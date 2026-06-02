
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarItem from './SidebarItem';

// Define a more robust type for sub-items
interface SettingsSubItem {
  title: string;
  href: string;
  icon?: React.ElementType; // Optional icon for future extensibility
}

interface SidebarFooterProps {
  isCollapsed: boolean;
  onItemClick: () => void;
  signOut: () => void;
}

const settingsSubItems: SettingsSubItem[] = [
  { title: "Profile", href: "/settings?tab=profile" },
  { title: "Privacy", href: "/settings?tab=privacy" },
  { title: "Notifications", href: "/settings?tab=notifications" },
  { title: "Chat", href: "/settings?tab=chat" },
  { title: "Appearance", href: "/settings?tab=appearance" },
  { title: "Help", href: "/settings?tab=help" }
];

const SidebarFooter: React.FC<SidebarFooterProps> = ({ 
  isCollapsed, 
  onItemClick,
  signOut 
}) => {
  const location = useLocation();
  
  return (
    <div className="border-t border-sidebar-border px-2 py-4">
      <SidebarItem
        icon={<Settings size={20} />}
        title="Settings"
        href="/settings"
        isCollapsed={isCollapsed}
        isActive={location.pathname.startsWith('/settings')}
        subItems={settingsSubItems}
        onClick={onItemClick}
      />
      <Button
        variant="ghost"
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg justify-start text-destructive hover:bg-destructive/10",
          isCollapsed && "justify-center"
        )}
        onClick={signOut}
      >
        <LogOut size={20} />
        {!isCollapsed && <span>Sign Out</span>}
      </Button>
    </div>
  );
};

export default SidebarFooter;
