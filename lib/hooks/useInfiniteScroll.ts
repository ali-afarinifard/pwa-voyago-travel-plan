"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  total: number;
  pageSize: number;
  /** distance from the sentinel before it's considered "reached" (0 = exact end) */
  rootMargin?: string;
  /** minimum time to show the loading state, so it never flashes/feels instant */
  minLoadingMs?: number;
}

interface UseInfiniteScrollResult {
  visibleCount: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  sentinelRef: (node: Element | null) => void;
}

export function useInfiniteScroll({
  total,
  pageSize,
  rootMargin = "0px",
  minLoadingMs = 400,
}: UseInfiniteScrollOptions): UseInfiniteScrollResult {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMore = visibleCount < total;

  // Reset paging whenever the dataset changes (new filter/search applied)
  useEffect(() => {
    setVisibleCount(pageSize);
    setIsLoadingMore(false);
    isLoadingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [total, pageSize]);

  const loadMore = useCallback(() => {
    if (isLoadingRef.current) return;
    if (visibleCount >= total) return;

    isLoadingRef.current = true;
    setIsLoadingMore(true);

    // Simulates/normalizes the loading window. Swap the body of this timeout
    // for a real fetch() call when pagination moves server-side.
    timeoutRef.current = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, total));
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }, minLoadingMs);
  }, [pageSize, total, visibleCount]);

  const sentinelRef = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { rootMargin, threshold: 0 },
      );

      observerRef.current.observe(node);
    },
    [loadMore, rootMargin],
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { visibleCount, hasMore, isLoadingMore, sentinelRef };
}
