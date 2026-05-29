import { Instrument_Serif, Merriweather } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${merriweather.variable}`}>{children}</body>
    </html>
  );
}
