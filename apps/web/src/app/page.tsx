"use client";

import { useState, useMemo, useCallback } from "react";
import type { Tag } from "@repo/types";
import { useAuth } from "@/lib/auth";
import { usePosts, useTags, useUsers, useInfiniteScroll } from "@/hooks";
import { PostsHeader } from "@/components/posts/posts-header";
import { PostsList } from "@/components/posts/posts-list";
import { CreatePostModal } from "@/components/posts/create-post-modal";
import { FilterModal, type FilterState } from "@/components/posts/filter-modal";

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    userIds: [],
    tagIds: [],
  });

  const {
    posts,
    isLoading: isPostsLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    createPost,
  } = usePosts({
    authorIds: activeFilters.userIds.length > 0 ? activeFilters.userIds : undefined,
    tagIds: activeFilters.tagIds.length > 0 ? activeFilters.tagIds : undefined,
  });

  const { tags: availableTags } = useTags();
  const { users: availableUsers } = useUsers();

  // Infinite scroll
  const { lastElementRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore,
  });

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const handleResetFilter = () => {
    setActiveFilters({ userIds: [], tagIds: [] });
  };

  const isFilterActive =
    activeFilters.userIds.length > 0 || activeFilters.tagIds.length > 0;

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPost = useCallback(
    async (content: string, tags: Tag[]) => {
      try {
        // Separate existing tags (have UUID) from new tags (have custom IDs)
        const existingTagIds = tags
          .filter((tag) => tag.id.match(/^[0-9a-f-]{36}$/i))
          .map((tag) => tag.id);
        const newTagNames = tags
          .filter((tag) => !tag.id.match(/^[0-9a-f-]{36}$/i))
          .map((tag) => tag.name);

        await createPost({
          content,
          tagIds: existingTagIds.length > 0 ? existingTagIds : undefined,
          tagNames: newTagNames.length > 0 ? newTagNames : undefined,
        });
      } catch (error) {
        console.error("Failed to create post:", error);
      }
    },
    [createPost]
  );

  // Create tag handler for the modal (creates temporary tag object)
  const handleCreateTag = useCallback((name: string): Tag => {
    return {
      id: `new-${Date.now()}`,
      name: name.trim(),
    };
  }, []);

  // Show loading state
  if (isAuthLoading) {
    return (
      <div className="bg-[#111] h-screen w-full flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // User should always exist here due to middleware protection
  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#111] relative h-screen w-full flex flex-col overflow-hidden">
      {/* Purple glow effect */}
      <div className="absolute bg-[#7c34f8] blur-[100px] h-[14px] left-1/2 top-[68px] -translate-x-1/2 w-[740px] pointer-events-none" />

      {/* Main content - scrollable */}
      <main className="flex-1 flex flex-col items-center px-4 overflow-y-auto">
        {/* Posts header - sticky */}
        <div className="sticky top-0 z-10 w-full max-w-[643px] pt-[32px]">
          <PostsHeader
            userName={user.name}
            userColor={user.color ?? "#6366f1"}
            onFilterClick={handleFilterClick}
            onCreateClick={handleCreateClick}
            isFilterActive={isFilterActive}
            onResetFilter={handleResetFilter}
          />
        </div>

        {/* Posts container */}
        <div className="flex flex-col w-full max-w-[643px] h-fit">
          {/* Posts list */}
          <div className="flex flex-col px-[16px] py-[24px]">
            {isPostsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#9747ff] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.6)]">
                    Loading posts...
                  </span>
                </div>
              </div>
            ) : (
              <PostsList
                posts={posts}
                isLoadingMore={isLoadingMore}
                lastElementRef={lastElementRef}
              />
            )}
          </div>
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPost}
        userName={user.name}
        userColor={user.color ?? "#6366f1"}
        availableTags={availableTags}
        onCreateTag={handleCreateTag}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
        availableUsers={availableUsers}
        availableTags={availableTags}
        initialFilters={activeFilters}
      />
    </div>
  );
}
