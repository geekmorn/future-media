"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Post } from "@repo/types";
import { getPosts, createPost as createPostApi, type GetPostsParams, type CreatePostParams } from "@/lib/api/posts";

export interface UsePostsOptions {
  authorIds?: string[];
  tagIds?: string[];
  limit?: number;
}

export interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  createPost: (params: CreatePostParams) => Promise<Post>;
}

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  
  // Track if initial load has happened
  const hasLoadedRef = useRef(false);
  
  // Keep options stable for comparison
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchPosts = useCallback(async (cursor?: string) => {
    const params: GetPostsParams = {
      limit: optionsRef.current.limit ?? 20,
      cursor,
    };

    if (optionsRef.current.authorIds?.length) {
      params.authorIds = optionsRef.current.authorIds;
    }
    if (optionsRef.current.tagIds?.length) {
      params.tagIds = optionsRef.current.tagIds;
    }

    return getPosts(params);
  }, []);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPosts();
      setPosts(data.items);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const data = await fetchPosts(nextCursor);
      setPosts((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more posts");
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore, fetchPosts]);

  const refresh = useCallback(async () => {
    setNextCursor(undefined);
    await loadInitial();
  }, [loadInitial]);

  const createPost = useCallback(async (params: CreatePostParams): Promise<Post> => {
    const newPost = await createPostApi(params);
    // Add new post to the beginning of the list
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, []);

  // Initial load
  useEffect(() => {
    loadInitial();
    hasLoadedRef.current = true;
  }, [loadInitial]);

  // Reload when filters change (after initial load)
  useEffect(() => {
    if (hasLoadedRef.current) {
      loadInitial();
    }
  }, [options.authorIds?.join(","), options.tagIds?.join(","), loadInitial]);

  return {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore: !!nextCursor,
    loadMore,
    refresh,
    createPost,
  };
}
