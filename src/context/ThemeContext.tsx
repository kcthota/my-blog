import { createContext, useContext, useEffect, useState } from 'react';
import { siteConfig } from '../site.config';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme;
            if (savedTheme) return savedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const themeConfig = siteConfig.theme[theme];

        root.style.setProperty('--color-primary', themeConfig.primary);
        root.style.setProperty('--color-secondary', themeConfig.secondary);
        root.style.setProperty('--color-background', themeConfig.background);
        root.style.setProperty('--color-text', themeConfig.text);
        root.style.setProperty('--color-border', themeConfig.border);
        root.style.setProperty('--color-card-bg', themeConfig.cardBackground);
        root.style.setProperty('--color-link-hover', themeConfig.linkHover);
        root.style.setProperty('--color-link', themeConfig.linkColor);
        root.style.setProperty('--font-family', siteConfig.theme.fontFamily);
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
