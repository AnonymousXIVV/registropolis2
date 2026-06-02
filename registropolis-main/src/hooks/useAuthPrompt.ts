
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuthPrompt = () => {
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/auth', '/', '/setup', '/index'];
  const isPublicRoute = publicRoutes.some(route => location.pathname === route) || 
                         location.pathname.startsWith('/auth/');
  
  // Check authentication status on mount and route change
  useEffect(() => {
    // Only show prompt if not loading, not authenticated, and not on public routes
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      setIsAuthPromptOpen(true);
    } else {
      setIsAuthPromptOpen(false);
    }
  }, [isAuthenticated, isLoading, location.pathname, isPublicRoute]);

  const checkAuthAndPrompt = useCallback((callback?: () => void, redirectPath?: string) => {
    if (!isAuthenticated && !isLoading) {
      setIsAuthPromptOpen(true);
      return false;
    }
    
    if (callback) {
      callback();
    }
    return true;
  }, [isAuthenticated, isLoading]);

  const closeAuthPrompt = useCallback(() => {
    setIsAuthPromptOpen(false);
    
    // If user closes auth prompt without authenticating and not on public routes,
    // redirect to home page
    if (!isAuthenticated && !isPublicRoute) {
      navigate('/');
      toast("Please sign in to access this feature");
    }
  }, [isAuthenticated, navigate, isPublicRoute]);

  return {
    isAuthPromptOpen,
    checkAuthAndPrompt,
    closeAuthPrompt
  };
};
