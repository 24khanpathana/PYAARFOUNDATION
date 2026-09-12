export const isSafeExternalUrl = (value) => {
    if (!value?.trim()) return true;

    try {
        const url = new URL(value.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};
