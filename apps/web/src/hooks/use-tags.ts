'use client';

import { useCallback } from 'react';
import type { Tag } from '@repo/types';
import { getTags } from '@/lib/api/posts';
import { useFetchList, type UseFetchListReturn } from './use-fetch-list';

export type UseTagsReturn = UseFetchListReturn<Tag> & { tags: Tag[] };

export function useTags(): UseTagsReturn {
  const fetchTags = useCallback(() => getTags(), []);
  const result = useFetchList<Tag>(fetchTags, 'Failed to load tags');

  return {
    ...result,
    tags: result.items,
  };
}
