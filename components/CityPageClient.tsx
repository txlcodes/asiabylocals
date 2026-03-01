'use client';

import React from 'react';

interface Props {
  tours: any[];
  city: string;
  country: string;
}

export default function CityPageClient({ tours, city, country }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-[#001A33] mb-4">
          Guided Tours & Things to Do in {city}
        </h1>
        <p className="text-gray-500 font-semibold mb-8">
          {tours.length} tours available in {city}, {country}
        </p>
        <p className="text-sm text-gray-400">CityPage migrating to Next.js — full content coming soon.</p>
      </div>
    </div>
  );
}
