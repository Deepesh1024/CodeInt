import { Switch, Route, useLocation, Link } from "wouter";
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
import LearnPage from "@/pages/learn-page";
import ProgressPage from "@/pages/progress-page";
import PortfolioPage from "@/pages/portfolio-page";
import AuthPage from "@/pages/auth-page";
import SessionPage from "@/pages/session-page";
import AdminDashboard from "@/pages/admin-dashboard";
import { useState } from "react";

// Fake authentication context for demo
const AuthContext = {
  isAuthenticated: true,
  isAdmin: true
};

// Protected route component
function ProtectedRoute({ component: Component, admin = false, ...rest }: { 
  component: React.ComponentType<any>, 
  admin?: boolean,
  path: string 
}) {
  const [location, setLocation] = useLocation();
  
  if (!AuthContext.isAuthenticated) {
    setLocation('/auth');
    return null;
  }
  
  if (admin && !AuthContext.isAdmin) {
    setLocation('/');
    return null;
  }
  
  return <Component {...rest} />;
}

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
            {/* Public routes */}
            <Route path="/auth" component={AuthPage} />
            
            {/* Protected routes */}
            <Route path="/" component={() => (
              <ProblemsList onSelectProblem={setSelectedProblemId} />
            )} />
            <Route path="/problems/:slug" component={ProblemView} />
            <Route path="/results/:submissionId" component={ResultsView} />
            <Route path="/learn" component={LearnPage} />
            <Route path="/progress" component={ProgressPage} />
            <Route path="/portfolio" component={PortfolioPage} />
            <Route path="/sessions" component={SessionPage} />
            
            {/* Admin routes */}
            <Route path="/admin" component={() => (
              <ProtectedRoute path="/admin" component={AdminDashboard} admin={true} />
            )} />
            
            {/* 404 route */}
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      {/* Mobile navigation footer */}
      <div className="md:hidden bg-popover border-t border-border">
        <div className="flex justify-around">
          <Link href="/" className="text-center py-3 px-4 text-white">
            <i className="block text-xl mb-1">📋</i>
            <span className="text-xs">Problems</span>
          </Link>
          <Link href="/problems/two-sum" className="text-center py-3 px-4 text-muted-foreground">
            <i className="block text-xl mb-1">💻</i>
            <span className="text-xs">Editor</span>
          </Link>
          <Link href="/progress" className="text-center py-3 px-4 text-muted-foreground">
            <i className="block text-xl mb-1">📊</i>
            <span className="text-xs">Progress</span>
          </Link>
          <Link href="/portfolio" className="text-center py-3 px-4 text-muted-foreground">
            <i className="block text-xl mb-1">👤</i>
            <span className="text-xs">Profile</span>
          </Link>
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
