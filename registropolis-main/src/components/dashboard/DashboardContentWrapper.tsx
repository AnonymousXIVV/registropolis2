import React from 'react';
import DashboardContent from './DashboardContent';

interface DashboardContentWrapperProps {
  initialSection?: string;
}

const DashboardContentWrapper: React.FC<DashboardContentWrapperProps> = ({
  initialSection = 'messages',
}) => {
  return <DashboardContent activeSection={initialSection} />;
};

export default DashboardContentWrapper;
