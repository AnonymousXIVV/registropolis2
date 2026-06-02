
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building,
  Filter,
  CalendarDays,
  Bookmark
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import JobPostingForm from './JobPostingForm';
import ContactButton from '../common/ContactButton';

// Sample job listings data
const jobListings = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    postedDate: "2 days ago",
    description: "We're looking for an experienced Frontend Developer to join our team, working on cutting-edge web applications using React, TypeScript, and modern web technologies.",
    requirements: "5+ years of frontend development experience, strong knowledge of React ecosystem, experience with state management solutions.",
    contactId: "job-tech-innovations",
    contactName: "Tech Innovations HR"
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Remote",
    salary: "$90,000 - $110,000",
    type: "Full-time",
    postedDate: "1 week ago",
    description: "Join our design team to create beautiful, intuitive interfaces for our product suite. You'll be working closely with product managers and developers to bring designs to life.",
    requirements: "3+ years of design experience, proficiency in Figma or similar tools, portfolio showcasing user-centered design work.",
    contactId: "job-creative-solutions",
    contactName: "Creative Solutions Talent"
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "Cloud Systems Ltd.",
    location: "Chicago, IL",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    postedDate: "3 days ago",
    description: "Help us build and maintain our cloud infrastructure. You'll be responsible for CI/CD pipelines, infrastructure as code, and ensuring system reliability.",
    requirements: "Experience with AWS/Azure, Docker, Kubernetes, and infrastructure automation tools like Terraform or CloudFormation.",
    contactId: "job-cloud-systems",
    contactName: "Cloud Systems Recruiting"
  },
  {
    id: "4",
    title: "Content Writer",
    company: "Digital Media Group",
    location: "New York, NY",
    salary: "$60,000 - $75,000",
    type: "Part-time",
    postedDate: "5 days ago",
    description: "Create engaging content for our digital platforms including blog posts, social media content, and newsletters focused on technology trends.",
    requirements: "Strong writing skills, understanding of SEO best practices, ability to translate complex topics into accessible content.",
    contactId: "job-digital-media",
    contactName: "Digital Media Group"
  },
  {
    id: "5",
    title: "Product Manager",
    company: "Innovate Software",
    location: "Boston, MA",
    salary: "$110,000 - $140,000",
    type: "Full-time",
    postedDate: "1 day ago",
    description: "Lead product development for our flagship SaaS solution. Work with cross-functional teams to define product roadmap and drive execution.",
    requirements: "3+ years in product management, experience with agile methodologies, strong analytical and communication skills.",
    contactId: "job-innovate-software",
    contactName: "Innovate Software HR"
  }
];

const JobsSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  
  const filteredJobs = jobListings.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        
        {isAuthenticated && (
          <JobPostingForm />
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, company, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="posted">My Job Postings</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <Card key={job.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="h-fit">
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-y-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center mr-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center mr-4">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {job.postedDate}
                    </div>
                  </div>
                  <p className="text-sm mt-2">{job.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                  <ContactButton 
                    contactId={job.contactId} 
                    contactName={job.contactName} 
                    size="sm" 
                  />
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No job listings found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applications">
          <Card className="h-[300px] flex items-center justify-center">
            <CardContent className="text-center p-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-medium mb-2">No Applications Yet</p>
              <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet. Browse listings to find opportunities.</p>
              <Button onClick={() => setActiveTab('browse')}>Browse Jobs</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card className="h-[300px] flex items-center justify-center">
            <CardContent className="text-center p-8">
              <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-medium mb-2">No Saved Jobs</p>
              <p className="text-muted-foreground mb-4">You haven't saved any jobs for later. Save jobs to keep track of opportunities.</p>
              <Button onClick={() => setActiveTab('browse')}>Browse Jobs</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isAuthenticated && (
          <TabsContent value="posted">
            <Card className="h-[300px] flex items-center justify-center">
              <CardContent className="text-center p-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-medium mb-2">No Job Postings Yet</p>
                <p className="text-muted-foreground mb-4">You haven't posted any job openings yet. Create a job posting to find candidates.</p>
                <JobPostingForm />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default JobsSection;
