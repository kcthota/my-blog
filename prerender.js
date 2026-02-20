import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);



async function prerender() {
    // 1. Read the template (client build output)
    const templatePath = toAbsolute('docs/index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('docs/index.html not found. Run client build first.');
        process.exit(1);
    }
    const template = fs.readFileSync(templatePath, 'utf-8');

    // 2. Import the server entry (SSR build output)
    const serverEntryPath = toAbsolute('dist/server/entry-server.js');
    if (!fs.existsSync(serverEntryPath)) {
        console.error('dist/server/entry-server.js not found. Run server build first.');
        process.exit(1);
    }
    const { render, siteConfig } = await import(serverEntryPath);

    let basePath = '/';
    try {
        if (siteConfig.url) {
            const url = new URL(siteConfig.url);
            basePath = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
        }
    } catch (e) {
        console.warn('Invalid siteConfig.url, defaulting to /');
    }
    const normalizedBasePath = basePath;

    // 3. Determine routes to prerender
    const routesToPrerender = ['/', '/projects/'];

    // Add blog post routes and pagination
    const postsPath = toAbsolute('src/posts.json');
    if (fs.existsSync(postsPath)) {
        const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

        // Add post routes
        posts.forEach(post => {
            routesToPrerender.push(`/post/${post.slug}/`);
        });

        // Add paginated routes
        const POSTS_PER_PAGE = 50;
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        for (let i = 2; i <= totalPages; i++) {
            routesToPrerender.push(`/page/${i}/`);
        }
    }

    // Generate theme.js content once
    const themeHash = Math.random().toString(36).substring(2, 10);
    const themeFilename = `theme.${themeHash}.js`;
    const themeJsContent = `
(function() {
    const themeConfig = ${JSON.stringify(siteConfig.theme)};
    const STORAGE_KEY = 'theme';
    const PREFERS_DARK = window.matchMedia('(prefers-color-scheme: dark)');

    function getTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme) return savedTheme;
        return PREFERS_DARK.matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        const root = document.documentElement;
        const config = themeConfig[theme];
        
        for (const [key, value] of Object.entries(config)) {
            // Check if key maps to CSS vars we use. 
            // The config keys (primary, secondary, etc) map to --color-[key]
            // Exception: linkColor -> --color-link, cardBackground -> --color-card-bg
            
            let cssVar = \`--color-\${key}\`;
            if (key === 'linkColor') cssVar = '--color-link';
            if (key === 'cardBackground') cssVar = '--color-card-bg';
            
            root.style.setProperty(cssVar, value);
        }
        root.style.setProperty('--font-family', themeConfig.fontFamily);
        
        localStorage.setItem(STORAGE_KEY, theme);
        
        // Update toggle button icon visibility if needed (could be CSS based)
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Initial setup
    setTheme(getTheme());

    // Listen for system changes
    PREFERS_DARK.addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Setup toggle button listener when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const current = getTheme();
                const next = current === 'light' ? 'dark' : 'light';
                setTheme(next);
            });
        }

        const hamburgerBtn = document.querySelector('.hamburger-menu');
        const topNav = document.querySelector('.top-nav');
        if (hamburgerBtn && topNav) {
            hamburgerBtn.addEventListener('click', () => {
                topNav.classList.toggle('active');
            });
            
            // Close menu when clicking links
             topNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                   topNav.classList.remove('active'); 
                });
            });
        }
    });
})();
`;
    // Write theme.js
    const themeJsPath = toAbsolute(`docs/assets/${themeFilename}`);
    if (!fs.existsSync(path.dirname(themeJsPath))) {
        fs.mkdirSync(path.dirname(themeJsPath), { recursive: true });
    }
    fs.writeFileSync(themeJsPath, themeJsContent);
    console.log(`Generated ${themeFilename}`);

    // 4. Render and save each route
    for (const url of routesToPrerender) {
        try {
            const renderUrl = url === '/' ? normalizedBasePath : `${normalizedBasePath}${url.startsWith('/') ? url.slice(1) : url}`;
            const { html: renderedHtml, helmet } = render(renderUrl);

            let html = template.replace('<!--app-html-->', renderedHtml);



            const helmetHead = `
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                ${helmet.script.toString()}
                <link rel="alternate" type="application/rss+xml" title="RSS Feed for Krishna Thota" href="${normalizedBasePath}rss.xml" />
                <script src="${normalizedBasePath}assets/${themeFilename}"></script>
            `;

            html = html.replace('<!--app-head-->', helmetHead);

            // Strip out the client-side React bundle scripts and preloads
            const escapedBase = normalizedBasePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const scriptRegex = new RegExp(`<script type="module" crossorigin src="${escapedBase}assets\\/index-[^"]+\\.js"><\\/script>`, 'g');
            const preloadRegex = new RegExp(`<link rel="modulepreload" crossorigin href="${escapedBase}assets\\/[^"]+">`, 'g');

            html = html.replace(scriptRegex, '');
            html = html.replace(preloadRegex, '');

            const formattedHtml = await prettier.format(html, { parser: 'html' });

            // Determine output file path
            // For '/', it is docs/index.html
            // For others, it is docs/subpath/index.html (to support clean URLs)
            let filePath = `docs${url === '/' ? '/index.html' : `${url}/index.html`}`;
            const absoluteFilePath = toAbsolute(filePath);
            const dir = path.dirname(absoluteFilePath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(absoluteFilePath, formattedHtml);
            console.log(`Pre-rendered: ${url} -> ${filePath}`);
        } catch (e) {
            console.error(`Failed to render ${url}:`, e);
        }
    }

    // 5. Generate Sitemap
    // siteConfig is already imported above
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routesToPrerender.map(url => `
  <url>
    <loc>${siteConfig.url.replace(/\/$/, '')}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  `).join('')}
</urlset>`;

    fs.writeFileSync(toAbsolute('docs/sitemap.xml'), sitemap);
    console.log('Generated sitemap.xml');

    // 6. Cleanup unused assets
    const assetsDir = toAbsolute('docs/assets');
    if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        for (const file of files) {
            if (file.endsWith('.js') && file !== themeFilename) {
                fs.unlinkSync(path.join(assetsDir, file));
                console.log(`Deleted unused asset: ${file}`);
            }
        }
    }
}

prerender();
