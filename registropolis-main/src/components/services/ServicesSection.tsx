
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import ContactButton from '../common/ContactButton';
import ServicePostingForm from './ServicePostingForm';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  Phone, 
  Mail, 
  Globe,
  ChevronRight,
  Wrench,
  Clock,
  DollarSign,
  CalendarClock,
  ThumbsUp
} from 'lucide-react';

// Sample services data - in a real app, this would come from an API
const servicesData = [
  {
    id: "service-1",
    title: "Professional Cleaning Services",
    category: "Cleaning",
    provider: "CleanPro Services",
    rating: 4.8,
    reviews: 156,
    location: "City Center",
    distance: "0.8 miles",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500",
    description: "Professional home and office cleaning services. Regular cleaning, deep cleaning, and move-in/move-out services available.",
    price: "$25-$40/hour",
    availability: "Mon-Sat: 8AM-6PM",
    experience: "15+ years",
    contactId: "service-1",
    contactName: "CleanPro Services",
    phone: "+1 555-123-4567",
    email: "info@cleanpro.com",
    website: "cleanproservices.com",
    followers: 245,
    verified: true
  },
  {
    id: "service-2",
    title: "Electrical Installations & Repairs",
    category: "Electrical",
    provider: "Power Solutions",
    rating: 4.9,
    reviews: 203,
    location: "North District",
    distance: "1.2 miles",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500",
    description: "Licensed electrician providing installations, repairs, and maintenance for residential and commercial properties.",
    price: "$45-$75/hour",
    availability: "Mon-Fri: 7AM-7PM, Sat: 8AM-5PM",
    experience: "20+ years",
    contactId: "service-2",
    contactName: "Power Solutions",
    phone: "+1 555-987-6543",
    email: "service@powersolutions.com",
    website: "powersolutions.com",
    followers: 378,
    verified: true
  },
  {
    id: "service-3",
    title: "Event Planning & Organization",
    category: "Events",
    provider: "Perfect Occasions",
    rating: 4.7,
    reviews: 118,
    location: "Downtown",
    distance: "0.5 miles",
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=500",
    description: "Full-service event planning for weddings, corporate events, and private parties. Decoration, catering, and venue coordination.",
    price: "Starting at $500",
    availability: "By appointment",
    experience: "8+ years",
    contactId: "service-3",
    contactName: "Perfect Occasions",
    phone: "+1 555-234-5678",
    email: "events@perfectoccasions.com",
    website: "perfectoccasions.com",
    followers: 512,
    verified: true
  },
  {
    id: "service-4",
    title: "Plumbing Services",
    category: "Plumbing",
    provider: "Quick Fix Plumbers",
    rating: 4.6,
    reviews: 92,
    location: "East Side",
    distance: "1.7 miles",
    image: "https://images.unsplash.com/photo-1574105760089-526d4a69edbc?q=80&w=500",
    description: "Emergency and regular plumbing services. Repairs, installations, and maintenance for all types of plumbing systems.",
    price: "$40-$65/hour",
    availability: "24/7 Emergency Service",
    experience: "12+ years",
    contactId: "service-4",
    contactName: "Quick Fix Plumbers",
    phone: "+1 555-876-5432",
    email: "help@quickfixplumbers.com",
    website: "quickfixplumbers.com",
    followers: 189,
    verified: true
  },
  {
    id: "service-5",
    title: "Landscaping & Garden Design",
    category: "Landscaping",
    provider: "Green Thumb Gardens",
    rating: 4.9,
    reviews: 176,
    location: "West District",
    distance: "2.3 miles",
    image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=500",
    description: "Professional landscaping services including design, maintenance, planting, and hardscaping for residential and commercial properties.",
    price: "Custom quotes available",
    availability: "Mon-Fri: 8AM-6PM",
    experience: "18+ years",
    contactId: "service-5",
    contactName: "Green Thumb Gardens",
    phone: "+1 555-345-6789",
    email: "info@greenthumbgardens.com",
    website: "greenthumbgardens.com",
    followers: 426,
    verified: true
  }
];

const categories = [
  "All Categories",
  "Cleaning",
  "Electrical",
  "Plumbing",
  "Landscaping",
  "Carpentry",
  "Painting",
  "Events",
  "Tutoring",
  "IT Support",
  "Moving"
];

const ServicesSection: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showPostingForm, setShowPostingForm] = useState(false);

  // Filter services based on search query and selected category
  const filteredServices = servicesData.filter(service => {
    const matchesQuery = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services</h1>
        <Button className="flex gap-2" onClick={() => setShowPostingForm(true)}>
          <Wrench className="h-4 w-4" />
          Post a Service
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-2">
          <select 
            className="bg-background border border-input rounded-md px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <Card key={service.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/4 flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {service.title}
                            {service.verified && (
                              <Badge variant="secondary" className="ml-2">Verified</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Provider: {service.provider} 
                            <span className="ml-2 text-xs text-muted-foreground">({service.followers} followers)</span>
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                              {service.category}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" /> 
                              {service.rating} ({service.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {service.distance}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          {service.price}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {service.availability}
                        </div>
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Experience: {service.experience}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                          {service.reviews} Reviews
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <ContactButton 
                          contactId={service.contactId}
                          contactName={service.contactName}
                          size="sm"
                        />
                        <Button size="sm" className="flex items-center gap-1">
                          View Details <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No services found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="map">
          <Card className="h-[600px] flex items-center justify-center">
            <CardContent className="text-center p-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-medium mb-2">Map View</p>
              <p className="text-muted-foreground">Map integration will show services on an interactive map here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showPostingForm && (
        <ServicePostingForm 
          isOpen={showPostingForm} 
          onClose={() => setShowPostingForm(false)} 
        />
      )}
    </div>
  );
};

export default ServicesSection;
