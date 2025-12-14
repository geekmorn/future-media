"use client";

import { useState, useMemo } from "react";
import type { Post, Tag } from "@repo/types";
import { PostsTabs, type PostsFilter } from "@/components/posts/posts-tabs";
import { PostsHeader } from "@/components/posts/posts-header";
import { PostsList } from "@/components/posts/posts-list";
import { CreatePostModal } from "@/components/posts/create-post-modal";
import {
  MOCK_POSTS,
  CURRENT_USER,
  getAllTags,
  createTag,
  createPost,
} from "@/lib/mock/posts";

export default function Home() {
  const [activeTab, setActiveTab] = useState<PostsFilter>("all");
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPosts = useMemo(
    () =>
      activeTab === "my"
        ? posts.filter((post) => post.authorId === CURRENT_USER.id)
        : posts,
    [posts, activeTab]
  );

  const availableTags = useMemo(() => getAllTags(), []);

  const handleSearchClick = () => {
    // TODO: Implement search
  };

  const handleFilterClick = () => {
    // TODO: Implement filter
  };

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

      {/* Header with tabs - fixed */}
      <header className="bg-[#111] border-b border-[rgba(255,255,255,0.2)] h-[68px] w-full shrink-0 z-10">
        <div className="flex h-full items-center justify-center">
          <PostsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 flex justify-center pt-[32px] px-4 overflow-hidden">
        <div className="backdrop-blur-[100px] bg-[rgba(0,0,0,0.03)] flex flex-col w-full max-w-[643px] rounded-[16px] overflow-hidden">
          {/* Posts header - fixed within container */}
          <PostsHeader
            userName={CURRENT_USER.name}
            userColor={CURRENT_USER.color}
            onSearchClick={handleSearchClick}
            onFilterClick={handleFilterClick}
            onCreateClick={handleCreateClick}
          />

          {/* Posts list - scrollable */}
          <div className="flex-1 flex flex-col px-[16px] py-[24px] overflow-y-auto">
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
    </div>
  );
}
