"use client";

import { useState, useMemo } from "react";
import type { Post, Tag } from "@repo/types";
import { PostsHeader } from "@/components/posts/posts-header";
import { PostsList } from "@/components/posts/posts-list";
import { CreatePostModal } from "@/components/posts/create-post-modal";
import {
  FilterModal,
  type FilterState,
} from "@/components/posts/filter-modal";
import {
  MOCK_POSTS,
  CURRENT_USER,
  getAllTags,
  getAllUsers,
  createTag,
  createPost,
} from "@/lib/mock/posts";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    usernames: [],
    tags: [],
  });

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by usernames
    if (activeFilters.usernames.length > 0) {
      result = result.filter((post) =>
        activeFilters.usernames.includes(post.authorName)
      );
    }

    // Filter by tags
    if (activeFilters.tags.length > 0) {
      result = result.filter((post) =>
        post.tags.some((tag) => activeFilters.tags.includes(tag.name))
      );
    }

    return result;
  }, [posts, activeFilters]);

  const availableTags = useMemo(() => getAllTags(), []);
  const availableUsers = useMemo(() => getAllUsers(), []);

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
    setActiveFilters({ usernames: [], tags: [] });
  };

  const isFilterActive =
    activeFilters.usernames.length > 0 || activeFilters.tags.length > 0;

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPost = (content: string, tags: Tag[]) => {
    const newPost = createPost(content, tags);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="bg-[#111] relative h-screen w-full flex flex-col overflow-hidden">
      {/* Purple glow effect */}
      <div className="absolute bg-[#7c34f8] blur-[100px] h-[14px] left-1/2 top-[68px] -translate-x-1/2 w-[740px] pointer-events-none" />

      {/* Main content - scrollable */}
      <main className="flex-1 flex flex-col items-center px-4 overflow-y-auto">
        {/* Posts header - sticky */}
        <div className="sticky top-0 z-10 w-full max-w-[643px] pt-[32px]">
          <PostsHeader
            userName={CURRENT_USER.name}
            userColor={CURRENT_USER.color}
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
            <PostsList posts={filteredPosts} />
          </div>
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPost}
        userName={CURRENT_USER.name}
        userColor={CURRENT_USER.color}
        availableTags={availableTags}
        onCreateTag={createTag}
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
