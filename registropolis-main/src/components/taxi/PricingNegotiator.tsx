
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { CircleDollarSign, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface PricingNegotiatorProps {
  basePrice: string;
  rideType: string;
  onAccept: (negotiatedPrice: string) => void;
  contactDriver?: () => void;
}

const PricingNegotiator: React.FC<PricingNegotiatorProps> = ({ 
  basePrice, 
  rideType,
  onAccept,
  contactDriver
}) => {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [counterOffer, setCounterOffer] = useState('');
  const [driverResponse, setDriverResponse] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState<string | null>(null);
  
  const numericBasePrice = parseFloat(basePrice.replace('$', ''));
  
  const handleStartNegotiation = () => {
    setIsNegotiating(true);
    setCounterOffer((numericBasePrice * 0.9).toFixed(2)); // Default to 10% less
  };
  
  const handleSubmitOffer = () => {
    const offerAmount = parseFloat(counterOffer);
    
    if (isNaN(offerAmount) || offerAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Simulate driver response based on how low the offer is
    const percentDifference = 1 - (offerAmount / numericBasePrice);
    
    if (percentDifference <= 0) {
      // Higher than base price, accept immediately
      setDriverResponse("Your offer has been accepted!");
      setFinalPrice(`$${offerAmount.toFixed(2)}`);
    } else if (percentDifference <= 0.1) {
      // Up to 10% discount - always accept
      setDriverResponse("Your offer has been accepted!");
      setFinalPrice(`$${offerAmount.toFixed(2)}`);
    } else if (percentDifference <= 0.2) {
      // 10-20% discount - counter once
      const counterAmount = (numericBasePrice * 0.85).toFixed(2);
      setDriverResponse(`I can do $${counterAmount} for you.`);
      setFinalPrice(`$${counterAmount}`);
    } else {
      // More than 20% discount - reject
      setDriverResponse("Sorry, that's too low. I can't go below the base price minus 15%.");
      setFinalPrice(null);
    }
  };
  
  const handleAcceptFinal = () => {
    if (finalPrice) {
      onAccept(finalPrice);
      toast.success(`Ride booked at ${finalPrice}`);
    }
  };
  
  if (!isNegotiating) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Base price</p>
          <p className="text-lg font-bold">{basePrice}</p>
        </div>
        <Button 
          variant="outline"
          className="gap-2"
          onClick={handleStartNegotiation}
        >
          <CircleDollarSign className="h-4 w-4" />
          Negotiate Price
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="border-dashed border-primary/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5" /> 
          Price Negotiation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original price:</span>
            <span className="font-medium">{basePrice}</span>
          </div>
          
          {!driverResponse ? (
            <div className="space-y-2">
              <p className="text-sm mb-2">Make a counter offer:</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={counterOffer}
                    onChange={(e) => setCounterOffer(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button onClick={handleSubmitOffer}>
                  Submit Offer
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Driver's response:</p>
                  <p className="text-sm">{driverResponse}</p>
                </div>
              </div>
            </div>
          )}
          
          {finalPrice && (
            <div className="flex justify-between items-center border-t pt-3">
              <div>
                <p className="text-sm text-muted-foreground">Final price:</p>
                <p className="font-bold text-primary">{finalPrice}</p>
              </div>
              <div className="space-x-2">
                <Button 
                  size="sm" 
                  onClick={handleAcceptFinal} 
                  className="gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setDriverResponse(null);
                    setFinalPrice(null);
                  }}
                  className="gap-1"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {contactDriver && (
        <CardFooter className="border-t pt-3">
          <Button 
            variant="ghost" 
            className="w-full gap-2"
            onClick={contactDriver}
          >
            <MessageSquare className="h-4 w-4" />
            Message Driver
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PricingNegotiator;
