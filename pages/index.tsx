import Head from 'next/head'
import Image from 'next/image'
import moneyMouthFace from '../public/images/money-mouth-face.png'
import background from '../public/images/background.webp'
import { signIn, getSession } from "next-auth/client";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex">
      <Head>
        <title>Mini Net Worth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Image src={moneyMouthFace} alt="Money Mouth Face" width={48} height={48} />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Mini Net Worth
            </h2>
          </div>
          <div className="mt-8">
            <button onClick={() => signIn('google')} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Log In with Google
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <Image layout="fill" objectFit="cover" className="absolute inset-0 h-full w-full object-cover" src={background} alt="Balance" />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: "/dashboard" },
    };
  }
  return {
    props: {

    },
  };
}