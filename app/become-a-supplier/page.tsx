import { Metadata } from 'next';
import SupplierClient from '@/components/SupplierClient';

export const metadata: Metadata = {
  title: 'Become a Supplier | AsiaByLocals',
  description: 'Join AsiaByLocals as a tour supplier. Share your local expertise with travelers from around the world.',
  alternates: { canonical: 'https://www.asiabylocals.com/supplier' },
};

export default function SupplierPage() {
  return <SupplierClient />;
}
