import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
                <Link href="/">
                  <a className="px-3 py-2 rounded-md text-sm font-medium bg-sidebar-accent text-white">
                    Problems
                  </a>
                </Link>
                <Link href="/progress">
                  <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-sidebar-accent hover:text-white">
                    My Progress
                  </a>
                </Link>
                <Link href="/learn">
                  <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-sidebar-accent hover:text-white">
                    Learn
                  </a>
                </Link>
                <Link href="/portfolio">
                  <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-sidebar-accent hover:text-white">
                    Portfolio
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <div className="ml-3 relative">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
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
                <div className="py-4 flex flex-col gap-2">
                  <Link href="/">
                    <a className="px-3 py-2 rounded-md text-md font-medium text-white bg-sidebar-accent">
                      Problems
                    </a>
                  </Link>
                  <Link href="/progress">
                    <a className="px-3 py-2 rounded-md text-md font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-white">
                      My Progress
                    </a>
                  </Link>
                  <Link href="/learn">
                    <a className="px-3 py-2 rounded-md text-md font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-white">
                      Learn
                    </a>
                  </Link>
                  <Link href="/portfolio">
                    <a className="px-3 py-2 rounded-md text-md font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-white">
                      Portfolio
                    </a>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
