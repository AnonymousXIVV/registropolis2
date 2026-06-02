import React, { useState } from 'react';
import { Search, Plus, Heart, MessageCircle, MapPin, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Living', 'Sports', 'Vehicles', 'Books'];

const PRODUCTS = [
  { id:'1', title:'MacBook Pro 14"', price:1850, originalPrice:2499, condition:'Like New', location:'San Francisco, CA', seller:'Alex K.', sellerRating:4.9, verified:true, category:'Electronics', saved:false, timeAgo:'2h ago', image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { id:'2', title:'Sony WH-1000XM5 Headphones', price:220, originalPrice:380, condition:'Good', location:'Austin, TX', seller:'Maria S.', sellerRating:4.7, verified:true, category:'Electronics', saved:true, timeAgo:'5h ago', image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { id:'3', title:'Nike Air Jordan 1 Retro', price:340, originalPrice:180, condition:'New', location:'New York, NY', seller:'James R.', sellerRating:5.0, verified:true, category:'Clothing', saved:false, timeAgo:'1d ago', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
  { id:'4', title:'Canon EOS R6 Camera', price:1600, originalPrice:2200, condition:'Good', location:'Seattle, WA', seller:'Priya M.', sellerRating:4.8, verified:false, category:'Electronics', saved:false, timeAgo:'3d ago', image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
  { id:'5', title:'Vintage Leather Watch', price:480, originalPrice:780, condition:'Like New', location:'Chicago, IL', seller:'Tom B.', sellerRating:4.6, verified:true, category:'Clothing', saved:true, timeAgo:'1d ago', image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { id:'6', title:'Velvet Accent Sofa', price:890, originalPrice:1400, condition:'Good', location:'Miami, FL', seller:'Clara N.', sellerRating:4.9, verified:true, category:'Home & Living', saved:false, timeAgo:'2d ago', image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { id:'7', title:'Trek Carbon Road Bike', price:1200, originalPrice:2100, condition:'Good', location:'Portland, OR', seller:'Dan W.', sellerRating:4.8, verified:false, category:'Sports', saved:false, timeAgo:'4d ago', image:'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { id:'8', title:'Designer Leather Handbag', price:420, originalPrice:950, condition:'Like New', location:'Los Angeles, CA', seller:'Sophie T.', sellerRating:4.7, verified:true, category:'Clothing', saved:true, timeAgo:'6h ago', image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
];

const COND_CLR: Record<string,string> = { 'New':'bg-emerald-50 text-emerald-700 border-emerald-100', 'Like New':'bg-blue-50 text-blue-700 border-blue-100', 'Good':'bg-amber-50 text-amber-700 border-amber-100', 'Fair':'bg-orange-50 text-orange-700 border-orange-100' };

export default function MarketplaceSection() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [savedMap, setSavedMap] = useState<Record<string,boolean>>(Object.fromEntries(PRODUCTS.map(p=>[p.id,p.saved])));

  const filtered = PRODUCTS.filter(p =>
    (activeCat === 'All' || p.category === activeCat) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-padding space-y-6">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Discover amazing deals from your community</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" />List an Item
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search marketplace…" className="pl-9 rounded-xl border-slate-200 bg-white h-10" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={()=>setActiveCat(cat)} className={cn('chip text-sm', activeCat===cat ? 'chip-active' : 'chip-default')}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} items found</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(p => (
          <div key={p.id} className="card-premium group cursor-pointer overflow-hidden">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {p.originalPrice > p.price && (
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </span>
                </div>
              )}
              <button
                onClick={e=>{e.stopPropagation(); setSavedMap(s=>({...s,[p.id]:!s[p.id]}));}}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <Heart className={cn('h-4 w-4 transition-colors', savedMap[p.id] ? 'fill-red-500 text-red-500' : 'text-slate-400')} />
              </button>
              {p.verified && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 text-[11px] font-semibold text-slate-700 px-2 py-0.5 rounded-full shadow-sm">
                  <CheckCircle2 className="h-3 w-3 text-blue-500" />Verified
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight text-slate-900 line-clamp-2 flex-1">{p.title}</h3>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md border flex-shrink-0', COND_CLR[p.condition]??'bg-slate-100 text-slate-600 border-slate-200')}>
                    {p.condition}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-[17px] font-bold text-slate-900">${p.price.toLocaleString()}</span>
                  {p.originalPrice > p.price && <span className="text-sm text-slate-400 line-through">${p.originalPrice.toLocaleString()}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{p.location}</span>
                <span className="ml-auto flex-shrink-0 font-medium">{p.timeAgo}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-[11px] text-white font-bold flex-shrink-0">
                    {p.seller[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-none">{p.seller}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] text-slate-500">{p.sellerRating}</span>
                    </div>
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
          <h3 className="font-semibold text-slate-700">No results found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
