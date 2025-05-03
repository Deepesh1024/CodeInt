import { 
  Problem as ProblemType,
  Example,
  TestCase as TestCaseType,
  Submission as SubmissionType,
  UserProgress as UserProgressType,
  DifficultyLevel,
  SubmissionStatus
} from "@shared/schema";

// Re-export types from schema for client use
export type Problem = ProblemType;
export type TestCase = TestCaseType;
export type Example = Example;
export type Submission = SubmissionType;
export type UserProgress = UserProgressType;
export type { DifficultyLevel, SubmissionStatus };

// Define additional client-only types
export interface CodeExecutionResult {
  passed: boolean;
  output: string;
  expected: string;
  error?: string;
  runtime: number;
}

export interface ProblemFilters {
  difficulties: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  status: {
    todo: boolean;
    attempted: boolean;
    solved: boolean;
  };
  tags?: string[];
  searchTerm?: string;
}
