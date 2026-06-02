import {
  MessageCircle,
  ShoppingBag,
  Briefcase,
  Wrench,
  Building2,
  Truck,
  Calendar,
  Shield,
} from 'lucide-react';

export const mainMenuItems = [
  {
    title: 'Messages',
    icon: MessageCircle,
    href: '/dashboard/messages',
    badge: '5',
  },
  {
    title: 'Marketplace',
    icon: ShoppingBag,
    href: '/dashboard/marketplace',
  },
  {
    title: 'Jobs',
    icon: Briefcase,
    href: '/dashboard/jobs',
  },
  {
    title: 'Services',
    icon: Wrench,
    href: '/dashboard/services',
  },
  {
    title: 'Real Estate',
    icon: Building2,
    href: '/dashboard/real-estate',
  },
  {
    title: 'Transport',
    icon: Truck,
    href: '/dashboard/transport',
  },
  {
    title: 'Events',
    icon: Calendar,
    href: '/dashboard/events',
  },
  {
    title: 'Admin',
    icon: Shield,
    href: '/admin',
    adminOnly: true,
  },
];
