
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
import { toast } from "sonner";
import ContactButton from '../common/ContactButton';
import TransportListingForm from './TransportListingForm';
import RatingDisplay from '../common/RatingDisplay';
import SaveButton from '../common/SaveButton';
import VerificationBadge from '../common/VerificationBadge';
import FilterPanel from '../common/FilterPanel';
import { 
  Search, 
  Filter, 
  Phone, 
  Calendar,
  ChevronRight,
  Truck,
  MapPin,
  DollarSign,
  Users,
  ThumbsUp,
  Loader2
} from 'lucide-react';

// Sample transport data
const transportData = [
  {
    id: "transport-1",
    title: "Moving Truck with Driver",
    category: "Moving",
    provider: "Quick Move Services",
    rating: 4.7,
    reviews: 118,
    location: "City-wide",
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=500",
    description: "Professional moving services with truck and experienced movers. Available for residential and commercial relocations.",
    price: "$75/hour",
    capacity: "2-ton truck with 2 movers",
    availability: "7 days a week, booking required",
    contactId: "transport-1",
    contactName: "Quick Move Services",
    phone: "+1 555-123-4567",
    followers: 156,
    verified: true
  },
  {
    id: "transport-2",
    title: "Event Shuttle Service",
    category: "Events",
    provider: "Premier Transport Co.",
    rating: 4.9,
    reviews: 87,
    location: "Metro Area",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=500",
    description: "Luxury shuttle services for corporate events, weddings, and special occasions. Multiple vehicle sizes available.",
    price: "Starting at $350 for 4 hours",
    capacity: "14-passenger van, 24-passenger shuttle",
    availability: "Booking required 72 hours in advance",
    contactId: "transport-2",
    contactName: "Premier Transport Co.",
    phone: "+1 555-987-6543",
    followers: 203,
    verified: true
  },
  {
    id: "transport-3",
    title: "Furniture Delivery Service",
    category: "Delivery",
    provider: "Reliable Haulers",
    rating: 4.6,
    reviews: 95,
    location: "Up to 25 miles radius",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=500",
    description: "Specialized furniture delivery and installation service. Careful handling guaranteed for all items.",
    price: "$60 base + $1/mile",
    capacity: "Large truck with hydraulic lift",
    availability: "Mon-Sat: 8AM-6PM",
    contactId: "transport-3",
    contactName: "Reliable Haulers",
    phone: "+1 555-234-5678",
    followers: 112,
    verified: false
  },
  {
    id: "transport-4",
    title: "Airport Transfer Service",
    category: "Personal Transport",
    provider: "Executive Rides",
    rating: 4.8,
    reviews: 142,
    location: "All airports in metro area",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=500",
    description: "Luxury airport transfer service with professional drivers. On-time pickup and comfortable vehicles.",
    price: "From $65 one-way",
    capacity: "Sedan (3 passengers), SUV (6 passengers)",
    availability: "24/7, reservation required",
    contactId: "transport-4",
    contactName: "Executive Rides",
    phone: "+1 555-876-5432",
    followers: 285,
    verified: true
  }
];

const categories = [
  "All Categories",
  "Moving",
  "Delivery",
  "Events",
  "Personal Transport",
  "Freight",
  "Courier",
  "Specialized"
];

const TransportSection: React.FC = () => {
  const { toast: uiToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showListingForm, setShowListingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

  // Filter transport services based on search, category, and other filters
  const filteredTransport = transportData.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    // Additional filter logic based on appliedFilters
    const matchesPrice = !appliedFilters.priceRange || 
      (parseFloat(item.price.replace(/[^0-9.]/g, '')) >= appliedFilters.priceRange[0] && 
       parseFloat(item.price.replace(/[^0-9.]/g, '')) <= appliedFilters.priceRange[1]);
    
    const matchesRating = !appliedFilters.rating || 
      item.rating >= parseFloat(appliedFilters.rating);
    
    const matchesVerification = !appliedFilters.verified || 
      (!appliedFilters.verified || item.verified);
    
    return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesVerification;
  });

  const handleFilterChange = (filters: Record<string, any>) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSelectedCategory(filters.category || 'All Categories');
      setAppliedFilters(filters);
      setIsLoading(false);
    }, 500);
  };

  const filterOptions = [
    {
      id: 'priceRange',
      label: 'Price Range',
      type: 'range' as const,
      min: 0,
      max: 200,
      step: 5
    },
    {
      id: 'rating',
      label: 'Minimum Rating',
      type: 'select' as const,
      options: [
        { value: '3', label: '3+ Stars' },
        { value: '3.5', label: '3.5+ Stars' },
        { value: '4', label: '4+ Stars' },
        { value: '4.5', label: '4.5+ Stars' }
      ]
    },
    {
      id: 'verified',
      label: 'Verified Providers Only',
      type: 'checkbox' as const,
      options: [{ value: 'true', label: 'Show verified providers only' }]
    }
  ];

  const handleBookService = (transportId: string) => {
    toast.success("Service booking initiated");
    // In a real app, you'd navigate to a booking page or open a modal
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transport Services</h1>
        <Button className="flex gap-2" onClick={() => setShowListingForm(true)}>
          <Truck className="h-4 w-4" />
          List Transport Service
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transport services..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <FilterPanel 
          categories={categories}
          filters={filterOptions}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTransport.length > 0 ? (
            filteredTransport.map(transport => (
              <Card key={transport.id} className="overflow-hidden group">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto relative">
                    <img 
                      src={transport.image} 
                      alt={transport.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <SaveButton 
                        itemId={transport.id} 
                        itemType="transport"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/4 flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {transport.title}
                            {transport.verified && (
                              <VerificationBadge isVerified={transport.verified} />
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Provider: {transport.provider} 
                            <span className="ml-2 text-xs text-muted-foreground">({transport.followers} followers)</span>
                          </CardDescription>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="secondary" className="rounded-full">
                              {transport.category}
                            </Badge>
                            <RatingDisplay rating={transport.rating} reviews={transport.reviews} />
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {transport.location}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{transport.description}</p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          {transport.price}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          {transport.capacity}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {transport.availability}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{transport.phone}</span>
                      </div>
                      <div className="flex gap-2">
                        <ContactButton 
                          contactId={transport.contactId}
                          contactName={transport.contactName}
                          size="sm"
                        />
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleBookService(transport.id)}
                        >
                          Book Now <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No transport services found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="map">
          <Card className="h-[600px] flex items-center justify-center">
            <CardContent className="text-center p-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-medium mb-2">Map View</p>
              <p className="text-muted-foreground">Map integration will show transport services on an interactive map here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showListingForm && (
        <TransportListingForm 
          isOpen={showListingForm} 
          onClose={() => setShowListingForm(false)} 
        />
      )}
    </div>
  );
};

export default TransportSection;
