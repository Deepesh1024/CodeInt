import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Book, Code, Award } from "lucide-react";

export default function LearnPage() {
  const tutorials = [
    {
      id: 1,
      title: "Data Structures Fundamentals",
      description: "Learn about arrays, linked lists, stacks, queues, and more",
      icon: <Code className="h-8 w-8 text-primary" />,
      lessons: 12,
      level: "Beginner"
    },
    {
      id: 2,
      title: "Algorithms Masterclass",
      description: "Sorting, searching, dynamic programming, and graph algorithms",
      icon: <Book className="h-8 w-8 text-primary" />,
      lessons: 18,
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Interview Preparation",
      description: "Common patterns and techniques for technical interviews",
      icon: <Award className="h-8 w-8 text-primary" />,
      lessons: 8,
      level: "Advanced"
    },
    {
      id: 4,
      title: "System Design",
      description: "Scaling, database design, and distributed systems",
      icon: <PlayCircle className="h-8 w-8 text-primary" />,
      lessons: 10,
      level: "Advanced"
    }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Learning Center</h1>
        <p className="text-muted-foreground">Structured courses and tutorials to help you master coding skills</p>
      </div>

      <div className="mb-8 bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <PlayCircle className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">Continue Learning</h2>
            <p className="text-muted-foreground mb-4">You're 60% through "Data Structures Fundamentals"</p>
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div className="bg-primary h-2 rounded-full" style={{width: "60%"}}></div>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Resume Course
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Browse Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map(tutorial => (
          <Card key={tutorial.id} className="bg-card border border-border overflow-hidden transition-all hover:border-primary">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 p-2 rounded-md">
                  {tutorial.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  tutorial.level === "Beginner" ? "bg-easy/20 text-easy" : 
                  tutorial.level === "Intermediate" ? "bg-medium/20 text-medium" : 
                  "bg-hard/20 text-hard"
                }`}>
                  {tutorial.level}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">{tutorial.title}</CardTitle>
              <CardDescription>{tutorial.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {tutorial.lessons} lessons • 4 hours total
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button variant="outline" className="w-full">Start Learning</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}