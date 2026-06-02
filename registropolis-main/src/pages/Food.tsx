
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Utensils, Clock, DollarSign, Star, Heart, Filter, ShoppingCart, Plus, Minus, Bike } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';

// Restaurant card component
const RestaurantCard = ({ 
  name, 
  cuisine, 
  rating,
  deliveryTime,
  deliveryFee,
  minOrder,
  imageUrl,
  isPromoted = false
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  return (
    <motion.div 
      className="bg-card rounded-lg overflow-hidden border border-border"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-40 object-cover" />
        {isPromoted && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            Promoted
          </Badge>
        )}
        <button 
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{cuisine}</p>
          </div>
          <div className="flex items-center bg-primary/10 px-2 py-1 rounded-md">
            <Star className="h-3 w-3 fill-primary text-primary mr-1" />
            <span className="text-sm font-medium text-primary">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-sm space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {deliveryTime} min
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Bike className="h-3 w-3" />
            ${deliveryFee}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Min ${minOrder}
          </Badge>
        </div>
        
        <Button className="w-full mt-3">Order Now</Button>
      </div>
    </motion.div>
  );
};

// Food item card component
const FoodItemCard = ({ 
  name, 
  description, 
  price,
  imageUrl
}) => {
  const [quantity, setQuantity] = useState(0);
  
  const increment = () => setQuantity(quantity + 1);
  const decrement = () => quantity > 0 && setQuantity(quantity - 1);
  
  return (
    <div className="flex gap-3 p-3 border-b border-border">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold">${price}</span>
          
          {quantity === 0 ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2.5"
              onClick={increment}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          ) : (
            <div className="flex items-center border rounded-md">
              <button 
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-accent"
                onClick={decrement}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button 
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-accent"
                onClick={increment}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Food = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [cartItems, setCartItems] = useState(2);
  
  // Sample restaurants data - would come from API in real app
  const restaurants = [
    {
      id: 1,
      name: "Burger Kingdom",
      cuisine: "American, Burgers, Fast Food",
      rating: 4.7,
      deliveryTime: 25,
      deliveryFee: 2.99,
      minOrder: 10,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800",
      isPromoted: true
    },
    {
      id: 2,
      name: "Pizza Palace",
      cuisine: "Italian, Pizza, Pasta",
      rating: 4.5,
      deliveryTime: 35,
      deliveryFee: 1.99,
      minOrder: 15,
      imageUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800",
      isPromoted: false
    },
    {
      id: 3,
      name: "Sushi Express",
      cuisine: "Japanese, Sushi, Asian",
      rating: 4.8,
      deliveryTime: 40,
      deliveryFee: 3.99,
      minOrder: 20,
      imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800",
      isPromoted: true
    },
    {
      id: 4,
      name: "Taco Fiesta",
      cuisine: "Mexican, Tacos, Burritos",
      rating: 4.3,
      deliveryTime: 30,
      deliveryFee: 2.49,
      minOrder: 12,
      imageUrl: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800",
      isPromoted: false
    },
    {
      id: 5,
      name: "Mediterranean Delight",
      cuisine: "Mediterranean, Greek, Healthy",
      rating: 4.6,
      deliveryTime: 45,
      deliveryFee: 3.49,
      minOrder: 15,
      imageUrl: "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?auto=format&fit=crop&w=800",
      isPromoted: false
    },
    {
      id: 6,
      name: "Curry House",
      cuisine: "Indian, Curry, Spicy",
      rating: 4.4,
      deliveryTime: 50,
      deliveryFee: 2.99,
      minOrder: 18,
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800",
      isPromoted: false
    },
    {
      id: 7,
      name: "Thai Spice",
      cuisine: "Thai, Spicy, Noodles",
      rating: 4.2,
      deliveryTime: 35,
      deliveryFee: 2.49,
      minOrder: 12,
      imageUrl: "https://images.unsplash.com/photo-1562565652-a0d8b4929444?auto=format&fit=crop&w=800",
      isPromoted: false
    },
    {
      id: 8,
      name: "Fresh Salad Bar",
      cuisine: "Healthy, Salads, Vegan",
      rating: 4.7,
      deliveryTime: 20,
      deliveryFee: 1.99,
      minOrder: 10,
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800",
      isPromoted: true
    },
  ];
  
  // Sample food items data - would come from API in real app
  const foodItems = [
    {
      id: 1,
      name: "Double Cheese Burger",
      description: "Two beef patties with cheddar cheese, lettuce, tomato, and special sauce on a brioche bun.",
      price: "9.99",
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200"
    },
    {
      id: 2,
      name: "Chicken Caesar Salad",
      description: "Fresh romaine lettuce with grilled chicken, parmesan cheese, croutons, and Caesar dressing.",
      price: "8.49",
      imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=200"
    },
    {
      id: 3,
      name: "Pepperoni Pizza",
      description: "Classic pizza with tomato sauce, mozzarella cheese, and pepperoni slices.",
      price: "12.99",
      imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=200"
    },
    {
      id: 4,
      name: "Sushi Combo",
      description: "Assorted sushi rolls with salmon, tuna, avocado, and cucumber.",
      price: "15.99",
      imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=200"
    },
    {
      id: 5,
      name: "Pad Thai",
      description: "Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts, and lime.",
      price: "10.99",
      imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=200"
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto pl-64">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Food Delivery</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Change Location
              </Button>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search for restaurants or dishes..." 
              className="pl-10 py-6"
            />
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <Button 
              variant={activeTab === 'restaurants' ? 'default' : 'outline'} 
              className="rounded-full"
              onClick={() => setActiveTab('restaurants')}
            >
              Restaurants
            </Button>
            <Button 
              variant={activeTab === 'dishes' ? 'default' : 'outline'} 
              className="rounded-full"
              onClick={() => setActiveTab('dishes')}
            >
              Dishes
            </Button>
            <Button 
              variant={activeTab === 'groceries' ? 'default' : 'outline'} 
              className="rounded-full"
              onClick={() => setActiveTab('groceries')}
            >
              Groceries
            </Button>
          </div>
          
          {/* Category filters */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <Button variant="default" className="rounded-full">All</Button>
            <Button variant="outline" className="rounded-full">Fast Food</Button>
            <Button variant="outline" className="rounded-full">Healthy</Button>
            <Button variant="outline" className="rounded-full">Pizza</Button>
            <Button variant="outline" className="rounded-full">Asian</Button>
            <Button variant="outline" className="rounded-full">Mexican</Button>
            <Button variant="outline" className="rounded-full">Desserts</Button>
          </div>
          
          {activeTab === 'restaurants' ? (
            <>
              {/* Featured restaurants section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Featured Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {restaurants.filter(r => r.isPromoted).map(restaurant => (
                    <RestaurantCard key={restaurant.id} {...restaurant} />
                  ))}
                </div>
              </div>
              
              {/* All restaurants section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">All Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {restaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} {...restaurant} />
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">Load More</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Food items list */}
              <div className="lg:col-span-2 bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="text-xl font-semibold">Popular Items</h2>
                </div>
                
                <div>
                  {foodItems.map(item => (
                    <FoodItemCard key={item.id} {...item} />
                  ))}
                </div>
              </div>
              
              {/* Cart summary */}
              <div className="bg-card rounded-lg border border-border p-4 h-fit">
                <h3 className="font-semibold mb-3">Your Order</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Chicken Caesar Salad</span>
                    <span>$8.49</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pepperoni Pizza</span>
                    <span>$12.99</span>
                  </div>
                  
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>$21.48</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2">
                      <span>Total</span>
                      <span>$24.47</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-2">
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Food;
