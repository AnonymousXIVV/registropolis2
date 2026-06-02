import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, MessageCircle, ShoppingBag, Briefcase,
  Wrench, Building2, Truck, Calendar, Zap, Shield, Star,
} from 'lucide-react';

const FEATURES = [
  {
    icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50',
    title: 'Instant Messaging', desc: 'Real-time chat with sellers, providers, and neighbors.',
    section: 'messages',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: ShoppingBag, color: 'text-violet-600', bg: 'bg-violet-50',
    title: 'Marketplace', desc: 'Buy and sell premium items within your community.',
    section: 'marketplace',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50',
    title: 'Jobs', desc: 'Discover top opportunities from companies that matter.',
    section: 'jobs',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Wrench, color: 'text-emerald-600', bg: 'bg-emerald-50',
    title: 'Services', desc: 'Hire verified local professionals for any task.',
    section: 'services',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50',
    title: 'Real Estate', desc: 'Find dream properties with trusted local agents.',
    section: 'real-estate',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Truck, color: 'text-rose-600', bg: 'bg-rose-50',
    title: 'Transport', desc: 'Browse and list vehicles from verified sellers.',
    section: 'transport',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50',
    title: 'Events', desc: 'Discover unforgettable local and global experiences.',
    section: 'events',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
  },
];

const STATS = [
  { value: '2.4M+', label: 'Active Users' },
  { value: '$890M', label: 'Marketplace Volume' },
  { value: '180K+', label: 'Jobs Posted' },
  { value: '4.9★', label: 'App Rating' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-slate-900">Buzzer</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-slate-600 hidden sm:flex">
              Browse
            </Button>
            <Button size="sm" onClick={() => navigate('/dashboard')} className="rounded-lg gap-1.5 shadow-sm">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24 text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Shield className="h-3.5 w-3.5" />
            Trusted by 2.4M+ people worldwide
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
            Your community,<br />
            <span className="gradient-text">all in one place.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Buzzer connects you with the best of your local world — from jobs and services to marketplace deals, events, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/dashboard')} className="gap-2 text-base px-7 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              Explore the app <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/dashboard/marketplace')} className="gap-2 text-base px-7 rounded-xl border-slate-200 text-slate-700">
              Browse Marketplace
            </Button>
          </div>
        </motion.div>

        {/* Hero image strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="flex gap-3 overflow-hidden rounded-2xl shadow-2xl border border-slate-100 h-64 sm:h-80">
            {[
              'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&q=80',
            ].map((src, i) => (
              <div key={i} className={`flex-1 overflow-hidden ${i > 1 ? 'hidden sm:block' : ''} ${i > 2 ? 'hidden lg:block' : ''}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent rounded-l-2xl" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent rounded-r-2xl" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-slate-50/70">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="text-center"
              >
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">Everything your community needs</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Seven powerful sections, one beautiful platform.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => navigate(`/dashboard/${f.section}`)}
                className="group card-premium cursor-pointer overflow-hidden"
              >
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className={`absolute bottom-3 left-3 w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${f.color}`} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {[1,2,3,4,5].map(n => <Star key={n} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-xl font-semibold text-slate-900 mb-2">"Buzzer changed how I connect with my neighbourhood."</p>
          <p className="text-sm text-slate-500">— Trusted by communities in 40+ cities</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Ready to explore?</h2>
          <p className="text-indigo-200 text-lg mb-8">Sign in from the sidebar to unlock all features, or browse freely as a guest.</p>
          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="bg-white text-indigo-700 hover:bg-indigo-50 gap-2 text-base px-8 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
          >
            Open Buzzer <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-slate-700">Buzzer</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 Buzzer Community Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
