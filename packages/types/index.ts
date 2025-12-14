// Shared types for the monorepo
// Add your shared types here

export type User = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date;
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

export type CreatePostDto = {
  content: string;
  tagIds: string[];
};

export type UpdatePostDto = {
  content?: string;
  tagIds?: string[];
};
