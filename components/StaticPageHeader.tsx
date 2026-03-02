'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function StaticPageHeader() {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto h-24 sm:h-28 md:h-32 flex items-center justify-between px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
                <Link href="/" className="flex items-center h-full">
                    <img
                        src="/logo.png"
                        alt="Asia By Locals"
                        className="h-[120px] sm:h-[130px] md:h-[140px] lg:h-[150px] xl:h-[160px] w-auto object-contain"
                        style={{ transform: 'translateY(3px)' }}
                    />
                </Link>
            </div>
        </header>
    );
}
