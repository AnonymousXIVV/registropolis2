
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedTransition from '../common/AnimatedTransition';
import { useSidebar } from '@/context/SidebarContext';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
  noAnimation?: boolean;
  withSidebar?: boolean;
  requireAuth?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  fullWidth = false,
  maxWidth = '2xl',
  centered = false,
  noAnimation = false,
  withSidebar = true,
  requireAuth = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, contentMargin, sidebarTransitionClass, setSidebarCollapsed } = useSidebar();
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // Determine if current page is the homepage
  const isHomepage = location.pathname === '/';
  
  // Effect to redirect if auth is required but user is not authenticated
  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [requireAuth, isAuthenticated, isLoading, navigate, location.pathname]);

  // Auto-collapse sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && withSidebar) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile, withSidebar, setSidebarCollapsed]);

  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full'
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background w-full" data-testid="app-layout">
      {withSidebar && <Sidebar />}
      
      <main 
        style={withSidebar && !isMobile ? { marginLeft: `${contentMargin}px` } : undefined}
        className={`
          flex-1 h-full overflow-y-auto
          transition-all duration-300 ease-in-out
          ${sidebarTransitionClass}
          ${fullWidth ? '' : 'px-2 sm:px-4 lg:px-6'}
          ${!fullWidth && !isHomepage ? maxWidthClasses[maxWidth] : ''}
          ${centered ? 'flex items-center justify-center' : ''}
          ${isHomepage ? 'w-full max-w-full p-0' : ''}
          ${isMobile ? 'pb-16' : ''} /* Add bottom padding on mobile for navigation */
          w-full
        `}
        data-mobile={isMobile ? "true" : "false"}
      >
        {noAnimation ? (
          children
        ) : (
          <AnimatePresence mode="wait">
            <AnimatedTransition key={location.pathname}>
              {children}
            </AnimatedTransition>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default AppLayout;
