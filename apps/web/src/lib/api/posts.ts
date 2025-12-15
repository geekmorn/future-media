import type { Post, Tag } from '@repo/types';
import { apiClient } from './client';

export interface PostsResponse {
  items: Post[];
  nextCursor?: string;
}

export interface GetPostsParams {
  authorIds?: string[];
  tagIds?: string[];
  limit?: number;
  cursor?: string;
  sort?: 'asc' | 'desc';
}

export async function getPosts(params: GetPostsParams = {}): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();

  if (params.authorIds?.length) {
    searchParams.set('authorIds', params.authorIds.join(','));
  }
  if (params.tagIds?.length) {
    searchParams.set('tagIds', params.tagIds.join(','));
  }
  if (params.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  const queryString = searchParams.toString();
  const url = `/api/posts${queryString ? `?${queryString}` : ''}`;

  return apiClient<PostsResponse>(url);
}

export interface CreatePostParams {
  content: string;
  tagIds?: string[];
  tagNames?: string[];
}

export async function createPost(params: CreatePostParams): Promise<Post> {
  return apiClient<Post>('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export interface UpdatePostParams {
  content?: string;
  tagIds?: string[];
  tagNames?: string[];
}

export async function updatePost(id: string, params: UpdatePostParams): Promise<Post> {
  return apiClient<Post>(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export async function deletePost(id: string): Promise<void> {
  await apiClient<void>(`/api/posts/${id}`, {
    method: 'DELETE',
  });
}

export interface TagsResponse {
  items: Tag[];
}

export async function getTags(search?: string): Promise<TagsResponse> {
  const searchParams = new URLSearchParams();
  if (search) {
    searchParams.set('search', search);
  }

  const queryString = searchParams.toString();
  const url = `/api/tags${queryString ? `?${queryString}` : ''}`;

  return apiClient<TagsResponse>(url);
}

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface UsersResponse {
  items: User[];
}

export async function getUsers(search?: string): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();
  if (search) {
    searchParams.set('search', search);
  }

  const queryString = searchParams.toString();
  const url = `/api/users${queryString ? `?${queryString}` : ''}`;

  return apiClient<UsersResponse>(url);
}
