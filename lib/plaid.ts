import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

let plaid: PlaidApi;
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

plaid = new PlaidApi(configuration);

export default plaid;

