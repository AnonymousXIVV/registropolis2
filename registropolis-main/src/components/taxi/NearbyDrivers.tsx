
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CarTaxiFront, Star, Clock3, MessageSquare } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RatingDisplay from "../common/RatingDisplay";
import VerificationBadge from "../common/VerificationBadge";

// Sample data for nearby drivers
const nearbyDrivers = [
  {
    id: 1,
    name: "Michael K.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    car: "Toyota Camry",
    plate: "ABC123",
    rating: 4.8,
    distance: "2 min away",
    verified: true
  },
  {
    id: 2,
    name: "Sarah L.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    car: "Honda Civic",
    plate: "XYZ789",
    rating: 5.0,
    distance: "5 min away",
    verified: true
  },
  {
    id: 3,
    name: "David R.",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    car: "Tesla Model 3",
    plate: "EV2022",
    rating: 4.7,
    distance: "8 min away",
    verified: false
  }
];

const NearbyDrivers: React.FC = () => {
  const navigate = useNavigate();
  
  const handleContactDriver = (driverId: number) => {
    toast.success(`Connecting to driver #${driverId}...`);
    navigate("/messages");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Nearby Drivers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nearbyDrivers.map(driver => (
          <div key={driver.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
            <Avatar>
              <AvatarImage src={driver.avatar} alt={driver.name} />
              <AvatarFallback>{driver.name.split(' ')[0][0]}{driver.name.split(' ')[1][0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-medium">{driver.name}</span>
                {driver.verified && <VerificationBadge isVerified type="icon" />}
              </div>
              
              <div className="flex flex-col text-xs">
                <div className="flex items-center gap-1">
                  <CarTaxiFront className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{driver.car} • {driver.plate}</span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <RatingDisplay rating={driver.rating} size="sm" showCount={false} />
                  <span className="text-xs flex items-center">
                    <Clock3 className="h-3 w-3 mr-1 text-muted-foreground" />
                    {driver.distance}
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleContactDriver(driver.id)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NearbyDrivers;
