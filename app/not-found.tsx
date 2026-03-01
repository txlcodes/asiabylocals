import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-black text-[#001A33] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-600 mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#059669] transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
