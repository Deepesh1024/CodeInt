import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, LogOut, User, Settings } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Fake authentication context for demo
const AuthContext = {
  isAuthenticated: true,
  isAdmin: true,
  user: {
    name: "John Doe",
    avatar: "https://github.com/shadcn.png"
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    // In a real app, this would call the logout API
    // and redirect to login page
    setLocation('/auth');
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-xl font-bold text-white cursor-pointer">CodePortfolio</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-sidebar-accent text-white' : 'text-gray-300 hover:bg-sidebar-accent hover:text-white'}`}>
                  Problems
                </Link>
                <Link href="/progress" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/progress') ? 'bg-sidebar-accent text-white' : 'text-gray-300 hover:bg-sidebar-accent hover:text-white'}`}>
                  My Progress
                </Link>
                <Link href="/learn" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/learn') ? 'bg-sidebar-accent text-white' : 'text-gray-300 hover:bg-sidebar-accent hover:text-white'}`}>
                  Learn
                </Link>
                <Link href="/sessions" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/sessions') ? 'bg-sidebar-accent text-white' : 'text-gray-300 hover:bg-sidebar-accent hover:text-white'}`}>
                  Sessions
                </Link>
                <Link href="/portfolio" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/portfolio') ? 'bg-sidebar-accent text-white' : 'text-gray-300 hover:bg-sidebar-accent hover:text-white'}`}>
                  Portfolio
                </Link>
                {AuthContext.isAdmin && (
                  <Link href="/admin" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin') ? 'bg-sidebar-accent text-white' : 'text-gray-300 hover:bg-sidebar-accent hover:text-white'}`}>
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <div className="ml-3 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={AuthContext.user.avatar} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation('/portfolio')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation('/progress')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>My Progress</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-white hover:bg-sidebar-accent"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-sidebar-background">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="py-2 flex flex-col">
                  <div className="px-4 py-2 mb-2">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={AuthContext.user.avatar} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{AuthContext.user.name}</p>
                        <p className="text-xs text-muted-foreground">View profile</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/" className={`px-3 py-2 rounded-md text-md font-medium ${isActive('/') ? 'text-white bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-white'}`}>
                    Problems
                  </Link>
                  <Link href="/progress" className={`px-3 py-2 rounded-md text-md font-medium ${isActive('/progress') ? 'text-white bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-white'}`}>
                    My Progress
                  </Link>
                  <Link href="/learn" className={`px-3 py-2 rounded-md text-md font-medium ${isActive('/learn') ? 'text-white bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-white'}`}>
                    Learn
                  </Link>
                  <Link href="/sessions" className={`px-3 py-2 rounded-md text-md font-medium ${isActive('/sessions') ? 'text-white bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-white'}`}>
                    Sessions
                  </Link>
                  <Link href="/portfolio" className={`px-3 py-2 rounded-md text-md font-medium ${isActive('/portfolio') ? 'text-white bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-white'}`}>
                    Portfolio
                  </Link>
                  {AuthContext.isAdmin && (
                    <Link href="/admin" className={`px-3 py-2 rounded-md text-md font-medium ${isActive('/admin') ? 'text-white bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-white'}`}>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <div className="mt-auto px-3 py-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-md font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
