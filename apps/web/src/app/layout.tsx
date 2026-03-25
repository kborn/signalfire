import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CivicSignal',
  description: 'Replace me with something meaningful. Im not sure where this ends up',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/topics">Topics</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/actions">Actions</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
