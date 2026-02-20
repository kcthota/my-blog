import { siteConfig } from '../site.config';

export default function Footer() {
    return (
        <footer className="container footer-container">
            <p className="footer-text">
                {`© ${new Date().getFullYear()} ${siteConfig.title}. ${siteConfig.footerText}`}
            </p>
        </footer>
    );
}
