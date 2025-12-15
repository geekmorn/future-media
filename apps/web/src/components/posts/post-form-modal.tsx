"use client";

import { useState, useEffect, useRef } from "react";
import type { Tag, Post } from "@repo/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TagInput } from "./tag-input";
import { CloseIcon } from "@/components/icons";
import { useModal } from "@/hooks/use-modal";

export type PostFormMode = "create" | "edit";

export interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, tags: Tag[]) => void | Promise<void>;
  availableTags: Tag[];
  onCreateTag: (name: string) => Tag;
  mode: PostFormMode;
  post?: Post;
  userName?: string;
  userColor?: string;
}

const MAX_CONTENT_LENGTH = 240;

const MODAL_CONFIG = {
  create: {
    title: "Create a new post",
    submitText: "Upload",
    errorMessage: "Failed to create post",
  },
  edit: {
    title: "Edit post",
    submitText: "Save changes",
    errorMessage: "Failed to update post",
  },
} as const;

export function PostFormModal({
  isOpen,
  onClose,
  onSubmit,
  availableTags,
  onCreateTag,
  mode,
  post,
  userName,
  userColor,
}: PostFormModalProps) {
  const config = MODAL_CONFIG[mode];
  const authorName = mode === "edit" ? post?.authorName : userName;
  const authorColor = mode === "edit" ? post?.authorColor : userColor;

  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useModal({ isOpen, onClose, disabled: isSubmitting });

  useEffect(() => {
    if (isOpen) {
      setContent(mode === "edit" && post ? post.content : "");
      setSelectedTags(mode === "edit" && post ? post.tags : []);
      setError("");
      setIsSubmitting(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, mode, post]);

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
      setError(err instanceof Error ? err.message : config.errorMessage);
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
      <div className="absolute inset-0 bg-black/50" />

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-[643px] bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-[16px]"
      >
        <div className="relative flex items-center justify-center h-[52px] px-4 border-b border-[rgba(255,255,255,0.2)]">
          <h2 className="text-[20px] font-medium leading-[28px] text-white text-center">
            {config.title}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-4 pt-6 pb-6">
          <div className="flex gap-2 items-start">
            <div className="flex flex-col gap-4 items-center">
              <Avatar name={authorName ?? ""} color={authorColor ?? "#6366f1"} size="md" />
              <div className="flex-1 w-px bg-[rgba(255,255,255,0.2)]" />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium leading-[20px] text-white">
                  {authorName}
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

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isValid}
              isLoading={isSubmitting}
              className="w-[182px]"
            >
              {config.submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

