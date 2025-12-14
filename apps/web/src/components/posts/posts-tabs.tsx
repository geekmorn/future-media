"use client";

import { cn } from "@/lib/utils";

export type PostsFilter = "all" | "my";

export interface PostsTabsProps {
  activeTab: PostsFilter;
  onTabChange: (tab: PostsFilter) => void;
}

export function PostsTabs({ activeTab, onTabChange }: PostsTabsProps) {
  const tabs = [
    { id: "all" as const, label: "All messages" },
    { id: "my" as const, label: "Only my messages" },
  ];

  return (
    <div className="flex gap-[16px] h-[68px] items-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex h-full items-center justify-center p-[12px] relative",
            "text-[16px] leading-[24px] text-white transition-colors",
            activeTab === tab.id &&
              "border-b border-[#9747ff] border-l-0 border-r-0 border-t-0"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
