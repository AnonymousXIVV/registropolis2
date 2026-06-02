
import React from 'react';
import { useBusinessDataInit } from '@/hooks/useBusinessDataInit';
import DashboardSection from './DashboardSection';

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
  console.log('Rendering DashboardContent with active section:', activeSection);
  
  // Initialize business data
  useBusinessDataInit();
  
  return <DashboardSection activeSection={activeSection} />;
};

export default DashboardContent;
