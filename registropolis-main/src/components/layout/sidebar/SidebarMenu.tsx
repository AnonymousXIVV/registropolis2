
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { useAuth } from '@/context/AuthContext';

interface SidebarItemType {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  adminOnly?: boolean;
}

interface SidebarMenuProps {
  menuItems: SidebarItemType[];
  isCollapsed: boolean;
  onItemClick: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuItems,
  isCollapsed,
  onItemClick,
}) => {
  const location = useLocation();
  const { isAdmin } = useAuth(); // Get admin status from auth context

  // Filter menu items based on admin status
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return isAdmin; // Only show admin items to admins
    }
    return true;
  });

  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <SidebarItem
              key={item.title}
              icon={<IconComponent size={20} />}
              title={item.title}
              href={item.href}
              badge={item.badge}
              isActive={location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)}
              isCollapsed={isCollapsed}
              onClick={onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarMenu;
