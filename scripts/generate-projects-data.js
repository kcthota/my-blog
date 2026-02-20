import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../projects');
const outputFile = path.join(__dirname, '../src/projects.json');

function generateProjectsData() {
    if (!fs.existsSync(projectsDir)) {
        console.log('No projects directory found.');
        return;
    }

    const files = fs.readdirSync(projectsDir).filter(file => file.endsWith('.md'));
    const projects = files.map(file => {
        const filePath = path.join(projectsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);

        return {
            name: data.title || 'Untitled Project',
            description: data.description || '',
            link: data.link || '#',
            status: data.status || 'inactive',
            weight: data.weight || 0
        };
    });

    // Sort by weight descending
    projects.sort((a, b) => b.weight - a.weight);

    fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));
    console.log(`Generated ${projects.length} projects in ${outputFile}`);
}

generateProjectsData();
