
(function() {
    const themeConfig = {"light":{"primary":"#222","secondary":"#666","background":"#ffffff","text":"#213547","border":"#eee","cardBackground":"#eee","linkHover":"#000","linkColor":"#222","lifeWeek":"#ddd"},"dark":{"primary":"#fff","secondary":"#aaa","background":"#121212","text":"#e0e0e0","border":"#333","cardBackground":"#373636ff","linkHover":"#fff","linkColor":"#ccc","lifeWeek":"#bbb"},"fontFamily":"Avenir, Open Sans, sans-serif"};
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
            
            let cssVar = `--color-${key}`;
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
