/**
 * Loads all images from the assets/images directory, categorized by rarity folders.
 * Returns an array of image objects: { src, path, rarity }
 */
export const loadWeddingImages = () => {
    // Import all images from rarity folders
    const ssrModules = import.meta.glob('/src/assets/images/SSR/*.{jpg,jpeg,png,webp}', { eager: true });
    const srModules = import.meta.glob('/src/assets/images/SR/*.{jpg,jpeg,png,webp}', { eager: true });
    const rModules = import.meta.glob('/src/assets/images/R/*.{jpg,jpeg,png,webp}', { eager: true });

    const formatImages = (modules, rarity) => {
        return Object.entries(modules).map(([path, module]) => ({
            src: module.default,
            path: path, // Full path for unique ID
            rarity: rarity
        }));
    };

    const ssrImages = formatImages(ssrModules, 'SSR');
    const srImages = formatImages(srModules, 'SR');
    const rImages = formatImages(rModules, 'R');

    // Combine all
    return [...ssrImages, ...srImages, ...rImages];
};
