'use client';

import React from 'react';

interface Props {
  country: string;
  city: string;
  slug: string;
}

export default function CityInfoClient({ country, city, slug }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-[#001A33] mb-4">
          {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h1>
        <p className="text-gray-500 font-semibold">{city}, {country}</p>
        <p className="text-sm text-gray-400 mt-4">CityInfoPage migrating to Next.js — full content coming soon.</p>
      </div>
    </div>
  );
}
