
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import ProfileSetup from '@/components/auth/ProfileSetup';
import GlassmorphicCard from '@/components/ui/custom/GlassmorphicCard';

const Setup = () => {
  const { isAuthenticated, isPhoneVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPhoneVerified) {
      navigate('/auth');
    }
    
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isPhoneVerified, navigate]);

  return (
    <AppLayout centered>
      <div className="w-full max-w-lg min-h-[80vh] flex items-center justify-center py-12 px-4">
        <GlassmorphicCard className="w-full p-6 sm:p-8">
          <ProfileSetup />
        </GlassmorphicCard>
      </div>
    </AppLayout>
  );
};

export default Setup;
