'use client';

import { FilterIcon, PlusCircleIcon, CloseIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserMenu } from './user-menu';

export interface PostsHeaderProps {
  userName: string;
  userColor: string;
  onFilterClick?: () => void;
  onCreateClick?: () => void;
  isFilterActive?: boolean;
  onResetFilter?: () => void;
}

export function PostsHeader({
  userName,
  userColor,
  onFilterClick,
  onCreateClick,
  isFilterActive,
  onResetFilter,
}: PostsHeaderProps) {
  return (
    <div className="bg-[#111] border border-[rgba(255,255,255,0.2)] flex items-center justify-between p-[16px] rounded-[16px] w-full shrink-0">
      {/* User menu with dropdown */}
      <UserMenu userName={userName} userColor={userColor} />

      {/* Actions */}
      <div className="flex gap-[8px] items-center shrink-0">
        {/* Filter button */}
        <div
          className={cn(
            'bg-[#171717] flex items-center rounded-[12px] shrink-0',
            isFilterActive && 'border border-[#9747ff]',
          )}
        >
          <Button
            variant="icon"
            size="md"
            onClick={onFilterClick}
            aria-label="Filter"
            className="bg-transparent"
          >
            <FilterIcon className="size-[24px] text-white shrink-0" />
          </Button>
          {isFilterActive && (
            <button
              onClick={onResetFilter}
              className="flex items-center justify-center pr-[12px] hover:opacity-70 transition-opacity"
              aria-label="Reset filter"
            >
              <CloseIcon className="size-[16px] text-[#9747ff] shrink-0" />
            </button>
          )}
        </div>

        {/* Create post button */}
        <Button variant="secondary" size="lg" onClick={onCreateClick} className="gap-[5px]">
          <PlusCircleIcon className="size-[24px] text-white shrink-0" />
          <span className="whitespace-nowrap">Create a new post</span>
        </Button>
      </div>
    </div>
  );
}
