import { useEffect, useRef, useState } from "preact/hooks";

// reverse should be set to true if the DOM element is `flex-col-reverse`
const useScroll = (reverse?: boolean) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isBottom, setIsBottom] = useState(false);
    const [isTop, setIsTop] = useState(false);

    const updateScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        if (reverse) {
            if (container.scrollTop === 0) {
                setIsBottom(true);
            } else {
                setIsBottom(false);
            }
            if (container.scrollTop - container.clientHeight === -container.scrollHeight) {
                setIsTop(true);
            } else {
                setIsTop(false);
            }
        } else {
            if (container.scrollTop === container.scrollHeight - container.clientHeight) {
                setIsBottom(true);
            } else {
                setIsBottom(false);
            }
            if (container.scrollTop === 0) {
                setIsTop(true);
            } else {
                setIsTop(false);
            }
        }
    };

    // eslint-disable-next-line no-unused-vars
    const debounce = (callback: (...args: unknown[]) => unknown, delay: number) => {
        let timer: number | undefined;
        return (...args: unknown[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => callback(...args), delay);
        };
    };

    useEffect(() => {
        updateScroll();
        const handleScroll = debounce(() => {
            updateScroll();
        }, 100);
        if (containerRef.current) {
            containerRef.current.addEventListener("scroll", handleScroll, {
                passive: true,
            });
        }
        return () => {
            if (containerRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                containerRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef.current, reverse]);

    return [isBottom, isTop, containerRef];
};

export default useScroll;
