"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Tag } from "@repo/types";
import type { User } from "@/lib/mock/posts";
import {
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterState {
  usernames: string[];
  tags: string[];
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  availableUsers: User[];
  availableTags: Tag[];
  initialFilters?: FilterState;
}

type ExpandedSection = "username" | "tag" | "date" | null;

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  availableUsers,
  availableTags,
  initialFilters,
}: FilterModalProps) {
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>(
    initialFilters?.usernames ?? []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialFilters?.tags ?? []
  );
  const [usernameSearch, setUsernameSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const usernameDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens with initial filters
  useEffect(() => {
    if (isOpen) {
      setSelectedUsernames(initialFilters?.usernames ?? []);
      setSelectedTags(initialFilters?.tags ?? []);
      setUsernameSearch("");
      setTagSearch("");
      setExpandedSection(null);
      setShowUsernameDropdown(false);
      setShowTagDropdown(false);
    }
  }, [isOpen, initialFilters]);

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

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        usernameDropdownRef.current &&
        !usernameDropdownRef.current.contains(event.target as Node) &&
        usernameInputRef.current &&
        !usernameInputRef.current.contains(event.target as Node)
      ) {
        setShowUsernameDropdown(false);
      }
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node) &&
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    const search = usernameSearch.toLowerCase().trim();
    if (!search) return availableUsers;
    return availableUsers.filter((user) =>
      user.name.toLowerCase().includes(search)
    );
  }, [availableUsers, usernameSearch]);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    const search = tagSearch.toLowerCase().trim();
    if (!search) return availableTags;
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(search)
    );
  }, [availableTags, tagSearch]);

  const handleToggleSection = (section: ExpandedSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
    setShowUsernameDropdown(false);
    setShowTagDropdown(false);
  };

  const handleSelectUsername = (username: string) => {
    setSelectedUsernames((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
    setShowUsernameDropdown(false);
    setUsernameSearch("");
  };

  const handleRemoveUsername = (username: string) => {
    setSelectedUsernames((prev) => prev.filter((u) => u !== username));
  };

  const handleSelectTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
    setShowTagDropdown(false);
    setTagSearch("");
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagName));
  };

  const handleReset = () => {
    setSelectedUsernames([]);
    setSelectedTags([]);
    setUsernameSearch("");
    setTagSearch("");
  };

  const handleApply = () => {
    onApply({
      usernames: selectedUsernames,
      tags: selectedTags,
    });
    onClose();
  };

  const hasFilters = selectedUsernames.length > 0 || selectedTags.length > 0;

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
        className="relative z-10 w-full max-w-[643px] bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-[16px]"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center h-[64px] px-4 border-b border-[rgba(255,255,255,0.2)]">
          <h2 className="text-[20px] font-medium leading-[28px] text-white text-center">
            Sort by
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-[8px] rounded-[12px] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="size-6 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 pt-8 flex flex-col gap-6">
          {/* Filter sections */}
          <div className="flex flex-col gap-4">
            {/* By user name section */}
            <div className="bg-[#1a1a1a] rounded-[8px]">
              {/* Header - collapsed state with chips */}
              {expandedSection !== "username" && (
                <button
                  type="button"
                  onClick={() => handleToggleSection("username")}
                  className="w-full flex items-center justify-between px-4 py-[10px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[16px] font-medium leading-[24px] text-white">
                      By user name
                    </span>
                    {/* Selected chips in collapsed state */}
                    {selectedUsernames.map((username) => (
                      <div
                        key={username}
                        className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                          {username}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUsername(username);
                          }}
                          className="text-[#9747ff] hover:text-[#b777ff] transition-colors"
                        >
                          <CloseIcon className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ChevronDownIcon className="size-4 text-white shrink-0" />
                </button>
              )}

              {/* Expanded state */}
              {expandedSection === "username" && (
                <div className="flex flex-col gap-4 px-4 py-[10px]">
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() => handleToggleSection("username")}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="text-[16px] font-medium leading-[24px] text-white">
                      By user name
                    </span>
                    <ChevronUpIcon className="size-4 text-white shrink-0" />
                  </button>

                  {/* Input field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium leading-[20px] text-[rgba(255,255,255,0.8)]">
                      Enter user name
                    </label>
                    <div className="relative">
                      <input
                        ref={usernameInputRef}
                        type="text"
                        value={usernameSearch}
                        onChange={(e) => {
                          setUsernameSearch(e.target.value);
                          setShowUsernameDropdown(true);
                        }}
                        onFocus={() => setShowUsernameDropdown(true)}
                        placeholder="Enter user name"
                        className={cn(
                          "w-full bg-[#242424] rounded-[8px] p-4 text-[16px] font-medium leading-[24px] text-white placeholder:text-[rgba(255,255,255,0.2)] focus:outline-none transition-colors",
                          showUsernameDropdown &&
                            "border border-[rgba(255,255,255,0.6)]"
                        )}
                      />

                      {/* Dropdown */}
                      {showUsernameDropdown && filteredUsers.length > 0 && (
                        <div
                          ref={usernameDropdownRef}
                          className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#242424] border border-[#595959] rounded-[8px] p-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-[#242424] scrollbar-thumb-[#595959] hover:scrollbar-thumb-[#6a6a6a]"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#595959 #242424",
                          }}
                        >
                          {filteredUsers.map((user) => {
                            const isSelected = selectedUsernames.includes(
                              user.name
                            );
                            return (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => handleSelectUsername(user.name)}
                                className={cn(
                                  "w-full flex items-center justify-between p-3 rounded-[8px] transition-colors",
                                  isSelected
                                    ? "bg-[#292929]"
                                    : "bg-[#242424] hover:bg-[#292929]"
                                )}
                              >
                                <span className="text-[12px] font-medium leading-[16px] text-white">
                                  {user.name}
                                </span>
                                {isSelected && (
                                  <CheckIcon className="size-[18px] text-[#9747ff]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected chips */}
                  {selectedUsernames.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedUsernames.map((username) => (
                        <div
                          key={username}
                          className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        >
                          <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                            {username}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveUsername(username)}
                            className="text-[#9747ff] hover:text-[#b777ff] transition-colors"
                          >
                            <CloseIcon className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* By tag section */}
            <div className="bg-[#1a1a1a] rounded-[8px]">
              {/* Header - collapsed state with chips */}
              {expandedSection !== "tag" && (
                <button
                  type="button"
                  onClick={() => handleToggleSection("tag")}
                  className="w-full flex items-center justify-between px-4 py-[10px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[16px] font-medium leading-[24px] text-white">
                      By tag
                    </span>
                    {/* Selected chips in collapsed state */}
                    {selectedTags.map((tagName) => (
                      <div
                        key={tagName}
                        className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                          {tagName}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(tagName);
                          }}
                          className="text-[#9747ff] hover:text-[#b777ff] transition-colors"
                        >
                          <CloseIcon className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ChevronDownIcon className="size-4 text-white shrink-0" />
                </button>
              )}

              {/* Expanded state */}
              {expandedSection === "tag" && (
                <div className="flex flex-col gap-4 px-4 py-[10px]">
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() => handleToggleSection("tag")}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="text-[16px] font-medium leading-[24px] text-white">
                      By tag
                    </span>
                    <ChevronUpIcon className="size-4 text-white shrink-0" />
                  </button>

                  {/* Input field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium leading-[20px] text-[rgba(255,255,255,0.8)]">
                      Enter tag
                    </label>
                    <div className="relative">
                      <input
                        ref={tagInputRef}
                        type="text"
                        value={tagSearch}
                        onChange={(e) => {
                          setTagSearch(e.target.value);
                          setShowTagDropdown(true);
                        }}
                        onFocus={() => setShowTagDropdown(true)}
                        placeholder="Enter tag"
                        className={cn(
                          "w-full bg-[#242424] rounded-[8px] p-4 text-[16px] font-medium leading-[24px] text-white placeholder:text-[rgba(255,255,255,0.2)] focus:outline-none transition-colors",
                          showTagDropdown &&
                            "border border-[rgba(255,255,255,0.6)]"
                        )}
                      />

                      {/* Dropdown */}
                      {showTagDropdown && filteredTags.length > 0 && (
                        <div
                          ref={tagDropdownRef}
                          className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#242424] border border-[#595959] rounded-[8px] p-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-[#242424] scrollbar-thumb-[#595959] hover:scrollbar-thumb-[#6a6a6a]"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#595959 #242424",
                          }}
                        >
                          {filteredTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.name);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleSelectTag(tag.name)}
                                className={cn(
                                  "w-full flex items-center justify-between p-3 rounded-[8px] transition-colors",
                                  isSelected
                                    ? "bg-[#292929]"
                                    : "bg-[#242424] hover:bg-[#292929]"
                                )}
                              >
                                <span className="text-[12px] font-medium leading-[16px] text-white">
                                  {tag.name}
                                </span>
                                {isSelected && (
                                  <CheckIcon className="size-[18px] text-[#9747ff]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected chips */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tagName) => (
                        <div
                          key={tagName}
                          className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        >
                          <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                            {tagName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tagName)}
                            className="text-[#9747ff] hover:text-[#b777ff] transition-colors"
                          >
                            <CloseIcon className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* By date section (disabled for now) */}
            <div className="bg-[#1a1a1a] rounded-[8px]">
              <div className="flex items-center justify-between px-4 py-[10px] opacity-50 cursor-not-allowed">
                <span className="text-[16px] font-medium leading-[24px] text-white">
                  By date
                </span>
                <ChevronDownIcon className="size-4 text-white shrink-0" />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3">
            {hasFilters && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleReset}
                className="w-[182px]"
              >
                Reset all
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleApply}
              disabled={!hasFilters}
              className="w-[182px]"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
