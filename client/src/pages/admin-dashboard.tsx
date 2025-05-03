import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Users, Settings, Database, FilePlus, Edit, Trash2, Eye, Search, UserPlus, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);
  
  // New problem form state
  const [newProblem, setNewProblem] = useState({
    title: "",
    slug: "",
    description: "",
    difficulty: "easy",
    tags: [] as string[],
    examples: [{ input: "", output: "", explanation: "" }],
    testCases: [{ input: "", output: "" }],
    codeTemplate: { javascript: "", python: "", java: "", cpp: "" }
  });
  
  interface AdminUser {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    joined: string;
    problems_solved: number;
  }

  interface AdminProblem {
    id: number;
    title: string;
    difficulty: string;
    acceptance: string;
    submissions: number;
    added: string;
  }

  interface AdminSession {
    id: number;
    title: string;
    type: string;
    status: string;
    date: string;
    duration: string;
    participants: number;
  }

  // Fetch users for admin
  const { data: users, isLoading: isLoadingUsers } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch problems for admin
  const { data: problems, isLoading: isLoadingProblems } = useQuery<AdminProblem[]>({
    queryKey: ['/api/admin/problems'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch sessions for admin
  const { data: sessions, isLoading: isLoadingSessions } = useQuery<AdminSession[]>({
    queryKey: ['/api/admin/sessions'],
    staleTime: 60000, // 1 minute
  });

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsCreatingProblem(true);
      
      // Generate slug if empty
      if (!newProblem.slug) {
        newProblem.slug = newProblem.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      // In a real app, this would call the API
      const response = await apiRequest("POST", "/api/problems", newProblem);
      
      if (response.ok) {
        toast({
          title: "Problem created",
          description: "The problem has been created successfully",
        });
        
        // Reset form
        setNewProblem({
          title: "",
          slug: "",
          description: "",
          difficulty: "easy",
          tags: [],
          examples: [{ input: "", output: "", explanation: "" }],
          testCases: [{ input: "", output: "" }],
          codeTemplate: { javascript: "", python: "", java: "", cpp: "" }
        });
        
        // Refetch problems
      } else {
        throw new Error("Failed to create problem");
      }
    } catch (error) {
      toast({
        title: "Failed to create problem",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingProblem(false);
    }
  };

  // Analytics data for dashboard
  const analyticsData = {
    totalUsers: 1253,
    activeUsers: 768,
    totalSessions: 42,
    totalProblems: 156,
    submission24h: 845,
    submissionSuccess: 62,
    userGrowth: '+24%',
    submissionGrowth: '+18%',
    totalSubmissions: 24680,
    problemsByDifficulty: {
      easy: 75,
      medium: 56,
      hard: 25
    }
  };

  // Sample users data
  const usersData = [
    { id: 1, username: "john_doe", email: "john@example.com", role: "user", status: "active", joined: "2023-01-15", problems_solved: 42 },
    { id: 2, username: "jane_smith", email: "jane@example.com", role: "admin", status: "active", joined: "2023-02-20", problems_solved: 86 },
    { id: 3, username: "bob_johnson", email: "bob@example.com", role: "user", status: "inactive", joined: "2023-03-05", problems_solved: 13 },
    { id: 4, username: "alice_williams", email: "alice@example.com", role: "user", status: "active", joined: "2023-02-10", problems_solved: 57 },
    { id: 5, username: "charlie_brown", email: "charlie@example.com", role: "moderator", status: "active", joined: "2023-01-25", problems_solved: 35 },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, problems, and sessions</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-card border-border w-full md:w-[300px]"
              placeholder="Search users, problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
              <div className="text-xs text-primary mt-1">{analyticsData.userGrowth} from last month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalSessions}</div>
              <div className="text-xs text-muted-foreground mt-1">Across all users</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Problems</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalProblems}</div>
              <div className="text-xs text-muted-foreground mt-1">Across all difficulty levels</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Submissions (24h)</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.submission24h}</div>
              <div className="text-xs text-primary mt-1">{analyticsData.submissionGrowth} from yesterday</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">
                <BarChart className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="problems">
                <Database className="h-4 w-4 mr-2" />
                Problems
              </TabsTrigger>
              <TabsTrigger value="sessions">
                <Settings className="h-4 w-4 mr-2" />
                Sessions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border border-border md:col-span-2">
                  <CardHeader>
                    <CardTitle>Submission Activity</CardTitle>
                    <CardDescription>Total submissions over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        Chart would go here in a real application
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle>Problems by Difficulty</CardTitle>
                    <CardDescription>Distribution across levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Easy</div>
                          <div className="text-sm text-muted-foreground">{analyticsData.problemsByDifficulty.easy}</div>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className="h-2 bg-easy rounded-full" 
                            style={{width: `${(analyticsData.problemsByDifficulty.easy / analyticsData.totalProblems) * 100}%`}}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Medium</div>
                          <div className="text-sm text-muted-foreground">{analyticsData.problemsByDifficulty.medium}</div>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className="h-2 bg-medium rounded-full" 
                            style={{width: `${(analyticsData.problemsByDifficulty.medium / analyticsData.totalProblems) * 100}%`}}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Hard</div>
                          <div className="text-sm text-muted-foreground">{analyticsData.problemsByDifficulty.hard}</div>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className="h-2 bg-hard rounded-full" 
                            style={{width: `${(analyticsData.problemsByDifficulty.hard / analyticsData.totalProblems) * 100}%`}}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium">User Success Rate</h4>
                        <Badge variant="outline">{analyticsData.submissionSuccess}%</Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{width: `${analyticsData.submissionSuccess}%`}}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Based on {analyticsData.totalSubmissions} total submissions
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border border-border md:col-span-3">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest user submissions and registrations</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">john_doe</div>
                          </TableCell>
                          <TableCell>Submitted solution to "Two Sum"</TableCell>
                          <TableCell>2 minutes ago</TableCell>
                          <TableCell>
                            <Badge className="bg-primary">Accepted</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">alice_williams</div>
                          </TableCell>
                          <TableCell>Registered new account</TableCell>
                          <TableCell>10 minutes ago</TableCell>
                          <TableCell>
                            <Badge>Completed</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">bob_johnson</div>
                          </TableCell>
                          <TableCell>Submitted solution to "Add Two Numbers"</TableCell>
                          <TableCell>15 minutes ago</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Wrong Answer</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">jane_smith</div>
                          </TableCell>
                          <TableCell>Created session "Dynamic Programming"</TableCell>
                          <TableCell>30 minutes ago</TableCell>
                          <TableCell>
                            <Badge variant="outline">Active</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">charlie_brown</div>
                          </TableCell>
                          <TableCell>Submitted solution to "Merge Intervals"</TableCell>
                          <TableCell>45 minutes ago</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-500">Time Limit</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card className="bg-card border border-border overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage registered users</CardDescription>
                    </div>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Problems Solved</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(users || usersData)
                          .filter(user => 
                            searchTerm === "" || 
                            user.username.includes(searchTerm) || 
                            user.email.includes(searchTerm)
                          )
                          .map(user => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>
                              <div className="font-medium">{user.username}</div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "admin" ? "default" : "outline"}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "secondary"} className={
                                user.status === "active" ? "bg-primary" : "bg-destructive"
                              }>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.joined}</TableCell>
                            <TableCell>{user.problems_solved}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="problems">
              <div className="grid grid-cols-1 gap-6">
                <Card className="bg-card border border-border overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Problem Management</CardTitle>
                        <CardDescription>Create and manage problems</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <FilePlus className="h-4 w-4 mr-2" /> Add Problem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                          <form onSubmit={handleCreateProblem}>
                            <DialogHeader>
                              <DialogTitle>Create New Problem</DialogTitle>
                              <DialogDescription>
                                Add a new coding problem to the platform
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="title">Problem Title</Label>
                                <Input 
                                  id="title" 
                                  value={newProblem.title}
                                  onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                                  placeholder="Two Sum"
                                  required
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="slug">
                                  Slug (URL-friendly identifier)
                                  <span className="text-xs text-muted-foreground ml-2">
                                    Will be auto-generated if empty
                                  </span>
                                </Label>
                                <Input 
                                  id="slug" 
                                  value={newProblem.slug}
                                  onChange={(e) => setNewProblem({...newProblem, slug: e.target.value})}
                                  placeholder="two-sum"
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="description">Description (Markdown supported)</Label>
                                <Textarea 
                                  id="description" 
                                  value={newProblem.description}
                                  onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                                  placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice."
                                  rows={6}
                                  required
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="difficulty">Difficulty</Label>
                                  <Select 
                                    value={newProblem.difficulty}
                                    onValueChange={(value) => setNewProblem({...newProblem, difficulty: value})}
                                  >
                                    <SelectTrigger id="difficulty">
                                      <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="easy">Easy</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="tags">Tags (comma separated)</Label>
                                  <Input 
                                    id="tags" 
                                    placeholder="array, hash-table"
                                    onChange={(e) => setNewProblem({
                                      ...newProblem, 
                                      tags: e.target.value.split(',').map(tag => tag.trim())
                                    })}
                                  />
                                </div>
                              </div>
                              
                              <div className="grid gap-2">
                                <Label>Example 1</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="example1-input" className="text-xs">Input</Label>
                                    <Input 
                                      id="example1-input" 
                                      value={newProblem.examples[0].input}
                                      onChange={(e) => {
                                        const examples = [...newProblem.examples];
                                        examples[0].input = e.target.value;
                                        setNewProblem({...newProblem, examples});
                                      }}
                                      placeholder="nums = [2,7,11,15], target = 9"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="example1-output" className="text-xs">Output</Label>
                                    <Input 
                                      id="example1-output" 
                                      value={newProblem.examples[0].output}
                                      onChange={(e) => {
                                        const examples = [...newProblem.examples];
                                        examples[0].output = e.target.value;
                                        setNewProblem({...newProblem, examples});
                                      }}
                                      placeholder="[0,1]"
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="example1-explanation" className="text-xs">Explanation (optional)</Label>
                                  <Input 
                                    id="example1-explanation" 
                                    value={newProblem.examples[0].explanation}
                                    onChange={(e) => {
                                      const examples = [...newProblem.examples];
                                      examples[0].explanation = e.target.value;
                                      setNewProblem({...newProblem, examples});
                                    }}
                                    placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                                  />
                                </div>
                              </div>
                              
                              <div className="grid gap-2">
                                <Label>Code Templates</Label>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="template-js" className="text-xs">JavaScript</Label>
                                    <Textarea 
                                      id="template-js" 
                                      value={newProblem.codeTemplate.javascript}
                                      onChange={(e) => {
                                        const codeTemplate = {...newProblem.codeTemplate};
                                        codeTemplate.javascript = e.target.value;
                                        setNewProblem({...newProblem, codeTemplate});
                                      }}
                                      placeholder="/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};"
                                      rows={6}
                                      required
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="template-python" className="text-xs">Python</Label>
                                    <Textarea 
                                      id="template-python" 
                                      value={newProblem.codeTemplate.python}
                                      onChange={(e) => {
                                        const codeTemplate = {...newProblem.codeTemplate};
                                        codeTemplate.python = e.target.value;
                                        setNewProblem({...newProblem, codeTemplate});
                                      }}
                                      placeholder="class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass"
                                      rows={6}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={isCreatingProblem}>
                                {isCreatingProblem ? "Creating..." : "Create Problem"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProblems ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Acceptance</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>
                              <div className="font-medium">Two Sum</div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-easy">Easy</Badge>
                            </TableCell>
                            <TableCell>72%</TableCell>
                            <TableCell>1,245</TableCell>
                            <TableCell>2023-01-15</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2</TableCell>
                            <TableCell>
                              <div className="font-medium">Add Two Numbers</div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-medium">Medium</Badge>
                            </TableCell>
                            <TableCell>56%</TableCell>
                            <TableCell>982</TableCell>
                            <TableCell>2023-01-20</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>3</TableCell>
                            <TableCell>
                              <div className="font-medium">Longest Substring Without Repeating Characters</div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-medium">Medium</Badge>
                            </TableCell>
                            <TableCell>48%</TableCell>
                            <TableCell>876</TableCell>
                            <TableCell>2023-01-25</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>4</TableCell>
                            <TableCell>
                              <div className="font-medium">Median of Two Sorted Arrays</div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-hard">Hard</Badge>
                            </TableCell>
                            <TableCell>35%</TableCell>
                            <TableCell>654</TableCell>
                            <TableCell>2023-02-05</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>5</TableCell>
                            <TableCell>
                              <div className="font-medium">Longest Palindromic Substring</div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-medium">Medium</Badge>
                            </TableCell>
                            <TableCell>42%</TableCell>
                            <TableCell>723</TableCell>
                            <TableCell>2023-02-10</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sessions">
              <Card className="bg-card border border-border overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Session Management</CardTitle>
                      <CardDescription>Manage practice sessions and contests</CardDescription>
                    </div>
                    <Button>
                      <FilePlus className="h-4 w-4 mr-2" /> Create Session
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingSessions ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>1</TableCell>
                          <TableCell>
                            <div className="font-medium">Weekly Algorithm Challenge</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Contest</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary">Active</Badge>
                          </TableCell>
                          <TableCell>Apr 15, 2023</TableCell>
                          <TableCell>90 min</TableCell>
                          <TableCell>48</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2</TableCell>
                          <TableCell>
                            <div className="font-medium">Dynamic Programming Practice</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Practice</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-500">Upcoming</Badge>
                          </TableCell>
                          <TableCell>Apr 16, 2023</TableCell>
                          <TableCell>120 min</TableCell>
                          <TableCell>32</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>3</TableCell>
                          <TableCell>
                            <div className="font-medium">Graph Algorithms Bootcamp</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Contest</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Ended</Badge>
                          </TableCell>
                          <TableCell>Apr 14, 2023</TableCell>
                          <TableCell>150 min</TableCell>
                          <TableCell>64</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}