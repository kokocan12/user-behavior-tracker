import { useEffect, useRef, WheelEvent } from 'react';

const scrollCache = {};
const useScrollCache = (key: string) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onScroll = (e: WheelEvent<HTMLDivElement>) => {
    scrollCache[key] = e.currentTarget.scrollTop;
  };

  useEffect(() => {
    if (containerRef.current && scrollCache[key]) {
      containerRef.current.scrollTo(0, scrollCache[key]);
    }
  }, []);

  return { onScroll, containerRef };
};

export default useScrollCache;
