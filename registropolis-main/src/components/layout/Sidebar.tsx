
import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarMenu from './sidebar/SidebarMenu';
import SidebarFooter from './sidebar/SidebarFooter';
import SidebarToggle from './sidebar/SidebarToggle';
import { useAuth } from '@/context/AuthContext';

// Import sidebar data
import { mainMenuItems } from './sidebar/SidebarData';

const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar, sidebarWidth, sidebarTransitionClass } = useSidebar();
  const { signOut } = useAuth();
  
  const handleItemClick = () => {
    // On mobile, clicking an item should collapse the sidebar
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };
  
  return (
    <aside 
      className={`fixed left-0 top-0 z-50 h-full bg-background border-r shadow-md ${sidebarTransitionClass}`}
      style={{ width: `${sidebarWidth}px` }}
      data-testid="sidebar"
    >
      <div className="h-full flex flex-col">
        <SidebarHeader isCollapsed={isCollapsed} />
        <div className="flex-1 overflow-y-auto">
          <SidebarMenu 
            menuItems={mainMenuItems} 
            isCollapsed={isCollapsed} 
            onItemClick={handleItemClick} 
          />
        </div>
        <SidebarFooter 
          isCollapsed={isCollapsed} 
          onItemClick={handleItemClick} 
          signOut={signOut}
        />
        <div className="absolute right-0 top-16 transform translate-x-1/2 z-10">
          <SidebarToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
