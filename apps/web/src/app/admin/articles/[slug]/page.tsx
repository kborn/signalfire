import { redirect } from 'next/navigation';

export default function AdminArticleFallbackPage() {
  redirect('/admin/articles');
}
