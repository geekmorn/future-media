"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Tag } from "@repo/types";
import type { User } from "@/lib/api/posts";
import {
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";

export interface FilterState {
  userIds: string[];
  tagIds: string[];
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
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    initialFilters?.userIds ?? []
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialFilters?.tagIds ?? []
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

  useModal({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) {
      setSelectedUserIds(initialFilters?.userIds ?? []);
      setSelectedTagIds(initialFilters?.tagIds ?? []);
      setUsernameSearch("");
      setTagSearch("");
      setExpandedSection(null);
      setShowUsernameDropdown(false);
      setShowTagDropdown(false);
    }
  }, [isOpen, initialFilters]);

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

  // Get selected users/tags for display
  const selectedUsers = useMemo(() => {
    return availableUsers.filter((user) => selectedUserIds.includes(user.id));
  }, [availableUsers, selectedUserIds]);

  const selectedTags = useMemo(() => {
    return availableTags.filter((tag) => selectedTagIds.includes(tag.id));
  }, [availableTags, selectedTagIds]);

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

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
    setShowUsernameDropdown(false);
    setUsernameSearch("");
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleSelectTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
    setShowTagDropdown(false);
    setTagSearch("");
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
  };

  const handleReset = () => {
    setSelectedUserIds([]);
    setSelectedTagIds([]);
    setUsernameSearch("");
    setTagSearch("");
  };

  const handleApply = () => {
    onApply({
      userIds: selectedUserIds,
      tagIds: selectedTagIds,
    });
    onClose();
  };

  const hasFilters = selectedUserIds.length > 0 || selectedTagIds.length > 0;

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
      <div className="absolute inset-0 bg-black/50" />

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-[643px] bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-[16px]"
      >
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

        <div className="p-4 pt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="bg-[#1a1a1a] rounded-[8px]">
              {expandedSection !== "username" && (
                <button
                  type="button"
                  onClick={() => handleToggleSection("username")}
                  className="w-full flex items-center justify-between px-4 py-[10px] rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[16px] font-medium leading-[24px] text-white">
                      By user name
                    </span>
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                          {user.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUser(user.id);
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

              {expandedSection === "username" && (
                <div className="flex flex-col gap-4 px-4 py-[10px]">
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
                            const isSelected = selectedUserIds.includes(
                              user.id
                            );
                            return (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => handleSelectUser(user.id)}
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

                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        >
                          <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                            {user.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(user.id)}
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

            <div className="bg-[#1a1a1a] rounded-[8px]">
              {expandedSection !== "tag" && (
                <button
                  type="button"
                  onClick={() => handleToggleSection("tag")}
                  className="w-full flex items-center justify-between px-4 py-[10px] rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[16px] font-medium leading-[24px] text-white">
                      By tag
                    </span>
                    {selectedTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                          {tag.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(tag.id);
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

              {expandedSection === "tag" && (
                <div className="flex flex-col gap-4 px-4 py-[10px]">
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
                            const isSelected = selectedTagIds.includes(tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleSelectTag(tag.id)}
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

                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="bg-[#18141d] border border-[#9747ff] flex items-center gap-[6px] px-3 py-2 rounded-[8px]"
                        >
                          <span className="text-[14px] font-normal leading-[20px] text-[#9747ff]">
                            {tag.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag.id)}
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

            <div className="bg-[#1a1a1a] rounded-[8px]">
              <div className="flex items-center justify-between px-4 py-[10px] opacity-50 cursor-not-allowed">
                <span className="text-[16px] font-medium leading-[24px] text-white">
                  By date
                </span>
                <ChevronDownIcon className="size-4 text-white shrink-0" />
              </div>
            </div>
          </div>

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
