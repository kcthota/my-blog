import { Link, useParams } from 'react-router-dom';
import { getBasePath } from '../utils/basePath';
import SiteHeader from '../components/SiteHeader';
import * as ReactHelmetAsync from 'react-helmet-async';
import { siteConfig } from '../site.config';
import { formatDate } from '../utils/date';

const helmetAsync = ReactHelmetAsync as any;
const { Helmet } = helmetAsync.default || helmetAsync;

const POSTS_PER_PAGE = 50;

import Profile from '../components/Profile';

// Import generated posts data
import postsData from '../posts.json';

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    summary: string;
}

export default function HomePage() {
    const { pageNumber } = useParams();
    const currentPage = parseInt(pageNumber || '1', 10);
    const blogPosts: BlogPost[] = postsData as BlogPost[];

    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = blogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const pageTitle = currentPage > 1 ? `${siteConfig.title} - Page ${currentPage}` : siteConfig.title;

    return (
        <div className="blog-container">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={siteConfig.description} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={siteConfig.description} />
                <meta property="og:url" content={siteConfig.url} />
                <meta property="og:type" content="website" />
                {siteConfig.image && <meta property="og:image" content={siteConfig.image.startsWith('http') ? siteConfig.image : `${getBasePath()}${siteConfig.image.startsWith('/') ? siteConfig.image.slice(1) : siteConfig.image}`} />}
            </Helmet>
            <SiteHeader showTitle={false} />
            <Profile />

            <section className="posts-section">
                <h2>
                    {currentPage > 1 ? `Posts - Page ${currentPage}` : 'Recent Posts'}
                </h2>
                <div className="posts-list">
                    {paginatedPosts.map((post) => (
                        <article key={post.slug} className="post-item">
                            <div className="post-header">
                                <h3><Link to={`/post/${post.slug}/`}>{post.title}</Link></h3>
                                <span className="post-date">{formatDate(post.date)}</span>
                            </div>
                            <p className="post-summary">{post.summary}</p>
                        </article>
                    ))}
                </div>

                {totalPages > 1 && (
                    <nav className="pagination">
                        {hasPrevPage && (
                            <Link to={currentPage === 2 ? '/' : `/page/${currentPage - 1}/`} className="prev-link">
                                ← Previous
                            </Link>
                        )}
                        {hasNextPage && (
                            <Link to={`/page/${currentPage + 1}/`} className="next-link">
                                Next →
                            </Link>
                        )}
                    </nav>
                )}
            </section>
        </div>
    );
}
