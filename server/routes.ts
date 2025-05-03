import express, { type Express, Response, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { executeCode } from "./codeExecutor";
import { 
  insertSubmissionSchema,
  insertUserProgressSchema,
  SubmissionStatus 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = express.Router();
  
  // Get all problems
  apiRouter.get("/problems", async (req: Request, res: Response) => {
    try {
      const problems = await storage.getProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching problems" });
    }
  });

  // Get problem by slug
  apiRouter.get("/problems/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const problem = await storage.getProblemBySlug(slug);
      
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Error fetching problem" });
    }
  });

  // Submit code solution
  apiRouter.post("/submit", async (req: Request, res: Response) => {
    try {
      const submitSchema = z.object({
        problemId: z.number(),
        userId: z.number(),
        code: z.string(),
        language: z.string(),
      });

      const validatedData = submitSchema.parse(req.body);
      const { problemId, userId, code, language } = validatedData;

      // Get problem to access test cases
      const problem = await storage.getProblem(problemId);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      // Execute code against test cases
      const executionResults = await executeCode(code, language, problem.testCases);
      
      // Determine overall status
      const allPassed = executionResults.every(result => result.passed);
      const status = allPassed ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;
      
      // For runtime calculation, take average of all test case executions
      const runtime = Math.round(
        executionResults.reduce((sum, result) => sum + result.runtime, 0) / executionResults.length
      );
      
      // Create submission record
      const submission = await storage.createSubmission({
        userId,
        problemId,
        code,
        language,
        status,
        runtime,
        memory: 0, // Would need actual memory profiling
        submittedAt: new Date(),
        testCasesPassed: executionResults,
      });

      // Update user progress
      let userProgress = await storage.getUserProgress(userId, problemId);
      
      if (!userProgress) {
        // If no progress record exists, create one
        userProgress = await storage.createUserProgress({
          userId,
          problemId,
          status: allPassed ? "solved" : "attempted"
        });
      } else if (userProgress.status !== "solved" && allPassed) {
        // Update from attempted to solved if necessary
        userProgress = await storage.updateUserProgress(userProgress.id, {
          status: "solved"
        });
      }

      res.json({
        id: submission.id,
        status,
        runtime,
        results: executionResults,
        submission
      });
    } catch (error) {
      console.error("Error submitting code:", error);
      res.status(500).json({ message: "Error processing submission" });
    }
  });

  // Get user progress
  apiRouter.get("/progress/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgressByUser(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user progress" });
    }
  });

  // Get user submissions
  apiRouter.get("/submissions/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const submissions = await storage.getSubmissionsByUser(userId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user submissions" });
    }
  });

  // Register the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
