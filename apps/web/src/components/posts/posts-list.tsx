'use client';

import { useState } from 'react';
import type { Post, Tag } from '@repo/types';
import { PostCard } from './post-card';
import { EditPostModal } from './edit-post-modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export interface PostsListProps {
  posts: Post[];
  isLoadingMore?: boolean;
  lastElementRef?: (node: HTMLElement | null) => void;
  currentUserId?: string;
  availableTags?: Tag[];
  onCreateTag?: (name: string) => Tag;
  onUpdatePost?: (id: string, content: string, tags: Tag[]) => Promise<void>;
  onDeletePost?: (id: string) => Promise<void>;
}

export function PostsList({
  posts,
  isLoadingMore,
  lastElementRef,
  currentUserId,
  availableTags = [],
  onCreateTag,
  onUpdatePost,
  onDeletePost,
}: PostsListProps) {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleCloseEditModal = () => {
    setEditingPost(null);
  };

  const handleSubmitEdit = async (content: string, tags: Tag[]) => {
    if (!editingPost || !onUpdatePost) return;
    await onUpdatePost(editingPost.id, content, tags);
    setEditingPost(null);
  };

  const handleDeleteClick = (post: Post) => {
    setDeletingPost(post);
  };

  const handleCloseDeleteModal = () => {
    setDeletingPost(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPost || !onDeletePost) return;
    setIsDeleting(true);
    try {
      await onDeletePost(deletingPost.id);
      setDeletingPost(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.6)]">No posts yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-[26px] items-start w-full">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          const isOwner = currentUserId === post.authorId;

          return (
            <div
              key={post.id}
              ref={isLast && lastElementRef ? lastElementRef : undefined}
              className="w-full"
            >
              <PostCard
                post={post}
                showLine={!isLast}
                isOwner={isOwner}
                onEdit={isOwner ? () => handleEdit(post) : undefined}
                onDelete={isOwner ? () => handleDeleteClick(post) : undefined}
              />
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

      {/* Edit Post Modal */}
      {editingPost && onCreateTag && (
        <EditPostModal
          isOpen={!!editingPost}
          onClose={handleCloseEditModal}
          onSubmit={handleSubmitEdit}
          post={editingPost}
          availableTags={availableTags}
          onCreateTag={onCreateTag}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingPost}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
