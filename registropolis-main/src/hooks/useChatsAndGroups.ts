import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatItemProps } from '@/components/messages/ChatItem';
import { GroupChatProps } from '@/components/groups/GroupChat';

// Define a more detailed user type with business roles
interface BusinessUser {
  id: string;
  name: string;
  role?: string;
  business?: {
    type: 'restaurant' | 'taxi' | 'event' | 'job' | 'marketplace' | 'realestate' | 'service';
    name: string;
    description: string;
    details: Record<string, any>; // Additional business-specific details
  };
}

// Sample business users data with their roles and businesses
const businessUsers: BusinessUser[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Restaurant Owner",
    business: {
      type: "restaurant",
      name: "John's Grill",
      description: "Family-owned restaurant serving home-style meals since 2018",
      details: {
        cuisine: "American",
        priceRange: "$$",
        rating: 4.5,
        address: "123 Main St, Downtown",
        hours: "Mon-Sat: 11AM-10PM, Sun: 12PM-8PM",
        specialties: ["Grilled Steak", "Homemade Pasta", "Fresh Seafood"],
        delivery: true,
        takeout: true
      }
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Taxi Driver",
    business: {
      type: "taxi",
      name: "Jane's City Rides",
      description: "Reliable and affordable taxi service for all your transportation needs",
      details: {
        vehicleType: "Sedan",
        vehicleModel: "Toyota Camry",
        vehicleYear: "2021",
        licensePlate: "TXI-1234",
        rating: 4.8,
        experience: "5 years",
        areas: ["Downtown", "Suburbs", "Airport"],
        availability: "24/7",
        perMileRate: "$1.50"
      }
    }
  },
  {
    id: "3",
    name: "Alex Johnson",
    role: "Event Organizer",
    business: {
      type: "event",
      name: "Johnson Events",
      description: "Making your special moments unforgettable",
      details: {
        eventTypes: ["Corporate", "Wedding", "Birthday", "Concerts"],
        upcomingEvents: [
          {
            title: "Summer Music Festival",
            date: "August 15, 2023",
            location: "Central Park",
            ticketPrice: "$35",
            description: "Annual music festival featuring local bands and food vendors"
          },
          {
            title: "Business Networking Mixer",
            date: "September 5, 2023",
            location: "Grand Hotel Conference Center",
            ticketPrice: "$25",
            description: "Connect with professionals in your industry"
          }
        ],
        experience: "7 years",
        pastClients: ["City Hall", "Tech Corp", "Local University"]
      }
    }
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "HR Manager",
    business: {
      type: "job",
      name: "Davis Recruitment",
      description: "Connecting talented individuals with their dream jobs",
      details: {
        industry: "Various",
        openPositions: [
          {
            title: "Software Developer",
            salary: "$80,000 - $120,000",
            location: "Remote / Downtown Office",
            requirements: "3+ years experience, React, Node.js",
            description: "Join our growing tech team to build innovative solutions"
          },
          {
            title: "Marketing Specialist",
            salary: "$60,000 - $75,000",
            location: "Office-based",
            requirements: "2+ years experience, Social Media, Content Creation",
            description: "Help businesses grow their brand through creative marketing"
          }
        ],
        benefits: ["Health Insurance", "Remote Work", "Flexible Hours", "Professional Development"]
      }
    }
  },
  {
    id: "1",
    name: "John Doe",
    role: "Electronics Retailer",
    business: {
      type: "marketplace",
      name: "JD Phone Store",
      description: "Quality smartphones and accessories at competitive prices",
      details: {
        products: [
          {
            name: "iPhone 13 Pro",
            price: "$899",
            condition: "New",
            warranty: "1 Year",
            description: "Latest Apple iPhone with 128GB storage"
          },
          {
            name: "Samsung Galaxy S22",
            price: "$799",
            condition: "New",
            warranty: "1 Year",
            description: "Flagship Android phone with amazing camera"
          },
          {
            name: "Phone Cases & Accessories",
            price: "$15 - $50",
            description: "Wide selection of cases, chargers, and screen protectors"
          }
        ],
        location: "Downtown Electronics Mall, Shop #42",
        returnPolicy: "30-day return guarantee"
      }
    }
  },
  {
    id: "3",
    name: "Alex Johnson",
    role: "Real Estate Agent",
    business: {
      type: "realestate",
      name: "Johnson Properties",
      description: "Finding your perfect home since 2015",
      details: {
        license: "RES-12345",
        specializes: ["Residential", "Commercial", "Luxury"],
        currentListings: [
          {
            address: "456 Park Avenue",
            price: "$425,000",
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1800,
            type: "Single Family Home",
            description: "Beautiful renovated home in a quiet neighborhood"
          },
          {
            address: "789 Downtown Lofts, Unit 12",
            price: "$350,000",
            bedrooms: 2,
            bathrooms: 2,
            sqft: 1200,
            type: "Condo",
            description: "Modern loft in the heart of downtown with amazing views"
          }
        ],
        experience: "8 years",
        certification: "Certified Residential Specialist"
      }
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Cleaning Service Provider",
    business: {
      type: "service",
      name: "Jane's Cleaning Services",
      description: "Professional cleaning solutions for homes and offices",
      details: {
        services: ["Regular Home Cleaning", "Deep Cleaning", "Move-in/Move-out", "Office Cleaning"],
        rates: {
          hourly: "$30/hour",
          flat: {
            "Small Home (up to 1000 sq ft)": "$80",
            "Medium Home (1000-2000 sq ft)": "$120",
            "Large Home (2000+ sq ft)": "$160+"
          }
        },
        availability: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM",
        satisfaction: "100% Satisfaction Guarantee",
        experience: "6 years",
        insured: true,
        eco: "Eco-friendly cleaning products available"
      }
    }
  }
];

// Sample initial chats data with business associations and verification status
const initialChats: ChatItemProps[] = [
  { 
    id: "1", 
    name: "John Doe", 
    message: "Hey, how are you doing?", 
    time: "12:30 PM", 
    unread: 2, 
    imageUrl: "https://i.pravatar.cc/150?img=1", 
    isOnline: true, 
    onClick: () => {}, 
    businessInfo: "Restaurant Owner & Electronics Retailer",
    businessType: "restaurant",
    verified: true 
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    message: "Can we meet tomorrow at 10?", 
    time: "11:45 AM", 
    unread: 0, 
    imageUrl: "https://i.pravatar.cc/150?img=5", 
    isOnline: false, 
    onClick: () => {}, 
    businessInfo: "Taxi Driver & Cleaning Service",
    businessType: "taxi",
    verified: true 
  },
  { 
    id: "3", 
    name: "Alex Johnson", 
    message: "I sent you the document", 
    time: "Yesterday", 
    unread: 0, 
    imageUrl: "https://i.pravatar.cc/150?img=3", 
    isOnline: true, 
    onClick: () => {}, 
    businessInfo: "Event Organizer & Real Estate Agent",
    businessType: "event",
    verified: true 
  },
  { 
    id: "4", 
    name: "Emily Davis", 
    message: "Thanks for your help!", 
    time: "Yesterday", 
    unread: 0, 
    imageUrl: "https://i.pravatar.cc/150?img=9", 
    isOnline: false, 
    onClick: () => {}, 
    businessInfo: "HR Manager",
    businessType: "job",
    verified: true 
  },
  { 
    id: "5", 
    name: "Michael Brown", 
    message: "Let's discuss the project", 
    time: "Monday", 
    unread: 0, 
    imageUrl: "https://i.pravatar.cc/150?img=12", 
    isOnline: true, 
    onClick: () => {} 
  },
  { 
    id: "6", 
    name: "Sarah Wilson", 
    message: "Check out this new restaurant", 
    time: "Monday", 
    unread: 0, 
    imageUrl: "https://i.pravatar.cc/150?img=16", 
    isOnline: false, 
    onClick: () => {} 
  },
  { 
    id: "7", 
    name: "David Miller", 
    message: "When are you free this week?", 
    time: "Last week", 
    unread: 0, 
    imageUrl: "https://i.pravatar.cc/150?img=20", 
    isOnline: true, 
    onClick: () => {} 
  },
  { 
    id: "8", 
    name: "Olivia Taylor", 
    message: "Happy birthday!", 
    time: "Last week", 
    unread: 0, 
    imageUrl: "https://i.pravatar.cc/150?img=25", 
    isOnline: false, 
    onClick: () => {} 
  },
];

// Sample initial groups data
const initialGroups: GroupChatProps[] = [
  { id: "g1", name: "Project Team", memberCount: 5, lastMessage: "Meeting at 2 PM tomorrow", time: "2 hours ago", unread: 3, onClick: () => {} },
  { id: "g2", name: "Family Group", memberCount: 8, lastMessage: "Who's coming for dinner?", time: "Yesterday", unread: 0, onClick: () => {} },
  { id: "g3", name: "Book Club", memberCount: 12, lastMessage: "Has anyone read the new novel?", time: "Monday", unread: 0, onClick: () => {} },
];

// Get business details by user ID and business type
export const getBusinessDetails = (userId: string, businessType?: string) => {
  return businessUsers.find(user => 
    user.id === userId && (!businessType || user.business?.type === businessType)
  );
};

// Get all business users of a specific type
export const getBusinessesByType = (type: string) => {
  return businessUsers.filter(user => user.business?.type === type);
};

export function useChatsAndGroups(onChatSelect: (chatId: string, isGroup: boolean) => void) {
  const { toast } = useToast();
  const [chats, setChats] = useState<ChatItemProps[]>(() => 
    initialChats.map(chat => ({
      ...chat,
      onClick: () => onChatSelect(chat.id, false)
    }))
  );
  
  const [groups, setGroups] = useState<GroupChatProps[]>(() => 
    initialGroups.map(group => ({
      ...group,
      onClick: () => onChatSelect(group.id, true)
    }))
  );

  const handleCreateGroup = (groupId: string, name: string = "New Group") => {
    const newGroup: GroupChatProps = {
      id: groupId,
      name: name,
      memberCount: 1,
      time: "Just now",
      unread: 0,
      onClick: () => onChatSelect(groupId, true)
    };

    setGroups(prev => [newGroup, ...prev]);
    
    toast({
      title: "Group created",
      description: `${name} has been created successfully`,
    });
    
    return groupId;
  };

  const handleJoinGroup = (groupId: string, name: string = "Joined Group") => {
    const newGroup: GroupChatProps = {
      id: groupId,
      name: name,
      memberCount: Math.floor(Math.random() * 20) + 3,
      time: "Just now",
      unread: 0,
      onClick: () => onChatSelect(groupId, true)
    };

    setGroups(prev => [newGroup, ...prev]);
    
    toast({
      title: "Group joined",
      description: `You've joined ${name} successfully`,
    });
    
    return groupId;
  };
  
  // Add a new business user/contact to the chat list
  const addBusinessContact = (
    businessId: string, 
    name: string, 
    businessInfo: string, 
    businessType: string
  ) => {
    const newContact: ChatItemProps = {
      id: businessId,
      name: name,
      businessInfo: businessInfo,
      businessType: businessType as any,
      verified: true,
      message: "Hi! How can I help you today?",
      time: "Just now",
      unread: 1,
      isOnline: true,
      imageUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 30) + 1}`,
      onClick: () => onChatSelect(businessId, false)
    };
    
    // Check if this contact already exists
    const existingContact = chats.find(chat => chat.id === businessId);
    
    if (!existingContact) {
      setChats(prev => [newContact, ...prev]);
      
      toast({
        title: "New business contact",
        description: `${name} has been added to your chats`,
      });
    }
    
    return businessId;
  };

  return {
    chats,
    groups,
    businessUsers,
    getBusinessDetails,
    getBusinessesByType,
    handleCreateGroup,
    handleJoinGroup,
    addBusinessContact
  };
}
