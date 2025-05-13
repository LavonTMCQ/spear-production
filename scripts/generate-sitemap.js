// This script is used to generate the sitemap.xml file
// It should be run during the build process

const fs = require('fs');
const path = require('path');

// Define the base URL for the sitemap
const BASE_URL = 'https://spear-app.vercel.app';

// Define the routes to include in the sitemap
const routes = [
  '/',
  '/login',
  '/dashboard',
  '/dashboard/devices',
  '/dashboard/profile',
  '/dashboard/recordings',
  '/dashboard/subscription',
  '/admin',
  '/admin/clients',
  '/admin/devices',
  '/admin/integrations',
  '/admin/profile',
  '/admin/remote-control',
  '/admin/settings',
  '/admin/subscriptions',
  '/admin/unattended-access',
  '/blog',
  '/faq',
  '/help',
  '/knowledge-base',
  '/learn-more',
  '/subscription',
];

// Generate the sitemap XML
function generateSitemap() {
  try {
    // Create the sitemap XML content
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write the sitemap to the public directory
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// Generate the sitemap
generateSitemap();
