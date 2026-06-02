import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Heart, 
  Share2, 
  MessageCircle,
  Filter,
  Grid,
  List,
  ChevronDown
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import ContactButton from '../common/ContactButton';

const productsData = [
  {
    id: 1,
    title: "iPhone 13 Pro - Perfect Condition",
    price: "$699",
    category: "Electronics",
    location: "Brooklyn, NY",
    distance: "1.2 miles",
    posted: "2 days ago",
    images: ["https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?q=80&w=500&auto=format&fit=crop"],
    description: "Selling my iPhone 13 Pro in perfect condition. 256GB, Pacific Blue. Includes original box, charger, and case.",
    seller: {
      name: "Alex Johnson",
      rating: "4.9",
      joined: "March 2019",
      otherListings: 8
    }
  },
  {
    id: 2,
    title: "Modern Coffee Table - Solid Wood",
    price: "$250",
    category: "Furniture",
    location: "Manhattan, NY",
    distance: "2.5 miles",
    posted: "1 week ago",
    images: ["https://images.unsplash.com/photo-1634712282287-14ed57b9cc14?q=80&w=500&auto=format&fit=crop"],
    description: "Beautiful modern coffee table made of solid walnut wood. Dimensions: 48\" L x 24\" W x 18\" H. Minor scratches on one leg.",
    seller: {
      name: "Sarah Miller",
      rating: "4.7",
      joined: "November 2020",
      otherListings: 12
    }
  },
  {
    id: 3,
    title: "Mountain Bike - Trek X-Caliber 8",
    price: "$850",
    category: "Sports & Outdoors",
    location: "Queens, NY",
    distance: "3.7 miles",
    posted: "3 days ago",
    images: ["https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=500&auto=format&fit=crop"],
    description: "Trek X-Caliber 8 mountain bike in great condition. Size M/L (17.5\"). Upgraded brakes and tires. Perfect for trails or commuting.",
    seller: {
      name: "David Chen",
      rating: "4.8",
      joined: "May 2018",
      otherListings: 5
    }
  },
  {
    id: 4,
    title: "Designer Handbag - Louis Vuitton",
    price: "$1,200",
    category: "Clothing & Accessories",
    location: "Manhattan, NY",
    distance: "1.8 miles",
    posted: "1 day ago",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop"],
    description: "Authentic Louis Vuitton Neverfull MM in excellent condition. Includes dust bag and receipt. Only used a few times.",
    seller: {
      name: "Emma Wilson",
      rating: "5.0",
      joined: "January 2021",
      otherListings: 3
    }
  },
  {
    id: 5,
    title: "Sony PlayStation 5 - Disc Edition",
    price: "$480",
    category: "Electronics",
    location: "Bronx, NY",
    distance: "5.2 miles",
    posted: "5 days ago",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=500&auto=format&fit=crop"],
    description: "PlayStation 5 disc edition in perfect working order. Includes 2 controllers, charging dock, and 3 games.",
    seller: {
      name: "Michael Brown",
      rating: "4.6",
      joined: "August 2020",
      otherListings: 7
    }
  },
  {
    id: 6,
    title: "Vintage Vinyl Record Collection",
    price: "$350",
    category: "Music & Instruments",
    location: "Brooklyn, NY",
    distance: "2.1 miles",
    posted: "1 week ago",
    images: ["https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=500&auto=format&fit=crop"],
    description: "Collection of 50+ classic rock and jazz vinyl records from the 60s and 70s. All in good to excellent condition. List of titles available.",
    seller: {
      name: "James Wilson",
      rating: "4.9",
      joined: "July 2017",
      otherListings: 15
    }
  }
];

const categories = [
  "All Categories",
  "Electronics",
  "Furniture",
  "Clothing & Accessories",
  "Sports & Outdoors",
  "Music & Instruments",
  "Vehicles",
  "Real Estate",
  "Services"
];

const MarketplaceSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState('grid');
  
  const filteredProducts = productsData.filter(product => {
    const matchesQuery = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-2 flex-shrink-0">
          <select 
            className="bg-background border border-input rounded-md px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="hidden md:flex border border-input rounded-md overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-none ${viewMode === 'grid' ? 'bg-accent' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-none ${viewMode === 'list' ? 'bg-accent' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          <TabsTrigger value="saved">Saved Items</TabsTrigger>
        </TabsList>
        <TabsContent value="browse">
          {filteredProducts.length > 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                  <div 
                    className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'aspect-video md:h-48'}`}
                  >
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className={`${viewMode === 'grid' ? 'text-base' : 'text-xl'}`}>{product.title}</CardTitle>
                        <span className="font-bold text-lg">{product.price}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-2">
                        <Badge variant="secondary" className="font-normal">
                          {product.category}
                        </Badge>
                        <span className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" /> 
                          {product.distance}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      {viewMode === 'list' && (
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Posted {product.posted}</span>
                        <span>Seller: {product.seller.name} ({product.seller.rating}★)</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <ContactButton 
                        contactId={`marketplace-${product.id}`} 
                        contactName={product.seller.name} 
                        size="sm"
                        productInfo={{
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          image: product.images[0]
                        }}
                      />
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No items found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="my-listings">
          <Card className="h-[300px] flex items-center justify-center">
            <CardContent className="text-center p-8">
              <p className="text-xl font-medium mb-2">You don't have any listings yet</p>
              <p className="text-muted-foreground mb-4">Create your first listing to start selling.</p>
              <Button>Create Listing</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="saved">
          <Card className="h-[300px] flex items-center justify-center">
            <CardContent className="text-center p-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-medium mb-2">No Saved Items</p>
              <p className="text-muted-foreground mb-4">Items you save will appear here for easy access.</p>
              <Button>Browse Marketplace</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceSection;
