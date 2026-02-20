import { useParams } from 'react-router-dom';
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

// Load all posts synchronously
const postFiles = import.meta.glob('../../posts/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
}) as Record<string, string>;

export default function BlogPost() {
    const { slug } = useParams();
    const postMeta = (postsData as any[]).find(p => p.slug === slug);

    if (!postMeta) {
        return <div>Post Not Found</div>;
    }

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

    return (
        <div className="blog-container">
            <SiteHeader />
            <Helmet>
                <script type='application/ld+json'>
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>
            <header>
                <h1>{postMeta.title}</h1>
                <div className="meta">
                    <span>{formatDate(postMeta.date)}</span>
                </div>
            </header>
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
        </div>
    );
}
