import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './main.scss';
import Sidebar from '@/components/core/Sidebar/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'BskyDeck - Monitor multiple timelines on a single screen',
  description:
    'BskyDeck is a tool that allows you to monitor multiple Bsky timelines on a single screen. Track and organize content, and engage with your others on Bsky.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="core-layout">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="columns-layout">{children}</div>
        </div>
      </body>
    </html>
  );
}
