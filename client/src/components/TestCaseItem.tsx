import { TestCase } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface TestCaseItemProps {
  testCase: TestCase;
  output?: string;
  expected?: string;
  passed?: boolean;
  index: number;
}

export default function TestCaseItem({ 
  testCase, 
  output, 
  expected, 
  passed = false, 
  index 
}: TestCaseItemProps) {
  return (
    <Card className="bg-card p-4 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">Test Case {index + 1}</h3>
        {output !== undefined && (
          <span className={passed ? "text-primary text-sm" : "text-destructive text-sm"}>
            {passed ? (
              <><CheckCircle className="inline-block mr-1 h-4 w-4" /> Passed</>
            ) : (
              <><XCircle className="inline-block mr-1 h-4 w-4" /> Failed</>
            )}
          </span>
        )}
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">Input</div>
          <pre className="mt-1 bg-muted p-2 rounded text-white overflow-x-auto">
            <code>{testCase.input}</code>
          </pre>
        </div>
        <div>
          <div className="text-muted-foreground">
            {output !== undefined ? "Your Output" : "Expected Output"}
          </div>
          <pre className="mt-1 bg-muted p-2 rounded text-white overflow-x-auto">
            <code>{output !== undefined ? output : testCase.output}</code>
          </pre>
        </div>
        
        {output !== undefined && !passed && (
          <div className="col-span-2">
            <div className="text-muted-foreground">Expected Output</div>
            <pre className="mt-1 bg-muted p-2 rounded text-white overflow-x-auto">
              <code>{expected}</code>
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}
