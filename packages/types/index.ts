// Shared types for the monorepo
// Add your shared types here

export type User = {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    lastLoginAt: Date;
};
