"use client";

import { useState, useCallback, useEffect } from "react";
import type { Tag } from "@repo/types";
import { getTags } from "@/lib/api/posts";

export interface UseTagsReturn {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTags();
      setTags(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    isLoading,
    error,
    refresh,
  };
}
