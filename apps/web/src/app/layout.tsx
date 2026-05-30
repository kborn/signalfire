import { Inter, Zilla_Slab } from 'next/font/google';
import './globals.css';

const zillaSlab = Zilla_Slab({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${zillaSlab.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
