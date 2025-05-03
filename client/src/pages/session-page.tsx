import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Users, PlayCircle, Trophy, ArrowRight, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Define session type
interface SessionType {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: number;
  participants: number;
  status: 'active' | 'upcoming' | 'ended';
  type: 'contest' | 'practice';
  creator: {
    name: string;
    avatar: string;
  };
  problems: number[];
}

interface ProblemType {
  id: number;
  title: string;
  difficulty: string;
}

export default function SessionPage() {
  const { toast } = useToast();
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    type: "practice",
    duration: "60",
    problems: [] as number[]
  });

  // Fetch active sessions
  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ['/api/sessions'],
    staleTime: 30000, // 30 seconds
  });

  // Fetch problems for selection
  const { data: problems } = useQuery<ProblemType[]>({
    queryKey: ['/api/problems'],
    staleTime: 300000, // 5 minutes
  });

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newSession.problems.length === 0) {
      toast({
        title: "No problems selected",
        description: "Please select at least one problem for the session",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingSession(true);
      
      // In a real app, this would call the API
      const response = await apiRequest("POST", "/api/sessions", newSession);
      
      if (response.ok) {
        toast({
          title: "Session created",
          description: "Your session has been created successfully",
        });
        
        // Reset form and refetch sessions
        setNewSession({
          title: "",
          description: "",
          type: "practice",
          duration: "60",
          problems: []
        });
        
        refetch();
      } else {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      toast({
        title: "Failed to create session",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionCode.trim()) {
      toast({
        title: "Session code required",
        description: "Please enter a valid session code",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, this would call the API
      const response = await apiRequest("POST", "/api/sessions/join", { code: sessionCode });
      
      if (response.ok) {
        toast({
          title: "Joined session",
          description: "You have successfully joined the session",
        });
        
        // Reset code and refetch sessions
        setSessionCode("");
        refetch();
      } else {
        throw new Error("Invalid session code");
      }
    } catch (error) {
      toast({
        title: "Failed to join session",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Sample data for demo
  const activeSessions: SessionType[] = [
    {
      id: 1,
      title: "Weekly Algorithm Challenge",
      description: "Solve 3 problems of varying difficulty within the time limit",
      date: "2023-04-15T14:00:00Z",
      duration: 90,
      participants: 48,
      status: "active",
      type: "contest",
      creator: {
        name: "Admin",
        avatar: "https://github.com/shadcn.png"
      },
      problems: [1, 2, 3]
    },
    {
      id: 2,
      title: "Dynamic Programming Practice",
      description: "A set of DP problems to improve your skills",
      date: "2023-04-16T10:00:00Z",
      duration: 120,
      participants: 32,
      status: "upcoming",
      type: "practice",
      creator: {
        name: "Jane Smith",
        avatar: "https://github.com/shadcn.png"
      },
      problems: [5, 8, 10, 15]
    },
    {
      id: 3,
      title: "Graph Algorithms Bootcamp",
      description: "Master BFS, DFS, and shortest path algorithms",
      date: "2023-04-14T15:30:00Z",
      duration: 150,
      participants: 64,
      status: "ended",
      type: "contest",
      creator: {
        name: "John Doe",
        avatar: "https://github.com/shadcn.png"
      },
      problems: [4, 9, 12]
    },
  ];

  // Use sample data for now
  const sessionsData: SessionType[] = sessions as SessionType[] || activeSessions;

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Coding Sessions</h1>
            <p className="text-muted-foreground">Practice together, compete, and improve your skills</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-1 h-4 w-4" /> Create Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleCreateSession}>
                  <DialogHeader>
                    <DialogTitle>Create New Session</DialogTitle>
                    <DialogDescription>
                      Create a practice session or coding contest for your team or class
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Session Title</Label>
                      <Input 
                        id="title" 
                        value={newSession.title}
                        onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                        placeholder="Weekly Algorithm Challenge"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description" 
                        value={newSession.description}
                        onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                        placeholder="Brief description of this session"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Session Type</Label>
                        <Select 
                          value={newSession.type}
                          onValueChange={(value) => setNewSession({...newSession, type: value})}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="practice">Practice Session</SelectItem>
                            <SelectItem value="contest">Contest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Select 
                          value={newSession.duration}
                          onValueChange={(value) => setNewSession({...newSession, duration: value})}
                        >
                          <SelectTrigger id="duration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="180">3 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Select Problems</Label>
                      <div className="border border-border rounded-md p-3 max-h-[200px] overflow-y-auto scrollbar-thin">
                        {Array.isArray(problems) ? problems.map((problem) => (
                          <div key={problem.id} className="flex items-center space-x-2 py-2">
                            <Checkbox 
                              id={`problem-${problem.id}`}
                              checked={newSession.problems.includes(problem.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewSession({
                                    ...newSession, 
                                    problems: [...newSession.problems, problem.id]
                                  });
                                } else {
                                  setNewSession({
                                    ...newSession, 
                                    problems: newSession.problems.filter(id => id !== problem.id)
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={`problem-${problem.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                            >
                              {problem.title}
                              <span className={`ml-2 inline-block w-2 h-2 rounded-full bg-${problem.difficulty}`}></span>
                            </label>
                          </div>
                        )) : null}
                        {!problems && Array(5).fill(0).map((_, idx) => (
                          <div key={idx} className="flex items-center space-x-2 py-2">
                            <div className="h-4 w-4 rounded bg-muted animate-pulse"></div>
                            <div className="h-4 w-40 rounded bg-muted animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isCreatingSession}>
                      {isCreatingSession ? "Creating..." : "Create Session"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Join Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Join a Session</DialogTitle>
                  <DialogDescription>
                    Enter the session code provided by the session creator
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="session-code">Session Code</Label>
                    <Input 
                      id="session-code" 
                      value={sessionCode}
                      onChange={(e) => setSessionCode(e.target.value)}
                      placeholder="Enter code (e.g. ABC123)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleJoinSession}>
                    Join
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="active">
              <PlayCircle className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past">
              <Trophy className="h-4 w-4 mr-2" />
              Past Sessions
            </TabsTrigger>
            <TabsTrigger value="my">
              <Users className="h-4 w-4 mr-2" />
              My Sessions
            </TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-0 top-[-40px]"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionsData.filter(s => s.status === "active").map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              {sessionsData.filter(s => s.status === "active").length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <div className="h-16 w-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <PlayCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No active sessions</h3>
                  <p className="text-muted-foreground mb-6">There are no active sessions right now</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-1 h-4 w-4" /> Create a Session
                      </Button>
                    </DialogTrigger>
                    {/* Dialog content is the same as the one above */}
                  </Dialog>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionsData.filter(s => s.status === "upcoming").map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              {sessionsData.filter(s => s.status === "upcoming").length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No upcoming sessions yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionsData.filter(s => s.status === "ended").map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              {sessionsData.filter(s => s.status === "ended").length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No past sessions</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="my">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filter by user's created sessions */}
              {sessionsData.filter(s => s.creator.name === "John Doe").map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              {sessionsData.filter(s => s.creator.name === "John Doe").length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">You haven't created any sessions yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Session Leaderboard</h2>
            <p className="text-muted-foreground mb-6">Recent contest results and top performers</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left">Contest</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Winner</th>
                    <th className="px-4 py-3 text-left">Problems Solved</th>
                    <th className="px-4 py-3 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">Weekly Algorithm Challenge</td>
                    <td className="px-4 py-3">Apr 10, 2023</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-muted overflow-hidden mr-2">
                          <img src="https://github.com/shadcn.png" alt="User" className="h-full w-full object-cover" />
                        </div>
                        <span>Alice Johnson</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">3/3</td>
                    <td className="px-4 py-3">42 minutes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">Binary Tree Bootcamp</td>
                    <td className="px-4 py-3">Apr 3, 2023</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-muted overflow-hidden mr-2">
                          <img src="https://github.com/shadcn.png" alt="User" className="h-full w-full object-cover" />
                        </div>
                        <span>Bob Smith</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">4/4</td>
                    <td className="px-4 py-3">67 minutes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">DP Showdown</td>
                    <td className="px-4 py-3">Mar 27, 2023</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-muted overflow-hidden mr-2">
                          <img src="https://github.com/shadcn.png" alt="User" className="h-full w-full object-cover" />
                        </div>
                        <span>Charlie Davis</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">3/5</td>
                    <td className="px-4 py-3">82 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: SessionType;
}

function SessionCard({ session }: SessionCardProps) {
  const { toast } = useToast();
  
  const handleJoin = () => {
    toast({
      title: "Joined session",
      description: `You've joined "${session.title}" successfully`,
    });
  };
  
  const handleRemind = () => {
    toast({
      title: "Reminder set",
      description: `We'll remind you when "${session.title}" begins`,
    });
  };
  
  const handleViewResults = () => {
    toast({
      title: "Results",
      description: `Viewing results for "${session.title}"`,
    });
  };
  
  const getStatusStyles = () => {
    switch (session.status) {
      case "active":
        return "bg-primary/20 text-primary";
      case "upcoming":
        return "bg-yellow-500/20 text-yellow-500";
      case "ended":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  return (
    <Card className="bg-card border border-border overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyles()}`}>
            {session.status === "active" ? "Active" : 
             session.status === "upcoming" ? "Upcoming" : 
             "Ended"}
          </span>
        </div>
        <CardDescription>{session.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {new Date(session.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{session.duration} minutes</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{session.participants} participants</span>
          </div>
          <div className="flex items-center text-sm">
            <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{session.type === "contest" ? "Contest" : "Practice Session"}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Created by: {session.creator.name}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t border-border mt-4">
        {session.status === "active" && (
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleJoin}>
            Join Now <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
        {session.status === "upcoming" && (
          <Button className="w-full" variant="outline" onClick={handleRemind}>
            Remind Me
          </Button>
        )}
        {session.status === "ended" && (
          <Button className="w-full" variant="outline" onClick={handleViewResults}>
            View Results
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}