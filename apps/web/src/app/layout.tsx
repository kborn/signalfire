import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CivicSignal',
  description:
    'Explore civic issues, understand their impact, and find clear actions you can take to make a meaningful difference.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="container">
      <body className="site-main">
        <header className="site-header">
          <nav className="site-nav">
            <Link href="/">Home</Link>
            <Link href="/topics">Topics</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/actions">Actions</Link>
            <Link href="/events">Events</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
