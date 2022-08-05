import GuessInput from '@components/GuessInput';
import Head from 'next/head';
import { FC } from 'react';

const HomePage: FC = () => {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta name='description' content='Adivinhe a comida' />
        <title>pastle</title>
      </Head>
      <header>
        <h1>Pastle</h1>
        <p>Adivinhe a comida</p>
      </header>
      <main>
        <GuessInput />
      </main>
    </>
  );
};

export default HomePage;
