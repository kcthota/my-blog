import Markdown from 'react-markdown';
import { getBasePath } from '../utils/basePath';
import remarkBreaks from 'remark-breaks';
import { siteConfig } from '../site.config';
import remarkGfm from 'remark-gfm';
import { Github, Mail, Rss } from 'lucide-react';

export default function Profile() {
    return (
        <section className="profile-section">
            {siteConfig.image && (
                <div className="profile-sidebar">
                    <div className="profile-image-container">
                        <img
                            src={siteConfig.image.startsWith('http') ? siteConfig.image : `${getBasePath()}${siteConfig.image.startsWith('/') ? siteConfig.image.slice(1) : siteConfig.image}`}
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