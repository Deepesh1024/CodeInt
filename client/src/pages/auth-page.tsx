import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Code, Lock, User, ChevronRight } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // For login form
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: ""
  });

  // For registration form
  const [registerCredentials, setRegisterCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, this would use a proper auth hook
      const response = await apiRequest("POST", "/api/login", loginCredentials);
      
      if (response.ok) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        setLocation("/");
      } else {
        const error = await response.text();
        throw new Error(error || "Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerCredentials.password !== registerCredentials.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, this would use a proper auth hook
      const response = await apiRequest("POST", "/api/register", {
        username: registerCredentials.username,
        email: registerCredentials.email,
        password: registerCredentials.password
      });
      
      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
        setLocation("/");
      } else {
        const error = await response.text();
        throw new Error(error || "Registration failed");
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Auth form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md bg-card border-border">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Login to your account to continue coding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="john.doe"
                        className="pl-9"
                        value={loginCredentials.username}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={loginCredentials.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Join CodePortfolio to start solving problems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-username"
                        name="username"
                        placeholder="john.doe"
                        className="pl-9"
                        value={registerCredentials.username}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className="pl-9"
                        value={registerCredentials.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={registerCredentials.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={registerCredentials.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Right side - Hero section for larger screens */}
      <div className="hidden md:block flex-1 bg-sidebar-background p-8">
        <div className="flex flex-col h-full justify-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">CodePortfolio</h1>
              <p className="text-xl text-muted-foreground">Your coding journey. One problem at a time.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Practice Coding Skills</h3>
                  <p className="text-muted-foreground">Solve over 100+ coding problems ranging from easy to hard</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Track Your Progress</h3>
                  <p className="text-muted-foreground">Monitor your improvement with detailed statistics and insights</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Build Your Portfolio</h3>
                  <p className="text-muted-foreground">Showcase your solutions and projects to potential employers</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                "CodePortfolio has been instrumental in my preparation for technical interviews. The platform is intuitive and the problem set is extensive."
              </p>
              <div className="mt-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden mr-3">
                  <img src="https://github.com/shadcn.png" alt="User" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Jane Smith</p>
                  <p className="text-xs text-muted-foreground">Software Engineer at Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}