const PROGRESS_QUEUE_KEY = 'offlineProgressQueue';

export const getQueuedProgress = () => {
    try {
        const raw = localStorage.getItem(PROGRESS_QUEUE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const addToQueue = (progressEntry) => {
    const current = getQueuedProgress();
    current.push(progressEntry);
    localStorage.setItem(PROGRESS_QUEUE_KEY, JSON.stringify(current));
};

export const clearQueue = () => {
    localStorage.removeItem(PROGRESS_QUEUE_KEY);
};
