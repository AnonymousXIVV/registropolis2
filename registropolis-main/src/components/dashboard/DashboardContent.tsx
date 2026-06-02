import React from 'react';
import { useBusinessDataInit } from '@/hooks/useBusinessDataInit';
import DashboardSection from './DashboardSection';

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
  useBusinessDataInit();

  return (
    <div className="h-full">
      <DashboardSection activeSection={activeSection} />
    </div>
  );
};

export default DashboardContent;
