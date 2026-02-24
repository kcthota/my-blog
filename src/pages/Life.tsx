import { useMemo } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const helmetAsync = ReactHelmetAsync as any;
const { Helmet } = helmetAsync.default || helmetAsync;
import { siteConfig } from '../site.config';
import lifeData from '../life.json';
import { differenceInWeeks, parseISO, addWeeks, format } from 'date-fns';
import SiteHeader from '../components/SiteHeader';

type LifeEvent = {
    title?: string;
    date: string;
    color: string;
    description: string;
    tags: string[];
    isMonthOnly?: boolean;
};

const WEEKS_IN_YEAR = 52;
const YEARS_IN_LIFE = 100;
const TOTAL_WEEKS = WEEKS_IN_YEAR * YEARS_IN_LIFE;

const LIFE_SECTIONS = [
    { label: 'Childhood', startYear: 0, endYear: 13 },
    { label: 'Teen Years', startYear: 13, endYear: 20 },
    { label: '20s', startYear: 20, endYear: 30 },
    { label: '30s', startYear: 30, endYear: 40 },
    { label: '40s', startYear: 40, endYear: 50 },
    { label: '50s', startYear: 50, endYear: 60 },
    { label: '60s', startYear: 60, endYear: 70 },
    { label: '70s', startYear: 70, endYear: 80 },
    { label: '80s', startYear: 80, endYear: 90 },
    { label: '90s', startYear: 90, endYear: 100 },
];

export default function Life() {
    const events: LifeEvent[] = lifeData;

    // The earliest date sets week 0
    const birthDateStr = events.length > 0 ? events[0].date : null;
    const birthDate = birthDateStr ? parseISO(birthDateStr) : null;
    const currentDate = new Date();

    const currentWeekIndex = birthDate ? Math.max(0, differenceInWeeks(currentDate, birthDate)) : 0;

    const weeks = useMemo(() => {
        const grid = Array.from({ length: TOTAL_WEEKS }, () => ({
            isPast: false,
            events: [] as LifeEvent[],
            date: null as Date | null,
            index: 0
        }));

        if (!birthDate) return grid;

        // Populate base week info
        for (let i = 0; i < TOTAL_WEEKS; i++) {
            grid[i].index = i;
            grid[i].isPast = i <= currentWeekIndex;
            grid[i].date = addWeeks(birthDate, i);
        }

        // Map events to weeks
        events.forEach(event => {
            const eventDate = parseISO(event.date);
            const weekIndex = differenceInWeeks(eventDate, birthDate);
            if (weekIndex >= 0 && weekIndex < TOTAL_WEEKS) {
                grid[weekIndex].events.push(event);
            }
        });

        return grid;
    }, [events, birthDate, currentWeekIndex]);

    return (
        <div className="blog-container">
            <Helmet>
                <title>Life in Weeks | {siteConfig.title}</title>
                <meta name="description" content="My life visualized in weeks." />
            </Helmet>

            <SiteHeader />
            <section className="projects-section">
                <h2>Life in Weeks</h2>
                <div className="life-page">
                    {!birthDate ? (
                        <div className="empty-state">
                            <p>No life events found. Add events to the `life/` directory with a past `date` in the frontmatter to start your timeline.</p>
                        </div>
                    ) : (
                        <div className="life-visualization">
                            <div className="life-grid-container">
                                <div className="life-sections">
                                    {LIFE_SECTIONS.map(section => {
                                        const sectionWeeks = weeks.slice(section.startYear * WEEKS_IN_YEAR, section.endYear * WEEKS_IN_YEAR);

                                        return (
                                            <div key={section.label} className="life-section">
                                                <h3 className="life-section-title">{section.label}</h3>
                                                <div className="life-grid">
                                                    {sectionWeeks.map((week, index) => {
                                                        const isEvent = week.events.length > 0;
                                                        const eventColor = isEvent ? week.events[0].color : undefined;

                                                        let className = "life-week";
                                                        if (week.isPast) className += " past";
                                                        if (isEvent) className += " event";

                                                        return (
                                                            <div
                                                                key={`${section.label}-${index}`}
                                                                className={className}
                                                                title={isEvent ? week.events.map(e => {
                                                                    const titlePart = e.title || '';
                                                                    const descPart = e.description ? (titlePart ? `: ${e.description}` : e.description) : '';
                                                                    const datePart = `(${e.isMonthOnly ? format(parseISO(e.date), 'MMMM yyyy') : format(parseISO(e.date), 'MMMM dd, yyyy')})`;
                                                                    return `${titlePart}${descPart} ${datePart}`.trim();
                                                                }).join('\n') : (week.date ? format(week.date, 'MMMM dd, yyyy') : undefined)}
                                                                style={isEvent ? { backgroundColor: eventColor, borderColor: eventColor } : undefined}
                                                            >
                                                                {isEvent && (
                                                                    <span className="event-label-text">
                                                                        {week.events[0].title || ''}
                                                                        {week.events[0].title && week.events[0].description ? `: ${week.events[0].description}` : (week.events[0].description || '')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
