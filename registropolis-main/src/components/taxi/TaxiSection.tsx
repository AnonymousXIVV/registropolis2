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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  MapPin, 
  Clock, 
  CreditCard, 
  Calendar, 
  User, 
  Star, 
  Navigation, 
  Search,
  CircleDollarSign,
  ChevronsUpDown,
  Clock3,
  LocateFixed,
  Home,
  Briefcase,
  MessageSquare,
  Package,
  Battery,
  Wrench,
  Truck,
  Loader2
} from 'lucide-react';
import TaxiMap from './TaxiMap';
import PricingNegotiator from './PricingNegotiator';
import DriverRegisterForm from './DriverRegisterForm';
import RatingDisplay from '../common/RatingDisplay';
import SaveButton from '../common/SaveButton';
import VerificationBadge from '../common/VerificationBadge';

const TaxiSection: React.FC = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | undefined>();
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | undefined>();
  const [isNegotiated, setIsNegotiated] = useState(false);
  const [finalPrice, setFinalPrice] = useState<string | null>(null);
  const [activeService, setActiveService] = useState('ride');
  const [isLoading, setIsLoading] = useState(false);

  const rideOptions = [
    {
      id: 'economy',
      name: 'Economy',
      price: '$18.50',
      time: '18 min',
      description: 'Affordable rides for up to 4 people',
      icon: <Car className="h-6 w-6" />
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$24.75',
      time: '15 min',
      description: 'Comfortable rides for up to 4 people',
      icon: <Car className="h-6 w-6" />
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$32.50',
      time: '12 min',
      description: 'High-end cars for up to 4 people',
      icon: <Car className="h-6 w-6" />
    },
    {
      id: 'xl',
      name: 'XL',
      price: '$35.00',
      time: '20 min',
      description: 'Rides for groups up to 6 people',
      icon: <Car className="h-6 w-6" />
    }
  ];

  const deliveryOptions = [
    {
      id: 'express',
      name: 'Express Delivery',
      price: '$15.00',
      time: '30 min',
      description: 'Fast delivery for small packages',
      icon: <Package className="h-6 w-6" />
    },
    {
      id: 'standard-delivery',
      name: 'Standard Delivery',
      price: '$10.50',
      time: '45 min',
      description: 'Regular delivery for most packages',
      icon: <Package className="h-6 w-6" />
    },
    {
      id: 'large',
      name: 'Large Package',
      price: '$25.00',
      time: '60 min',
      description: 'For larger items up to 20kg',
      icon: <Truck className="h-6 w-6" />
    }
  ];

  const batteryOptions = [
    {
      id: 'jumpstart',
      name: 'Jumpstart',
      price: '$35.00',
      time: '25 min',
      description: 'Jump start your vehicle battery',
      icon: <Battery className="h-6 w-6" />
    },
    {
      id: 'replacement',
      name: 'Battery Replacement',
      price: '$120.00',
      time: '45 min',
      description: 'Full battery replacement service',
      icon: <Battery className="h-6 w-6" />
    }
  ];

  const towingOptions = [
    {
      id: 'standard-tow',
      name: 'Standard Towing',
      price: '$85.00',
      time: '40 min',
      description: 'Towing for cars and small vehicles',
      icon: <Truck className="h-6 w-6" />
    },
    {
      id: 'heavy-tow',
      name: 'Heavy Towing',
      price: '$150.00',
      time: '60 min',
      description: 'For SUVs, trucks and larger vehicles',
      icon: <Truck className="h-6 w-6" />
    },
    {
      id: 'roadside',
      name: 'Roadside Assistance',
      price: '$65.00',
      time: '30 min',
      description: 'On-site help for minor issues',
      icon: <Wrench className="h-6 w-6" />
    }
  ];

  const recentRides = [
    {
      id: 1,
      date: 'Aug 15, 2023',
      pickup: '123 Main St, New York, NY',
      destination: 'JFK Airport, Queens, NY',
      price: '$58.75',
      driver: 'Michael K.',
      rating: 4.8,
      status: 'Completed'
    },
    {
      id: 2,
      date: 'Aug 10, 2023',
      pickup: 'Brooklyn Bridge, Brooklyn, NY',
      destination: '350 5th Ave, New York, NY',
      price: '$22.50',
      driver: 'Sarah L.',
      rating: 5.0,
      status: 'Completed'
    },
    {
      id: 3,
      date: 'Aug 5, 2023',
      pickup: 'Grand Central Terminal, New York, NY',
      destination: 'Central Park West, New York, NY',
      price: '$18.30',
      driver: 'David R.',
      rating: 4.6,
      status: 'Completed'
    }
  ];

  const savedLocations = [
    { id: 1, name: 'Home', address: '123 W 45th St, New York, NY 10036' },
    { id: 2, name: 'Work', address: '350 5th Ave, New York, NY 10118' },
    { id: 3, name: 'Gym', address: '500 E 57th St, New York, NY 10022' }
  ];

  const handlePickupSelected = (coords: [number, number], address: string) => {
    setPickupCoords(coords);
    setPickup(address);
  };

  const handleDestinationSelected = (coords: [number, number], address: string) => {
    setDestinationCoords(coords);
    setDestination(address);
  };

  const handleAcceptPrice = (negotiatedPrice: string) => {
    setFinalPrice(negotiatedPrice);
    setIsNegotiated(true);
  };

  const handleContactDriver = () => {
    toast.success("Connecting to driver chat...");
    navigate("/messages");
  };

  const handleBookRide = () => {
    if (!pickup || !destination) {
      toast.error("Please enter pickup and destination locations");
      return;
    }

    const serviceOptions = {
      'ride': rideOptions,
      'delivery': deliveryOptions,
      'battery': batteryOptions,
      'towing': towingOptions
    };

    const currentOptions = serviceOptions[activeService as keyof typeof serviceOptions];
    const selectedOption = currentOptions.find(option => option.id === rideType);

    toast.success(`${activeService.charAt(0).toUpperCase() + activeService.slice(1)} service booked! Provider will arrive in approximately ${selectedOption?.time}`);
  };

  const getCurrentServiceOptions = () => {
    switch (activeService) {
      case 'delivery':
        return deliveryOptions;
      case 'battery':
        return batteryOptions;
      case 'towing':
        return towingOptions;
      default:
        return rideOptions;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Transportation & Services</h1>
      
      <div className="mb-6">
        <Tabs defaultValue="ride" value={activeService} onValueChange={setActiveService} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="ride" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Rides</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Delivery</span>
            </TabsTrigger>
            <TabsTrigger value="battery" className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              <span className="hidden sm:inline">Battery</span>
            </TabsTrigger>
            <TabsTrigger value="towing" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Towing</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {activeService === 'ride' && 'Book a Ride'}
                  {activeService === 'delivery' && 'Request Delivery'}
                  {activeService === 'battery' && 'Request Battery Service'}
                  {activeService === 'towing' && 'Request Towing Service'}
                </span>
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                  Top Rated Service
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TaxiMap 
                pickupLocation={pickupCoords}
                destinationLocation={destinationCoords}
                onPickupSelected={handlePickupSelected}
                onDestinationSelected={handleDestinationSelected}
              />
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  className="pl-10"
                  placeholder={activeService === 'delivery' ? "Pickup location (sender)" : "Your location"}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <LocateFixed className="h-4 w-4" />
                </Button>
              </div>
              
              {(activeService === 'ride' || activeService === 'delivery') && (
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Navigation className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    className="pl-10"
                    placeholder={activeService === 'delivery' ? "Delivery location (recipient)" : "Destination"}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              )}
              
              {(activeService === 'battery' || activeService === 'towing') && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                  <p className="text-sm">
                    {activeService === 'battery' 
                      ? "A battery service technician will be dispatched to your location." 
                      : "A towing service provider will be dispatched to your location."}
                  </p>
                </div>
              )}
              
              {(
                (activeService === 'ride' && pickup && destination) ||
                (activeService === 'delivery' && pickup && destination) ||
                (activeService === 'battery' && pickup) ||
                (activeService === 'towing' && pickup)
              ) && (
                <>
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Choose Service Option</h3>
                    <div className="space-y-3">
                      {getCurrentServiceOptions().map(option => (
                        <div 
                          key={option.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${rideType === option.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                          onClick={() => setRideType(option.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${rideType === option.id ? 'bg-primary/10' : 'bg-muted'}`}>
                                {option.icon}
                              </div>
                              <div>
                                <h4 className="font-medium">{option.name}</h4>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{finalPrice && option.id === rideType ? finalPrice : option.price}</div>
                              <div className="text-sm text-muted-foreground flex items-center justify-end">
                                <Clock3 className="h-3 w-3 mr-1" />
                                {option.time}
                              </div>
                            </div>
                          </div>
                          {option.id === 'premium' && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-primary">Best Value</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <PricingNegotiator 
                      basePrice={getCurrentServiceOptions().find(option => option.id === rideType)?.price || '$0.00'} 
                      rideType={rideType}
                      onAccept={handleAcceptPrice}
                      contactDriver={handleContactDriver}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                    <div className="flex space-x-3">
                      <div
                        className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <CreditCard className="h-5 w-5" />
                          <span>Card</span>
                        </div>
                      </div>
                      <div
                        className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <CircleDollarSign className="h-5 w-5" />
                          <span>Cash</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full relative" 
                size="lg"
                disabled={
                  (activeService === 'ride' && (!pickup || !destination)) ||
                  (activeService === 'delivery' && (!pickup || !destination)) ||
                  (activeService === 'battery' && !pickup) ||
                  (activeService === 'towing' && !pickup)
                }
                onClick={handleBookRide}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {activeService === 'ride' && 'Book Ride'}
                {activeService === 'delivery' && 'Request Delivery'}
                {activeService === 'battery' && 'Request Battery Service'}
                {activeService === 'towing' && 'Request Towing Service'}
                {finalPrice && ` for ${finalPrice}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="places" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="places">Saved Places</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="driver">Provider</TabsTrigger>
            </TabsList>
            <TabsContent value="places" className="pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Saved Locations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedLocations.map(location => (
                    <div 
                      key={location.id} 
                      className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setDestination(location.address)}
                    >
                      <div className="mt-0.5">
                        {location.name === 'Home' ? (
                          <Home className="h-5 w-5 text-muted-foreground" />
                        ) : location.name === 'Work' ? (
                          <Briefcase className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Add New Location
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentRides.map(ride => (
                    <div key={ride.id} className="border rounded-lg p-4 relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <SaveButton 
                          itemId={`ride-${ride.id}`} 
                          itemType="taxi"
                          size="sm"
                        />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{ride.date}</span>
                        </div>
                        <Badge variant="outline">{ride.status}</Badge>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-start space-x-2">
                          <div className="mt-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <p className="text-sm truncate">{ride.pickup}</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="mt-1">
                            <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <p className="text-sm truncate">{ride.destination}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ride.driver}</span>
                          <RatingDisplay rating={ride.rating} size="sm" showCount={false} />
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold">{ride.price}</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => {
                              toast.success(`Connecting to chat with ${ride.driver}...`);
                              navigate("/messages");
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="driver" className="pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Provider Portal 
                    <VerificationBadge isVerified={true} type="icon" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      {activeService === 'delivery' ? (
                        <Package className="h-8 w-8 text-primary" />
                      ) : activeService === 'battery' ? (
                        <Battery className="h-8 w-8 text-primary" />
                      ) : activeService === 'towing' ? (
                        <Truck className="h-8 w-8 text-primary" />
                      ) : (
                        <Car className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {activeService === 'delivery' ? 'Become a Delivery Partner' : 
                       activeService === 'battery' ? 'Register as a Battery Technician' :
                       activeService === 'towing' ? 'Join as a Towing Provider' :
                       'Become a Driver'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Join our network and start earning by providing services on your own schedule
                    </p>
                    
                    <DriverRegisterForm />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TaxiSection;
