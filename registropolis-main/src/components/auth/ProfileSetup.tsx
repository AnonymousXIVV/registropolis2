
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Camera, X } from 'lucide-react';
import { authAPI } from '@/services/apiService';

const ProfileSetup: React.FC = () => {
  const { phoneNumber, signIn } = useAuth();
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Completing profile for:', name.trim());
      
      // Call API to complete profile
      const result = await authAPI.completeProfile(
        phoneNumber, 
        name.trim(), 
        profileImage || undefined
      );
      
      console.log('Profile creation successful:', result);
      
      // Check if token and user exist in the response
      if (result.token && result.user) {
        // Store the auth token
        localStorage.setItem('auth_token', result.token);
        
        // Sign in the user
        signIn(result.user);
        toast.success('Profile created successfully! Redirecting you to the dashboard...');
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Complete your profile</h1>
        <p className="text-muted-foreground">Tell us a bit about yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative group mb-6">
            <div 
              className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 ${
                profileImage 
                  ? 'border-2 border-primary' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            {profileImage && (
              <button
                type="button"
                className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            
            <p className="text-xs text-muted-foreground mt-2">
              {profileImage ? 'Click to change photo' : 'Add profile photo'}
            </p>
          </div>

          <div className="w-full space-y-2">
            <Input
              placeholder="Your name"
              value={name}
              onChange={handleNameChange}
              className="text-lg h-12"
              autoFocus
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating profile...
            </>
          ) : (
            'Continue'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </motion.div>
  );
};

export default ProfileSetup;
