'use client';

import type { Post } from '@repo/types';
import { Avatar } from '@/components/ui/avatar';
import { Tag } from '@/components/ui/tag';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { MoreHorizontalIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface PostCardProps {
  post: Post;
  showLine?: boolean;
  className?: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return 'just now';
  }
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function PostCard({
  post,
  showLine = true,
  className,
  isOwner = false,
  onEdit,
  onDelete,
}: PostCardProps) {
  const menuItems = [];

  if (isOwner) {
    if (onEdit) {
      menuItems.push({
        label: 'Edit',
        onClick: onEdit,
      });
    }
    if (onDelete) {
      menuItems.push({
        label: 'Delete',
        onClick: onDelete,
        variant: 'danger' as const,
      });
    }
  }

  return (
    <div className={cn('flex gap-[8px] items-start w-full', className)}>
      {/* Left column with avatar and line */}
      <div className="flex flex-col gap-[16px] items-center justify-center self-stretch shrink-0">
        <Avatar name={post.authorName} color={post.authorColor} size="md" />
        {showLine && <div className="flex-1 min-h-[1px] w-[1px] bg-[rgba(255,255,255,0.2)]" />}
      </div>

      {/* Right column with content */}
      <div className="flex flex-1 flex-col gap-[12px] items-start min-w-0">
        <div className="flex flex-col gap-[8px] items-start w-full">
          {/* Author, time, and actions */}
          <div className="flex gap-[8px] items-center w-full">
            <span className="font-medium text-[14px] leading-[20px] text-white">
              {post.authorName}
            </span>
            <span className="text-[12px] leading-[16px] text-[rgba(255,255,255,0.6)]">
              {formatTimeAgo(new Date(post.createdAt))}
            </span>

            {/* Actions menu - only show for owners */}
            {isOwner && menuItems.length > 0 && (
              <div className="ml-auto">
                <DropdownMenu
                  trigger={
                    <div className="p-[4px] rounded-[8px] hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
                      <MoreHorizontalIcon className="text-[rgba(255,255,255,0.6)]" />
                    </div>
                  }
                  items={menuItems}
                  align="right"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <p className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.8)] w-full whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex gap-[8px] items-start flex-wrap">
            {post.tags.map((tag) => (
              <Tag key={tag.id} name={tag.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
