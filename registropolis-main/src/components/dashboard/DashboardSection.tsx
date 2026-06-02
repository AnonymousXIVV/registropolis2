import React, { Suspense } from 'react';
import DashboardLoadingSection from './DashboardLoadingSection';

const MessagesSection   = React.lazy(() => import('../messages/MessagesSection'));
const MarketplaceSection = React.lazy(() => import('../marketplace/MarketplaceSection'));
const JobsSection       = React.lazy(() => import('../jobs/JobsSection'));
const ServicesSection   = React.lazy(() => import('../services/ServicesSection'));
const RealEstateSection = React.lazy(() => import('../real-estate/RealEstateSection'));
const TransportSection  = React.lazy(() => import('../transport/TransportSection'));
const EventsSection     = React.lazy(() => import('../events/EventsSection'));
const SettingsSection   = React.lazy(() => import('../settings/SettingsSection'));
const BusinessSection   = React.lazy(() => import('../business/BusinessSection'));

interface DashboardSectionProps {
  activeSection: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ activeSection }) => {
  const isFullHeight = activeSection === 'messages';

  const renderSection = () => {
    switch (activeSection) {
      case 'messages':    return <MessagesSection />;
      case 'marketplace': return <MarketplaceSection />;
      case 'jobs':        return <JobsSection />;
      case 'services':    return <ServicesSection />;
      case 'real-estate': return <RealEstateSection />;
      case 'transport':   return <TransportSection />;
      case 'events':      return <EventsSection />;
      case 'settings':    return <SettingsSection />;
      case 'business':    return <BusinessSection />;
      default:            return <MessagesSection />;
    }
  };

  return (
    <Suspense fallback={<DashboardLoadingSection />}>
      <div className={isFullHeight ? 'h-full overflow-hidden' : 'h-full overflow-y-auto pb-20'}>
        {renderSection()}
      </div>
    </Suspense>
  );
};

export default DashboardSection;
