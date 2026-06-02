import React, { useState } from 'react';
import { MessageSquare, CircleDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import RatingDisplay from '../common/RatingDisplay';
import SaveButton from '../common/SaveButton';
import VerificationBadge from '../common/VerificationBadge';
import FoodPriceNegotiator from './FoodPriceNegotiator';
import { useAuthPrompt } from '@/hooks/useAuthPrompt';
import AuthPrompt from '@/components/auth/AuthPrompt';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    deliveryTime: string;
    deliveryFee: string;
    cuisine: string;
    image: string;
    distance: string;
    verified: boolean;
  };
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNegotiator, setShowNegotiator] = useState(false);
  const [negotiatedDeliveryFee, setNegotiatedDeliveryFee] = useState<string | null>(null);
  const { isAuthPromptOpen, checkAuthAndPrompt, closeAuthPrompt } = useAuthPrompt();

  const handleAcceptNegotiation = (newPrice: string, newDeliveryFee: string) => {
    setNegotiatedDeliveryFee(newDeliveryFee);
    setShowNegotiator(false);
    toast({
      title: "Price Negotiated",
      description: `Delivery fee negotiated to ${newDeliveryFee}`
    });
  };

  const handleMessageRestaurant = () => {
    if (checkAuthAndPrompt()) {
      toast({
        title: "Opening Chat",
        description: `Opening chat with ${restaurant.name}...`
      });
      navigate("/messages");
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
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

        <CardContent className="flex-1 flex flex-col pt-4">
          <div className="flex justify-between items-start mb-4">
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

          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
            <div>{restaurant.deliveryTime}</div>
            <div>{restaurant.distance}</div>
            <div>
              {negotiatedDeliveryFee || restaurant.deliveryFee}
              {negotiatedDeliveryFee && (
                <span className="text-xs line-through ml-1">
                  {restaurant.deliveryFee}
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleMessageRestaurant}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setShowNegotiator(!showNegotiator)}
              >
                <CircleDollarSign className="h-4 w-4 mr-1" />
                {showNegotiator ? 'Cancel' : 'Negotiate'}
              </Button>
            </div>
            
            {showNegotiator && (
              <div className="pt-2">
                <FoodPriceNegotiator 
                  originalPrice="$25.00"
                  deliveryFee={restaurant.deliveryFee}
                  restaurantName={restaurant.name}
                  onAccept={handleAcceptNegotiation}
                  onMessageRestaurant={handleMessageRestaurant}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AuthPrompt 
        isOpen={isAuthPromptOpen}
        onClose={closeAuthPrompt}
        message="Please sign in or register to message this restaurant"
      />
    </>
  );
};

export default RestaurantCard;
