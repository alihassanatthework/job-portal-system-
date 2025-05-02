import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, Briefcase, User, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const [_, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">JobConnect</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary border-b-2 border-primary">
              Home
            </Link>
            <Link href="/jobs" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              Find Jobs
            </Link>
            <Link href="/job-seekers" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              For Job Seekers
            </Link>
            <Link href="/employers" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              For Employers
            </Link>
            <Link href="/resources" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              Resources
            </Link>
          </nav>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Search button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Notifications - Only for logged in users */}
            {user && (
              <Link href="/notifications" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 text-xs" variant="secondary">2</Badge>
              </Link>
            )}
            
            {/* Account menu */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/profile" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.username}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.userType === "job_seeker" ? "Job Seeker" : "Employer"}
                    </p>
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => logoutMutation.mutate()}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary bg-primary-50 dark:bg-primary-900/20">
              Home
            </Link>
            <Link href="/jobs" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              Find Jobs
            </Link>
            <Link href="/job-seekers" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              For Job Seekers
            </Link>
            <Link href="/employers" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              For Employers
            </Link>
            <Link href="/resources" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
              Resources
            </Link>
            {user && (
              <>
                <Link href="/applications" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
                  My Applications
                </Link>
                <Link href="/profile" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white">
                  Profile
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user ? user.username.substring(0, 2).toUpperCase() : 'GU'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3 flex-grow">
                {user ? (
                  <>
                    <div className="text-base font-medium text-gray-800 dark:text-white">{user.username}</div>
                    <Button 
                      variant="link" 
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 p-0" 
                      onClick={() => logoutMutation.mutate()}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-1">
                    <Link href="/auth" className="block text-base font-medium text-gray-800 dark:text-white">
                      Sign In
                    </Link>
                    <Link href="/auth" className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      or Create Account
                    </Link>
                  </div>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
      
      {/* Search panel */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gray-900 bg-opacity-50" 
            onClick={() => setSearchOpen(false)}
          ></div>
          <div className="absolute inset-x-0 top-0 bg-white dark:bg-gray-800 shadow-lg transform transition-all p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search for jobs, companies, or keywords..." 
                    className="w-full border-0 focus:ring-0 text-lg bg-transparent" 
                    autoFocus
                  />
                </div>
                <button 
                  onClick={() => setSearchOpen(false)} 
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Popular searches:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full">Software Engineer</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full">Remote</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full">Marketing</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full">Data Analyst</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
