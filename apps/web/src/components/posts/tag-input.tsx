"use client";

import { useState, useRef, useEffect } from "react";
import type { Tag } from "@repo/types";
import { Tag as TagComponent } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onCreateTag: (name: string) => Tag;
  maxTags?: number;
  maxTagLength?: number;
  className?: string;
}

export function TagInput({
  selectedTags,
  availableTags,
  onTagsChange,
  onCreateTag,
  maxTags = 5,
  maxTagLength = 12,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [showCreateOption, setShowCreateOption] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter tags based on input
  useEffect(() => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) {
      // Show all available tags when input is empty and dropdown is open
      const available = availableTags.filter(
        (tag) => !selectedTags.some((selected) => selected.id === tag.id)
      );
      setFilteredTags(available);
      setShowCreateOption(false);
      return;
    }

    const filtered = availableTags.filter(
      (tag) =>
        !selectedTags.some((selected) => selected.id === tag.id) &&
        tag.name.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setFilteredTags(filtered);
    setShowCreateOption(
      trimmedValue.length > 0 &&
        trimmedValue.length <= maxTagLength &&
        !availableTags.some(
          (tag) => tag.name.toLowerCase() === trimmedValue.toLowerCase()
        ) &&
        !selectedTags.some(
          (tag) => tag.name.toLowerCase() === trimmedValue.toLowerCase()
        )
    );
  }, [inputValue, availableTags, selectedTags, maxTagLength]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxTagLength) {
      setInputValue(value);
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true); // Show dropdown when input is focused
    setIsInputVisible(true);
  };

  const handleShowInput = () => {
    setIsInputVisible(true);
    setIsOpen(true); // Show dropdown immediately
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputBlur = () => {
    // Delay hiding input to allow dropdown clicks
    setTimeout(() => {
      if (!inputValue && selectedTags.length === 0) {
        setIsInputVisible(false);
      }
      setIsOpen(false);
      // Reset input if no tags selected
      if (!inputValue && selectedTags.length === 0) {
        setInputValue("");
      }
    }, 200);
  };

  const handleSelectTag = (tag: Tag) => {
    if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
      setInputValue("");
      setIsOpen(false);
      // Hide input if we've reached max tags, otherwise keep it visible
      if (selectedTags.length + 1 >= maxTags) {
        setIsInputVisible(false);
      } else {
        setIsInputVisible(true);
      }
    }
  };

  const handleCreateTag = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue.length > 0 &&
      trimmedValue.length <= maxTagLength &&
      selectedTags.length < maxTags
    ) {
      const newTag = onCreateTag(trimmedValue);
      onTagsChange([...selectedTags, newTag]);
      setInputValue("");
      setIsOpen(false);
      // Hide input if we've reached max tags, otherwise keep it visible
      if (selectedTags.length + 1 >= maxTags) {
        setIsInputVisible(false);
      } else {
        setIsInputVisible(true);
      }
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const newTags = selectedTags.filter((tag) => tag.id !== tagId);
    onTagsChange(newTags);
    if (newTags.length === 0 && !inputValue) {
      setIsInputVisible(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (showCreateOption) {
        handleCreateTag();
      } else if (filteredTags.length > 0) {
        handleSelectTag(filteredTags[0]);
      }
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1].id);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const shouldShowDropdown = isOpen && (filteredTags.length > 0 || showCreateOption || (!inputValue.trim() && availableTags.filter((tag) => !selectedTags.some((selected) => selected.id === tag.id)).length > 0));
  const showInput = isInputVisible || selectedTags.length > 0 || inputValue.length > 0;
  const canAddMoreTags = selectedTags.length < maxTags;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Selected tags */}
      {selectedTags.map((tag) => (
        <div key={tag.id} className="relative group">
          <TagComponent name={tag.name} />
          <button
            type="button"
            onClick={() => handleRemoveTag(tag.id)}
            className="absolute -top-1 -right-1 bg-[#212121] border border-[rgba(255,255,255,0.2)] rounded-full size-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remove tag ${tag.name}`}
          >
            <span className="text-[10px] text-white leading-none">×</span>
          </button>
        </div>
      ))}

      {/* Add tag button/input - only show if can add more */}
      {canAddMoreTags && (
        <div className="relative inline-block">
          {showInput ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag"
              className="bg-transparent border-none outline-none text-[#9747ff] text-[16px] font-medium leading-[24px] placeholder:text-[#9747ff] focus:ring-0 w-[120px]"
            />
          ) : (
            <button
              type="button"
              onClick={handleShowInput}
              className="text-[#9747ff] text-[14px] font-normal leading-[20px] underline decoration-solid underline-offset-2 cursor-pointer hover:text-[#b777ff] transition-colors"
            >
              Add a tag
            </button>
          )}

          {/* Dropdown */}
          {shouldShowDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-50 mt-2 left-0 bg-[#1a1a1a] border border-[rgba(255,255,255,0.2)] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto min-w-[200px]"
            >
              {/* Create new tag option */}
              {showCreateOption && (
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="w-full px-4 py-3 text-left hover:bg-[#212121] transition-colors flex items-center justify-between"
                >
                  <span className="text-white text-[14px] leading-[20px]">
                    {inputValue.trim()}
                  </span>
                  <span className="text-[rgba(255,255,255,0.6)] text-[12px] leading-[16px]">
                    New tag
                  </span>
                </button>
              )}

              {/* Existing tags */}
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className="w-full px-4 py-3 text-left hover:bg-[#212121] transition-colors"
                >
                  <span className="text-white text-[14px] leading-[20px]">
                    {tag.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
