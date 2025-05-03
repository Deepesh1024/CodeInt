import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Send, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { initMonacoTheme } from "@/lib/monaco";
import { useLocation } from "wouter";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

// Initialize Monaco theme
const themeName = initMonacoTheme();

interface CodeEditorProps {
  problemId: number;
  codeTemplate: Record<string, string>;
  onRunCode: (code: string, language: string) => Promise<any>;
}

const SUPPORTED_LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
];

export default function CodeEditor({ problemId, codeTemplate, onRunCode }: CodeEditorProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplate.javascript || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runtime, setRuntime] = useState<number | null>(null);
  const [spaceComplexity, setSpaceComplexity] = useState<string | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const editorOptions = {
    fontSize: 14,
    fontFamily: "Fira Code, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on" as const,
    theme: "vs-dark",
  };

  useEffect(() => {
    // Handle language change by updating code from template
    if (codeTemplate[language]) {
      setCode(codeTemplate[language]);
      if (editorRef.current) {
        editorRef.current.setValue(codeTemplate[language]);
      }
    }
  }, [language, codeTemplate]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleReset = () => {
    if (codeTemplate[language]) {
      setCode(codeTemplate[language]);
      if (editorRef.current) {
        editorRef.current.setValue(codeTemplate[language]);
      }
    }
  };

  const handleRun = async () => {
    if (!editorRef.current) return;
    
    try {
      setIsRunning(true);
      // Get current code from editor
      const currentCode = editorRef.current.getValue();
      
      // Send to onRunCode callback
      const results = await onRunCode(currentCode, language);
      
      if (results && results.length > 0) {
        // Calculate average runtime
        const avgRuntime = Math.round(
          results.reduce((sum: number, result: any) => sum + (result.runtime || 0), 0) / results.length
        );
        setRuntime(avgRuntime);
        
        // Show success/failure toast
        const passedAll = results.every((r: any) => r.passed);
        toast({
          title: passedAll ? "All test cases passed!" : "Some test cases failed",
          description: passedAll 
            ? `Your solution passed ${results.length} test cases in ${avgRuntime}ms`
            : `Failed ${results.filter((r: any) => !r.passed).length} out of ${results.length} test cases`,
          variant: passedAll ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error("Error running code:", error);
      toast({
        title: "Error running code",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    
    try {
      setIsSubmitting(true);
      const currentCode = editorRef.current.getValue();
      
      // Submit code to the server
      const response = await apiRequest("POST", "/api/submit", {
        problemId,
        userId: 1, // Hardcoded user ID for this demo
        code: currentCode,
        language,
      });
      
      const submissionData = await response.json();
      
      // Redirect to results page
      setLocation(`/results/${submissionData.id}`);
    } catch (error) {
      console.error("Error submitting code:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="p-3 flex gap-2">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px] bg-muted text-white">
            <SelectValue placeholder="JavaScript" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          className="ml-auto"
          onClick={handleReset}
        >
          <RotateCcw className="mr-1 h-4 w-4" /> Reset
        </Button>
      </div>
      
      <div className="flex-1 p-3 pt-0 overflow-auto scrollbar-thin">
        <div className="h-full rounded bg-muted overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={code}
            options={editorOptions}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
      
      <div className="p-3 border-t border-border flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            <Play className="mr-1 h-4 w-4" /> 
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="mr-1 h-4 w-4" /> 
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {runtime !== null && <span>Time: {runtime}ms</span>}
          {spaceComplexity && <span className="ml-2">Space: {spaceComplexity}</span>}
        </div>
      </div>
    </div>
  );
}