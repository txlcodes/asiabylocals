import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    country?: string;
    city?: string;
    tourTitle?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ country, city, tourTitle }) => {
    const countrySlug = country?.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city?.toLowerCase().replace(/\s+/g, '-');

    return (
        <nav className="flex items-center gap-2 text-[14px] font-semibold text-gray-500 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar py-2">
            <a href="/" className="flex items-center gap-1 hover:text-[#10B981] transition-colors shrink-0">
                <Home size={16} />
                <span>Home</span>
            </a>

            {country && (
                <React.Fragment key="country">
                    <ChevronRight size={14} className="shrink-0 text-gray-300" />
                    <span className="hover:text-[#10B981] transition-colors shrink-0">
                        {country}
                    </span>
                </React.Fragment>
            )}

            {city && (
                <React.Fragment key="city">
                    <ChevronRight size={14} className="shrink-0 text-gray-300" />
                    <a href={`/${countrySlug}/${citySlug}`} className="hover:text-[#10B981] transition-colors shrink-0">
                        {city}
                    </a>
                </React.Fragment>
            )}

            {tourTitle && (
                <React.Fragment key="tour">
                    <ChevronRight size={14} className="shrink-0 text-gray-300" />
                    <span className="text-[#001A33] font-black truncate max-w-[200px] sm:max-w-md shrink-0">
                        {tourTitle}
                    </span>
                </React.Fragment>
            )}
        </nav>
    );
};

export default Breadcrumbs;
