import type { Metadata } from 'next';
import './globals.css';
import './mina.css';

export const metadata: Metadata = {
  title: 'LIFEOS -- Intelligent Operating System',
  description: 'LIFEOS — an intelligent operating system for everyday life and learning, with an interactive living portrait.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/></head><body>{children}</body></html>;
}
