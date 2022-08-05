import GuessInput from '@components/GuessInput';
import Head from 'next/head';
import { FC } from 'react';

const HomePage: FC = () => {
  return (
    <div className='mx-auto max-w-3xl h-full max-h-4xl p-3 flex flex-col'>
      <Head>
        <meta charSet='utf-8' />
        <meta name='description' content='Adivinhe a comida' />
        <title>pastle</title>
      </Head>
      <header>
        <h1 className='font-bold text-4xl mb-2'>Pastle</h1>
        <p className='text-xl mb-2'>Adivinhe a comida</p>
      </header>
      <main className='flex grow flex-col'>
        <GuessInput />
      </main>
    </div>
  );
};

export default HomePage;
