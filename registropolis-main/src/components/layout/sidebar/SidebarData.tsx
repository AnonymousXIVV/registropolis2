
import { Home, MessageCircle, ShoppingBag, Car, Briefcase, Wrench, Building, Truck, Calendar, Settings, Shield } from 'lucide-react';

export const mainMenuItems = [
  {
    title: 'Home',
    icon: Home,
    href: '/',
  },
  {
    title: 'Messages',
    icon: MessageCircle,
    href: '/messages',
    badge: '5',
  },
  {
    title: 'Marketplace',
    icon: ShoppingBag,
    href: '/marketplace',
  },
  {
    title: 'Taxi',
    icon: Car,
    href: '/taxi',
  },
  {
    title: 'Jobs',
    icon: Briefcase,
    href: '/jobs',
  },
  {
    title: 'Services',
    icon: Wrench,
    href: '/services',
  },
  {
    title: 'Real Estate',
    icon: Building,
    href: '/real-estate',
  },
  {
    title: 'Transport',
    icon: Truck,
    href: '/transport',
  },
  {
    title: 'Food',
    icon: ShoppingBag,
    href: '/food',
  },
  {
    title: 'Events',
    icon: Calendar,
    href: '/events',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
  {
    title: 'Admin',
    icon: Shield, 
    href: '/admin',
    adminOnly: true,  // This will be used to conditionally render this item
  }
];
