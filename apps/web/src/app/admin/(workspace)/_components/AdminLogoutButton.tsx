'use client';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/auth';

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
  }

  return (
    <button className="logoutButton" type="button" onClick={handleLogout}>
      Logout
    </button>
  );
}
