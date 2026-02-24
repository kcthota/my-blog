import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, FolderGit2, Sun, Moon, Menu, X, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { siteConfig } from '../site.config';
import projects from '../projects.json';
import lifeData from '../life.json';

export default function SiteHeader({ showTitle = true }: { showTitle?: boolean }) {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className={showTitle ? 'main-header with-bottom-border' : 'main-header'}>
            <div className="header-title">{showTitle && <h1 className="site-title"><Link to="/">{siteConfig.title}</Link></h1>}</div>
            <div className="nav-container">
                <nav className={`top-nav ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={closeMenu}>
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                    {projects.length > 0 && (
                        <Link to="/projects/" onClick={closeMenu}>
                            <FolderGit2 size={18} />
                            <span>Projects</span>
                        </Link>
                    )}
                    {lifeData.length > 0 && (
                        <Link to="/life" onClick={closeMenu}>
                            <Activity size={18} />
                            <span>Life</span>
                        </Link>
                    )}
                </nav>

                <div className="header-actions">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
