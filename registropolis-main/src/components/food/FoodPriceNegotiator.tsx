
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
import { CircleDollarSign, MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

interface FoodPriceNegotiatorProps {
  originalPrice: string;
  deliveryFee: string;
  restaurantName: string;
  onAccept: (negotiatedPrice: string, negotiatedDeliveryFee: string) => void;
  onMessageRestaurant: () => void;
}

const FoodPriceNegotiator: React.FC<FoodPriceNegotiatorProps> = ({ 
  originalPrice, 
  deliveryFee,
  restaurantName,
  onAccept,
  onMessageRestaurant
}) => {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [priceOffer, setPriceOffer] = useState('');
  const [deliveryOffer, setDeliveryOffer] = useState('');
  const [restaurantResponse, setRestaurantResponse] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState<string | null>(null);
  const [finalDeliveryFee, setFinalDeliveryFee] = useState<string | null>(null);
  
  const numericPrice = parseFloat(originalPrice.replace('$', ''));
  const numericDeliveryFee = parseFloat(deliveryFee.replace('$', ''));
  
  const handleStartNegotiation = () => {
    setIsNegotiating(true);
    setPriceOffer((numericPrice * 0.9).toFixed(2)); // Default to 10% less
    setDeliveryOffer((numericDeliveryFee * 0.5).toFixed(2)); // Default to 50% less delivery fee
  };
  
  const handleSubmitOffer = () => {
    const offerPrice = parseFloat(priceOffer);
    const offerDelivery = parseFloat(deliveryOffer);
    
    if (isNaN(offerPrice) || offerPrice <= 0 || isNaN(offerDelivery) || offerDelivery < 0) {
      toast.error("Please enter valid amounts");
      return;
    }
    
    // Calculate how much lower the offers are compared to original
    const priceDifference = 1 - (offerPrice / numericPrice);
    const deliveryDifference = 1 - (offerDelivery / numericDeliveryFee);
    
    // Simulate restaurant response based on the offer
    if (priceDifference <= 0.1 && deliveryDifference <= 0.5) {
      // Good offer - accept immediately
      setRestaurantResponse(`${restaurantName} has accepted your offer!`);
      setFinalPrice(`$${offerPrice.toFixed(2)}`);
      setFinalDeliveryFee(`$${offerDelivery.toFixed(2)}`);
    } else if (priceDifference <= 0.2 && deliveryDifference <= 0.7) {
      // Reasonable offer - counter once
      const counterPrice = (numericPrice * 0.85).toFixed(2);
      const counterDelivery = (numericDeliveryFee * 0.8).toFixed(2);
      setRestaurantResponse(`We can offer the items for $${counterPrice} with a delivery fee of $${counterDelivery}.`);
      setFinalPrice(`$${counterPrice}`);
      setFinalDeliveryFee(`$${counterDelivery}`);
    } else {
      // Too low - reject
      setRestaurantResponse("We're sorry, but we can't accept this offer. Our costs don't allow for such a discount.");
      setFinalPrice(null);
      setFinalDeliveryFee(null);
    }
  };
  
  const handleAcceptFinal = () => {
    if (finalPrice && finalDeliveryFee) {
      onAccept(finalPrice, finalDeliveryFee);
      toast.success(`Order placed with negotiated price: ${finalPrice} and delivery fee: ${finalDeliveryFee}`);
    }
  };
  
  if (!isNegotiating) {
    return (
      <Button 
        variant="outline"
        className="gap-2 w-full"
        onClick={handleStartNegotiation}
      >
        <CircleDollarSign className="h-4 w-4" />
        Negotiate Price
      </Button>
    );
  }
  
  return (
    <Card className="border-dashed border-primary/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5" /> 
          Price Negotiation with {restaurantName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original price:</span>
            <span className="font-medium">{originalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery fee:</span>
            <span className="font-medium">{deliveryFee}</span>
          </div>
          
          {!restaurantResponse ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm">Your offer for food price:</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={priceOffer}
                    onChange={(e) => setPriceOffer(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm">Your offer for delivery fee:</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={deliveryOffer}
                    onChange={(e) => setDeliveryOffer(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <Button onClick={handleSubmitOffer} className="w-full">
                Submit Offer
              </Button>
            </div>
          ) : (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Restaurant response:</p>
                  <p className="text-sm">{restaurantResponse}</p>
                </div>
              </div>
            </div>
          )}
          
          {finalPrice && finalDeliveryFee && (
            <div className="flex justify-between items-center border-t pt-3">
              <div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Final price:</p>
                  <p className="font-bold text-primary ml-2">{finalPrice}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Final delivery fee:</p>
                  <p className="font-bold text-primary ml-2">{finalDeliveryFee}</p>
                </div>
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
                    setRestaurantResponse(null);
                    setFinalPrice(null);
                    setFinalDeliveryFee(null);
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
      <CardFooter className="border-t pt-3">
        <Button 
          variant="ghost" 
          className="w-full gap-2"
          onClick={onMessageRestaurant}
        >
          <MessageSquare className="h-4 w-4" />
          Message Restaurant
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodPriceNegotiator;
