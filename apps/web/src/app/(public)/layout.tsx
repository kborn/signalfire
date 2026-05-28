import type { Metadata } from 'next';
import NavLink from '@/app/navbar';

export const metadata: Metadata = {
  title: 'Find Your Fight',
  description: 'Focus on the issue that matters most to you, and find a way to act.',
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="publicShell">
      <div className="container site-main publicContent">
        <header className="site-header">
          <nav className="site-nav">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/topics">Issues</NavLink>
            <NavLink href="/articles">Articles</NavLink>
            <NavLink href="/actions">Actions</NavLink>
            <NavLink href="/events">Events</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/submit">Submit a Resource</NavLink>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
