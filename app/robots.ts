import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/secure-panel-abl', '/api/'] }
    ],
    sitemap: 'https://www.asiabylocals.com/sitemap.xml',
  };
}
