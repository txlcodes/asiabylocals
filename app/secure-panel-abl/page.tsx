import { Metadata } from 'next';
import AdminClient from '@/components/AdminClient';

export const metadata: Metadata = {
  title: 'Admin | AsiaByLocals',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
