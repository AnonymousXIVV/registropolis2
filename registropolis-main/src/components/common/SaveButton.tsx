
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SaveButtonProps {
  itemId: string;
  itemType: 'job' | 'service' | 'property' | 'transport' | 'food' | 'event' | 'taxi' | 'product';
  initialSaved?: boolean;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const SaveButton = ({ 
  itemId, 
  itemType, 
  initialSaved = false,
  className,
  variant = 'ghost',
  size = 'icon'
}: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSaved(!isSaved);
    
    if (!isSaved) {
      toast.success(`Added to favorites`);
      // Here you would typically save to a favorites database or local storage
    } else {
      toast.info(`Removed from favorites`);
      // Here you would typically remove from a favorites database or local storage
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleSave}
      aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn(
        "h-[1.2em] w-[1.2em] transition-colors",
        isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"
      )} />
    </Button>
  );
};

export default SaveButton;
