import { Link } from "wouter";
import { Problem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface ProblemCardProps {
  problem: Problem;
  onSelect: (id: number) => void;
}

export default function ProblemCard({ problem, onSelect }: ProblemCardProps) {
  // Fetch user progress to determine problem status
  const { data: userProgress } = useQuery({
    queryKey: ["/api/progress/1"], // Hardcoded user ID for this demo
    staleTime: 60000, // 1 minute
  });

  // Find problem status based on user progress
  const problemStatus = userProgress?.find((p: any) => p.problemId === problem.id)?.status || "todo";

  return (
    <Link href={`/problems/${problem.slug}`}>
      <Card 
        className="bg-card border border-border rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-all hover:border-primary"
        onClick={() => onSelect(problem.id)}
      >
        <CardContent className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`flex-shrink-0 inline-block h-2 w-2 rounded-full dot-${problem.difficulty}`}></span>
              <span className={`ml-2 text-xs font-medium difficulty-${problem.difficulty}`}>
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </span>
            </div>
            <div className="flex space-x-2">
              {problem.tags.slice(0, 1).map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-accent text-white">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
              {problem.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {problem.description.replace(/\*\*/g, '').replace(/`/g, '').substring(0, 100)}...
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className={`text-sm font-medium ${
              problemStatus === "solved" 
                ? "text-primary" 
                : problemStatus === "attempted" 
                  ? "text-orange-400" 
                  : "text-muted-foreground"
            }`}>
              {problemStatus === "solved" 
                ? "Solved" 
                : problemStatus === "attempted" 
                  ? "Attempted" 
                  : "Not Started"}
            </div>
            <div className="text-xs text-muted-foreground">
              Acceptance: {problem.acceptanceRate}%
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
