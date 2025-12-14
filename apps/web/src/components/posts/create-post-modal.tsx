"use client";

import { useState, useEffect, useRef } from "react";
import type { Tag } from "@repo/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TagInput } from "./tag-input";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, tags: Tag[]) => void;
  userName: string;
  userColor: string;
  availableTags: Tag[];
  onCreateTag: (name: string) => Tag;
}

const MAX_CONTENT_LENGTH = 240;

export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
  userColor,
  availableTags,
  onCreateTag,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setContent("");
      setSelectedTags([]);
      setError("");
      // Focus textarea when modal opens
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

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

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit(trimmedContent, selectedTags);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-[520px] bg-[#1a1a1a] border border-[rgba(255,255,255,0.2)] rounded-[16px] shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 className="text-[24px] font-medium leading-[28px] text-white">
            Create a new post
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-[rgba(255,255,255,0.8)] transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-4">
            {/* User info and tag input */}
            <div className="flex items-center gap-3">
              <Avatar name={userName} color={userColor} size="md" />
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[16px] font-medium leading-[24px] text-white">
                    {userName}
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
              </div>
            </div>

            {/* Content textarea */}
            <div className="flex flex-col gap-2">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="What do you want to share today?"
                rows={6}
                className={cn(
                  "w-full bg-[#1a1a1a] rounded-[8px] p-4 text-[16px] font-medium leading-[24px] text-white placeholder:text-[rgba(255,255,255,0.2)] focus:outline-none transition-colors resize-none"
                )}
              />
              {error && (
                <p className="text-[12px] leading-[16px] text-red-500">
                  {error}
                </p>
              )}
              <div className="flex items-center justify-end">
                <span
                  className={cn(
                    "text-[12px] leading-[16px]",
                    content.length > MAX_CONTENT_LENGTH
                      ? "text-red-500"
                      : "text-[rgba(255,255,255,0.6)]"
                  )}
                >
                  {content.length}/{MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
            {(content.trim() || selectedTags.length > 0) && (
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                size="md"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={!content.trim() || content.length > MAX_CONTENT_LENGTH}
            >
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
