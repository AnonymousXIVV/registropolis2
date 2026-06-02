
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ChefHat, 
  Clock, 
  MapPin, 
  Upload, 
  Phone, 
  FileCheck, 
  Loader2,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const HomeChefRegisterForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.name || '',
    specialties: '',
    phoneNumber: user?.phoneNumber || '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cuisineType: '',
    bio: '',
    availableFrom: '',
    availableTo: '',
    deliveryRadius: '',
    priceRange: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.displayName || !formData.cuisineType || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call to register home chef
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Your profile has been registered as a Home Chef!",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full flex gap-2">
          <ChefHat className="h-4 w-4" />
          Register as Home Chef
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>Home Chef Registration</SheetTitle>
          <SheetDescription>
            Share your culinary skills with your community
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties/Signature Dishes *</Label>
              <Input
                id="specialties"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                placeholder="E.g., Homemade pasta, Vegan desserts"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisineType">Cuisine Type *</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('cuisineType', value)}
                value={formData.cuisineType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homestyle">Home-style Cooking</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="thai">Thai</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="desserts">Desserts & Baking</SelectItem>
                  <SelectItem value="vegan">Vegan & Vegetarian</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About Your Cooking</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell customers about your cooking style, experience, and what makes your food special"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From *</Label>
                <Input
                  id="availableFrom"
                  name="availableFrom"
                  type="time"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableTo">Available To *</Label>
                <Input
                  id="availableTo"
                  name="availableTo"
                  type="time"
                  value={formData.availableTo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryRadius">Delivery Radius (miles) *</Label>
                <Input
                  id="deliveryRadius"
                  name="deliveryRadius"
                  type="number"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('priceRange', value)}
                  value={formData.priceRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ (Budget-friendly)</SelectItem>
                    <SelectItem value="$$">$$ (Moderate)</SelectItem>
                    <SelectItem value="$$$">$$$ (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sample Dish Photos</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-20 flex flex-col gap-1"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Signature Dish</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-20 flex flex-col gap-1"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">More Food Photos</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                * Upload photos of your dishes to attract more customers
              </p>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-primary" />
            <p className="text-sm">
              Your profile will be reviewed to ensure food safety and quality standards.
            </p>
          </div>

          <SheetFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">Cancel</Button>
            </SheetClose>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Register as Home Chef'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default HomeChefRegisterForm;
