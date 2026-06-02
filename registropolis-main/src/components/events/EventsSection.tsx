import React, { useState } from 'react';
import { Search, Plus, Calendar, MapPin, Clock, Users, Ticket, Heart, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Music', 'Sports', 'Arts & Culture', 'Business', 'Food & Drink', 'Tech'];

const EVENTS = [
  { id:'1', title:'Coachella Valley Music & Arts', category:'Music', date:'Apr 12–14, 2025', time:'2:00 PM', location:'Indio, CA', price:449, priceDisplay:'$449', attendees:125000, attending:true, featured:true, image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', host:'Goldenvoice', tag:'Trending' },
  { id:'2', title:'TechCrunch Disrupt 2025', category:'Tech', date:'Oct 27–29, 2025', time:'9:00 AM', location:'San Francisco, CA', price:1299, priceDisplay:'$1,299', attendees:8500, attending:false, featured:true, image:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', host:'TechCrunch', tag:'Must Attend' },
  { id:'3', title:'World Street Food Congress', category:'Food & Drink', date:'Mar 22, 2025', time:'11:00 AM', location:'New York, NY', price:85, priceDisplay:'$85', attendees:4200, attending:false, featured:false, image:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80', host:'WSFC', tag:'Limited Seats' },
  { id:'4', title:'NBA All-Star Weekend', category:'Sports', date:'Feb 14–16, 2025', time:'7:00 PM', location:'Indianapolis, IN', price:320, priceDisplay:'$320', attendees:65000, attending:true, featured:false, image:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', host:'NBA', tag:'Hot' },
  { id:'5', title:'Art Basel Miami Beach', category:'Arts & Culture', date:'Dec 4–8, 2025', time:'Varies', location:'Miami Beach, FL', price:72, priceDisplay:'$72', attendees:93000, attending:false, featured:false, image:'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80', host:'Art Basel', tag:'Premium' },
  { id:'6', title:'SaaStr Annual Summit', category:'Business', date:'Sep 10–12, 2025', time:'8:30 AM', location:'San Mateo, CA', price:1499, priceDisplay:'$1,499', attendees:12000, attending:false, featured:false, image:'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80', host:'SaaStr', tag:'Sold Out Soon' },
  { id:'7', title:'Electric Daisy Carnival Las Vegas', category:'Music', date:'May 17–19, 2025', time:'5:00 PM', location:'Las Vegas, NV', price:379, priceDisplay:'$379', attendees:155000, attending:false, featured:false, image:'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80', host:'Insomniac Events', tag:'Epic' },
  { id:'8', title:'Local Farmers & Artisan Market', category:'Food & Drink', date:'Every Sunday', time:'8:00 AM', location:'Brooklyn, NY', price:0, priceDisplay:'Free', attendees:2200, attending:false, featured:false, image:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80', host:'BK Farmers Co.', tag:'Weekly' },
];

const TAG_CLR: Record<string,string> = { 'Trending':'bg-rose-500', 'Must Attend':'bg-violet-500', 'Limited Seats':'bg-amber-500', 'Hot':'bg-orange-500', 'Premium':'bg-indigo-500', 'Sold Out Soon':'bg-red-600', 'Epic':'bg-pink-500', 'Weekly':'bg-emerald-500' };
const CAT_CLR: Record<string,string> = { 'Music':'bg-violet-50 text-violet-700', 'Tech':'bg-blue-50 text-blue-700', 'Food & Drink':'bg-orange-50 text-orange-700', 'Sports':'bg-green-50 text-green-700', 'Arts & Culture':'bg-pink-50 text-pink-700', 'Business':'bg-slate-50 text-slate-700' };

export default function EventsSection() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = EVENTS.filter(e =>
    (activeCat === 'All' || e.category === activeCat) &&
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-padding space-y-6">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Discover what's happening in your world</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" />Create Event
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events, artists, venues…" className="pl-9 rounded-xl border-slate-200 bg-white h-10" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={()=>setActiveCat(cat)} className={cn('chip text-sm', activeCat===cat ? 'chip-active' : 'chip-default')}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} events found</p>

      {/* Featured hero — first featured event */}
      {activeCat === 'All' && !search && (() => {
        const feat = filtered.find(e => e.featured);
        if (!feat) return null;
        return (
          <div className="relative rounded-2xl overflow-hidden h-56 cursor-pointer group shadow-md">
            <img src={feat.image} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className={cn('self-start text-[11px] font-bold text-white px-2.5 py-1 rounded-full mb-3', TAG_CLR[feat.tag]??'bg-slate-700')}>
                {feat.tag}
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">{feat.title}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{feat.date}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{feat.location}</span>
                <span className="font-semibold text-white ml-auto">{feat.priceDisplay}</span>
              </div>
            </div>
            <Button className="absolute top-4 right-4 gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white">
              Get Tickets <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        );
      })()}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.filter(e => !(activeCat === 'All' && !search && e.featured)).map(e => (
          <div key={e.id} className="card-premium group cursor-pointer overflow-hidden">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-slate-100">
              <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2.5 left-2.5">
                <span className={cn('text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm', TAG_CLR[e.tag]??'bg-slate-700')}>
                  {e.tag}
                </span>
              </div>
              {/* Save */}
              <button
                onClick={ev=>{ev.stopPropagation(); setSaved(s=>{const n=new Set(s); n.has(e.id)?n.delete(e.id):n.add(e.id); return n;});}}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-sm"
              >
                <Heart className={cn('h-3.5 w-3.5', saved.has(e.id)?'fill-red-500 text-red-500':'text-slate-400')} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md', CAT_CLR[e.category]??'bg-slate-100 text-slate-600')}>
                  {e.category}
                </span>
                <h3 className="font-semibold text-sm text-slate-900 leading-tight mt-1.5 line-clamp-2">{e.title}</h3>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 flex-shrink-0" />{e.date} · <Clock className="h-3 w-3 flex-shrink-0 ml-0.5" />{e.time}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />{e.location}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3 flex-shrink-0" />{e.attendees.toLocaleString()} attending
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[13px] font-bold text-slate-900">{e.priceDisplay}</span>
                  {e.price === 0 && <span className="text-[10px] text-emerald-600 font-semibold ml-1">FREE</span>}
                </div>
                <Button size="sm" className="rounded-lg gap-1 h-7 text-xs">
                  <Ticket className="h-3 w-3" />Tickets
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-700">No events found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different category or search</p>
        </div>
      )}
    </div>
  );
}
