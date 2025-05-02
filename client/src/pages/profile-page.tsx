import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { JobSeekerProfile, EmployerProfile } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, User, Building } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");

  // Job Seeker Profile Form State
  const [jobSeekerForm, setJobSeekerForm] = useState({
    fullName: "",
    headline: "",
    bio: "",
    skills: "",
    experience: "",
    education: "",
    location: "",
    phone: "",
    resumeUrl: "",
  });

  // Employer Profile Form State
  const [employerForm, setEmployerForm] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    description: "",
    location: "",
    website: "",
    logoUrl: "",
  });

  // Fetch job seeker profile
  const { data: jobSeekerProfile, isLoading: loadingJobSeekerProfile } = useQuery<JobSeekerProfile>({
    queryKey: ["/api/profile/job-seeker"],
    enabled: !!user && user.userType === "job_seeker",
    onSuccess: (data) => {
      if (data) {
        setJobSeekerForm({
          fullName: data.fullName || "",
          headline: data.headline || "",
          bio: data.bio || "",
          skills: (data.skills || []).join(", "),
          experience: data.experience || "",
          education: data.education || "",
          location: data.location || "",
          phone: data.phone || "",
          resumeUrl: data.resumeUrl || "",
        });
      }
    },
  });

  // Fetch employer profile
  const { data: employerProfile, isLoading: loadingEmployerProfile } = useQuery<EmployerProfile>({
    queryKey: ["/api/profile/employer"],
    enabled: !!user && user.userType === "employer",
    onSuccess: (data) => {
      if (data) {
        setEmployerForm({
          companyName: data.companyName || "",
          industry: data.industry || "",
          companySize: data.companySize || "",
          description: data.description || "",
          location: data.location || "",
          website: data.website || "",
          logoUrl: data.logoUrl || "",
        });
      }
    },
  });

  // Update job seeker profile mutation
  const updateJobSeekerMutation = useMutation({
    mutationFn: async (data: Partial<JobSeekerProfile>) => {
      const response = await apiRequest("PUT", "/api/profile/job-seeker", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile/job-seeker"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update employer profile mutation
  const updateEmployerMutation = useMutation({
    mutationFn: async (data: Partial<EmployerProfile>) => {
      const response = await apiRequest("PUT", "/api/profile/employer", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Company profile updated",
        description: "Your company information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile/employer"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update your company profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleJobSeekerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateJobSeekerMutation.mutate({
      fullName: jobSeekerForm.fullName,
      headline: jobSeekerForm.headline,
      bio: jobSeekerForm.bio,
      skills: jobSeekerForm.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      experience: jobSeekerForm.experience,
      education: jobSeekerForm.education,
      location: jobSeekerForm.location,
      phone: jobSeekerForm.phone,
      resumeUrl: jobSeekerForm.resumeUrl,
    });
  };

  const handleEmployerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployerMutation.mutate({
      companyName: employerForm.companyName,
      industry: employerForm.industry,
      companySize: employerForm.companySize,
      description: employerForm.description,
      location: employerForm.location,
      website: employerForm.website,
      logoUrl: employerForm.logoUrl,
    });
  };

  const handleJobSeekerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobSeekerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You need to log in to view this page.</p>
      </div>
    );
  }

  const isJobSeeker = user.userType === "job_seeker";
  const isEmployer = user.userType === "employer";
  const isAdmin = user.userType === "admin";
  const isLoading = loadingJobSeekerProfile || loadingEmployerProfile;

  const getProfileInitials = () => {
    if (isJobSeeker && jobSeekerProfile?.fullName) {
      const names = jobSeekerProfile.fullName.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`
        : names[0][0];
    } else if (isEmployer && employerProfile?.companyName) {
      return employerProfile.companyName[0];
    } else {
      return user.username[0].toUpperCase();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  {isEmployer && employerProfile?.logoUrl ? (
                    <AvatarImage src={employerProfile.logoUrl} alt="Company Logo" />
                  ) : (
                    <>
                      <AvatarFallback className="text-lg">
                        {getProfileInitials()}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {isJobSeeker && jobSeekerProfile?.fullName
                    ? jobSeekerProfile.fullName
                    : isEmployer && employerProfile?.companyName
                    ? employerProfile.companyName
                    : user.username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isJobSeeker
                    ? "Job Seeker"
                    : isEmployer
                    ? "Employer"
                    : isAdmin
                    ? "Administrator"
                    : "User"}
                </p>
                {isJobSeeker && jobSeekerProfile?.headline && (
                  <p className="text-sm mt-2">{jobSeekerProfile.headline}</p>
                )}
                {isEmployer && employerProfile?.industry && (
                  <p className="text-sm mt-2">{employerProfile.industry}</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("account")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                {isJobSeeker && (
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                )}
                {isEmployer && (
                  <Button
                    variant={activeTab === "company" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("company")}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Company
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <p>Loading profile information...</p>
            </div>
          ) : (
            <>
              {activeTab === "account" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={user.username}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="usertype">Account Type</Label>
                        <Input
                          id="usertype"
                          value={
                            isJobSeeker
                              ? "Job Seeker"
                              : isEmployer
                              ? "Employer"
                              : "Administrator"
                          }
                          disabled
                        />
                      </div>

                      <div className="pt-4">
                        <Button variant="outline">Change Password</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "profile" && isJobSeeker && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleJobSeekerSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={jobSeekerForm.fullName}
                            onChange={handleJobSeekerChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="headline">Professional Headline</Label>
                          <Input
                            id="headline"
                            name="headline"
                            value={jobSeekerForm.headline}
                            onChange={handleJobSeekerChange}
                            placeholder="e.g. Senior Software Engineer"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Professional Summary</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={jobSeekerForm.bio}
                          onChange={handleJobSeekerChange}
                          rows={4}
                          placeholder="Brief overview of your professional background and career goals"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={jobSeekerForm.location}
                            onChange={handleJobSeekerChange}
                            placeholder="e.g. New York, NY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={jobSeekerForm.phone}
                            onChange={handleJobSeekerChange}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input
                          id="skills"
                          name="skills"
                          value={jobSeekerForm.skills}
                          onChange={handleJobSeekerChange}
                          placeholder="e.g. JavaScript, React, Node.js"
                        />
                      </div>

                      <div>
                        <Label htmlFor="experience">Work Experience</Label>
                        <Textarea
                          id="experience"
                          name="experience"
                          value={jobSeekerForm.experience}
                          onChange={handleJobSeekerChange}
                          rows={4}
                          placeholder="Summarize your work history"
                        />
                      </div>

                      <div>
                        <Label htmlFor="education">Education</Label>
                        <Textarea
                          id="education"
                          name="education"
                          value={jobSeekerForm.education}
                          onChange={handleJobSeekerChange}
                          rows={3}
                          placeholder="List your education background"
                        />
                      </div>

                      <div>
                        <Label htmlFor="resumeUrl">Resume URL</Label>
                        <Input
                          id="resumeUrl"
                          name="resumeUrl"
                          type="url"
                          value={jobSeekerForm.resumeUrl}
                          onChange={handleJobSeekerChange}
                          placeholder="Link to your resume"
                        />
                      </div>

                      <Button 
                        type="submit"
                        disabled={updateJobSeekerMutation.isPending}
                        className="mt-4"
                      >
                        {updateJobSeekerMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "company" && isEmployer && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleEmployerSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={employerForm.companyName}
                            onChange={handleEmployerChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            name="industry"
                            value={employerForm.industry}
                            onChange={handleEmployerChange}
                            required
                            placeholder="e.g. Technology, Healthcare, Finance"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companySize">Company Size</Label>
                          <Input
                            id="companySize"
                            name="companySize"
                            value={employerForm.companySize}
                            onChange={handleEmployerChange}
                            placeholder="e.g. 1-10, 11-50, 51-200, 201-500, 500+"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={employerForm.location}
                            onChange={handleEmployerChange}
                            placeholder="e.g. San Francisco, CA"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={employerForm.description}
                          onChange={handleEmployerChange}
                          rows={4}
                          placeholder="Describe your company, mission, and culture"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            type="url"
                            value={employerForm.website}
                            onChange={handleEmployerChange}
                            placeholder="https://your-company.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="logoUrl">Logo URL</Label>
                          <Input
                            id="logoUrl"
                            name="logoUrl"
                            type="url"
                            value={employerForm.logoUrl}
                            onChange={handleEmployerChange}
                            placeholder="Link to your company logo"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit"
                        disabled={updateEmployerMutation.isPending}
                        className="mt-4"
                      >
                        {updateEmployerMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Save className="mr-2 h-4 w-4" />
                        Save Company Profile
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}