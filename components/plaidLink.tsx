import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from "react-plaid-link";
import React, { useCallback, useState, FunctionComponent } from "react";

interface Props {
  token: string;
  refreshData(): void;
}

export const PlaidLink: FunctionComponent<Props> = ({ token, refreshData }) => {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      const res = await fetch(
        '/api/register_plaid',
        {
          body: JSON.stringify({
            public_token
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        }
      )
      const result = await res.json()
      refreshData()
    },
    []
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    // onExit
    // onEvent
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Connect a bank account
    </button>
  );
};