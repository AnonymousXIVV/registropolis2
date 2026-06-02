
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Car, Clock, DollarSign, Star, Calendar, Clock1, Building, Map, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';

// Ride option component
const RideOption = ({ 
  name, 
  price, 
  time,
  capacity,
  iconUrl,
  isSelected = false,
  onClick
}) => {
  return (
    <motion.div 
      className={`p-4 rounded-lg border cursor-pointer ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center bg-accent rounded-md">
          {iconUrl ? (
            <img src={iconUrl} alt={name} className="w-8 h-8" />
          ) : (
            <Car className="w-6 h-6 text-primary" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{time} min</span>
            <span className="mx-1">•</span>
            <span>{capacity} seats</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-bold">${price}</div>
          <div className="text-sm text-muted-foreground">est. fare</div>
        </div>
      </div>
    </motion.div>
  );
};

// Driver card component
const DriverCard = ({ 
  name, 
  rating,
  experience,
  car,
  imageUrl
}) => {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-border">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-accent flex items-center justify-center">
            <span className="text-lg font-medium text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {experience} years exp. • {car}
        </div>
      </div>
    </div>
  );
};

const Taxi = () => {
  const [selectedRide, setSelectedRide] = useState(1);
  const [step, setStep] = useState(1); // 1: Enter location, 2: Select ride, 3: Confirm booking
  
  // Sample ride options data - would come from API in real app
  const rideOptions = [
    {
      id: 1,
      name: "Bolt Standard",
      price: "12.50",
      time: 5,
      capacity: 4,
      iconUrl: null
    },
    {
      id: 2,
      name: "Bolt Comfort",
      price: "18.75",
      time: 8,
      capacity: 4,
      iconUrl: null
    },
    {
      id: 3,
      name: "Bolt XL",
      price: "24.30",
      time: 10,
      capacity: 6,
      iconUrl: null
    },
    {
      id: 4,
      name: "Bolt Green",
      price: "15.80",
      time: 7,
      capacity: 4,
      iconUrl: null
    }
  ];
  
  // Sample drivers data - would come from API in real app
  const drivers = [
    {
      id: 1,
      name: "John D.",
      rating: 4.9,
      experience: 3,
      car: "Toyota Camry (2019)",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200"
    },
    {
      id: 2,
      name: "Maria S.",
      rating: 4.8,
      experience: 2,
      car: "Honda Civic (2020)",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200"
    },
    {
      id: 3,
      name: "Robert L.",
      rating: 4.7,
      experience: 5,
      car: "Ford Fusion (2018)",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200"
    }
  ];
  
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Where are you going?</h2>
            
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <Input 
                  placeholder="Pickup location" 
                  className="pl-10"
                  defaultValue="Current Location"
                />
              </div>
              
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <Input 
                  placeholder="Destination" 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="pt-3">
              <Button onClick={() => setStep(2)} className="w-full">
                Search Rides
              </Button>
            </div>
            
            <div className="space-y-3 pt-2">
              <h3 className="font-medium">Recent Destinations</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                  <Clock1 className="text-muted-foreground" />
                  <div>
                    <div className="font-medium">Work</div>
                    <div className="text-sm text-muted-foreground">123 Business Ave, Downtown</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                  <Clock1 className="text-muted-foreground" />
                  <div>
                    <div className="font-medium">Home</div>
                    <div className="text-sm text-muted-foreground">456 Residential St, Suburb</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                  <Clock1 className="text-muted-foreground" />
                  <div>
                    <div className="font-medium">Gym</div>
                    <div className="text-sm text-muted-foreground">789 Fitness Blvd, Sports District</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Choose a ride</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Edit Route
              </Button>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-border h-48 relative">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <Map className="w-12 h-12 text-muted-foreground" />
                <span className="sr-only">Map view showing route</span>
              </div>
              <Badge className="absolute top-2 left-2">
                <Clock className="w-3.5 h-3.5 mr-1" />
                15 min ride
              </Badge>
              <Badge className="absolute top-2 right-2">
                <Navigation className="w-3.5 h-3.5 mr-1" />
                5.3 miles
              </Badge>
            </div>
            
            <div className="space-y-2 pt-2">
              {rideOptions.map(ride => (
                <RideOption 
                  key={ride.id}
                  {...ride}
                  isSelected={selectedRide === ride.id}
                  onClick={() => setSelectedRide(ride.id)}
                />
              ))}
            </div>
            
            <div className="pt-2">
              <Button onClick={() => setStep(3)} className="w-full">
                Confirm {rideOptions.find(r => r.id === selectedRide)?.name}
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Confirm your ride</h2>
            
            <div className="rounded-lg overflow-hidden border border-border p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Trip Details</h3>
                <Badge variant="outline">
                  <DollarSign className="w-3.5 h-3.5 mr-1" />
                  ${rideOptions.find(r => r.id === selectedRide)?.price}
                </Badge>
              </div>
              
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <span className="text-xs text-primary-foreground">A</span>
                  </div>
                  <div>
                    <div className="font-medium">Current Location</div>
                    <div className="text-sm text-muted-foreground">123 Main St, Downtown</div>
                  </div>
                </div>
                
                <div className="border-l-2 border-dashed border-muted-foreground/30 h-6 ml-3"></div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary mt-1">
                    <span className="text-xs text-primary">B</span>
                  </div>
                  <div>
                    <div className="font-medium">Destination</div>
                    <div className="text-sm text-muted-foreground">456 Business Blvd, Midtown</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-border p-4">
              <h3 className="font-medium mb-2">Available Drivers Nearby</h3>
              
              <div>
                {drivers.map(driver => (
                  <DriverCard key={driver.id} {...driver} />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button>
                Book Now
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto pl-64">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Taxi</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                Ride History
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking panel */}
            <div className="bg-card rounded-lg border border-border p-6 md:col-span-1">
              {renderStep()}
            </div>
            
            {/* Map view (placeholder) */}
            <div className="hidden md:block md:col-span-2 rounded-lg border border-border overflow-hidden bg-muted">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Map View</p>
                  <p className="text-sm text-muted-foreground">Shows live location and available drivers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taxi;
