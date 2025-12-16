'use client';

import { useCallback } from 'react';
import { getUsers, type User } from '@/lib/api/posts';
import { useFetchList, type UseFetchListReturn } from './use-fetch-list';

export type UseUsersReturn = UseFetchListReturn<User> & { users: User[] };

export function useUsers(): UseUsersReturn {
  const fetchUsers = useCallback(() => getUsers(), []);
  const result = useFetchList<User>(fetchUsers, 'Failed to load users');

  return {
    ...result,
    users: result.items,
  };
}
