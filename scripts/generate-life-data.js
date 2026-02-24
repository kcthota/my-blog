import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lifeDir = path.join(__dirname, '../life');
const outputFile = path.join(__dirname, '../src/life.json');

function generateLifeData() {
    if (!fs.existsSync(lifeDir)) {
        console.log('No life directory found. Creating empty life.json');
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
        return;
    }

    const files = fs.readdirSync(lifeDir).filter(file => file.endsWith('.md'));
    const events = files.map(file => {
        const filePath = path.join(lifeDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);

        if (!data.date) {
            console.warn(`Warning: File ${file} is missing a 'date' in its frontmatter.`);
        }

        return {
            title: data.title || '',
            date: data.date ? (data.date.length === 7 ? `${data.date}-01` : data.date) : '',
            isMonthOnly: data.date ? data.date.length === 7 : false,
            color: data.color || '#333333',
            description: data.description || '',
            tags: data.tags || [],
        };
    }).filter(event => event.date);

    // Sort by date ascending to find the earliest date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    fs.writeFileSync(outputFile, JSON.stringify(events, null, 2));
    console.log(`Generated ${events.length} life events in ${outputFile}`);
}

generateLifeData();
