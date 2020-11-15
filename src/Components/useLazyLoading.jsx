import {useCallback, useEffect} from 'react';
import throttle from 'lodash/throttle';

export function useLazyLoading({
                                   onIntersection,
                                   delay = 1000,
                                   marginFromBottom = 10
                               }) {
    const onScroll = useCallback(
        throttle(() => {
            let scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight);
            const scrollY = -document.body.getBoundingClientRect().top;

            if (
                (scrollMaxY && scrollY) &&
                scrollMaxY - scrollY - marginFromBottom <= 0
            ) {
                scrollMaxY+=marginFromBottom+20;
                onIntersection();
            }
        }, delay),
        [onIntersection, marginFromBottom, delay]
    );

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return [onScroll];
}
