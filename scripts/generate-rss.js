import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsPath = path.join(__dirname, '../src/posts.json');
const docsDir = path.join(__dirname, '../docs');
const outputFile = path.join(docsDir, 'rss.xml');

// Import site config
const configPath = path.join(__dirname, '../src/site.config.ts');
// Simple extraction of values from site.config.ts since it's TS and we are in JS environment
const configContent = fs.readFileSync(configPath, 'utf-8');
const siteTitle = configContent.match(/title:\s*"(.*?)"/)?.[1] || 'My Blog';
const siteUrl = configContent.match(/url:\s*"(.*?)"/)?.[1] || 'http://localhost:3000';
const siteDescription = configContent.match(/description:\s*`(.*?)`/s)?.[1].replace(/\*\*/g, '').replace(/👋/g, '').trim() || '';
// Derive base path from URL
let derivedBasePath = '/';
try {
    if (siteUrl) {
        const urlObj = new URL(siteUrl);
        derivedBasePath = urlObj.pathname.endsWith('/') ? urlObj.pathname : `${urlObj.pathname}/`;
    }
} catch (e) {
    console.warn('Invalid siteUrl, defaulting to /');
}

const normalizedBasePath = derivedBasePath;

function generateRSS() {
    if (!fs.existsSync(postsPath)) {
        console.error('posts.json not found. Run generate-posts-data.js first.');
        return;
    }

    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8')).slice(0, 25);

    const items = posts.map(post => {
        const url = `${siteUrl.replace(/\/$/, '')}/post/${post.slug}`;
        const pubDate = new Date(post.date).toUTCString();

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${siteTitle}</title>
  <link>${siteUrl}</link>
  <description>${siteDescription}</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteUrl.replace(/\/$/, '')}/rss.xml" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

    fs.writeFileSync(outputFile, rss);
    console.log(`Generated RSS feed with ${posts.length} posts at ${outputFile}`);
}

generateRSS();
