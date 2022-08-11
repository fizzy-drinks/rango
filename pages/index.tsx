import Game from '@components/Game';
import StorageService from '@data/services/storage.service';
import GuessResult from '@data/types/GuessResult';
import { GetServerSideProps } from 'next';
import { useCookie } from 'next-cookie';
import Head from 'next/head';
import { FC } from 'react';

type HomePageProps = { guesses: GuessResult[] };

const HomePage: FC<HomePageProps> = ({ guesses }) => {
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
      <Game preloadGuesses={guesses} />
    </div>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
  const guesses = StorageService.getGuessesAtDate(new Date(), useCookie(ctx));
  return {
    props: {
      guesses,
    },
  };
};
