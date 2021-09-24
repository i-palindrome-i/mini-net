import plaid from '../lib/plaid';
import { createDailyBalance, processAccounts, processTransactions } from '../lib/utils';
import dayjs from 'dayjs';
import prisma from '../lib/prisma';

export async function getTransactions(user) {
  const accounts_response = await plaid.accountsGet({ access_token: user.plaidAccessToken })
  let raw_accounts = accounts_response.data.accounts
  let [current_net_worth, account_ids] = processAccounts(raw_accounts)
  let today = dayjs()
  let start = today.subtract(60, 'day')
  // TODO - according to the docs, new access_tokens might not have full access to transactions so 
  // for now, we'll refetch the whole list of transactions
  // if (user.lastUpdated) {
  //   let last_update = dayjs(user.lastUpdated)
  //   start = last_update.subtract(2, 'day') // allow for delayed transaction reporting and timezones
  // }
  const transactions_response = await plaid.transactionsGet({
    access_token: user.plaidAccessToken,
    start_date: start.format('YYYY-MM-DD'),
    end_date: today.format('YYYY-MM-DD')
  })
  let raw_transactions = transactions_response.data.transactions
  let transactions = processTransactions(raw_transactions, account_ids, user.id)
  for (let index = 0; index < transactions.length; index++) {
    const transaction = transactions[index];
    await prisma.transaction.upsert({
      where: { id: transaction.id },
      update: transaction,
      create: transaction
    });
  }
  let stored_transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      date: 'desc'
    }
  })
  let balance_data = createDailyBalance(today, current_net_worth, stored_transactions)

  await prisma.user.update({
    where: { id: user.id },
    data: { lastUpdated: today.toDate() }
  });
  return balance_data;
}