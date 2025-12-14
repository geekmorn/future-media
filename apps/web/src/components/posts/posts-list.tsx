import type { Post } from "@repo/types";
import { PostCard } from "./post-card";

export interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.6)]">
          No posts yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[26px] items-start w-full">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          showLine={index < posts.length - 1}
        />
      ))}
    </div>
  );
}
