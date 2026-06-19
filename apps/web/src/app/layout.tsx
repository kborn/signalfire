import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  icons: {
    icon: '/fyf-favicon.png',
    shortcut: '/fyf-favicon.png',
    apple: '/fyf-favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
