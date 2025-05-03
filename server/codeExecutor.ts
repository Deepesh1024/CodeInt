import { TestCase, SubmissionStatus } from "@shared/schema";
import vm from "vm";

interface ExecutionResult {
  testCase: TestCase;
  output: string;
  expected: string;
  passed: boolean;
  runtime: number;
  error?: string;
}

export async function executeCode(
  code: string, 
  language: string, 
  testCases: TestCase[]
): Promise<ExecutionResult[]> {
  // For now, we only support JavaScript execution in the sandbox
  if (language !== "javascript") {
    throw new Error(`Language ${language} is not supported yet`);
  }

  const results: ExecutionResult[] = [];

  for (const testCase of testCases) {
    try {
      // Parse the input from the test case
      const inputs = parseInput(testCase.input);

      // Create a sandbox context for execution
      const sandbox = {
        console: {
          log: () => {}, // Suppress console logs
        },
        result: null,
      };

      // Start timer for runtime calculation
      const startTime = performance.now();

      // Prepare the code for execution
      const executionCode = `
        ${code}
        
        // Function setup for different problem types
        try {
          ${getFunctionCall(language, inputs)}
        } catch(e) {
          // Catch runtime errors
          result = { error: e.message };
        }
      `;

      // Execute the code in the sandbox
      vm.createContext(sandbox);
      vm.runInContext(executionCode, sandbox, { timeout: 5000 }); // 5 second timeout

      // End timer
      const endTime = performance.now();
      const runtime = Math.round(endTime - startTime);

      // Check for errors
      if (sandbox.result && sandbox.result.error) {
        results.push({
          testCase,
          output: "Error",
          expected: testCase.output,
          passed: false,
          runtime,
          error: sandbox.result.error
        });
        continue;
      }

      // Format and compare output
      const formattedOutput = formatOutput(sandbox.result);
      const passed = formattedOutput === testCase.output;

      results.push({
        testCase,
        output: formattedOutput,
        expected: testCase.output,
        passed,
        runtime
      });
    } catch (error) {
      // Handle any unexpected errors during execution
      results.push({
        testCase,
        output: "Error",
        expected: testCase.output,
        passed: false,
        runtime: 0,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return results;
}

function parseInput(input: string): any[] {
  // Parse the input string into arguments
  // Format expected: '[1,2,3],5' -> [[1,2,3], 5]
  try {
    // Split by comma but not within brackets/braces
    const args: any[] = [];
    let currentArg = "";
    let bracketCount = 0;
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (char === '[' || char === '{') bracketCount++;
      else if (char === ']' || char === '}') bracketCount--;
      
      if (char === ',' && bracketCount === 0) {
        args.push(JSON.parse(currentArg));
        currentArg = "";
      } else {
        currentArg += char;
      }
    }
    
    if (currentArg) {
      args.push(JSON.parse(currentArg));
    }
    
    return args;
  } catch (e) {
    console.error("Error parsing input:", e);
    return [input]; // Return input as-is if parsing fails
  }
}

function formatOutput(output: any): string {
  if (output === null || output === undefined) return "null";
  
  try {
    return JSON.stringify(output);
  } catch (e) {
    return String(output);
  }
}

function getFunctionCall(language: string, inputs: any[]): string {
  if (language === "javascript") {
    // Detect function name based on common LeetCode patterns
    const functionIdentifiers = [
      { name: "twoSum", args: ["nums", "target"] },
      { name: "addTwoNumbers", args: ["l1", "l2"] },
      { name: "lengthOfLongestSubstring", args: ["s"] },
      { name: "isPalindrome", args: ["s"] },
      { name: "longestValidParentheses", args: ["s"] },
      { name: "maxPathSum", args: ["root"] },
    ];
    
    // Try to find the function in the code
    const functionCall = functionIdentifiers.find(fn => {
      const regex = new RegExp(`(var|function|const|let)\\s+${fn.name}\\s*=`);
      return regex.test(code);
    });
    
    if (functionCall) {
      const args = inputs.map(input => JSON.stringify(input)).join(", ");
      return `result = ${functionCall.name}(${args});`;
    }
    
    // Default fallback - assume first function in the code
    return `result = twoSum(${inputs.map(i => JSON.stringify(i)).join(", ")});`;
  }
  
  return "result = null;"; // Unsupported language
}
