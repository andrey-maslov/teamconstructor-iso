declare global {
    interface Window {
        gtag: any;
    }
}

export const event = ( action: string, category: string, label: string, value: string ) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value,
        });
    }
};
