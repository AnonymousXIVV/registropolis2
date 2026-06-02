
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Phone } from 'lucide-react';
import { authAPI } from '@/services/apiService';

const PhoneVerification: React.FC = () => {
  const { phoneNumber, setPhoneNumber, setIsOtpSent } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');
    setPhoneNumber(value);
    if (error) setError('');
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation (at least 10 digits)
    const digitCount = phone.replace(/\D/g, '').length;
    return digitCount >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Requesting OTP for phone number:', phoneNumber);
      
      // Call API to request OTP
      await authAPI.requestOTP(phoneNumber);
      
      // Update auth context
      setIsOtpSent(true);
      toast.success('Verification code sent successfully');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to send verification code. Please try again.');
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
        <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight mb-2">Enter your phone number</h1>
        <p className="text-muted-foreground">We'll send you a verification code to confirm your identity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`text-lg h-12 ${error ? 'border-destructive' : ''}`}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={isLoading || !phoneNumber}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default PhoneVerification;
