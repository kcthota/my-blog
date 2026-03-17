import Markdown from 'react-markdown';
import { getBasePath } from '../utils/basePath';
import remarkBreaks from 'remark-breaks';
import { siteConfig } from '../site.config';
import remarkGfm from 'remark-gfm';
import { Github, Mail, Rss } from 'lucide-react';

declare const __BUILD_TIMESTAMP__: string | number | undefined;

export default function Profile() {
    const isRelativeImage = Boolean(siteConfig.image && !siteConfig.image.startsWith('http') && !siteConfig.image.startsWith('//'));
    let finalImageUrl = siteConfig.image || '';

    if (isRelativeImage && siteConfig.image) {
        finalImageUrl = `${getBasePath()}${siteConfig.image.startsWith('/') ? siteConfig.image.slice(1) : siteConfig.image}`;

        if (typeof __BUILD_TIMESTAMP__ !== 'undefined') {
            try {
                const url = new URL(finalImageUrl, 'http://dummy.local');
                if (!url.searchParams.has('v')) {
                    url.searchParams.set('v', String(__BUILD_TIMESTAMP__));
                }
                finalImageUrl = url.pathname + url.search + url.hash;
            } catch (err) {
                // Should not happen, but safe fallback
            }
        }
    }

    return (
        <section className="profile-section">
            {siteConfig.image && (
                <div className="profile-sidebar">
                    <div className="profile-image-container">
                        <img
                            src={finalImageUrl}
                            alt="Profile"
                            className="profile-image"
                        />
                    </div>
                </div>
            )}
            <div className="profile-info">
                <h1 className="site-title">{siteConfig.title}</h1>
                <div className="social-links">
                    {siteConfig.contact?.email && (
                        <a href={`mailto:${siteConfig.contact.email}`} aria-label="Email">
                            <Mail size={20} />
                        </a>
                    )}
                    {siteConfig.contact?.github && (
                        <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer" aria-label="Github">
                            <Github size={20} />
                        </a>
                    )}

                    <a href={`${getBasePath()}rss.xml`} target="_blank" rel="noopener noreferrer" aria-label="RSS Feed">
                        <Rss size={18} className="inline-block align-middle text-gray-500 hover:text-black transition-colors" />
                    </a>
                </div>
                <Markdown remarkPlugins={[remarkBreaks, remarkGfm]}>{siteConfig.description}</Markdown>

            </div>
        </section>
    );
}