
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Calendar, User, CircleDollarSign, MessageSquare, Clock } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RatingDisplay from "../common/RatingDisplay";
import SaveButton from "../common/SaveButton";

interface RideHistoryProps {
  limit?: number;
}

// Sample ride history data
const recentRides = [
  {
    id: 1,
    date: 'Aug 15, 2023',
    time: '14:30',
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
    time: '09:15',
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
    time: '19:45',
    pickup: 'Grand Central Terminal, New York, NY',
    destination: 'Central Park West, New York, NY',
    price: '$18.30',
    driver: 'David R.',
    rating: 4.6,
    status: 'Completed'
  },
  {
    id: 4,
    date: 'Jul 28, 2023',
    time: '08:30',
    pickup: 'Times Square, New York, NY',
    destination: 'Columbia University, New York, NY',
    price: '$26.40',
    driver: 'Jennifer A.',
    rating: 4.7,
    status: 'Completed'
  },
  {
    id: 5,
    date: 'Jul 20, 2023',
    time: '17:15',
    pickup: 'Barclays Center, Brooklyn, NY',
    destination: 'LaGuardia Airport, Queens, NY',
    price: '$45.60',
    driver: 'Robert T.',
    rating: 4.9,
    status: 'Completed'
  }
];

const RideHistory: React.FC<RideHistoryProps> = ({ limit }) => {
  const navigate = useNavigate();
  const displayRides = limit ? recentRides.slice(0, limit) : recentRides;
  
  const handleContactDriver = (driverName: string) => {
    toast.success(`Connecting to chat with ${driverName}...`);
    navigate("/messages");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Rides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayRides.map(ride => (
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
                <span className="text-sm text-muted-foreground">{ride.date} • {ride.time}</span>
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
                  onClick={() => handleContactDriver(ride.driver)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      {!limit && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Rides
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RideHistory;
