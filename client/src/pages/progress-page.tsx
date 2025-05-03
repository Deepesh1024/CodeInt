import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, X, TrendingUp, Award } from "lucide-react";
import { Link } from "wouter";

export default function ProgressPage() {
  // Fetch user progress from API
  const { data: userProgress, isLoading } = useQuery({
    queryKey: ['/api/progress/1'], // Hardcoded user ID for this demo
    staleTime: 60000, // 1 minute
  });

  // Fetch user submissions from API
  const { data: submissions } = useQuery({
    queryKey: ['/api/submissions/1'], // Hardcoded user ID for this demo
    staleTime: 60000, // 1 minute
  });

  // Sample data for demo
  const statistics = {
    solved: 42,
    attempted: 18,
    total: 150,
    streak: 7,
    ranking: 1542,
    byDifficulty: {
      easy: {total: 50, solved: 30},
      medium: {total: 70, solved: 12},
      hard: {total: 30, solved: 0}
    }
  };

  // Sample submissions for demo
  const recentSubmissions = [
    {id: 1, problemId: 1, problemTitle: 'Two Sum', status: 'accepted', submittedAt: '2023-04-15T14:30:00Z', runtime: 76, language: 'javascript'},
    {id: 2, problemId: 2, problemTitle: 'Add Two Numbers', status: 'wrong_answer', submittedAt: '2023-04-14T10:15:00Z', runtime: 92, language: 'python'},
    {id: 3, problemId: 3, problemTitle: 'Longest Substring Without Repeating Characters', status: 'accepted', submittedAt: '2023-04-13T16:45:00Z', runtime: 84, language: 'javascript'},
    {id: 4, problemId: 4, problemTitle: 'Median of Two Sorted Arrays', status: 'time_limit_exceeded', submittedAt: '2023-04-12T09:20:00Z', runtime: 0, language: 'java'},
    {id: 5, problemId: 5, problemTitle: 'Longest Palindromic Substring', status: 'accepted', submittedAt: '2023-04-11T18:10:00Z', runtime: 65, language: 'cpp'},
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">My Progress</h1>
        <p className="text-muted-foreground">Track your coding journey and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Problems Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.solved}</div>
            <div className="text-xs text-muted-foreground mt-1">out of {statistics.total} problems</div>
            <Progress value={(statistics.solved / statistics.total) * 100} className="h-2 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="bg-card border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{statistics.streak} days</div>
              <TrendingUp className="ml-2 h-5 w-5 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">Keep it going!</div>
            <div className="flex gap-1 mt-3">
              {Array.from({length: 7}).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-sm ${i < statistics.streak % 7 ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">#{statistics.ranking}</div>
              <Award className="ml-2 h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">Top 10% of all users</div>
            <div className="h-2 bg-muted rounded-full mt-3">
              <div className="h-2 bg-yellow-500 rounded-full" style={{width: '10%'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border border-border mb-6">
        <CardHeader>
          <CardTitle>Solving Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Easy</div>
                <div className="text-sm text-muted-foreground">{statistics.byDifficulty.easy.solved}/{statistics.byDifficulty.easy.total}</div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-easy rounded-full" 
                  style={{width: `${(statistics.byDifficulty.easy.solved / statistics.byDifficulty.easy.total) * 100}%`}}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Medium</div>
                <div className="text-sm text-muted-foreground">{statistics.byDifficulty.medium.solved}/{statistics.byDifficulty.medium.total}</div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-medium rounded-full" 
                  style={{width: `${(statistics.byDifficulty.medium.solved / statistics.byDifficulty.medium.total) * 100}%`}}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Hard</div>
                <div className="text-sm text-muted-foreground">{statistics.byDifficulty.hard.solved}/{statistics.byDifficulty.hard.total}</div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-hard rounded-full" 
                  style={{width: `${(statistics.byDifficulty.hard.solved / statistics.byDifficulty.hard.total) * 100}%`}}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="submissions" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-3 text-left">Problem</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Runtime</th>
                    <th className="px-4 py-3 text-left">Language</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map(submission => (
                    <tr key={submission.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Link href={`/problems/${submission.problemId}`}>
                          <a className="text-primary hover:underline">{submission.problemTitle}</a>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'accepted' 
                            ? 'bg-primary/20 text-primary' 
                            : submission.status === 'wrong_answer' 
                              ? 'bg-destructive/20 text-destructive' 
                              : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {submission.status === 'accepted' && <Check className="mr-1 h-3 w-3" />}
                          {submission.status === 'wrong_answer' && <X className="mr-1 h-3 w-3" />}
                          {submission.status === 'time_limit_exceeded' && <Clock className="mr-1 h-3 w-3" />}
                          {submission.status === 'accepted' ? 'Accepted' : 
                           submission.status === 'wrong_answer' ? 'Wrong Answer' : 
                           'Time Limit Exceeded'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {submission.runtime > 0 ? `${submission.runtime} ms` : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {submission.language}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-card border border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Problem Solver</h3>
                  <p className="text-sm text-muted-foreground mb-3">Solved 25 problems</p>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <p className="text-xs text-primary mt-2">Completed!</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-medium/20 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-medium" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Medium Mastery</h3>
                  <p className="text-sm text-muted-foreground mb-3">Solve 20 medium problems</p>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="h-2 bg-medium rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">12/20 completed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-hard/20 flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-hard" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Hard Hitter</h3>
                  <p className="text-sm text-muted-foreground mb-3">Solve 10 hard problems</p>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="h-2 bg-hard rounded-full" style={{width: '0%'}}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">0/10 completed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}