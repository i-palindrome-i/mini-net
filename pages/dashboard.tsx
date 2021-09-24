import Head from 'next/head'
import { signOut, getSession } from "next-auth/client";
import Image from 'next/image'
import moneyMouthFace from '../public/images/money-mouth-face.png'
import React, { useState } from "react";
import prisma from '../lib/prisma';
import plaid from '../lib/plaid';
import { useRouter } from 'next/router';
import { PlaidLink } from '../components/plaidLink';
import { WorthGrid } from '../components/worthGrid';
import { getTransactions } from '../controllers/transactionsController';

export default function Dashboard({ session, linked, balance_data }) {
    const router = useRouter();
    const refreshData = () => {
        router.replace(router.asPath);
    }
    const [token, setToken] = useState<string | null>(null);
    React.useEffect(() => {
        async function createLinkToken() {
            let response = await fetch("/api/create_link_token");
            const { link_token } = await response.json();
            setToken(link_token);
        }
        createLinkToken();
    }, []);
    let linkButton;
    if (token === null) {
        linkButton = <div>Loading....</div>
    } else {
        linkButton = <PlaidLink token={token} refreshData={refreshData} />
    }
    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>Mini Net Worth</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="block h-8 w-auto">
                                    <Image objectFit="contain" src={moneyMouthFace} alt="Mini Net Worth" width={32} height={32} />
                                </div>
                            </div>
                            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" aria-current="page">
                                    Dashboard
                                </a>
                                <a href="#" onClick={() => signOut()} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Sign Out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            Dashboard
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="w-1/2 mx-auto sm:px-6 lg:px-8">
                        <div className="px-4 py-8 sm:px-0">
                            {linked ? <WorthGrid balance_data={balance_data} /> : linkButton}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    let linked = false;
    let accounts = null;
    if (!session) {
        return {
            redirect: { destination: "/" },
        };
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });
    let balance_data = []
    if (user.plaidAccessToken) {
        linked = true;
        balance_data = await getTransactions(user);
    }
    return {
        props: {
            session,
            linked,
            balance_data
        },
    };
}