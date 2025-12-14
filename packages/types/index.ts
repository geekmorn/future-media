// Shared types for the monorepo

export type User = {
  id: string;
  name: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Post = {
  id: string;
  content: string;
  tags: Tag[];
  authorId: string;
  authorName: string;
  authorColor: string;
  createdAt: Date;
};

export type PostsListResponse = {
  items: Post[];
  nextCursor?: string;
  total?: number;
};

export type TagsListResponse = {
  items: Tag[];
};

export type AuthResponse = {
  user: User;
};

export type SuccessResponse = {
  success: boolean;
};

export type SignUpRequest = {
  name: string;
  password: string;
};

export type SignInRequest = {
  name: string;
  password: string;
};

export type CreatePostRequest = {
  content: string;
  tagIds?: string[];
  tagNames?: string[];
};

export type GetPostsQuery = {
  authorIds?: string;
  tagIds?: string;
  limit?: number;
  cursor?: string;
  sort?: 'asc' | 'desc';
};

export type GetTagsQuery = {
  search?: string;
  limit?: number;
};
