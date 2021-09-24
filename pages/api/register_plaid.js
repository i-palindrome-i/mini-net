const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
import { getSession } from "next-auth/client"
import prisma from '../../lib/prisma';
import plaid from '../../lib/plaid';

export default async function handle(req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(401)
  }
  const publicToken = req.body.public_token;
  const request = {
    public_token: publicToken,
  };
  try {
    const response = await plaid.itemPublicTokenExchange(request);
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { plaidAccessToken: accessToken }
    });
    res.status(200).json({ message: 'Bank linked!' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something went wrong....' })
  }
}
