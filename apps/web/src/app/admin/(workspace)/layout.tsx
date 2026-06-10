import NavLink from '@/app/navbar';
import AdminLogoutButton from '@/app/admin/(workspace)/_components/AdminLogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container site-main adminShell">
      <header className="adminHeader">
        <div className="adminNavLabel">Admin workspace</div>
        <section className="adminNavWrap">
          <nav className="adminNav" aria-label="Admin">
            <NavLink href="/admin">Admin Home</NavLink>
            <NavLink href="/admin/submissions">Submissions</NavLink>
            <NavLink href="/admin/articles">Articles</NavLink>
            <NavLink href="/admin/actions">Actions</NavLink>
            <NavLink href="/admin/events">Events</NavLink>
          </nav>
        </section>
        <section className="adminHeaderActions">
          <AdminLogoutButton />
        </section>
      </header>
      <main>{children}</main>
    </div>
  );
}
