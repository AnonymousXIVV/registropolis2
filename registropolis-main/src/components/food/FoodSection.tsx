
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pizza, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Utensils, 
  ShoppingCart, 
  Plus, 
  MessageSquare,
  CircleDollarSign,
  ChefHat,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import FoodPriceNegotiator from './FoodPriceNegotiator';
import RestaurantRegisterForm from './RestaurantRegisterForm';
import HomeChefRegisterForm from './HomeChefRegisterForm';
import RatingDisplay from '../common/RatingDisplay';
import SaveButton from '../common/SaveButton';
import VerificationBadge from '../common/VerificationBadge';

// Mock data for restaurants
const restaurants = [
  {
    id: "rest-1",
    name: "Tasty Bites",
    rating: 4.8,
    reviews: 127,
    deliveryTime: "15-25 min",
    deliveryFee: "$2.99",
    cuisine: "American",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    distance: "0.8 miles",
    verified: true
  },
  {
    id: "rest-2",
    name: "Spice Garden",
    rating: 4.5,
    reviews: 89,
    deliveryTime: "20-30 min",
    deliveryFee: "$1.99",
    cuisine: "Indian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356cf4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    distance: "1.2 miles",
    verified: false
  },
  {
    id: "rest-3",
    name: "Sushi Master",
    rating: 4.9,
    reviews: 204,
    deliveryTime: "25-35 min",
    deliveryFee: "$3.99",
    cuisine: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    distance: "1.5 miles",
    verified: true
  },
  {
    id: "rest-4",
    name: "Pizza Paradise",
    rating: 4.4,
    reviews: 156,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.49",
    cuisine: "Italian",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    distance: "0.6 miles",
    verified: false
  }
];

// Mock data for featured items
const featuredItems = [
  {
    id: "item-1",
    name: "Double Cheeseburger",
    restaurant: "Tasty Bites",
    rating: 4.7,
    reviews: 42,
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "item-2",
    name: "Butter Chicken",
    restaurant: "Spice Garden",
    rating: 4.8,
    reviews: 36,
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "item-3",
    name: "California Roll",
    restaurant: "Sushi Master",
    rating: 4.6,
    reviews: 28,
    price: "$10.99",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const RestaurantCard: React.FC<{ restaurant: typeof restaurants[0] }> = ({ restaurant }) => {
  const navigate = useNavigate();
  const [showNegotiator, setShowNegotiator] = useState(false);
  const [negotiatedDeliveryFee, setNegotiatedDeliveryFee] = useState<string | null>(null);

  const handleAcceptNegotiation = (newPrice: string, newDeliveryFee: string) => {
    setNegotiatedDeliveryFee(newDeliveryFee);
    setShowNegotiator(false);
    toast.success(`Delivery fee negotiated to ${newDeliveryFee}`);
  };

  const handleMessageRestaurant = () => {
    toast.success(`Opening chat with ${restaurant.name}...`);
    navigate("/messages");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <SaveButton 
            itemId={restaurant.id} 
            itemType="food" 
            variant="outline"
            className="bg-white/80 hover:bg-white"
          />
        </div>
        {restaurant.verified && (
          <div className="absolute top-2 left-2">
            <VerificationBadge isVerified={restaurant.verified} />
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-1">
              {restaurant.name}
              {restaurant.verified && (
                <VerificationBadge isVerified={restaurant.verified} type="icon" className="h-4 w-4" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
          </div>
          <RatingDisplay 
            rating={restaurant.rating} 
            reviews={restaurant.reviews}
            size="sm"
          />
        </div>
        <div className="flex justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{restaurant.distance}</span>
          </div>
          <div>
            <span>{negotiatedDeliveryFee || restaurant.deliveryFee}</span>
            {negotiatedDeliveryFee && (
              <span className="text-xs line-through ml-1 text-muted-foreground">
                {restaurant.deliveryFee}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleMessageRestaurant}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
          
          {showNegotiator ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowNegotiator(false)}
            >
              Cancel
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowNegotiator(true)}
            >
              <CircleDollarSign className="h-4 w-4 mr-1" />
              Negotiate
            </Button>
          )}
        </div>
        
        {showNegotiator && (
          <div className="mt-3">
            <FoodPriceNegotiator 
              originalPrice="$25.00" // Example order price
              deliveryFee={restaurant.deliveryFee}
              restaurantName={restaurant.name}
              onAccept={handleAcceptNegotiation}
              onMessageRestaurant={handleMessageRestaurant}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const FoodItemCard: React.FC<{ item: typeof featuredItems[0] }> = ({ item }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    toast.success(`${item.name} added to cart`);
  };

  const handleMessageVendor = () => {
    toast.success(`Opening chat with ${item.restaurant}...`);
    navigate("/messages");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative h-36 overflow-hidden rounded-t-lg">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105" 
        />
        <div className="absolute top-2 right-2">
          <SaveButton 
            itemId={item.id} 
            itemType="food" 
            variant="outline"
            className="bg-white/80 hover:bg-white"
            size="sm"
          />
        </div>
      </div>
      <CardContent className="pt-3 pb-3">
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-sm text-muted-foreground">{item.restaurant}</p>
        <div className="mt-1">
          <RatingDisplay 
            rating={item.rating} 
            reviews={item.reviews}
            size="sm"
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold">{item.price}</p>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleMessageVendor}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={added ? "default" : "outline"}
              className="h-8 w-8"
              onClick={handleAddToCart}
            >
              {added ? (
                <ShoppingCart className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FoodSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = cuisineFilter === "all" || restaurant.cuisine.toLowerCase() === cuisineFilter.toLowerCase();
    
    return matchesSearch && matchesCuisine;
  });

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Food Delivery</h1>
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" />
          Delivery to: Home
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for restaurants or cuisines" 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cuisines</SelectItem>
            <SelectItem value="american">American</SelectItem>
            <SelectItem value="indian">Indian</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
            <SelectItem value="italian">Italian</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 py-1 scrollbar-hide">
        {["Fast Food", "Pizza", "Chinese", "Indian", "Healthy", "Dessert", "Breakfast", "Mexican"].map(cuisine => (
          <Button 
            key={cuisine} 
            variant={cuisineFilter.toLowerCase() === cuisine.toLowerCase() ? "default" : "outline"} 
            size="sm"
            className="flex-shrink-0"
            onClick={() => setCuisineFilter(cuisine.toLowerCase())}
          >
            {cuisine}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="restaurants" className="mb-8">
        <TabsList>
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Pizza className="h-4 w-4" />
            Featured Items
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Sell Food
          </TabsTrigger>
        </TabsList>
        <TabsContent value="restaurants" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/70" />
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p>No restaurants found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setCuisineFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="featured" className="mt-6">
          <h2 className="text-xl font-bold mb-4">Featured Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredItems.map(item => (
              <FoodItemCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="register" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Become a Food Seller</CardTitle>
              <CardDescription>
                Register your restaurant or offer home-cooked meals on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 p-6 rounded-lg flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Utensils className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Restaurant Owner</h3>
                  <p className="text-muted-foreground mb-6">
                    List your restaurant on our platform and reach more customers
                  </p>
                  <RestaurantRegisterForm />
                </div>
                
                <div className="bg-muted/30 p-6 rounded-lg flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ChefHat className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Home Chef</h3>
                  <p className="text-muted-foreground mb-6">
                    Sell your home-cooked meals to people in your neighborhood
                  </p>
                  <HomeChefRegisterForm />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Join our platform and start selling your food to thousands of hungry customers in your area.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodSection;
