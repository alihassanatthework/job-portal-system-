import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Job } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BriefcaseBusiness, Briefcase, Building, Search, MapPin, LucideIcon, CheckCircle2, LineChart, Users } from "lucide-react";

// Feature type for the features section
type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

// Sample features
const features: Feature[] = [
  {
    title: "Find Top Jobs",
    description: "Browse thousands of the latest job openings from top employers.",
    icon: Briefcase,
  },
  {
    title: "Smart Matching",
    description: "Our AI-powered system connects you with opportunities that match your skills and experience.",
    icon: CheckCircle2,
  },
  {
    title: "Career Growth",
    description: "Get valuable insights and resources to help advance your career journey.",
    icon: LineChart,
  },
  {
    title: "Connect with Employers",
    description: "Communicate directly with hiring managers and recruiters.",
    icon: Users,
  },
];

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: latestJobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", { limit: 6 }],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-4">
                  Find Your Dream Job <span className="text-primary">Today</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                  Connect with top employers and discover opportunities that match your skills and career goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => navigate("/jobs")}>
                    Browse Jobs
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => !user && navigate("/auth")}>
                    {user ? "My Dashboard" : "Join Now"}
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-10 md:mt-0">
                <div className="relative">
                  <div className="w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    {/* We'll replace this with an actual image later */}
                    Job Portal Dashboard Preview
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white">
                    <Briefcase className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-16 max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => {
                    e.preventDefault();
                    navigate("/jobs");
                  }}>
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Location"
                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <Button type="submit" className="md:w-auto">
                      Find Jobs
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose Our Platform</h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We provide the tools and resources you need to succeed in your job search.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Latest Jobs Section */}
        <section id="latest-jobs" className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Job Openings</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Explore the newest opportunities from top employers
                </p>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0" asChild>
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !latestJobs || latestJobs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Check back soon for new job opportunities
                </p>
                <Button asChild>
                  <Link href="/auth">Create Account</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <Card className="h-full cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="line-clamp-1">{job.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Building className="h-4 w-4 mr-1" />
                              Company Name
                            </CardDescription>
                          </div>
                          <Badge variant={job.jobType === "full-time" ? "default" : "outline"}>
                            {job.jobType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2 text-sm mb-3">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 opacity-70" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 opacity-70" />
                            {job.salaryMin && job.salaryMax
                              ? `$${job.salaryMin} - $${job.salaryMax}`
                              : job.salaryMin
                              ? `From $${job.salaryMin}`
                              : job.salaryMax
                              ? `Up to $${job.salaryMax}`
                              : "Salary not specified"}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Posted {formatDate(job.postedAt)}
                        </div>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step in Your Career?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of professionals who've found their dream jobs through our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
              {!user && (
                <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/auth">Sign Up Now</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Get Career Tips & Job Alerts</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Subscribe to our newsletter for exclusive career advice and be the first to know about new opportunities.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                />
                <Button type="submit">
                  Subscribe
                </Button>
              </form>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                We care about your data. Read our 
                <Link href="#" className="font-medium text-primary hover:underline ml-1">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
