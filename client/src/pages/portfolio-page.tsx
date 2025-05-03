import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, Github, ExternalLink, Heart, Plus, User, Briefcase, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";

export default function PortfolioPage() {
  const solvedProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "easy",
      date: "2023-04-15",
      language: "JavaScript",
      code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "medium",
      date: "2023-04-10",
      language: "Python",
      code: `def addTwoNumbers(self, l1, l2):
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    
    while l1 or l2 or carry:
        x = l1.val if l1 else 0
        y = l2.val if l2 else 0
        sum = x + y + carry
        
        carry = sum // 10
        curr.next = ListNode(sum % 10)
        curr = curr.next
        
        if l1: l1 = l1.next
        if l2: l2 = l2.next
            
    return dummy.next`
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      date: "2023-04-05",
      language: "JavaScript",
      code: `function lengthOfLongestSubstring(s) {
  let map = new Map();
  let maxLength = 0;
  let start = 0;
  
  for (let end = 0; end < s.length; end++) {
    if (map.has(s[end])) {
      start = Math.max(start, map.get(s[end]) + 1);
    }
    map.set(s[end], end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  
  return maxLength;
}`
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "medium",
      date: "2023-03-28",
      language: "C++",
      code: `string longestPalindrome(string s) {
    if (s.empty()) return "";
    
    int start = 0, maxLength = 1;
    
    for (int i = 0; i < s.length(); i++) {
        // Check for odd length palindromes
        int left = i, right = i;
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            if (right - left + 1 > maxLength) {
                maxLength = right - left + 1;
                start = left;
            }
            left--; right++;
        }
        
        // Check for even length palindromes
        left = i; right = i + 1;
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            if (right - left + 1 > maxLength) {
                maxLength = right - left + 1;
                start = left;
            }
            left--; right++;
        }
    }
    
    return s.substr(start, maxLength);
}`
    }
  ];

  const projects = [
    {
      id: 1,
      title: "Algorithm Visualizer",
      description: "Interactive tool to visualize sorting and pathfinding algorithms",
      tags: ["React", "JavaScript", "Data Structures"],
      image: "https://placeholder.pics/svg/300/222222/FFFFFF/Algorithm%20Visualizer",
      github: "https://github.com",
      demo: "https://demo.com",
      featured: true
    },
    {
      id: 2,
      title: "Memory Game",
      description: "A card matching memory game with multiple difficulty levels",
      tags: ["JavaScript", "HTML5", "CSS3"],
      image: "https://placeholder.pics/svg/300/222222/FFFFFF/Memory%20Game",
      github: "https://github.com",
      demo: "https://demo.com",
      featured: false
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather application with 5-day forecast",
      tags: ["React", "API", "Tailwind CSS"],
      image: "https://placeholder.pics/svg/300/222222/FFFFFF/Weather%20Dashboard",
      github: "https://github.com",
      demo: "https://demo.com",
      featured: true
    }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-white">John Doe</h1>
                <p className="text-muted-foreground">Full Stack Developer | Algorithm Enthusiast</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">
                    <User className="inline-block h-3 w-3 mr-1" /> 150 problems solved
                  </span>
                  <span className="text-sm bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                    <Award className="inline-block h-3 w-3 mr-1" /> Top 10%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" /> GitHub
              </Button>
              <Button variant="outline" size="sm">
                <Briefcase className="h-4 w-4 mr-2" /> LinkedIn
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" /> Website
              </Button>
            </div>
          </div>
          
          <Card className="bg-card border border-border mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <p className="text-muted-foreground">
                I'm a passionate software engineer with a strong background in algorithms and data structures.
                I enjoy solving complex problems and building efficient solutions. With expertise in JavaScript,
                Python, and React, I have developed various web applications and tools that focus on performance
                and user experience.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-md font-medium mb-2">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {["JavaScript", "Python", "React", "Node.js", "Data Structures", "Algorithms", "System Design"].map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="solutions" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="solutions">Problem Solutions</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="solutions">
            <div className="grid grid-cols-1 gap-4">
              {solvedProblems.map(problem => (
                <Card key={problem.id} className="bg-card border border-border overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg hover:text-primary">
                          <Link href={`/problems/${problem.id}`}>
                            <a>{problem.title}</a>
                          </Link>
                        </CardTitle>
                        <CardDescription>Solved on {new Date(problem.date).toLocaleDateString()}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium difficulty-${problem.difficulty}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                        <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                          {problem.language}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{problem.code}</code>
                    </pre>
                  </CardContent>
                  <CardFooter className="border-t border-border pt-3 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Time: 76ms (faster than 90%) | Space: 42.1MB (less than 75%)
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" /> Like
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Code className="h-4 w-4 mr-1" /> View Full
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <Card key={project.id} className={`bg-card border ${project.featured ? 'border-primary' : 'border-border'} overflow-hidden`}>
                  <div className="aspect-video w-full bg-muted">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {project.featured && (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-muted rounded-md text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border pt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Github className="h-4 w-4 mr-2" /> GitHub
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" /> Demo
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="bg-card border border-dashed border-border overflow-hidden flex items-center justify-center">
                <div className="p-8 text-center">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Add New Project</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Showcase your coding projects and applications
                  </p>
                  <Button variant="outline">Add Project</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}