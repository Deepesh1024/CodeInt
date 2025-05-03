import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CodeEditor from "@/components/CodeEditor";
import TestCaseItem from "@/components/TestCaseItem";
import { parseMarkdown } from "@/lib/codeRunner";

export default function ProblemView() {
  const [, params] = useRoute("/problems/:slug");
  const slug = params?.slug;
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState("solution");

  // Fetch problem data
  const { data: problem, isLoading, error } = useQuery({
    queryKey: [`/api/problems/${slug}`],
    staleTime: 60000, // 1 minute
  });

  async function runCode(code: string, language: string) {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          userId: 1, // Hardcoded user ID for this demo
          code,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to run code");
      }

      const result = await response.json();
      setTestResults(result.results);
      setActiveTab("testcases");
      return result.results;
    } catch (error) {
      console.error("Error running code:", error);
      throw error;
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col md:flex-row overflow-hidden">
        <div className="h-1/2 md:h-auto md:w-1/2 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-border">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-32 bg-muted" />
            <Skeleton className="h-6 w-16 bg-muted rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
            <Skeleton className="h-4 w-5/6 bg-muted" />
            <Skeleton className="h-32 w-full bg-muted rounded-md" />
          </div>
        </div>
        <div className="h-1/2 md:h-auto md:w-1/2 bg-card flex flex-col overflow-hidden">
          <Skeleton className="h-10 w-full bg-muted" />
          <div className="flex-1 p-4">
            <Skeleton className="h-full w-full bg-muted rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Problem
          </h1>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Problem not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col md:flex-row overflow-hidden">
      {/* Left panel: Problem description */}
      <div className="h-1/2 md:h-auto md:w-1/2 overflow-y-auto scrollbar-thin p-4 sm:p-6 border-b md:border-b-0 md:border-r border-border">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">{problem.title}</h1>
          <Badge className={`px-2 py-1 rounded text-xs font-medium bg-${problem.difficulty} text-white`}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </Badge>
        </div>
        
        <div className="mb-6 prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: parseMarkdown(problem.description) }} />
          
          {problem.examples.map((example: any, index: number) => (
            <div key={index}>
              <h3 className="text-lg font-medium mt-4">Example {index + 1}:</h3>
              <pre className="bg-muted p-3 rounded"><code>{example.input}
Output: {example.output}{example.explanation ? `\nExplanation: ${example.explanation}` : ''}</code></pre>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="px-2 py-1 rounded-full text-xs font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-xs text-muted-foreground">
          <p>Solve this problem to add it to your portfolio. This is a commonly asked interview question.</p>
        </div>
      </div>
      
      {/* Right panel: Code editor and test cases */}
      <div className="h-1/2 md:h-auto md:w-1/2 flex flex-col overflow-hidden bg-card">
        <Tabs 
          defaultValue="solution" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="border-b border-border">
            <TabsList className="h-10 bg-transparent border-b border-border">
              <TabsTrigger value="solution" className="data-[state=active]:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4">
                Solution
              </TabsTrigger>
              <TabsTrigger value="testcases" className="data-[state=active]:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4">
                Test Cases
              </TabsTrigger>
              <TabsTrigger value="submissions" className="data-[state=active]:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4">
                Submissions
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="solution" className="flex-1 mt-0 p-0 overflow-hidden">
            <CodeEditor 
              problemId={problem.id} 
              codeTemplate={problem.codeTemplate}
              onRunCode={runCode}
            />
          </TabsContent>
          
          <TabsContent value="testcases" className="flex-1 mt-0 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {testResults 
              ? testResults.map((result, index) => (
                <TestCaseItem 
                  key={index}
                  testCase={result.testCase}
                  output={result.output}
                  expected={result.expected}
                  passed={result.passed}
                  index={index}
                />
              ))
              : problem.examples.map((example: any, index: number) => (
                <TestCaseItem 
                  key={index}
                  testCase={{ 
                    input: example.input, 
                    output: example.output 
                  }}
                  index={index}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="submissions" className="flex-1 mt-0 overflow-y-auto p-4 scrollbar-thin">
            <div className="text-center py-8 text-muted-foreground">
              No submissions yet. Solve the problem to see your submissions here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
