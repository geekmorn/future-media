-- Future Media Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(32) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255),
    "googleId" VARCHAR(255) UNIQUE,
    color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users("googleId");

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(12) NOT NULL UNIQUE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for tag search
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content VARCHAR(240) NOT NULL,
    "authorId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts("authorId");
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts("createdAt" DESC);

-- Junction table for posts and tags (many-to-many)
CREATE TABLE IF NOT EXISTS posts_tags (
    "postId" UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    "tagId" UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY ("postId", "tagId")
);

-- Create indexes for junction table
CREATE INDEX IF NOT EXISTS idx_posts_tags_post_id ON posts_tags("postId");
CREATE INDEX IF NOT EXISTS idx_posts_tags_tag_id ON posts_tags("tagId");

-- Optional: Add some sample data for testing
-- INSERT INTO users (name, "passwordHash", color) VALUES 
--     ('demo_user', '$2b$10$...', '#6366f1');
