
import { siteConfig } from '../site.config';

/**
 * Derives the base path from siteConfig.url.
 * This is useful for SSG and ensure consistency.
 * 
 * If siteConfig.url is "https://user.github.io/repo/", basePath is "/repo/".
 * If siteConfig.url is "https://custom.com/", basePath is "/".
 */
export function getBasePath(): string {
    try {
        if (!siteConfig.url) return '/';
        const url = new URL(siteConfig.url);
        const path = url.pathname;
        return path.endsWith('/') ? path : `${path}/`;
    } catch (e) {
        console.warn('Invalid siteConfig.url, defaulting to /');
        return '/';
    }
}
