import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, CheckCircle, Clock, MemoryStick, Code, Calendar } from "lucide-react";
import TestCaseItem from "@/components/TestCaseItem";
import { useToast } from "@/hooks/use-toast";

export default function ResultsView() {
  const [, params] = useRoute("/results/:submissionId");
  const submissionId = params?.submissionId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch submission data
  const { data: submission, isLoading, error } = useQuery({
    queryKey: [`/api/submissions/${submissionId}`],
    staleTime: 60000, // 1 minute
  });

  // Simulate a successful submission for the demo (since we don't have real API endpoints)
  const demoSubmission = {
    id: submissionId || "1",
    status: "accepted",
    runtime: 72,
    memory: 42.1,
    language: "javascript",
    submittedAt: new Date().toISOString(),
    code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return null;
};`,
    results: [
      {
        testCase: { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
        passed: true,
        output: "[0,1]",
        expected: "[0,1]",
      },
      {
        testCase: { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
        passed: true,
        output: "[1,2]",
        expected: "[1,2]",
      },
      {
        testCase: { input: "nums = [3,3], target = 6", output: "[0,1]" },
        passed: true,
        output: "[0,1]",
        expected: "[0,1]",
      }
    ],
    problem: {
      id: 1,
      title: "Two Sum",
      slug: "two-sum",
    }
  };

  // Use demo data for now
  const submissionData = submission || demoSubmission;
  const isAccepted = submissionData.status === "accepted";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submissionData.code);
    toast({
      title: "Code copied to clipboard",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center">
            <Skeleton className="h-10 w-10 rounded-full bg-muted mr-3" />
            <Skeleton className="h-8 w-40 bg-muted" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg bg-muted mb-6" />
          <Skeleton className="h-8 w-32 bg-muted mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Submission
          </h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "Submission not found"}
          </p>
          <Button 
            onClick={() => setLocation("/")}
            className="bg-primary hover:bg-primary/90"
          >
            Back to Problems
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-3 p-2 rounded text-muted-foreground hover:text-white hover:bg-muted"
            onClick={() => setLocation(`/problems/${submissionData.problem.slug}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Submission Results</h1>
        </div>
        
        <div className={`mb-6 bg-card p-4 rounded-lg border ${isAccepted ? 'border-primary' : 'border-destructive'}`}>
          <div className="flex items-center">
            {isAccepted ? (
              <CheckCircle className="text-2xl text-primary mr-3" />
            ) : (
              <div className="text-2xl text-destructive mr-3">✗</div>
            )}
            <div>
              <h2 className={`text-lg font-medium ${isAccepted ? 'text-primary' : 'text-destructive'}`}>
                {isAccepted ? 'Accepted' : 'Wrong Answer'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isAccepted 
                  ? 'Your solution passed all test cases!' 
                  : 'Your solution failed one or more test cases.'}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Runtime
              </div>
              <div className="text-white font-medium">{submissionData.runtime} ms</div>
              <div className="text-xs text-primary">Faster than 85%</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center">
                <MemoryStick className="h-4 w-4 mr-1" /> MemoryStick
              </div>
              <div className="text-white font-medium">{submissionData.memory} MB</div>
              <div className="text-xs text-secondary">Less than 53%</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center">
                <Code className="h-4 w-4 mr-1" /> Language
              </div>
              <div className="text-white font-medium">{submissionData.language}</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Submitted
              </div>
              <div className="text-white font-medium">
                {new Date(submissionData.submittedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-white mb-3">Test Cases</h2>
          <div className="space-y-3">
            {submissionData.results.map((result: any, index: number) => (
              <TestCaseItem
                key={index}
                testCase={result.testCase}
                output={result.output}
                expected={result.expected}
                passed={result.passed}
                index={index}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-white mb-3">Your Solution</h2>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{submissionData.language}</span>
              <Button 
                variant="ghost" 
                className="text-sm text-primary hover:text-primary/90"
                onClick={handleCopyCode}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
            <pre className="bg-muted p-3 rounded font-mono text-sm text-white overflow-x-auto">
              <code>{submissionData.code}</code>
            </pre>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setLocation(`/problems/${submissionData.problem.slug}`)}
            className="px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Problem
          </Button>
          <Button 
            className="px-4 py-2 bg-primary hover:bg-primary/90"
            onClick={() => toast({
              title: "Added to Portfolio",
              description: "This solution has been added to your portfolio",
            })}
          >
            <span className="mr-1">+</span> Add to Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
