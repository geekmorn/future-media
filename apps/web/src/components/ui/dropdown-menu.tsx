'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function DropdownMenu({ trigger, items, align = 'left', className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled || item.isLoading) return;
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center justify-center"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-[3px] z-50 bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-[8px] p-[8px] min-w-[120px]',
            align === 'left' ? 'left-0' : 'right-0',
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled || item.isLoading}
              className={cn(
                'w-full bg-[#111] hover:bg-[#1a1a1a] flex gap-[12px] items-center p-[8px] rounded-[8px] transition-colors disabled:opacity-50',
                item.variant === 'danger' && 'text-red-500 hover:text-red-400',
              )}
            >
              <span
                className={cn(
                  'font-medium text-[12px] leading-[16px] whitespace-nowrap',
                  item.variant === 'danger' ? 'text-red-500' : 'text-white',
                )}
              >
                {item.isLoading ? 'Loading...' : item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
