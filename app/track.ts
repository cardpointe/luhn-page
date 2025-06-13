export function Track(category: string, action: string, label?: string) {
    try {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
            });
        } else if (process.env.TRACKING_ENABLED) {
            const url = `/track.json?category=${encodeURIComponent(category)}&action=${encodeURIComponent(action)}${label ? `&label=${encodeURIComponent(label)}` : ''}`;
            fetch(url, {
                method: 'GET',
            });
        }
    } catch (err) {
        console.error('Tracking error:', err);
    }
}