import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedTransition from '../common/AnimatedTransition';
import { useSidebar } from '@/context/SidebarContext';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
  noAnimation?: boolean;
  withSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  fullWidth = false,
  maxWidth = '2xl',
  centered = false,
  noAnimation = false,
  withSidebar = true,
}) => {
  const location = useLocation();
  const { isCollapsed, contentMargin, sidebarTransitionClass, setSidebarCollapsed } = useSidebar();
  const isMobile = useIsMobile();
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    if (isMobile && withSidebar) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile, withSidebar, setSidebarCollapsed]);

  const maxWidthClasses: Record<string, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background w-full" data-testid="app-layout">
      {withSidebar && <Sidebar />}

      <main
        style={withSidebar && !isMobile ? { marginLeft: `${contentMargin}px` } : undefined}
        className={[
          'flex-1 h-full overflow-hidden',
          'transition-all duration-300 ease-in-out',
          sidebarTransitionClass,
          isHomepage ? 'overflow-y-auto w-full max-w-full p-0' : '',
          !isHomepage && !fullWidth ? 'px-2 sm:px-4 lg:px-6' : '',
          !isHomepage && !fullWidth ? maxWidthClasses[maxWidth] : '',
          centered ? 'flex items-center justify-center' : '',
          'w-full',
        ]
          .filter(Boolean)
          .join(' ')}
        data-mobile={isMobile ? 'true' : 'false'}
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
