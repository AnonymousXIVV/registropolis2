import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, LogIn, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarItem from './SidebarItem';
import { useAuth } from '@/context/AuthContext';
import { setupTemporaryUser } from '@/utils/authUtils';

interface SidebarFooterProps {
  isCollapsed: boolean;
  onItemClick: () => void;
  signOut: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed, onItemClick, signOut }) => {
  const location = useLocation();
  const { isAuthenticated, user, signIn } = useAuth();

  const handleSignIn = (type: 'user' | 'admin') => {
    const { user: u } = setupTemporaryUser(type);
    signIn(u);
  };

  return (
    <div className="border-t border-sidebar-border px-2 py-3 space-y-1">
      <SidebarItem
        icon={<Settings size={20} />}
        title="Settings"
        href="/dashboard/settings"
        isCollapsed={isCollapsed}
        isActive={location.pathname === '/dashboard/settings'}
        onClick={onItemClick}
      />

      {isAuthenticated ? (
        <>
          {!isCollapsed && user && (
            <div className="px-3 py-2 rounded-lg bg-muted/40 mx-1 mb-1">
              <p className="text-xs font-medium truncate">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate capitalize">{user.role ?? 'user'}</p>
            </div>
          )}
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
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg justify-start text-primary hover:bg-primary/10',
              isCollapsed && 'justify-center'
            )}
            onClick={() => handleSignIn('user')}
          >
            <User size={20} />
            {!isCollapsed && <span>Sign in as User</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg justify-start text-amber-600 hover:bg-amber-50',
              isCollapsed && 'justify-center'
            )}
            onClick={() => handleSignIn('admin')}
          >
            <Shield size={20} />
            {!isCollapsed && <span>Sign in as Admin</span>}
          </Button>
        </>
      )}
    </div>
  );
};

export default SidebarFooter;
