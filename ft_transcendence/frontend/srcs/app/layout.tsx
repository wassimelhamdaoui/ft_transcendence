'use client';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import OptionBar from './components/forms/OptionBar';
import Context from '../context/context';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Logo from '../public/logo.svg';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// };

export default function rootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Atari Pong</title>
        {/* <link rel="icon" type="image/svg" href={Logo}/> */}
      </head>
      <body className={inter.className}>
          <Context>
            <QueryClientProvider client={new QueryClient()}>
              {children}
              <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                limit={1}
              />
            </QueryClientProvider>
          </Context>
      </body>
    </html>
  );
}
