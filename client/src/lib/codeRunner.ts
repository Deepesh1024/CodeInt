export function parseMarkdown(markdown: string): string {
  if (!markdown) return "";
  
  // Handle code blocks with backticks
  let html = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle bold text with double asterisks
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Handle line breaks
  html = html.replace(/\n/g, '<br />');
  
  return html;
}

export async function runTestCase(code: string, input: string): Promise<string> {
  // This is just a simple example of how to run code in the browser
  // In a real app, this would be handled by a server
  try {
    // Create a safe environment to run the code
    const sandbox = {
      console: {
        log: (output: any) => output,
      },
      input: parseInput(input),
      output: null,
    };
    
    // Wrap the code in a try-catch block
    const wrappedCode = `
      try {
        ${code}
        // Assume the last line returns the output
      } catch (e) {
        output = "Error: " + e.message;
      }
    `;
    
    // Execute the code in a safe environment
    // Note: This is just for demonstration - real apps would use server-side execution
    const result = new Function(wrappedCode).call(sandbox);
    
    return sandbox.output || result;
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

function parseInput(input: string): any {
  // Parse the input string into arguments
  try {
    // Simple parsing for basic input strings
    // In a real app, this would be more sophisticated
    return input.split(',').map(arg => {
      // Try to parse as JSON, if it fails return the raw string
      try {
        return JSON.parse(arg.trim());
      } catch (e) {
        return arg.trim();
      }
    });
  } catch (e) {
    return input;
  }
}
