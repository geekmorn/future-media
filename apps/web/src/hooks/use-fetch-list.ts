"use client";

import { useState, useCallback, useEffect } from "react";

export interface UseFetchListReturn<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useFetchList<T>(
  fetchFn: () => Promise<{ items: T[] }>,
  errorMessage: string
): UseFetchListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFn();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, errorMessage]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    isLoading,
    error,
    refresh,
  };
}

