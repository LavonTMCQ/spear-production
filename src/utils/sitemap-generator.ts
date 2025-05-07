import fs from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';

/**
 * Generate a sitemap.xml file for the website
 * This should be run during the build process
 */
export async function generateSitemap() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  
  // Base URL of the website
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spear-platform.com';
  
  // Pages to exclude from the sitemap
  const excludedPaths = [
    '/admin',
    '/admin/*',
    '/dashboard',
    '/dashboard/*',
    '/api',
    '/api/*',
    '/login',
    '/404',
    '/500',
  ];
  
  // Get all .tsx files in the pages directory
  const pages = await globby([
    'src/app/**/*.tsx',
    '!src/app/admin/**/*.tsx',
    '!src/app/dashboard/**/*.tsx',
    '!src/app/api/**/*.tsx',
    '!src/app/login/**/*.tsx',
    '!src/app/**/_*.tsx',
    '!src/app/**/layout.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/not-found.tsx',
  ]);
  
  // Get all blog posts
  const blogPosts = await globby(['src/app/blog/**/*.tsx', '!src/app/blog/page.tsx']);
  
  // Create sitemap entries for pages
  const pageEntries = pages.map((page) => {
    // Convert file path to URL path
    const path = page
      .replace('src/app', '')
      .replace('/page.tsx', '')
      .replace('.tsx', '');
    
    // Skip excluded paths
    if (excludedPaths.some(excludedPath => {
      if (excludedPath.endsWith('*')) {
        return path.startsWith(excludedPath.slice(0, -1));
      }
      return path === excludedPath;
    })) {
      return null;
    }
    
    // Format the URL properly
    const url = `${siteUrl}${path === '/index' ? '' : path}`;
    
    return `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  }).filter(Boolean);
  
  // Create sitemap entries for blog posts
  const blogEntries = blogPosts.map((post) => {
    // Convert file path to URL path
    const path = post
      .replace('src/app', '')
      .replace('/page.tsx', '')
      .replace('.tsx', '');
    
    // Format the URL properly
    const url = `${siteUrl}${path}`;
    
    return `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    `;
  });
  
  // Combine all entries
  const allEntries = [...pageEntries, ...blogEntries];
  
  // Create the sitemap XML
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allEntries.join('')}
    </urlset>
  `;
  
  // Format the XML with prettier
  const formattedSitemap = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });
  
  // Write the sitemap to the public directory
  fs.writeFileSync('public/sitemap.xml', formattedSitemap);
  
  console.log('Sitemap generated successfully!');
}
