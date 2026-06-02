
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Route, Car, CircleDollarSign } from 'lucide-react';

interface RideEstimateCardProps {
  distance?: string;
  duration?: string;
  price?: string;
  type?: string;
}

const RideEstimateCard: React.FC<RideEstimateCardProps> = ({
  distance = "-- km",
  duration = "-- min",
  price = "--",
  type = "Standard"
}) => {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Ride Estimate</span>
          <Badge variant="outline" className="bg-primary/5">{type}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
            <Route className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm font-medium">{distance}</span>
            <span className="text-xs text-muted-foreground">Distance</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
            <Clock className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm font-medium">{duration}</span>
            <span className="text-xs text-muted-foreground">Duration</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
            <CircleDollarSign className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm font-medium">{price}</span>
            <span className="text-xs text-muted-foreground">Price</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideEstimateCard;
