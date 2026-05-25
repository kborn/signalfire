import { redirect } from 'next/navigation';

export default function AdminEventFallbackPage() {
  redirect('/admin/events');
}
