import type { Post } from "@repo/types";

export const CURRENT_USER = {
  id: "user-1",
  name: "Makar B.",
  color: "#7c34f8",
};

// Static mock posts to avoid hydration mismatch
// Time values are relative offsets in minutes from "now" for display purposes
export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    content:
      "Just finished a great book on system design. Highly recommend it to anyone looking to level up their architecture skills!",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t6", name: "Tips" },
    ],
    authorId: "user-2",
    authorName: "YuraShivi",
    authorColor: "#fbbc05",
    createdAt: new Date("2024-12-13T10:30:00"),
  },
  {
    id: "post-2",
    content:
      "Working on a new project with Next.js 15 and loving the new features. The app router is a game changer!",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t8", name: "Frontend" },
    ],
    authorId: "user-3",
    authorName: "AlexDev",
    authorColor: "#ee443f",
    createdAt: new Date("2024-12-13T09:15:00"),
  },
  {
    id: "post-3",
    content:
      "Coffee break! Sometimes the best ideas come when you step away from the keyboard.",
    tags: [{ id: "t5", name: "Life" }],
    authorId: "user-4",
    authorName: "SarahCode",
    authorColor: "#34e7f8",
    createdAt: new Date("2024-12-13T08:45:00"),
  },
  {
    id: "post-4",
    content:
      "Debugging tip: When you're stuck, explain the problem to a rubber duck. It works more often than you'd think!",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t6", name: "Tips" },
    ],
    authorId: "user-1",
    authorName: "Makar B.",
    authorColor: "#7c34f8",
    createdAt: new Date("2024-12-13T07:30:00"),
  },
  {
    id: "post-5",
    content:
      "Team meeting went great today! We're all aligned on the Q1 goals. Excited for what's coming next.",
    tags: [
      { id: "t2", name: "HardWork" },
      { id: "t3", name: "Office" },
    ],
    authorId: "user-5",
    authorName: "JohnDoe",
    authorColor: "#4caf50",
    createdAt: new Date("2024-12-12T16:00:00"),
  },
  {
    id: "post-6",
    content:
      "TypeScript strict mode is your friend. Enable it and never look back!",
    tags: [{ id: "t1", name: "IT" }],
    authorId: "user-2",
    authorName: "YuraShivi",
    authorColor: "#fbbc05",
    createdAt: new Date("2024-12-12T14:20:00"),
  },
  {
    id: "post-7",
    content:
      "Remember: Perfect is the enemy of good. Ship early, iterate often!",
    tags: [{ id: "t6", name: "Tips" }],
    authorId: "user-6",
    authorName: "EmmaJS",
    authorColor: "#ff6b6b",
    createdAt: new Date("2024-12-12T11:00:00"),
  },
  {
    id: "post-8",
    content:
      "Just deployed a critical hotfix at 2 AM. The life of a developer... but the feeling when it works is priceless!",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t2", name: "HardWork" },
    ],
    authorId: "user-3",
    authorName: "AlexDev",
    authorColor: "#ee443f",
    createdAt: new Date("2024-12-11T02:30:00"),
  },
  {
    id: "post-9",
    content:
      "Learning Rust this weekend. The borrow checker is challenging but the safety guarantees are worth it.",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t9", name: "Backend" },
    ],
    authorId: "user-7",
    authorName: "MikeRust",
    authorColor: "#ffa502",
    createdAt: new Date("2024-12-10T15:45:00"),
  },
  {
    id: "post-10",
    content:
      "Code review session was super productive. Found three potential bugs before they hit production!",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t2", name: "HardWork" },
    ],
    authorId: "user-1",
    authorName: "Makar B.",
    authorColor: "#7c34f8",
    createdAt: new Date("2024-12-10T10:00:00"),
  },
  {
    id: "post-11",
    content:
      "Hot take: Tailwind CSS has changed how I think about styling. Less context switching, more productivity.",
    tags: [
      { id: "t7", name: "Design" },
      { id: "t8", name: "Frontend" },
    ],
    authorId: "user-4",
    authorName: "SarahCode",
    authorColor: "#34e7f8",
    createdAt: new Date("2024-12-09T17:30:00"),
  },
  {
    id: "post-12",
    content:
      "Finally figured out that memory leak. It was a missing cleanup in useEffect. Classic mistake!",
    tags: [{ id: "t8", name: "Frontend" }],
    authorId: "user-8",
    authorName: "LisaPy",
    authorColor: "#a55eea",
    createdAt: new Date("2024-12-09T14:15:00"),
  },
  {
    id: "post-13",
    content:
      "Docker compose is magic. Spun up the entire dev environment in under 2 minutes.",
    tags: [
      { id: "t10", name: "DevOps" },
      { id: "t1", name: "IT" },
    ],
    authorId: "user-5",
    authorName: "JohnDoe",
    authorColor: "#4caf50",
    createdAt: new Date("2024-12-08T09:00:00"),
  },
  {
    id: "post-14",
    content:
      "Pair programming session was awesome. Two heads really are better than one!",
    tags: [
      { id: "t2", name: "HardWork" },
      { id: "t3", name: "Office" },
    ],
    authorId: "user-6",
    authorName: "EmmaJS",
    authorColor: "#ff6b6b",
    createdAt: new Date("2024-12-07T16:45:00"),
  },
  {
    id: "post-15",
    content:
      "Just hit 100% test coverage on the auth module. Feels good!",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t2", name: "HardWork" },
    ],
    authorId: "user-1",
    authorName: "Makar B.",
    authorColor: "#7c34f8",
    createdAt: new Date("2024-12-07T11:30:00"),
  },
  {
    id: "post-16",
    content:
      "GraphQL vs REST debate again in the team chat. Why not both?",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t9", name: "Backend" },
    ],
    authorId: "user-7",
    authorName: "MikeRust",
    authorColor: "#ffa502",
    createdAt: new Date("2024-12-06T13:00:00"),
  },
  {
    id: "post-17",
    content:
      "Spent the day refactoring legacy code. It's not glamorous but someone has to do it.",
    tags: [{ id: "t2", name: "HardWork" }],
    authorId: "user-3",
    authorName: "AlexDev",
    authorColor: "#ee443f",
    createdAt: new Date("2024-12-06T08:30:00"),
  },
  {
    id: "post-18",
    content:
      "Open source contribution merged! Small step but it feels great to give back.",
    tags: [
      { id: "t1", name: "IT" },
      { id: "t4", name: "Smile" },
    ],
    authorId: "user-8",
    authorName: "LisaPy",
    authorColor: "#a55eea",
    createdAt: new Date("2024-12-05T19:00:00"),
  },
  {
    id: "post-19",
    content:
      "Friday afternoon coding session. Jazz music, good coffee, clean code.",
    tags: [
      { id: "t5", name: "Life" },
      { id: "t4", name: "Smile" },
    ],
    authorId: "user-2",
    authorName: "YuraShivi",
    authorColor: "#fbbc05",
    createdAt: new Date("2024-12-05T15:30:00"),
  },
  {
    id: "post-20",
    content:
      "Accessibility is not optional. Screen reader testing should be part of every PR.",
    tags: [
      { id: "t7", name: "Design" },
      { id: "t8", name: "Frontend" },
      { id: "t6", name: "Tips" },
    ],
    authorId: "user-4",
    authorName: "SarahCode",
    authorColor: "#34e7f8",
    createdAt: new Date("2024-12-05T10:00:00"),
  },
];
