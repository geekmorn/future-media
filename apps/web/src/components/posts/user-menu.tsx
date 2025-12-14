"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";

export interface UserMenuProps {
  userName: string;
  userColor: string;
}

export function UserMenu({ userName, userColor }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/sign-in");
    } catch {
      // Even if signOut fails, redirect to sign-in
      router.push("/sign-in");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User button */}
      <button
        onClick={handleToggle}
        className="bg-[#171717] flex items-center px-[16px] py-[10px] rounded-[12px] shrink-0 hover:bg-[#222] transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex gap-[8px] items-center">
          <Avatar name={userName} color={userColor} size="sm" />
          <span className="font-medium text-[16px] leading-[24px] text-white whitespace-nowrap">
            {userName}
          </span>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-[3px] z-50 bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-[8px] p-[8px] w-[160px]">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-[#111] hover:bg-[#1a1a1a] flex gap-[12px] items-center p-[8px] rounded-[8px] transition-colors disabled:opacity-50"
          >
            <span className="font-medium text-[12px] leading-[16px] text-white whitespace-nowrap">
              {isLoading ? "Logging out..." : "Log out"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
