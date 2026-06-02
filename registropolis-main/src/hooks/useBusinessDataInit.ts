
import { useEffect } from 'react';
import { getBusinessesByType } from '@/hooks/useChatsAndGroups';

export const useBusinessDataInit = () => {
  useEffect(() => {
    // Pre-populate localStorage with business data on initial load
    if (!localStorage.getItem('businessesInitialized')) {
      // Initialize restaurant data
      const restaurants = getBusinessesByType('restaurant').map(user => ({
        id: `${user.id}-restaurant`,
        name: user.business?.name || '',
        description: user.business?.description || '',
        ownerName: user.name,
        contactId: user.id,
        rating: 4.5,
        cuisine: user.business?.details.cuisine || 'Various',
        priceRange: user.business?.details.priceRange || '$$',
        address: user.business?.details.address || 'Local Area',
        imageUrl: `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
        menu: user.business?.details.specialties?.map((item: string) => ({
          name: item,
          price: `$${Math.floor(Math.random() * 20) + 10}`,
          description: `Delicious ${item.toLowerCase()} prepared fresh daily`
        })) || []
      }));
      localStorage.setItem('restaurants', JSON.stringify(restaurants));
      
      // Initialize other business types
      initializeTaxiDrivers();
      initializeEvents();
      initializeJobs();
      initializeMarketplace();
      initializeRealEstate();
      initializeServices();
      
      localStorage.setItem('businessesInitialized', 'true');
    }
  }, []);
};

// Helper functions for different business types
const initializeTaxiDrivers = () => {
  const taxiDrivers = getBusinessesByType('taxi').map(user => ({
    id: `${user.id}-taxi`,
    name: user.name,
    service: user.business?.name || '',
    vehicleType: user.business?.details.vehicleType || 'Sedan',
    vehicleModel: user.business?.details.vehicleModel || 'Standard',
    rating: user.business?.details.rating || 4.5,
    contactId: user.id,
    imageUrl: `https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
    isAvailable: true,
    experience: user.business?.details.experience || '3+ years',
    perMileRate: user.business?.details.perMileRate || '$1.50'
  }));
  localStorage.setItem('taxiDrivers', JSON.stringify(taxiDrivers));
};

const initializeEvents = () => {
  const events = getBusinessesByType('event').flatMap(user => 
    (user.business?.details.upcomingEvents || []).map((event: any, index: number) => ({
      id: `${user.id}-event-${index}`,
      title: event.title,
      date: event.date,
      location: event.location,
      ticketPrice: event.ticketPrice,
      description: event.description,
      organizer: user.name,
      contactId: user.id,
      imageUrl: `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
      attendees: Math.floor(Math.random() * 100) + 50
    }))
  );
  localStorage.setItem('events', JSON.stringify(events));
};

const initializeJobs = () => {
  const jobs = getBusinessesByType('job').flatMap(user => 
    (user.business?.details.openPositions || []).map((job: any, index: number) => ({
      id: `${user.id}-job-${index}`,
      title: job.title,
      company: user.business?.name || '',
      location: job.location,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      contactName: user.name,
      contactId: user.id,
      postedDate: `${Math.floor(Math.random() * 10) + 1} days ago`,
      deadline: `${Math.floor(Math.random() * 20) + 10} days remaining`,
      benefits: user.business?.details.benefits || []
    }))
  );
  localStorage.setItem('jobs', JSON.stringify(jobs));
};

const initializeMarketplace = () => {
  const marketplaceItems = getBusinessesByType('marketplace').flatMap(user => 
    (user.business?.details.products || []).map((product: any, index: number) => ({
      id: `${user.id}-product-${index}`,
      name: product.name,
      price: product.price,
      description: product.description,
      condition: product.condition || 'New',
      warranty: product.warranty || 'None',
      sellerName: user.name,
      storeName: user.business?.name || '',
      contactId: user.id,
      location: user.business?.details.location || 'Local Area',
      imageUrl: `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
      postedDate: `${Math.floor(Math.random() * 7) + 1} days ago`
    }))
  );
  localStorage.setItem('marketplaceItems', JSON.stringify(marketplaceItems));
};

const initializeRealEstate = () => {
  const realEstateListings = getBusinessesByType('realestate').flatMap(user => 
    (user.business?.details.currentListings || []).map((listing: any, index: number) => ({
      id: `${user.id}-property-${index}`,
      address: listing.address,
      price: listing.price,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      sqft: listing.sqft,
      type: listing.type,
      description: listing.description,
      agentName: user.name,
      agency: user.business?.name || '',
      contactId: user.id,
      imageUrl: `https://images.unsplash.com/photo-1580587771548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
      listedDate: `${Math.floor(Math.random() * 30) + 1} days ago`,
      features: ['Parking', 'Air Conditioning', 'Garden']
    }))
  );
  localStorage.setItem('realEstateListings', JSON.stringify(realEstateListings));
};

const initializeServices = () => {
  const services = getBusinessesByType('service').map(user => ({
    id: `${user.id}-service`,
    title: `Professional ${user.business?.details.services?.[0] || 'Cleaning'} Services`,
    category: 'Cleaning',
    description: user.business?.description || '',
    price: user.business?.details.rates?.hourly || '$30/hour',
    location: 'City-wide',
    availability: user.business?.details.availability || 'Weekdays',
    experience: user.business?.details.experience || '5+ years',
    provider: user.name,
    contactId: user.id,
    rating: 4.7,
    reviews: Math.floor(Math.random() * 50) + 10,
    imageUrl: `https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
    services: user.business?.details.services || [],
    satisfaction: user.business?.details.satisfaction || '100% Satisfaction Guarantee'
  }));
  localStorage.setItem('services', JSON.stringify(services));
};
