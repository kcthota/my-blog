import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, '../posts');
const outputFile = path.join(__dirname, '../src/posts.json');

function generatePostsData() {
    if (!fs.existsSync(postsDir)) {
        console.log('No posts directory found.');
        return;
    }

    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    const posts = files.map(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);
        const slug = file.replace('.md', '');

        return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || 'Unknown Date',
            summary: data.summary || '',
            weight: data.weight || 0
        };
    });

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
    console.log(`Generated ${posts.length} posts in ${outputFile}`);
}

generatePostsData();
