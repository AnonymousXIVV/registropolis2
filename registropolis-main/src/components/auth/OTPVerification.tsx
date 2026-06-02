
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { authAPI } from '@/services/apiService';

const OTPVerification: React.FC = () => {
  const { phoneNumber, setIsPhoneVerified, setIsOtpSent } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const lastFour = phone.slice(-4);
    return `***-***-${lastFour}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    if (!pastedData) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    
    // Focus last filled input or the next empty one
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    toast.info('Sending new verification code...');
    
    try {
      // Call API to request new OTP
      await authAPI.requestOTP(phoneNumber);
      toast.success('New verification code sent successfully');
      setTimeLeft(60);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error('Failed to send verification code. Please try again.');
    }
  };

  const handleGoBack = () => {
    setIsOtpSent(false);
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Verifying OTP:', otpString, 'for phone:', phoneNumber);
      
      // Call API to verify OTP
      await authAPI.verifyOTP(phoneNumber, otpString);
      
      // Set phone verification status
      setIsPhoneVerified(true);
      toast.success('Phone number verified successfully');
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      toast.error('Invalid verification code. Please try again.');
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
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Verify your phone</h1>
        <p className="text-muted-foreground">
          Enter the 6-digit code we sent to {formatPhoneNumber(phoneNumber)}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              ref={el => (inputRefs.current[index] = el)}
              value={digit}
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-2xl text-center rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none"
              maxLength={1}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <Button 
          className="w-full h-12 text-base"
          onClick={handleVerify}
          disabled={isLoading || otp.join('').length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive a code?
          </p>
          {timeLeft > 0 ? (
            <p className="text-sm">Resend code in {timeLeft} seconds</p>
          ) : (
            <Button 
              variant="link" 
              className="text-sm p-0 h-auto"
              onClick={handleResend}
            >
              Resend code
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OTPVerification;
