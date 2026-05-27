import NavLink from '@/app/navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container site-main adminShell">
      <header className="adminHeader">
        <div className="adminNavLabel">Admin workspace</div>
        <nav className="adminNav" aria-label="Admin">
          <NavLink href="/admin">Admin Home</NavLink>
          <NavLink href="/admin/submissions">Submissions</NavLink>
          <NavLink href="/admin/articles">Articles</NavLink>
          <NavLink href="/admin/actions">Actions</NavLink>
          <NavLink href="/admin/events">Events</NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
