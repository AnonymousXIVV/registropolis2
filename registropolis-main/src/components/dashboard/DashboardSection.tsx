import React, { Suspense } from 'react';
import DashboardLoadingSection from './DashboardLoadingSection';

const MessagesSection = React.lazy(() => import('../messages/MessagesSection'));
const BusinessSection = React.lazy(() => import('../business/BusinessSection'));
const JobsSection = React.lazy(() => import('../jobs/JobsSection'));
const MarketplaceSection = React.lazy(() => import('../marketplace/MarketplaceSection'));
const RealEstateSection = React.lazy(() => import('../real-estate/RealEstateSection'));
const TaxiSection = React.lazy(() => import('../taxi/TaxiSection'));
const FoodSection = React.lazy(() => import('../food/FoodSection'));
const ServicesSection = React.lazy(() => import('../services/ServicesSection'));
const TransportSection = React.lazy(() => import('../transport/TransportSection'));
const EventsSection = React.lazy(() => import('../events/EventsSection'));
const SettingsSection = React.lazy(() => import('../settings/SettingsSection'));

interface DashboardSectionProps {
  activeSection: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ activeSection }) => {
  const isFullHeight = activeSection === 'messages';

  const renderSection = () => {
    switch (activeSection) {
      case 'messages':    return <MessagesSection />;
      case 'business':    return <BusinessSection />;
      case 'jobs':        return <JobsSection />;
      case 'services':    return <ServicesSection />;
      case 'marketplace': return <MarketplaceSection />;
      case 'real-estate': return <RealEstateSection />;
      case 'taxi':        return <TaxiSection />;
      case 'transport':   return <TransportSection />;
      case 'food':        return <FoodSection />;
      case 'events':      return <EventsSection />;
      case 'settings':    return <SettingsSection />;
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
