import React, { useState, FunctionComponent } from "react";

interface Props {
  balance_data: { date: string, balance: number }[]
}

const cls = (...classes) => classes.filter(Boolean).join(' ');

export const WorthGrid: FunctionComponent<Props> = ({ balance_data }) => {

  return (
    <table className="border-collapse border table-fixed w-full">
      <thead>
        <tr>
          <th className="border w-1/2">Date</th>
          <th className="border w-1/2">Net Worth</th>
        </tr>
      </thead>
      <tbody>
        {balance_data.map(data => (
          <tr key={data.date}>
            <td className="border text-center" key={1}>{data.date}</td>
            <td className={cls('border', 'text-center', data.balance < 1 ? 'text-red-600' : 'text-green-600')} key={2}>${(data.balance / 100).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
