export interface Frontmatter {
    [key: string]: string;
}

export function parseFrontmatter(content: string): { data: Frontmatter; content: string } {
    const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
    const match = frontmatterRegex.exec(content);

    // If no frontmatter is found, return empty data and the whole content
    if (!match) {
        return { data: {}, content };
    }

    const frontmatterBlock = match[1];
    const body = match[2];

    const data: Frontmatter = {};
    frontmatterBlock.split('\n').forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            // Join the rest back in case the value contained colons (e.g., date times)
            // And remove surrounding quotes if present
            const value = parts.slice(1).join(':').trim().replace(/^['"](.*)['"]$/, '$1');
            if (key) {
                data[key] = value;
            }
        }
    });

    return { data, content: body };
}
