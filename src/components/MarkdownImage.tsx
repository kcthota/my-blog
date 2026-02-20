

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
}

export function MarkdownImage({ src, alt, ...props }: MarkdownImageProps) {
    if (!src) {
        return <img alt={alt} {...props} />;
    }

    try {
        const url = new URL(src, 'http://dummy-base');
        const width = url.searchParams.get('vmw');
        const height = url.searchParams.get('vmh');

        //remove the vmw and vmh params from the src
        src = src.replace(/\?vmw=\d+&vmh=\d+/, '');

        // Construct styles or attributes
        const style: React.CSSProperties = {};
        if (width) style.width = `${width}px`;
        if (height) style.height = `${height}px`;

        return (
            <img
                src={src}
                alt={alt}
                width={width || undefined}
                height={height || undefined}
                style={{ ...props.style, ...style }}
                {...props}
            />
        );
    } catch (e) {
        // Fallback for invalid URLs
        return <img src={src} alt={alt} {...props} />;
    }
}
