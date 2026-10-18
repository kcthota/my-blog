import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as ReactHelmetAsync from 'react-helmet-async';
const helmetAsync = ReactHelmetAsync as any;
const { Helmet } = helmetAsync.default || helmetAsync;
import { siteConfig } from '../site.config';
import SiteHeader from '../components/SiteHeader';
import Markdown from 'react-markdown';
import { parseFrontmatter } from '../utils/frontmatter';
import postsData from '../posts.json';
import { formatDate } from '../utils/date';
import remarkGfm from 'remark-gfm';
import { MarkdownImage } from '../components/MarkdownImage';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BookOpen, ArrowRight } from 'lucide-react';

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    summary?: string;
    image?: string | null;
}

function getPreviousPosts(currentSlug: string, posts: PostMeta[], count = 3): PostMeta[] {
    const currentIndex = posts.findIndex(p => p.slug === currentSlug);
    if (currentIndex === -1) return [];

    // Articles published before this one (older posts in chronological order)
    let previous = posts.slice(currentIndex + 1, currentIndex + 1 + count);

    // If there are fewer than count older posts, backfill with remaining posts
    if (previous.length < count) {
        const remaining = posts.filter(
            p => p.slug !== currentSlug && !previous.some(prev => prev.slug === p.slug)
        );
        previous = [...previous, ...remaining].slice(0, count);
    }

    return previous;
}

// Load all posts synchronously
const postFiles = import.meta.glob('../../posts/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
}) as Record<string, string>;

export default function BlogPost() {
    const { slug } = useParams();
    const allPosts = postsData as PostMeta[];
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    const postMeta = allPosts[currentIndex];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, [slug]);

    if (!postMeta) {
        return <div>Post Not Found</div>;
    }

    const previousPosts = getPreviousPosts(slug || '', allPosts, 3);
    const sidebarTitle = currentIndex < allPosts.length - 1 ? 'Previous Articles' : 'Recent Articles';

    const filePath = `../../posts/${slug}.md`;
    const rawContent = postFiles[filePath];

    if (!rawContent) {
        return <div>Post Content Not Found</div>;
    }

    const { content } = parseFrontmatter(rawContent);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postMeta.title,
        "datePublished": postMeta.date,
        "description": postMeta.summary || siteConfig.description,
        "author": {
            "@type": "Person",
            "name": siteConfig.title,
            "url": siteConfig.url
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/post/${slug}`
        }
    };

    const ogImageUrl = postMeta.image 
        ? (postMeta.image.startsWith('http') ? postMeta.image : `${siteConfig.url.replace(/\/$/, '')}${postMeta.image.startsWith('/') ? '' : '/'}${postMeta.image}`)
        : undefined;

    return (
        <div className="blog-container post-page-container">
            <SiteHeader />
            <Helmet>
                <title>{`${postMeta.title} - ${siteConfig.title}`}</title>
                <meta name="description" content={postMeta.summary || siteConfig.description} />
                {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
                <script type='application/ld+json'>
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>
            <div className="post-layout">
                <main className="post-main">
                    <header>
                        <h1>{postMeta.title}</h1>
                        <div className="meta">
                            <span>{formatDate(postMeta.date)}</span>
                        </div>
                    </header>
                    {postMeta.image && (
                        <div className="post-image">
                            <img src={postMeta.image} alt={postMeta.title} />
                        </div>
                    )}
                    <div className="markdown-content">
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                img: MarkdownImage,
                                code(props) {
                                    const { children, className, node, ref, ...rest } = props
                                    const match = /language-(\w+)/.exec(className || '')
                                    return match ? (
                                        <SyntaxHighlighter
                                            {...rest}
                                            PreTag="div"
                                            children={String(children).replace(/\n$/, '')}
                                            language={match[1]}
                                            style={dracula}
                                        />
                                    ) : (
                                        <code {...rest} className={className}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {content}
                        </Markdown>
                    </div>
                </main>
                {previousPosts.length > 0 && (
                    <aside className="post-sidebar" aria-label="Previous articles">
                        <div className="sidebar-inner">
                            <div className="sidebar-header">
                                <BookOpen size={18} className="sidebar-header-icon" />
                                <h3>{sidebarTitle}</h3>
                            </div>
                            <div className="sidebar-posts-list">
                                {previousPosts.map(post => (
                                    <Link
                                        key={post.slug}
                                        to={`/post/${post.slug}/`}
                                        className="sidebar-post-card"
                                    >
                                        {post.image && (
                                            <div className="sidebar-post-thumbnail">
                                                <img src={post.image} alt={post.title} loading="lazy" />
                                            </div>
                                        )}
                                        <div className="sidebar-post-body">
                                            <span className="sidebar-post-date">{formatDate(post.date)}</span>
                                            <h4 className="sidebar-post-title">{post.title}</h4>
                                            {post.summary && (
                                                <p className="sidebar-post-summary">{post.summary}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="sidebar-footer">
                                <Link to="/" className="sidebar-all-link">
                                    <span>All Articles</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
