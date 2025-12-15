'use client';

import { useState, useCallback } from 'react';
import type { Tag } from '@repo/types';
import { useAuth } from '@/lib/auth';
import { usePosts, useTags, useUsers, useInfiniteScroll } from '@/hooks';
import { PostsHeader } from '@/components/posts/posts-header';
import { PostsList } from '@/components/posts/posts-list';
import { PostFormModal } from '@/components/posts/post-form-modal';
import { FilterModal, type FilterState } from '@/components/posts/filter-modal';

const UUID_REGEX = /^[0-9a-f-]{36}$/i;

function separateTagsByType(tags: Tag[]) {
  const existingTagIds = tags.filter((tag) => UUID_REGEX.test(tag.id)).map((tag) => tag.id);
  const newTagNames = tags.filter((tag) => !UUID_REGEX.test(tag.id)).map((tag) => tag.name);

  return {
    tagIds: existingTagIds.length > 0 ? existingTagIds : undefined,
    tagNames: newTagNames.length > 0 ? newTagNames : undefined,
  };
}

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
    updatePost,
    deletePost,
  } = usePosts({
    authorIds: activeFilters.userIds.length > 0 ? activeFilters.userIds : undefined,
    tagIds: activeFilters.tagIds.length > 0 ? activeFilters.tagIds : undefined,
  });

  const { tags: availableTags } = useTags();
  const { users: availableUsers } = useUsers();

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

  const isFilterActive = activeFilters.userIds.length > 0 || activeFilters.tagIds.length > 0;

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPost = useCallback(
    async (content: string, tags: Tag[]) => {
      try {
        const { tagIds, tagNames } = separateTagsByType(tags);
        await createPost({ content, tagIds, tagNames });
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    },
    [createPost],
  );

  const handleUpdatePost = useCallback(
    async (id: string, content: string, tags: Tag[]) => {
      try {
        const { tagIds, tagNames } = separateTagsByType(tags);
        await updatePost(id, { content, tagIds, tagNames });
      } catch (error) {
        console.error('Failed to update post:', error);
        throw error;
      }
    },
    [updatePost],
  );

  const handleDeletePost = useCallback(
    async (id: string) => {
      try {
        await deletePost(id);
      } catch (error) {
        console.error('Failed to delete post:', error);
        throw error;
      }
    },
    [deletePost],
  );

  const handleCreateTag = useCallback((name: string): Tag => {
    return {
      id: `new-${Date.now()}`,
      name: name.trim(),
    };
  }, []);

  if (isAuthLoading) {
    return (
      <div className="bg-[#111] h-screen w-full flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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
            userColor={user.color ?? '#6366f1'}
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
                currentUserId={user.id}
                availableTags={availableTags}
                onCreateTag={handleCreateTag}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
              />
            )}
          </div>
        </div>
      </main>

      <PostFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPost}
        userName={user.name}
        userColor={user.color ?? '#6366f1'}
        availableTags={availableTags}
        onCreateTag={handleCreateTag}
        mode="create"
      />

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
