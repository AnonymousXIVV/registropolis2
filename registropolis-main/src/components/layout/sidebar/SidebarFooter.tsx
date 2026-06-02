import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarItem from './SidebarItem';

interface SidebarFooterProps {
  isCollapsed: boolean;
  onItemClick: () => void;
  signOut: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed,
  onItemClick,
  signOut,
}) => {
  const location = useLocation();

  return (
    <div className="border-t border-sidebar-border px-2 py-4">
      <SidebarItem
        icon={<Settings size={20} />}
        title="Settings"
        href="/dashboard/settings"
        isCollapsed={isCollapsed}
        isActive={location.pathname === '/dashboard/settings'}
        onClick={onItemClick}
      />
      <Button
        variant="ghost"
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg justify-start text-destructive hover:bg-destructive/10',
          isCollapsed && 'justify-center'
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
