import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProblemsList from "@/pages/ProblemsList";
import ProblemView from "@/pages/ProblemView";
import ResultsView from "@/pages/ResultsView";
import { useState } from "react";

function Router() {
  // Simple global state for the currently selected problem
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          <Switch>
            <Route path="/" component={() => (
              <ProblemsList onSelectProblem={setSelectedProblemId} />
            )} />
            <Route path="/problems/:slug" component={ProblemView} />
            <Route path="/results/:submissionId" component={ResultsView} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      {/* Mobile navigation footer */}
      <div className="md:hidden bg-popover border-t border-border">
        <div className="flex justify-around">
          <a href="/" className="text-center py-3 px-4 text-white">
            <i className="block text-xl mb-1">📋</i>
            <span className="text-xs">Problems</span>
          </a>
          <a href="/problems/two-sum" className="text-center py-3 px-4 text-muted-foreground">
            <i className="block text-xl mb-1">💻</i>
            <span className="text-xs">Editor</span>
          </a>
          <a href="#" className="text-center py-3 px-4 text-muted-foreground">
            <i className="block text-xl mb-1">📊</i>
            <span className="text-xs">Progress</span>
          </a>
          <a href="#" className="text-center py-3 px-4 text-muted-foreground">
            <i className="block text-xl mb-1">👤</i>
            <span className="text-xs">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
