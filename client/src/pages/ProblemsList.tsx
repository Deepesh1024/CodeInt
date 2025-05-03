import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProblemCard from "@/components/ProblemCard";
import { Problem } from "@/lib/types";

interface ProblemsListProps {
  onSelectProblem: (id: number) => void;
}

export default function ProblemsList({ onSelectProblem }: ProblemsListProps) {
  // Fetch problems from API
  const { data: problems, isLoading, error } = useQuery<Problem[]>({
    queryKey: ["/api/problems"],
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 bg-muted" />
          <Skeleton className="h-4 w-64 mt-2 bg-muted" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Problems</h1>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Problems</h1>
        <p className="text-muted-foreground">Build your portfolio by solving these coding challenges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems?.map((problem) => (
          <ProblemCard 
            key={problem.id} 
            problem={problem} 
            onSelect={onSelectProblem}
          />
        ))}
      </div>
    </div>
  );
}
