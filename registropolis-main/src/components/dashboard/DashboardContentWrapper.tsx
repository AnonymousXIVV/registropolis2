import React from 'react';
import DashboardContent from './DashboardContent';

interface DashboardContentWrapperProps {
  initialSection?: string;
}

const DashboardContentWrapper: React.FC<DashboardContentWrapperProps> = ({
  initialSection = 'messages',
}) => {
  return (
    <div className="h-full">
      <DashboardContent activeSection={initialSection} />
    </div>
  );
};

export default DashboardContentWrapper;
