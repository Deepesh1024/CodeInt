import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Code, 
  Search, 
  Network, 
  BarChart2,
  Layers,
  FileCode
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const categories = [
  { id: "all", name: "All Problems", icon: <Layers className="text-muted-foreground mr-3 h-4 w-4" /> },
  { id: "arrays", name: "Arrays & Strings", icon: <Code className="text-muted-foreground mr-3 h-4 w-4" /> },
  { id: "linked-lists", name: "Linked Lists", icon: <Network className="text-muted-foreground mr-3 h-4 w-4" /> },
  { id: "trees", name: "Trees & Graphs", icon: <FileCode className="text-muted-foreground mr-3 h-4 w-4" /> },
  { id: "dp", name: "Dynamic Programming", icon: <BarChart2 className="text-muted-foreground mr-3 h-4 w-4" /> },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState({
    difficulties: {
      easy: true,
      medium: true,
      hard: true,
    },
    status: {
      todo: true,
      attempted: true,
      solved: true,
    },
  });

  // Fetch user progress to display statistics
  const { data: userProgress } = useQuery({
    queryKey: ["/api/progress/1"], // Hardcoded user ID for this demo
    staleTime: 60000, // 1 minute
  });

  const handleDifficultyChange = (difficulty: string) => {
    setFilters({
      ...filters,
      difficulties: {
        ...filters.difficulties,
        [difficulty]: !filters.difficulties[difficulty as keyof typeof filters.difficulties],
      },
    });
  };

  const handleStatusChange = (status: string) => {
    setFilters({
      ...filters,
      status: {
        ...filters.status,
        [status]: !filters.status[status as keyof typeof filters.status],
      },
    });
  };

  return (
    <aside className="hidden md:flex md:flex-shrink-0 h-full">
      <div className="flex flex-col w-64 border-r border-border bg-sidebar-background">
        <div className="px-4 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              className="block w-full pl-10 pr-3 py-2 bg-muted"
              placeholder="Search problems"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col pt-2 pb-4 overflow-y-auto scrollbar-thin">
          <div className="px-4 py-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Problem Categories
          </div>
          <nav className="mt-1 flex-1 px-3 space-y-1">
            {categories.map((category) => (
              <Link key={category.id} href={category.id === "all" ? "/" : `/category/${category.id}`}>
                <a
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    selectedCategory === category.id
                      ? "bg-sidebar-accent text-white"
                      : "text-gray-300 hover:bg-sidebar-accent hover:text-white"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon}
                  {category.name}
                </a>
              </Link>
            ))}
          </nav>
          <div className="px-4 py-2 mt-4 text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Difficulty
          </div>
          <div className="px-4 py-2 space-y-2">
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={filters.difficulties.easy} 
                onCheckedChange={() => handleDifficultyChange("easy")}
                className="data-[state=checked]:bg-easy data-[state=checked]:border-easy"
              />
              <span className="ml-2 text-sm font-medium difficulty-easy">Easy</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={filters.difficulties.medium} 
                onCheckedChange={() => handleDifficultyChange("medium")}
                className="data-[state=checked]:bg-medium data-[state=checked]:border-medium"
              />
              <span className="ml-2 text-sm font-medium difficulty-medium">Medium</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={filters.difficulties.hard} 
                onCheckedChange={() => handleDifficultyChange("hard")}
                className="data-[state=checked]:bg-hard data-[state=checked]:border-hard"
              />
              <span className="ml-2 text-sm font-medium difficulty-hard">Hard</span>
            </label>
          </div>
          <div className="px-4 py-2 mt-4 text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Status
          </div>
          <div className="px-4 py-2 space-y-2">
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={filters.status.todo} 
                onCheckedChange={() => handleStatusChange("todo")}
              />
              <span className="ml-2 text-sm font-medium text-white">Todo</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={filters.status.attempted} 
                onCheckedChange={() => handleStatusChange("attempted")}
              />
              <span className="ml-2 text-sm font-medium text-white">Attempted</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={filters.status.solved} 
                onCheckedChange={() => handleStatusChange("solved")}
              />
              <span className="ml-2 text-sm font-medium text-white">Solved</span>
            </label>
          </div>
        </div>
        <div className="px-4 py-3 bg-muted border-t border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary">
                <span className="text-sm font-medium text-white">42%</span>
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Your Progress</p>
              <p className="text-xs text-muted-foreground">25/60 problems solved</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
