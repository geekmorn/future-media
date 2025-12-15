export const AVATAR_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
] as const;

export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
  ACCESS_TOKEN_MS: 15 * 60 * 1000,
  REFRESH_TOKEN_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_POSTS_LIMIT: 50,
  MIN_POSTS_LIMIT: 10,
  MAX_TAGS_LIMIT: 20,
  MAX_USERS_LIMIT: 50,
  MAX_TAGS_PER_POST: 5,
} as const;

