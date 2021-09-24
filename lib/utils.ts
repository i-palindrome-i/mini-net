import dayjs from "dayjs"

export function processAccounts(accounts) {
  let accountsToConsider = ['Plaid Checking', 'Plaid Credit Card', 'Plaid Saving']
  accounts = accounts.filter(account => accountsToConsider.includes(account.name))
  accounts = accounts.map(account => {
    return {
      id: account.account_id,
      balance: account.balances.current,
      name: account.name,
      depository: account.name != 'Plaid Credit Card'
    }
  })
  let current_net_worth = 0
  let account_ids = []
  for (const account of accounts) {
    current_net_worth += account.depository ? 100 * account.balance : - 100 * account.balance
    account_ids.push(account.id)
  }
  return [current_net_worth, account_ids]
}

export function processTransactions(transactions, account_ids, user_id) {
  transactions = transactions.filter(transaction => account_ids.includes(transaction.account_id))
  transactions = transactions.map(transaction => {
    let date = dayjs(transaction.date);
    return {
      id: transaction.transaction_id,
      amount: 100 * transaction.amount,
      date: date.toDate(),
      user: {
        connect: {
          id: user_id
        }
      }
    }
  })
  return transactions;
}

export function createDailyBalance(end_date, end_balance, transactions) {
  let result = []
  let current_balance = end_balance;
  for (let index = 0; index < 59; index++) {
    const date = end_date.subtract(index, 'day')
    result.push({ date: date.format('YYYY-MM-DD'), balance: current_balance })
    while (transactions.length > 0 && transactions[0].date > date) {
      current_balance = current_balance + transactions.shift().amount
    }
  }
  return result.reverse();
}



