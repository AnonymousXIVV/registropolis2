import React, { useState } from 'react';
import { Search, Plus, Heart, MapPin, Gauge, Calendar, Fuel, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Cars', 'Motorcycles', 'Trucks & Vans', 'SUVs', 'Electric'];

const VEHICLES = [
  { id:'1', title:'2023 Tesla Model S Plaid', category:'Cars', electric:true, price:89_900, mileage:'4,200 mi', year:2023, fuel:'Electric', transmission:'Auto', color:'Pearl White', location:'San Francisco, CA', condition:'Like New', seller:'TechSales Inc.', verified:true, image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
  { id:'2', title:'2021 Ducati Panigale V4', category:'Motorcycles', electric:false, price:24_500, mileage:'8,100 mi', year:2021, fuel:'Petrol', transmission:'Manual', color:'Ducati Red', location:'Los Angeles, CA', condition:'Good', seller:'MotoWorld', verified:true, image:'https://images.unsplash.com/photo-1558618047-f9ad0c2d2c47?auto=format&fit=crop&w=800&q=80' },
  { id:'3', title:'2022 Range Rover Sport SE', category:'SUVs', electric:false, price:72_000, mileage:'18,500 mi', year:2022, fuel:'Diesel', transmission:'Auto', color:'Santorini Black', location:'New York, NY', condition:'Excellent', seller:'LuxuryDrive', verified:true, image:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80' },
  { id:'4', title:'2023 Ford F-150 Raptor', category:'Trucks & Vans', electric:false, price:64_500, mileage:'11,000 mi', year:2023, fuel:'Petrol', transmission:'Auto', color:'Velocity Blue', location:'Austin, TX', condition:'Good', seller:'TexasTrucks', verified:false, image:'https://images.unsplash.com/photo-1577705998148-6188b8c07bb7?auto=format&fit=crop&w=800&q=80' },
  { id:'5', title:'2022 Porsche 911 GT3 RS', category:'Cars', electric:false, price:215_000, mileage:'2,800 mi', year:2022, fuel:'Petrol', transmission:'PDK', color:'Python Green', location:'Miami, FL', condition:'Like New', seller:'SportsCar Elite', verified:true, image:'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80' },
  { id:'6', title:'2024 Rivian R1T Adventure', category:'Electric', electric:true, price:74_900, mileage:'1,200 mi', year:2024, fuel:'Electric', transmission:'Auto', color:'Forest Green', location:'Seattle, WA', condition:'New', seller:'GreenDrive Co.', verified:true, image:'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=800&q=80' },
  { id:'7', title:'2020 BMW M3 Competition', category:'Cars', electric:false, price:58_000, mileage:'32,000 mi', year:2020, fuel:'Petrol', transmission:'Manual', color:'Isle of Man Blue', location:'Chicago, IL', condition:'Good', seller:'BavMotors', verified:true, image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' },
  { id:'8', title:'2023 Harley-Davidson Road King', category:'Motorcycles', electric:false, price:21_000, mileage:'5,500 mi', year:2023, fuel:'Petrol', transmission:'Manual', color:'Vivid Black', location:'Nashville, TN', condition:'Excellent', seller:'HOG Nation', verified:false, image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80' },
];

const COND_CLR: Record<string,string> = { 'New':'bg-emerald-50 text-emerald-700 border-emerald-100', 'Like New':'bg-blue-50 text-blue-700 border-blue-100', 'Excellent':'bg-violet-50 text-violet-700 border-violet-100', 'Good':'bg-amber-50 text-amber-700 border-amber-100' };

export default function TransportSection() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = VEHICLES.filter(v =>
    (activeCat === 'All' || v.category === activeCat || (activeCat === 'Electric' && v.electric)) &&
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-padding space-y-6">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transport</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find your next vehicle from trusted sellers</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" />List a Vehicle
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search makes, models, year…" className="pl-9 rounded-xl border-slate-200 bg-white h-10" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={()=>setActiveCat(cat)} className={cn('chip text-sm', activeCat===cat ? 'chip-active' : 'chip-default')}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} vehicles listed</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(v => (
          <div key={v.id} className="card-premium group cursor-pointer overflow-hidden">
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img src={v.image} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {/* Condition badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className={cn('text-[11px] font-semibold border px-2 py-0.5 rounded-full bg-white/95', COND_CLR[v.condition]??'bg-white text-slate-600 border-slate-200')}>
                  {v.condition}
                </span>
              </div>
              {v.electric && (
                <div className="absolute top-2.5 right-10">
                  <span className="text-[11px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full shadow-sm">EV</span>
                </div>
              )}
              {/* Save */}
              <button
                onClick={e=>{e.stopPropagation(); setSaved(s=>{const n=new Set(s); n.has(v.id)?n.delete(v.id):n.add(v.id); return n;});}}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:bg-white"
              >
                <Heart className={cn('h-3.5 w-3.5', saved.has(v.id)?'fill-red-500 text-red-500':'text-slate-400')} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 leading-tight line-clamp-2">{v.title}</h3>
                <p className="text-xl font-bold text-slate-900 mt-1">${v.price.toLocaleString()}</p>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{v.mileage}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{v.year}</span>
                <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{v.fuel}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{v.location.split(',')[1]?.trim() ?? v.location}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                    {v.seller[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[80px]">{v.seller}</p>
                    {v.verified && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5 text-blue-500" />
                        <span className="text-[9px] text-slate-400">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 rounded-lg border-slate-200">
                  <MessageCircle className="h-3 w-3" />Chat
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
          <h3 className="font-semibold text-slate-700">No vehicles found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
