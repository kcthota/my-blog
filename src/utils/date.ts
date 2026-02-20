import { format, parse } from 'date-fns';

export const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    // Try parsing as standard date first (handles ISO strings with time)
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return format(date, 'MMMM dd, yyyy');
    }

    try {
        return format(parse(dateString, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy');
    } catch (e) {
        return dateString;
    }
};
