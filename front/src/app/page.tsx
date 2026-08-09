import Head from 'next/head';
import { ChatLayout } from '@/components/Chat/ChatLayout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Portafolio - Juan Carlos Castillo</title>
        <meta name="description" content="Portafolio de Juan Carlos Castillo - Asistente IA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChatLayout />
    </>
  );
}
