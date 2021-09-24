const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

import plaid from '../../lib/plaid';

export default async function handle(req, res) {
  const request = {
    user: {
      client_user_id: 'TODO',
    },
    client_name: 'Mini Net Worth',
    products: ['transactions'],
    language: 'en',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await plaid.linkTokenCreate(request);
    res.status(200).json(createTokenResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong....' })
  }
}
