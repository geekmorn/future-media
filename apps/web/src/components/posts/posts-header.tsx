"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon, PlusCircleIcon } from "@/components/icons";

export interface PostsHeaderProps {
  userName: string;
  userColor: string;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  onCreateClick?: () => void;
}

export function PostsHeader({
  userName,
  userColor,
  onSearchClick,
  onFilterClick,
  onCreateClick,
}: PostsHeaderProps) {
  return (
    <div className="bg-[#111] border border-[rgba(255,255,255,0.2)] flex items-center justify-between p-[16px] rounded-[16px] w-full shrink-0">
      {/* User info */}
      <div className="bg-[#171717] flex items-center px-[16px] py-[10px] rounded-[12px] shrink-0">
        <div className="flex gap-[8px] items-center">
          <Avatar name={userName} color={userColor} size="sm" />
          <span className="font-medium text-[16px] leading-[24px] text-white whitespace-nowrap">
            {userName}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-[8px] items-center shrink-0">
        {/* Search button (stub) */}
        <button
          onClick={onSearchClick}
          className="bg-[#171717] flex items-center justify-center p-[12px] rounded-[12px] size-[48px] shrink-0 hover:bg-[#222] transition-colors"
          aria-label="Search"
        >
          <SearchIcon className="size-[24px] text-white shrink-0" />
        </button>

        {/* Filter button (stub) */}
        <button
          onClick={onFilterClick}
          className="bg-[#171717] flex items-center justify-center p-[12px] rounded-[12px] size-[48px] shrink-0 hover:bg-[#222] transition-colors"
          aria-label="Filter"
        >
          <FilterIcon className="size-[24px] text-white shrink-0" />
        </button>

        {/* Create post button */}
        <Button onClick={onCreateClick} className="gap-[5px] shrink-0">
          <PlusCircleIcon className="size-[24px] shrink-0" />
          <span className="whitespace-nowrap">Create a new post</span>
        </Button>
      </div>
    </div>
  );
}
