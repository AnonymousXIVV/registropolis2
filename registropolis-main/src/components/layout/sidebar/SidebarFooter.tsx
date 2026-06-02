import React from 'react';
import { useLocation } from 'react-router-dom';
import { Settings, LogOut, User, Shield, ChevronRight } from 'lucide-react';
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
    <div className="border-t border-slate-100 px-2 py-3 space-y-1">
      <SidebarItem
        icon={<Settings size={18} />}
        title="Settings"
        href="/dashboard/settings"
        isCollapsed={isCollapsed}
        isActive={location.pathname === '/dashboard/settings'}
        onClick={onItemClick}
      />

      {isAuthenticated && user ? (
        <>
          {!isCollapsed && (
            <div className="mx-1 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5 mt-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                user.role === 'admin' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-indigo-400 to-violet-500'
              )}>
                {user.name?.[0] ?? 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 capitalize mt-0.5">{user.role ?? 'user'}</p>
              </div>
              <button
                onClick={signOut}
                className="flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
          {isCollapsed && (
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          )}
        </>
      ) : (
        <div className={cn('space-y-1 mt-1', !isCollapsed && 'px-1')}>
          {!isCollapsed && (
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Quick Sign In</p>
          )}
          <button
            onClick={() => handleSignIn('user')}
            className={cn(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 group',
              isCollapsed && 'justify-center'
            )}
          >
            <User size={18} className="flex-shrink-0 text-indigo-400 group-hover:text-indigo-600" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Sign in as User</span>
                <ChevronRight size={14} className="text-slate-300" />
              </>
            )}
          </button>
          <button
            onClick={() => handleSignIn('admin')}
            className={cn(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors text-slate-500 hover:bg-amber-50 hover:text-amber-700 group',
              isCollapsed && 'justify-center'
            )}
          >
            <Shield size={18} className="flex-shrink-0 text-amber-400 group-hover:text-amber-600" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Sign in as Admin</span>
                <ChevronRight size={14} className="text-slate-300" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
