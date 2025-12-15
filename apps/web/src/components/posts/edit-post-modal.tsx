"use client";

import { useState, useEffect, useRef } from "react";
import type { Tag, Post } from "@repo/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TagInput } from "./tag-input";
import { CloseIcon } from "@/components/icons";

export interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, tags: Tag[]) => void | Promise<void>;
  post: Post;
  availableTags: Tag[];
  onCreateTag: (name: string) => Tag;
}

const MAX_CONTENT_LENGTH = 240;

export function EditPostModal({
  isOpen,
  onClose,
  onSubmit,
  post,
  availableTags,
  onCreateTag,
}: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(post.tags);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset form when modal opens/closes or post changes
  useEffect(() => {
    if (isOpen) {
      setContent(post.content);
      setSelectedTags(post.tags);
      setError("");
      setIsSubmitting(false);
      // Focus textarea when modal opens
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, post]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isSubmitting]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CONTENT_LENGTH) {
      setContent(value);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Post content is required");
      return;
    }

    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setError(`Content cannot exceed ${MAX_CONTENT_LENGTH} characters`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(trimmedContent, selectedTags);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = content.trim() && content.length <= MAX_CONTENT_LENGTH && !isSubmitting;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-[643px] bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-[16px]"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center h-[52px] px-4 border-b border-[rgba(255,255,255,0.2)]">
          <h2 className="text-[20px] font-medium leading-[28px] text-white text-center">
            Edit post
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-[8px] rounded-[12px] hover:bg-[rgba(255,255,255,0.1)] transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <CloseIcon className="size-6 text-white" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-4 pt-6 pb-6">
          {/* Content area */}
          <div className="flex gap-2 items-start">
            {/* Avatar and vertical line */}
            <div className="flex flex-col gap-4 items-center">
              <Avatar name={post.authorName} color={post.authorColor} size="md" />
              <div className="flex-1 w-px bg-[rgba(255,255,255,0.2)]" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-2">
              {/* User info and tag input */}
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium leading-[20px] text-white">
                  {post.authorName}
                </span>
                <TagInput
                  selectedTags={selectedTags}
                  availableTags={availableTags}
                  onTagsChange={setSelectedTags}
                  onCreateTag={onCreateTag}
                  maxTags={5}
                  maxTagLength={12}
                />
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="What do you want to share today?"
                rows={3}
                disabled={isSubmitting}
                className="w-full bg-transparent text-[14px] font-normal leading-[20px] text-[rgba(255,255,255,0.8)] placeholder:text-[rgba(255,255,255,0.6)] focus:outline-none resize-none disabled:opacity-50"
              />
              {error && (
                <p className="text-[12px] leading-[16px] text-red-500">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isValid}
              isLoading={isSubmitting}
              className="w-[182px]"
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

