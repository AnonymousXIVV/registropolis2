import React, { useState } from 'react';
import { Search, Plus, MapPin, Clock, DollarSign, Building, Bookmark, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const FILTERS = ['All', 'Remote', 'Full-time', 'Part-time', 'Contract', 'Internship'];

const JOBS = [
  { id:'1', title:'Senior Frontend Engineer', company:'Vercel', location:'Remote', salary:'$140k – $180k', type:'Full-time', remote:true, posted:'2d ago', category:'Engineering', logo:'V', color:'from-slate-800 to-slate-900', desc:'Build the future of web deployment tools with React, TypeScript, and Next.js. You will own core parts of our dashboard product.', tags:['React','TypeScript','Next.js'] },
  { id:'2', title:'Product Designer', company:'Figma', location:'San Francisco, CA', salary:'$130k – $160k', type:'Full-time', remote:false, posted:'3d ago', category:'Design', logo:'F', color:'from-violet-600 to-purple-700', desc:'Shape the design system and user experience for millions of designers worldwide. Deep knowledge of design systems required.', tags:['Figma','Design Systems','Prototyping'] },
  { id:'3', title:'Data Scientist', company:'Stripe', location:'Remote', salary:'$150k – $200k', type:'Full-time', remote:true, posted:'1d ago', category:'Data', logo:'S', color:'from-indigo-600 to-blue-700', desc:'Drive data-driven decisions across Stripe\'s payments infrastructure. Experience with ML and large datasets required.', tags:['Python','ML','SQL'] },
  { id:'4', title:'iOS Engineer', company:'Linear', location:'Remote', salary:'$160k – $210k', type:'Full-time', remote:true, posted:'5d ago', category:'Engineering', logo:'L', color:'from-slate-700 to-indigo-800', desc:'Build blazing fast native iOS experiences for our project management tool. Swift and SwiftUI experience required.', tags:['Swift','SwiftUI','iOS'] },
  { id:'5', title:'Marketing Manager', company:'Notion', location:'New York, NY', salary:'$110k – $140k', type:'Full-time', remote:false, posted:'1w ago', category:'Marketing', logo:'N', color:'from-slate-900 to-slate-800', desc:'Lead growth marketing strategies for one of the fastest-growing productivity tools. Experience with B2B SaaS required.', tags:['Growth','SEO','B2B SaaS'] },
  { id:'6', title:'Backend Engineer', company:'PlanetScale', location:'Remote', salary:'$160k – $200k', type:'Contract', remote:true, posted:'4d ago', category:'Engineering', logo:'P', color:'from-orange-600 to-rose-700', desc:'Scale distributed database infrastructure serving billions of queries. Go and MySQL expertise required.', tags:['Go','MySQL','Distributed Systems'] },
  { id:'7', title:'UX Researcher', company:'Airbnb', location:'San Francisco, CA', salary:'$120k – $150k', type:'Full-time', remote:false, posted:'6d ago', category:'Design', logo:'A', color:'from-rose-500 to-pink-600', desc:'Conduct user research to inform product decisions for our host and guest experience teams.', tags:['User Research','Usability Testing','Figma'] },
  { id:'8', title:'DevOps Engineer', company:'GitHub', location:'Remote', salary:'$145k – $190k', type:'Full-time', remote:true, posted:'2d ago', category:'Engineering', logo:'G', color:'from-slate-700 to-slate-900', desc:'Own deployment pipelines and infrastructure reliability for GitHub Actions and CI/CD systems.', tags:['Kubernetes','Terraform','AWS'] },
];

const TYPE_CLR: Record<string,string> = { 'Full-time':'bg-green-50 text-green-700 border-green-100', 'Contract':'bg-purple-50 text-purple-700 border-purple-100', 'Part-time':'bg-blue-50 text-blue-700 border-blue-100', 'Internship':'bg-amber-50 text-amber-700 border-amber-100' };

export default function JobsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = JOBS.filter(j => {
    const matchesCat =
      activeFilter === 'All' ||
      (activeFilter === 'Remote' && j.remote) ||
      j.type === activeFilter;
    return matchesCat && (j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="section-padding space-y-6">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find your next role in the community</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" />Post a Job
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs, companies…" className="pl-9 rounded-xl border-slate-200 bg-white h-10" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={()=>setActiveFilter(f)} className={cn('chip text-sm', activeFilter===f ? 'chip-active' : 'chip-default')}>
            {f}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} positions available</p>

      {/* Job Cards */}
      <div className="space-y-3">
        {filtered.map(job => (
          <div key={job.id} className="card-premium p-5 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm', job.color)}>
                {job.logo}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 leading-tight">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-sm text-slate-600 font-medium">
                        <Building className="h-3.5 w-3.5 text-slate-400" />{job.company}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />{job.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={e=>{e.stopPropagation(); setSaved(s=>{const n=new Set(s); n.has(job.id)?n.delete(job.id):n.add(job.id); return n;});}}>
                      <Bookmark className={cn('h-4.5 w-4.5 transition-colors', saved.has(job.id)?'fill-primary text-primary':'text-slate-300 hover:text-slate-500')} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{job.desc}</p>

                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {job.tags.map(tag => (
                    <span key={tag} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={cn('text-[11px] font-semibold px-2 py-1 rounded-md border', TYPE_CLR[job.type]??'bg-slate-100 text-slate-600 border-slate-200')}>
                  {job.type}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />{job.salary}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />{job.posted}
                </span>
              </div>
              <Button size="sm" className="rounded-lg gap-1.5 group-hover:bg-primary group-hover:text-white transition-colors">
                Apply <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-700">No jobs found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different filter or search term</p>
        </div>
      )}
    </div>
  );
}
