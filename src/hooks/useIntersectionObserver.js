import { useEffect, useState } from 'react';

const useIntersectionObserver = (elementRef, { threshold = 0.1, root = null, rootMargin = '0%' } = {}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = elementRef?.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(node); // Trigger once
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [elementRef, threshold, root, rootMargin]);

    return isVisible;
};

export default useIntersectionObserver;
