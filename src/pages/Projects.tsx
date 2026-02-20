import SiteHeader from '../components/SiteHeader';

import projectsData from '../projects.json';

type ProjectStatus = 'active' | 'dead' | 'inactive';

interface Project {
    name: string;
    description: string;
    link: string;
    status: ProjectStatus;
}

const projects = projectsData as Project[];

export default function Projects() {


    const getStatusDisplay = (status: ProjectStatus) => {
        switch (status) {
            case 'active':
                return '🚀 Active';
            case 'dead':
                return '💀 Dead';
            case 'inactive':
                return '🦥 Inactive';
            default:
                return status;
        }
    };

    return (
        <div className="blog-container">
            <SiteHeader />
            <section className="projects-section">
                <h2>Projects</h2>
                <div className="project-grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <h3><a href={project.link} target="_blank">{project.name}</a></h3>
                            <p>{project.description}</p>
                            <p className="project-status">{getStatusDisplay(project.status)}</p>
                            <a className="btn" href={project.link} target="_blank">View Project</a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
