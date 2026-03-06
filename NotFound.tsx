import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Helmet>
        <title>Page Not Found | AsiaByLocals</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
      </Helmet>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin size={36} className="text-[#10B981]" />
        </div>
        <h1 className="text-3xl font-black text-[#001A33] mb-3">Page Not Found</h1>
        <p className="text-gray-500 font-semibold mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] text-white font-black rounded-full hover:bg-[#059669] transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </a>
          <a
            href="/india/agra"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-[#001A33] font-black rounded-full hover:bg-gray-200 transition-colors text-sm"
          >
            Explore Agra Tours
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
