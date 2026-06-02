import React, { useState } from 'react';
import { Search, Plus, Star, Clock, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Home Repair', 'Cleaning', 'Design', 'Tutoring', 'Health', 'Tech Support'];

const SERVICES = [
  { id:'1', name:'Marcus Johnson', title:'Licensed Plumber & Handyman', category:'Home Repair', rating:4.9, reviews:127, rate:'$75/hr', location:'San Francisco, CA', available:true, jobs:340, verified:true, tags:['Plumbing','Electrical','Fixtures'], image:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' },
  { id:'2', name:'Sophia Chen', title:'Premium Interior Cleaning', category:'Cleaning', rating:5.0, reviews:89, rate:'$120/visit', location:'New York, NY', available:true, jobs:210, verified:true, tags:['Deep Clean','Move-in/out','Office'], image:'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80' },
  { id:'3', name:'David Park', title:'Brand & Product Designer', category:'Design', rating:4.8, reviews:64, rate:'$95/hr', location:'Remote', available:true, jobs:180, verified:true, tags:['Branding','UI/UX','Figma'], image:'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80' },
  { id:'4', name:'Elena Rossi', title:'Private Chef & Catering', category:'Health', rating:4.9, reviews:55, rate:'$200/event', location:'Los Angeles, CA', available:false, jobs:95, verified:true, tags:['Italian','Catering','Meal Prep'], image:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80' },
  { id:'5', name:'Jordan Williams', title:'Certified Personal Trainer', category:'Health', rating:4.7, reviews:203, rate:'$80/session', location:'Chicago, IL', available:true, jobs:500, verified:false, tags:['Strength','HIIT','Nutrition'], image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80' },
  { id:'6', name:'Aria Patel', title:'Mathematics & SAT Tutor', category:'Tutoring', rating:5.0, reviews:148, rate:'$60/hr', location:'Boston, MA', available:true, jobs:290, verified:true, tags:['Calculus','SAT Prep','AP Math'], image:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
  { id:'7', name:'Ryan Thompson', title:'MacBook & PC Specialist', category:'Tech Support', rating:4.6, reviews:77, rate:'$70/hr', location:'Remote', available:true, jobs:160, verified:false, tags:['macOS','Windows','Networking'], image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80' },
  { id:'8', name:'Amara Osei', title:'Residential Electrician', category:'Home Repair', rating:4.9, reviews:112, rate:'$90/hr', location:'Seattle, WA', available:true, jobs:275, verified:true, tags:['Wiring','Panel Upgrades','EV Chargers'], image:'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' },
];

export default function ServicesSection() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = SERVICES.filter(s =>
    (activeCat === 'All' || s.category === activeCat) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="section-padding space-y-6">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find trusted professionals in your community</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" />Offer a Service
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search services or providers…" className="pl-9 rounded-xl border-slate-200 bg-white h-10" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={()=>setActiveCat(cat)} className={cn('chip text-sm', activeCat===cat ? 'chip-active' : 'chip-default')}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} providers available</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(svc => (
          <div key={svc.id} className="card-premium group cursor-pointer overflow-hidden">
            {/* Photo */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img src={svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {/* Availability */}
              <div className="absolute top-2.5 left-2.5">
                <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', svc.available ? 'bg-green-500 text-white' : 'bg-slate-600 text-white')}>
                  {svc.available ? 'Available' : 'Busy'}
                </span>
              </div>
              {svc.verified && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 text-[11px] font-semibold text-slate-700 px-2 py-0.5 rounded-full shadow-sm">
                  <CheckCircle2 className="h-3 w-3 text-blue-500" />Verified Pro
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm">{svc.name}</h3>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{svc.rating}</span>
                    <span className="text-xs text-slate-400 ml-0.5">({svc.reviews})</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{svc.title}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {svc.tags.map(t => (
                  <span key={t} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{t}</span>
                ))}
              </div>

              {/* Meta */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" /><span className="truncate">{svc.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 flex-shrink-0" /><span>{svc.jobs}+ jobs completed</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-base font-bold text-slate-900">{svc.rate}</span>
                <Button size="sm" className="rounded-lg gap-1.5 h-8 text-xs">
                  <MessageCircle className="h-3.5 w-3.5" />Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-700">No providers found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different category or search</p>
        </div>
      )}
    </div>
  );
}
