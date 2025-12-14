import type { Post } from "@repo/types";
import { PostCard } from "./post-card";

export interface PostsListProps {
  posts: Post[];
  isLoadingMore?: boolean;
  lastElementRef?: (node: HTMLElement | null) => void;
}

export function PostsList({ posts, isLoadingMore, lastElementRef }: PostsListProps) {
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
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <div
            key={post.id}
            ref={isLast && lastElementRef ? lastElementRef : undefined}
            className="w-full"
          >
            <PostCard post={post} showLine={!isLast} />
          </div>
        );
      })}
      
      {isLoadingMore && (
        <div className="flex items-center justify-center py-4 w-full">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#9747ff] border-t-transparent rounded-full animate-spin" />
            <span className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.6)]">
              Loading more...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
