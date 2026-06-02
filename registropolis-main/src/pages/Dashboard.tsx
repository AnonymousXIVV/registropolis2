
import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardContentWrapper from '@/components/dashboard/DashboardContentWrapper';
import { useAuthPrompt } from '@/hooks/useAuthPrompt';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { section?: string } | null;
  const isMobile = useIsMobile();
  
  // Determine active section from either URL param or state
  const activeSection = section || state?.section || 'messages'; 
  
  const { checkAuthAndPrompt, isAuthPromptOpen, closeAuthPrompt } = useAuthPrompt();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    checkAuthAndPrompt();
    
    // Log the active section for debugging
    console.log("Rendering Dashboard with section:", activeSection);
  }, [checkAuthAndPrompt, activeSection]);

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppLayout 
      withSidebar={true} 
      fullWidth={isMobile}
      maxWidth={isMobile ? 'full' : '2xl'}
    >
      <DashboardContentWrapper initialSection={activeSection} />
    </AppLayout>
  );
};

export default Dashboard;
