import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    country?: string;
    city?: string;
    tourTitle?: string;
    slug?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ country, city, tourTitle, slug }) => {
    const countrySlug = country?.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city?.toLowerCase().replace(/\s+/g, '-');

    // Build BreadcrumbList JSON-LD schema
    const items: { position: number; name: string; item: string }[] = [
        { position: 1, name: 'Home', item: 'https://www.asiabylocals.com' }
    ];
    if (country && countrySlug) {
        items.push({ position: 2, name: country, item: `https://www.asiabylocals.com/${countrySlug}` });
    }
    if (city && citySlug && countrySlug) {
        items.push({ position: 3, name: city, item: `https://www.asiabylocals.com/${countrySlug}/${citySlug}` });
    }
    if (tourTitle && city && country) {
        items.push({
            position: items.length + 1,
            name: tourTitle,
            item: slug
                ? `https://www.asiabylocals.com/${countrySlug}/${citySlug}/${slug}`
                : `https://www.asiabylocals.com/${countrySlug}/${citySlug}`
        });
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map(i => ({
            '@type': 'ListItem',
            position: i.position,
            name: i.name,
            item: i.item
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px] font-semibold text-gray-500 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar py-2">
                <a href="/" className="flex items-center gap-1 hover:text-[#10B981] transition-colors shrink-0">
                    <Home size={16} />
                    <span>Home</span>
                </a>

                {country && (
                    <React.Fragment key="country">
                        <ChevronRight size={14} className="shrink-0 text-gray-300" />
                        <a href={`/${countrySlug}`} className="hover:text-[#10B981] transition-colors shrink-0">
                            {country}
                        </a>
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
        </>
    );
};

export default Breadcrumbs;
