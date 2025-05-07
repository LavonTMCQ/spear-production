// This script is used to generate the sitemap.xml file
// It should be run during the build process

const { generateSitemap } = require('../dist/utils/sitemap-generator');

// Generate the sitemap
generateSitemap()
  .then(() => {
    console.log('Sitemap generated successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  });
