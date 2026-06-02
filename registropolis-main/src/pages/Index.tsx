import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Pizza,
  Car,
  ShoppingBag,
  Briefcase,
  Building,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const features = [
  { icon: <MessageSquare className="w-12 h-12 text-blue-500" />,    title: 'Instant Messaging', description: 'Connect with businesses and users through real-time messaging.',           section: 'messages' },
  { icon: <Pizza className="w-12 h-12 text-orange-500" />,          title: 'Food Delivery',      description: 'Order from local restaurants or become a home chef.',                   section: 'food' },
  { icon: <Car className="w-12 h-12 text-green-500" />,             title: 'Taxi Services',       description: 'Book rides and negotiate fares directly with drivers.',                  section: 'taxi' },
  { icon: <ShoppingBag className="w-12 h-12 text-purple-500" />,    title: 'Marketplace',         description: 'Buy, sell, or trade items in your local community.',                    section: 'marketplace' },
  { icon: <Briefcase className="w-12 h-12 text-indigo-500" />,      title: 'Jobs',                description: 'Find job opportunities or post positions for your business.',            section: 'jobs' },
  { icon: <Building className="w-12 h-12 text-red-500" />,          title: 'Real Estate',         description: 'Browse properties, connect with agents, find your next home.',          section: 'real-estate' },
  { icon: <Calendar className="w-12 h-12 text-teal-500" />,         title: 'Events',              description: 'Discover and organize local events in your community.',                  section: 'events' },
  { icon: <ShieldCheck className="w-12 h-12 text-cyan-500" />,      title: 'Secure Platform',     description: 'Sign in to unlock full features while browsing freely as a guest.',     section: 'settings' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout centered={false} withSidebar={false}>
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/80">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Your All-in-One Platform
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Browse services freely as a guest. Sign in from the sidebar to unlock messaging and full features.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-foreground">Explore Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.section}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                  className="glass-morphism p-6 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => navigate(`/dashboard/${f.section}`)}
                >
                  <div className="flex justify-center mb-6">{f.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
