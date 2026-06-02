
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed }) => {
  return (
    <div className={cn(
      "flex items-center h-16 px-4",
      isCollapsed ? "justify-center" : "justify-start"
    )}>
      {isCollapsed ? (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">B</div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">B</div>
          <span className="text-xl font-semibold text-foreground">Buzzer</span>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
