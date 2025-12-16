'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth';

export interface UserMenuProps {
  userName: string;
  userColor: string;
}

export function UserMenu({ userName, userColor }: UserMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/sign-in');
    } catch {
      // Even if signOut fails, redirect to sign-in
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu
      trigger={
        <div className="bg-[#171717] flex items-center px-[16px] py-[10px] rounded-[12px] shrink-0 hover:bg-[#222] transition-colors cursor-pointer">
          <div className="flex gap-[8px] items-center">
            <Avatar name={userName} color={userColor} size="sm" />
            <span className="font-medium text-[16px] leading-[24px] text-white whitespace-nowrap">
              {userName}
            </span>
          </div>
        </div>
      }
      items={[
        {
          label: 'Log out',
          onClick: handleLogout,
          isLoading,
          disabled: isLoading,
        },
      ]}
      align="left"
    />
  );
}
