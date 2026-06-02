
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ContactButton from '../common/ContactButton';
import EventTicketForm from './EventTicketForm';
import { 
  Search, 
  Star, 
  Filter, 
  Calendar, 
  ChevronRight,
  Ticket,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CalendarDays
} from 'lucide-react';

// Sample events data
const eventsData = [
  {
    id: "event-1",
    title: "Summer Music Festival",
    category: "Music",
    organizer: "Rhythm Productions",
    rating: 4.8,
    reviews: 256,
    location: "City Park Amphitheater",
    date: "July 15-17, 2023",
    time: "12:00 PM - 11:00 PM",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=500",
    description: "Three days of live music featuring top artists across multiple genres. Food vendors, art installations, and more.",
    price: "$75 - $250",
    capacity: "5,000 attendees",
    contactId: "event-1",
    contactName: "Rhythm Productions",
    followers: 3452,
    verified: true
  },
  {
    id: "event-2",
    title: "Tech Innovation Conference",
    category: "Business",
    organizer: "Future Tech Forum",
    rating: 4.7,
    reviews: 128,
    location: "Metropolitan Convention Center",
    date: "September 5-7, 2023",
    time: "9:00 AM - 6:00 PM",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500",
    description: "Connect with industry leaders and discover the latest advancements in technology. Workshops, keynotes, and networking opportunities.",
    price: "$350 - $600",
    capacity: "2,000 attendees",
    contactId: "event-2",
    contactName: "Future Tech Forum",
    followers: 1876,
    verified: true
  },
  {
    id: "event-3",
    title: "Food & Wine Festival",
    category: "Food",
    organizer: "Culinary Events Co.",
    rating: 4.9,
    reviews: 192,
    location: "Riverfront Plaza",
    date: "August 12-13, 2023",
    time: "11:00 AM - 8:00 PM",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
    description: "Sample delicious cuisine from top local restaurants paired with exceptional wines. Chef demonstrations and tasting workshops.",
    price: "$95 - $150",
    capacity: "3,000 attendees",
    contactId: "event-3",
    contactName: "Culinary Events Co.",
    followers: 2145,
    verified: true
  },
  {
    id: "event-4",
    title: "Comic & Gaming Convention",
    category: "Entertainment",
    organizer: "Fandom Events",
    rating: 4.6,
    reviews: 215,
    location: "Exhibition Hall",
    date: "October 20-22, 2023",
    time: "10:00 AM - 7:00 PM",
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=500",
    description: "Celebrate pop culture with celebrity guests, gaming tournaments, cosplay contests, and exclusive merchandise.",
    price: "$45 - $120",
    capacity: "10,000 attendees",
    contactId: "event-4",
    contactName: "Fandom Events",
    followers: 4532,
    verified: true
  }
];

const categories = [
  "All Categories",
  "Music",
  "Sports",
  "Business",
  "Entertainment",
  "Food",
  "Arts",
  "Education",
  "Community",
  "Charity"
];

const EventsSection: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showEventForm, setShowEventForm] = useState(false);

  // Filter events based on search and category
  const filteredEvents = eventsData.filter(event => {
    const matchesQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || event.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events & Tickets</h1>
        <Button className="flex gap-2" onClick={() => setShowEventForm(true)}>
          <Ticket className="h-4 w-4" />
          List Event
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
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
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/4 flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {event.title}
                            {event.verified && (
                              <Badge variant="secondary" className="ml-2">Verified</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Organizer: {event.organizer} 
                            <span className="ml-2 text-xs text-muted-foreground">({event.followers} followers)</span>
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" /> 
                              {event.rating} ({event.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.price}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.capacity}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <ContactButton 
                          contactId={event.contactId}
                          contactName={event.contactName}
                          size="sm"
                        />
                        <Button size="sm" className="flex items-center gap-1">
                          Get Tickets <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No events found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="featured">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Featured events will be displayed here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="nearby">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nearby events will be displayed here based on your location.</p>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showEventForm && (
        <EventTicketForm 
          isOpen={showEventForm} 
          onClose={() => setShowEventForm(false)} 
        />
      )}
    </div>
  );
};

export default EventsSection;
