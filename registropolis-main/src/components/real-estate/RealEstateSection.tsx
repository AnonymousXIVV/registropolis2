import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import PropertyListingForm from './PropertyListingForm';
import FilterBar from './FilterBar';
import PropertyGrid from './PropertyGrid';
import Pagination from './Pagination';
import { PropertyListing } from './PropertyCard';

// Update property types
const PROPERTY_TYPES = {
  all: 'All Types',
  hotel: 'Hotels',
  motel: 'Motels',
  lodge: 'Lodges',
  apartment: 'Apartments',
  house: 'Houses',
  villa: 'Villas',
  room: 'Rooms',
  condo: 'Condos',
  commercial: 'Commercial'
};

// Update sample property listings data with new types
const propertyListings: PropertyListing[] = [
  {
    id: "1",
    title: "Modern Apartment with City View",
    price: "$2,200/month",
    listingType: "rent",
    propertyType: "apartment",
    location: "Downtown, Seattle",
    address: "123 Main St, Seattle, WA 98101",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    yearBuilt: 2018,
    description: "Beautiful apartment with breathtaking city views, modern kitchen, in-unit laundry, and access to gym and pool.",
    amenities: "Gym, Pool, In-unit Laundry, Central AC, Parking",
    listedDate: "3 days ago",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop"],
    contactId: "re-cityview-apts",
    contactName: "City View Properties"
  },
  {
    id: "2",
    title: "Spacious Family Home",
    price: "$550,000",
    listingType: "sale",
    propertyType: "house",
    location: "Bellevue, WA",
    address: "456 Park Ave, Bellevue, WA 98004",
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    yearBuilt: 2010,
    description: "Perfect family home in a quiet neighborhood with excellent schools. Features open floor plan, updated kitchen, large backyard with deck.",
    amenities: "Fenced yard, Garage, Fireplace, Hardwood floors",
    listedDate: "1 week ago",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2340&auto=format&fit=crop"],
    contactId: "re-quality-homes",
    contactName: "Quality Homes Realty"
  },
  {
    id: "3",
    title: "Luxury Downtown Condo",
    price: "$3,500/month",
    listingType: "rent",
    propertyType: "condo",
    location: "South Lake Union, Seattle",
    address: "789 Lake St, Seattle, WA 98109",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    yearBuilt: 2020,
    description: "Upscale condo with high-end finishes, floor-to-ceiling windows, and spectacular lake views. Building features 24/7 security and concierge service.",
    amenities: "Concierge, Rooftop terrace, Gym, Pet-friendly, Smart home features",
    listedDate: "5 days ago",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2340&auto=format&fit=crop"],
    contactId: "re-luxury-living",
    contactName: "Luxury Living Properties"
  },
  {
    id: "4",
    title: "Charming Craftsman Home",
    price: "$675,000",
    listingType: "sale",
    propertyType: "house",
    location: "Queen Anne, Seattle",
    address: "321 Queen Ave, Seattle, WA 98119",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    yearBuilt: 1925,
    description: "Beautifully maintained Craftsman with original woodwork, built-ins, and period details. Updated systems and modern kitchen while preserving historic charm.",
    amenities: "Original hardwood, Basement, Covered porch, Updated electrical",
    listedDate: "2 weeks ago",
    images: ["https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=2340&auto=format&fit=crop"],
    contactId: "re-historic-homes",
    contactName: "Historic Homes Agency"
  },
  {
    id: "5",
    title: "Modern Townhouse",
    price: "$2,800/month",
    listingType: "rent",
    propertyType: "townhouse",
    location: "Capitol Hill, Seattle",
    address: "567 Broadway, Seattle, WA 98122",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1650,
    yearBuilt: 2016,
    description: "Contemporary townhouse with rooftop deck and city views. Open concept living, high ceilings, and gourmet kitchen with stainless steel appliances.",
    amenities: "Rooftop deck, Attached garage, Energy efficient, Smart thermostats",
    listedDate: "1 day ago",
    images: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2340&auto=format&fit=crop"],
    contactId: "re-urban-living",
    contactName: "Urban Living Properties"
  },
  {
    id: "6",
    title: "Luxury Hotel Suite with Ocean View",
    price: "$150/night",
    listingType: "daily",
    propertyType: "hotel",
    location: "Oceanfront, Seattle",
    address: "789 Beach Dr, Seattle, WA 98101",
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    yearBuilt: 2019,
    description: "Luxurious hotel suite with stunning ocean views, king-size bed, and modern amenities. Includes access to pool, spa, and room service.",
    amenities: "Room Service, Pool, Spa, WiFi, Mini Bar, Ocean View",
    listedDate: "Just listed",
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2340&auto=format&fit=crop"],
    contactId: "hotel-oceanview",
    contactName: "Oceanview Hotel",
    dailyRate: 150,
    minStay: 1,
    maxStay: 30,
    instantBook: true,
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in"
  },
  {
    id: "7",
    title: "Cozy Lodge in the Mountains",
    price: "$200/night",
    listingType: "daily",
    propertyType: "lodge",
    location: "Mount Rainier",
    address: "456 Mountain View Rd, Ashford, WA 98304",
    bedrooms: 2,
    bathrooms: 1,
    area: 800,
    yearBuilt: 2015,
    description: "Charming mountain lodge with fireplace and stunning views. Perfect for weekend getaways and outdoor adventures.",
    amenities: "Fireplace, Kitchen, Hiking Trails, Parking, WiFi",
    listedDate: "2 days ago",
    images: ["https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?q=80&w=2340&auto=format&fit=crop"],
    contactId: "mountain-lodges",
    contactName: "Mountain Escape Lodges",
    dailyRate: 200,
    minStay: 2,
    maxStay: 14,
    instantBook: true,
    checkInTime: "4:00 PM",
    checkOutTime: "10:00 AM",
    cancellationPolicy: "72-hour cancellation policy"
  }
];

const ITEMS_PER_PAGE = 6;

const RealEstateSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, propertyTypeFilter]);
  
  // Filter properties based on search query, active tab (rent/sale/daily/all), and property type
  const filteredProperties = propertyListings.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'rent' && property.listingType === 'rent') ||
      (activeTab === 'sale' && property.listingType === 'sale') ||
      (activeTab === 'daily' && property.listingType === 'daily');
    
    const matchesPropertyType =
      propertyTypeFilter === 'all' || property.propertyType === propertyTypeFilter;
    
    return matchesSearch && matchesTab && matchesPropertyType;
  });
  
  // Paginate the filtered properties
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    // Simulate loading delay for pagination
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };
  
  const handleFavorite = (id: string) => {
    toast.success('Property added to favorites');
  };
  
  const handleShare = (id: string) => {
    toast.success('Share link copied to clipboard');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Real Estate</h1>
        
        {isAuthenticated && (
          <PropertyListingForm />
        )}
      </div>
      
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        propertyTypeFilter={propertyTypeFilter}
        setPropertyTypeFilter={setPropertyTypeFilter}
        propertyTypes={PROPERTY_TYPES}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="daily">Daily Rentals</TabsTrigger>
          <TabsTrigger value="rent">Long Term Rent</TabsTrigger>
          <TabsTrigger value="sale">For Sale</TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <PropertyGrid 
            properties={paginatedProperties}
            isLoading={isLoading}
            onFavorite={handleFavorite}
            onShare={handleShare}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        
        <TabsContent value="rent" className="space-y-4">
          <PropertyGrid 
            properties={paginatedProperties} 
            isLoading={isLoading}
            onFavorite={handleFavorite}
            onShare={handleShare}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        
        <TabsContent value="sale" className="space-y-4">
          <PropertyGrid 
            properties={paginatedProperties} 
            isLoading={isLoading}
            onFavorite={handleFavorite}
            onShare={handleShare}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-4">
          <PropertyGrid 
            properties={paginatedProperties} 
            isLoading={isLoading}
            onFavorite={handleFavorite}
            onShare={handleShare}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        
        {isAuthenticated && (
          <TabsContent value="my-listings">
            <Card className="h-[300px] flex items-center justify-center">
              <CardContent className="text-center p-8">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-medium mb-2">No Properties Listed Yet</p>
                <p className="text-muted-foreground mb-4">You haven't listed any properties yet. Create a listing to start showcasing your property.</p>
                <PropertyListingForm />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default RealEstateSection;
