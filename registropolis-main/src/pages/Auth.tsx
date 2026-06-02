
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import PhoneVerification from '@/components/auth/PhoneVerification';
import OTPVerification from '@/components/auth/OTPVerification';
import GlassmorphicCard from '@/components/ui/custom/GlassmorphicCard';
import TemporaryAuth from '@/components/auth/TemporaryAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const { isOtpSent, isPhoneVerified } = useAuth();
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState<string>('temp');

  React.useEffect(() => {
    if (isPhoneVerified) {
      navigate('/setup');
    }
  }, [isPhoneVerified, navigate]);

  return (
    <AppLayout centered>
      <div className="w-full max-w-lg min-h-[80vh] flex items-center justify-center py-12 px-4">
        <GlassmorphicCard className="w-full p-6 sm:p-8">
          <Tabs defaultValue="temp" value={authTab} onValueChange={setAuthTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="temp">Temporary Auth</TabsTrigger>
              <TabsTrigger value="phone">Phone Verification</TabsTrigger>
            </TabsList>
            <TabsContent value="temp">
              <TemporaryAuth />
            </TabsContent>
            <TabsContent value="phone">
              {isOtpSent ? <OTPVerification /> : <PhoneVerification />}
            </TabsContent>
          </Tabs>
        </GlassmorphicCard>
      </div>
    </AppLayout>
  );
};

export default Auth;
