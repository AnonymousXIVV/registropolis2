import React, { useState } from 'react';
import { Search, Plus, Heart, MapPin, BedDouble, Bath, Maximize2, CheckCircle2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TYPES = ['All', 'Buy', 'Rent', 'Commercial'];
const BEDS = ['Any', '1+', '2+', '3+', '4+'];

const PROPERTIES = [
  { id:'1', mode:'Buy', title:'Modern Hillside Villa', address:'2847 Skyline Blvd, San Francisco, CA', price:3_250_000, priceDisplay:'$3.25M', beds:5, baths:4, sqft:4_200, agent:'Sarah Mitchell', agentImg:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', tag:'New Listing', image:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' },
  { id:'2', mode:'Buy', title:'Downtown Penthouse Condo', address:'1200 Market St #48, New York, NY', price:2_100_000, priceDisplay:'$2.1M', beds:3, baths:2.5, sqft:2_800, agent:'James Lee', agentImg:'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', tag:'Hot Deal', image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
  { id:'3', mode:'Rent', title:'Luxury 2BR Apartment', address:'850 Pine St #12, Chicago, IL', price:3_200, priceDisplay:'$3,200/mo', beds:2, baths:2, sqft:1_400, agent:'Emma Davis', agentImg:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', tag:'Available Now', image:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' },
  { id:'4', mode:'Buy', title:'Contemporary Family Home', address:'445 Oak Lane, Austin, TX', price:875_000, priceDisplay:'$875K', beds:4, baths:3, sqft:3_100, agent:'Carlos Rivera', agentImg:'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80', tag:'Price Reduced', image:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80' },
  { id:'5', mode:'Buy', title:'Coastal Modern Estate', address:'12 Ocean Drive, Miami, FL', price:4_800_000, priceDisplay:'$4.8M', beds:6, baths:5, sqft:6_500, agent:'Diana Prince', agentImg:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', tag:'Luxury', image:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
  { id:'6', mode:'Rent', title:'Studio Loft in Arts District', address:'330 Creative Ave, Los Angeles, CA', price:1_800, priceDisplay:'$1,800/mo', beds:1, baths:1, sqft:750, agent:'Kai Nakamura', agentImg:'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80', tag:'Move-in Ready', image:'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=800&q=80' },
];

const TAG_CLR: Record<string,string> = { 'New Listing':'bg-blue-500', 'Hot Deal':'bg-red-500', 'Price Reduced':'bg-amber-500', 'Available Now':'bg-green-500', 'Luxury':'bg-violet-500', 'Move-in Ready':'bg-teal-500' };

export default function RealEstateSection() {
  const [mode, setMode] = useState('All');
  const [activeBeds, setActiveBeds] = useState('Any');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = PROPERTIES.filter(p =>
    (mode === 'All' || p.mode === mode) &&
    (activeBeds === 'Any' || p.beds >= parseInt(activeBeds)) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="section-padding space-y-6">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Real Estate</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find your perfect property</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" />List Property
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by address, city, or listing…" className="pl-9 rounded-xl border-slate-200 bg-white h-10" />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {TYPES.map(t => (
            <button key={t} onClick={()=>setMode(t)} className={cn('chip text-sm', mode===t ? 'chip-active' : 'chip-default')}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Beds:</span>
          {BEDS.map(b => (
            <button key={b} onClick={()=>setActiveBeds(b)} className={cn('chip text-xs px-2.5 py-1', activeBeds===b ? 'chip-active' : 'chip-default')}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} properties</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="card-premium group cursor-pointer overflow-hidden">
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {/* Mode badge */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={cn('text-[11px] font-bold text-white px-2.5 py-1 rounded-full shadow-sm', TAG_CLR[p.tag]??'bg-slate-700')}>
                  {p.tag}
                </span>
              </div>
              <span className={cn('absolute top-3 right-10 text-[11px] font-bold text-white px-2.5 py-1 rounded-full shadow-sm', p.mode==='Rent' ? 'bg-indigo-600' : 'bg-slate-900')}>
                For {p.mode}
              </span>
              {/* Save */}
              <button
                onClick={e=>{e.stopPropagation(); setSaved(s=>{const n=new Set(s); n.has(p.id)?n.delete(p.id):n.add(p.id); return n;});}}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:bg-white"
              >
                <Heart className={cn('h-3.5 w-3.5', saved.has(p.id) ? 'fill-red-500 text-red-500' : 'text-slate-400')} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight">{p.title}</h3>
                  <span className="text-base font-bold text-primary flex-shrink-0">{p.priceDisplay}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{p.address}</span>
                </div>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <BedDouble className="h-4 w-4 text-slate-400" />{p.beds}
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Bath className="h-4 w-4 text-slate-400" />{p.baths}
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Maximize2 className="h-4 w-4 text-slate-400" />{p.sqft.toLocaleString()} ft²
                </span>
              </div>

              {/* Agent */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <img src={p.agentImg} alt={p.agent} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-none">{p.agent}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5 text-blue-500" />
                      <span className="text-[10px] text-slate-400">Licensed Agent</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 rounded-lg border-slate-200">
                  <Phone className="h-3 w-3" />Contact
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
          <h3 className="font-semibold text-slate-700">No properties found</h3>
          <p className="text-sm text-muted-foreground mt-1">Adjust your filters to see more listings</p>
        </div>
      )}
    </div>
  );
}
