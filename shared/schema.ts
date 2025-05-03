import { pgTable, text, serial, integer, boolean, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define difficulty enum
export const DifficultyLevel = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel];

// Define submission status enum
export const SubmissionStatus = {
  ACCEPTED: "accepted",
  WRONG_ANSWER: "wrongAnswer",
  TIME_LIMIT_EXCEEDED: "timeLimitExceeded",
  RUNTIME_ERROR: "runtimeError",
  COMPILATION_ERROR: "compilationError",
} as const;

export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

// Define example type
export const exampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

export type Example = z.infer<typeof exampleSchema>;

// Define test case type
export const testCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
});

export type TestCase = z.infer<typeof testCaseSchema>;

// Define problems table
export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  tags: text("tags").array().notNull(),
  examples: jsonb("examples").notNull(),
  testCases: jsonb("testCases").notNull(),
  codeTemplate: jsonb("codeTemplate").notNull(),
  acceptanceRate: integer("acceptanceRate"),
});

export const insertProblemSchema = createInsertSchema(problems);
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problems.$inferSelect;

// Define users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  problemId: integer("problemId").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  status: text("status").notNull(),
  runtime: integer("runtime"),
  memory: integer("memory"),
  submittedAt: date("submittedAt").notNull(),
  testCasesPassed: jsonb("testCasesPassed"),
});

export const insertSubmissionSchema = createInsertSchema(submissions);
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Define userProgress table to track user's progress on problems
export const userProgress = pgTable("userProgress", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  problemId: integer("problemId").notNull(),
  status: text("status").notNull(), // 'solved', 'attempted', 'todo'
});

export const insertUserProgressSchema = createInsertSchema(userProgress);
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
