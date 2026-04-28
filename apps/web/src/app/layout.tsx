import type { Metadata } from 'next';
import './globals.css';
import NavLink from '@/app/navbar';

export const metadata: Metadata = {
  title: 'CivicSignal',
  description:
    'Explore civic issues, understand their impact, and find clear actions you can take to make a meaningful difference.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="container">
      <body className="site-main">
        <header className="site-header">
          <nav className="site-nav">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/topics">Topics</NavLink>
            <NavLink href="/articles">Articles</NavLink>
            <NavLink href="/actions">Actions</NavLink>
            <NavLink href="/events">Events</NavLink>
            <NavLink href="/submit">Submit</NavLink>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
