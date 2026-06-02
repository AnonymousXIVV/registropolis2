
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isCollapsed: boolean;
  isActive?: boolean;
  subItems?: { title: string; href: string }[];
  badge?: string;
  isNew?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  title, 
  href, 
  isCollapsed, 
  isActive,
  subItems,
  badge,
  isNew = false,
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (isCollapsed && onClick) {
      onClick();
    }
    
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="w-full" data-testid={`sidebar-item-${title ? title.toLowerCase() : 'item'}`}>
      <Link 
        to={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full relative",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
        )}
        onClick={handleClick}
      >
        <div className={cn(
          "flex items-center justify-center w-8 h-8 relative",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          {icon}
          {badge && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[0.65rem] text-destructive-foreground font-medium">
              {parseInt(badge) > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <>
            <span className={cn(
              "font-medium transition-opacity flex-1",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}>
              {title}
              {isNew && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                  New
                </span>
              )}
            </span>
            {badge && (
              <span className="bg-destructive/10 text-destructive text-xs px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            {hasSubItems && (
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "transform rotate-90"
              )} />
            )}
          </>
        )}
      </Link>
      
      {hasSubItems && isOpen && !isCollapsed && (
        <div className="pl-10 space-y-1 mt-1">
          {subItems.map((item, idx) => (
            <Link 
              key={idx}
              to={item.href}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.href 
                  ? "bg-sidebar-accent/70 text-foreground" 
                  : "hover:bg-sidebar-accent/30 text-muted-foreground"
              )}
              onClick={onClick}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
