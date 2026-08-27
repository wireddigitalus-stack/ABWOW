"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Briefcase, Calculator, MessageSquare, 
  Phone, Mail, MessageCircle, Calendar, MapPin, ChevronDown, ChevronUp, 
  Trash2, Plus, ArrowRight, DollarSign, Wrench, Fuel, CheckSquare, 
  Square, Printer, X, Edit3, ExternalLink, ShieldCheck, CheckCircle2, Clock
} from "lucide-react";
import { 
  getLeads, updateLead, deleteLead, 
  getJobs, addJob, updateJob, deleteJob, createJobFromLead,
  getEstimates, updateEstimate, 
  getChatLogs, getDashboardStats 
} from '@/lib/store';
import type { Lead, Job, JobMaterial, JobLabor, JobEquipment, Estimate, ChatLog } from '@/lib/store';

type TabType = "dashboard" | "leads" | "jobs" | "estimates" | "chats";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // Modals & Selection States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNoteInput, setLeadNoteInput] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [jobFilter, setJobFilter] = useState<string>("all");
  
  // Expandable Chat rows
  const [expandedChats, setExpandedChats] = useState<Record<string, boolean>>({});

  const loadData = () => {
    const l = getLeads();
    const j = getJobs();
    const e = getEstimates();
    const c = getChatLogs();
    const s = getDashboardStats();
    
    setLeads(l);
    setJobs(j);
    setEstimates(e);
    setChatLogs(c);
    setStats(s);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Lead Handlers
  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadNoteInput(lead.notes || "");
  };

  const handleUpdateLeadStatus = (id: string, status: Lead["status"]) => {
    updateLead(id, { status });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status } : null);
    }
    loadData();
  };

  const handleSaveLeadNotes = () => {
    if (!selectedLead) return;
    updateLead(selectedLead.id, { notes: leadNoteInput });
    setSelectedLead(prev => prev ? { ...prev, notes: leadNoteInput } : null);
    loadData();
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id);
      if (selectedLead?.id === id) setSelectedLead(null);
      loadData();
    }
  };

  const handleConvertLeadToJob = (lead: Lead) => {
    const contractPrice = lead.service?.toLowerCase().includes("commercial") ? 12500 : 4200;
    const newJob = createJobFromLead(lead, contractPrice);
    setSelectedLead(null);
    setSelectedJob(newJob);
    setIsEditingJob(true);
    setActiveTab("jobs");
    loadData();
  };

  // Job Handlers
  const handleCreateNewJob = () => {
    const newJob = addJob({
      clientName: "New Client",
      clientPhone: "(423) ",
      jobAddress: "Tri-Cities, TN",
      serviceType: "Residential Driveway Paving",
      contractPrice: 4500,
      status: "scheduled",
      startDate: new Date().toISOString().split("T")[0],
      materials: [
        { id: `m-${Date.now()}-1`, item: "Surface Hot Mix Asphalt", quantity: 20, unit: "Tons", unitCost: 85, totalCost: 1700 },
        { id: `m-${Date.now()}-2`, item: "SS-1h Tack Coat", quantity: 15, unit: "Gallons", unitCost: 8.5, totalCost: 127.50 }
      ],
      labor: [
        { id: `l-${Date.now()}-1`, role: "Paving Crew (3 Person)", crewCount: 3, hours: 8, hourlyRate: 30, totalCost: 720 }
      ],
      equipment: [
        { id: `e-${Date.now()}-1`, equipmentName: "CAT Roller & Support Truck", fuelCost: 120, maintenanceReserve: 150, rentalOrOperatingCost: 200, totalCost: 470 }
      ],
      checklist: {
        sitePrepDone: false,
        baseCompacted: false,
        tackApplied: false,
        asphaltRolled: false,
        edgesTamped: false,
        cleanupComplete: false
      },
      notes: "Job created by Alan Bracken."
    });
    setSelectedJob(newJob);
    setIsEditingJob(true);
    loadData();
  };

  const handleSaveJob = (jobToSave: Job) => {
    updateJob(jobToSave.id, jobToSave);
    setSelectedJob(jobToSave);
    loadData();
    setIsEditingJob(false);
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm("Are you sure you want to delete this job work order?")) {
      deleteJob(id);
      if (selectedJob?.id === id) setSelectedJob(null);
      loadData();
    }
  };

  // Estimate Handlers
  const handleUpdateEstimateStatus = (id: string, status: string) => {
    updateEstimate(id, { status: status as Estimate["status"] });
    loadData();
  };

  const toggleChat = (id: string) => {
    setExpandedChats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper Calculations
  const calculateJobFinancials = (job: Job) => {
    const matCost = (job.materials || []).reduce((sum, m) => sum + (Number(m.totalCost) || 0), 0);
    const labCost = (job.labor || []).reduce((sum, l) => sum + (Number(l.totalCost) || 0), 0);
    const eqCost = (job.equipment || []).reduce((sum, e) => sum + (Number(e.totalCost) || 0), 0);
    const totalCosts = matCost + labCost + eqCost;
    const profit = (job.contractPrice || 0) - totalCosts;
    const margin = job.contractPrice > 0 ? Math.round((profit / job.contractPrice) * 100) : 0;
    return { matCost, labCost, eqCost, totalCosts, profit, margin };
  };

  const statusColors: Record<string, string> = {
    'new': 'bg-red-500/20 text-red-400 border-red-500/30',
    'contacted': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'quoted': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'won': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'lost': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'scheduled': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'in-progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse',
    'completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'invoiced': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'paid': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    const colorClass = statusColors[s] || 'bg-white/10 text-white/70 border-white/20';
    return `px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass} uppercase tracking-wider`;
  };

  const filteredJobs = jobs.filter(j => {
    if (jobFilter === "all") return true;
    return j.status === jobFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto bg-[#111111] p-1.5 rounded-xl border border-white/10 hide-scrollbar gap-1">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "leads", label: `Leads (${leads.length})`, icon: Users },
          { id: "jobs", label: `Jobs / Costing (${jobs.length})`, icon: Briefcase },
          { id: "estimates", label: `Estimates (${estimates.length})`, icon: Calculator },
          { id: "chats", label: `Chats (${chatLogs.length})`, icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                isActive 
                  ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: DASHBOARD TAB                                          */}
      {/* ============================================================ */}
      {activeTab === "dashboard" && stats && (
        <div className="space-y-8">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Leads", value: stats.totalLeads, sub: `${stats.todayLeads} received today`, icon: Users, color: "text-[#DC2626]", bg: "bg-[#DC2626]/10" },
              { label: "Active Jobs", value: stats.activeJobs, sub: `${stats.completedJobs} completed`, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Total Revenue", value: `$${(stats.totalRevenue || 0).toLocaleString()}`, sub: "Contract value", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Est. Gross Profit", value: `$${(stats.grossProfit || 0).toLocaleString()}`, sub: `${stats.profitMargin}% avg margin`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Estimates & Chats", value: stats.totalEstimates + stats.totalChats, sub: `${stats.totalEstimates} est · ${stats.totalChats} chats`, icon: Calculator, color: "text-amber-400", bg: "bg-amber-500/10" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-[#111111] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-1.5">{stat.value || 0}</h3>
                      <p className="text-xs text-white/40 mt-1">{stat.sub}</p>
                    </div>
                    <div className={`p-3 ${stat.bg} rounded-xl border border-white/5`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Recent Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leads (Clickable) */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Recent Client Inquiries</h3>
                  <p className="text-xs text-white/50">Click any lead for instant 1-tap call/text or work order</p>
                </div>
                <button 
                  onClick={() => setActiveTab("leads")}
                  className="text-xs text-[#DC2626] hover:underline font-semibold flex items-center gap-1"
                >
                  View All ({leads.length}) <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {(stats.recentLeads || []).map((lead: Lead) => (
                  <div 
                    key={lead.id}
                    onClick={() => handleOpenLead(lead)}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-[#DC2626] transition-colors">{lead.name || 'Anonymous'}</span>
                        <span className={getStatusBadge(lead.status)}>{lead.status}</span>
                      </div>
                      <p className="text-xs text-white/60 flex items-center gap-2">
                        <span>{lead.service || 'Paving Project'}</span>
                        <span>•</span>
                        <span>{lead.phone}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                      <span className="text-xs hidden sm:inline font-medium text-white/50">Open details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
                {(!stats.recentLeads || stats.recentLeads.length === 0) && (
                  <p className="text-white/50 text-sm py-4 text-center">No recent leads found.</p>
                )}
              </div>
            </div>

            {/* Active Jobs & Live Financials */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Active Jobs & Costing</h3>
                  <p className="text-xs text-white/50">Track labor, asphalt tonnage & equipment expenses</p>
                </div>
                <button 
                  onClick={() => setActiveTab("jobs")}
                  className="text-xs text-[#DC2626] hover:underline font-semibold flex items-center gap-1"
                >
                  View All ({jobs.length}) <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {jobs.slice(0, 4).map((job: Job) => {
                  const fin = calculateJobFinancials(job);
                  return (
                    <div 
                      key={job.id}
                      onClick={() => { setSelectedJob(job); setActiveTab("jobs"); }}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#DC2626] font-bold">{job.jobNumber}</span>
                          <span className="font-bold text-white">{job.clientName}</span>
                          <span className={getStatusBadge(job.status)}>{job.status}</span>
                        </div>
                        <p className="text-xs text-white/60">{job.serviceType}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-emerald-400">+${fin.profit.toLocaleString()}</div>
                        <div className="text-[10px] text-white/40">{fin.margin}% margin on ${job.contractPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={handleCreateNewJob}
                  className="w-full py-3 border border-dashed border-white/20 hover:border-[#DC2626] hover:text-[#DC2626] rounded-xl text-xs font-bold text-white/60 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create New Work Order / Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: LEADS TAB (SUPER CLICKABLE ON MOBILE & DESKTOP)        */}
      {/* ============================================================ */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Lead Management</h2>
              <p className="text-sm text-white/60">Tap any client inquiry to call, text, navigate, or convert directly into a job</p>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-12 text-center text-white/50">
              No leads currently in the database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((lead) => (
                <div 
                  key={lead.id} 
                  onClick={() => handleOpenLead(lead)}
                  className="bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all shadow-lg group relative"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-white group-hover:text-[#DC2626] transition-colors">{lead.name || 'Anonymous'}</h3>
                        <p className="text-xs text-white/40">{new Date(lead.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={getStatusBadge(lead.status)}>{lead.status}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {lead.service && (
                        <div className="text-xs font-semibold text-white/80 bg-white/5 px-2.5 py-1.5 rounded-md inline-block">
                          {lead.service}
                        </div>
                      )}
                      {lead.address && (
                        <p className="text-xs text-white/60 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                          <span className="truncate">{lead.address}</span>
                        </p>
                      )}
                      {lead.message && (
                        <p className="text-xs text-white/70 line-clamp-2 bg-black/40 p-2.5 rounded-lg border border-white/5 italic">
                          &ldquo;{lead.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 1-Tap Quick Action Row */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <a 
                      href={`tel:${lead.phone}`}
                      className="flex-1 py-2 px-3 bg-[#002868] hover:bg-[#001f4d] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a 
                      href={`sms:${lead.phone}`}
                      className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      title="Send SMS Text"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Text
                    </a>
                    <button 
                      onClick={() => handleConvertLeadToJob(lead)}
                      className="py-2 px-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
                      title="Convert to Active Job"
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: JOBS, LABOR, MATERIALS & EQUIPMENT COSTING             */}
      {/* ============================================================ */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Job Work Orders & Costing</h2>
              <p className="text-sm text-white/60">Manage asphalt tonnage, crew labor, equipment fuel & repairs to track real profit</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#DC2626]"
              >
                <option value="all">All Jobs ({jobs.length})</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
              </select>
              <button 
                onClick={handleCreateNewJob}
                className="px-4 py-2.5 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors whitespace-nowrap shadow-lg shadow-[#DC2626]/20"
              >
                <Plus className="w-4 h-4" /> New Job
              </button>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-12 text-center space-y-4">
              <p className="text-white/50">No jobs matching this filter.</p>
              <button 
                onClick={handleCreateNewJob}
                className="px-6 py-3 bg-[#DC2626] text-white rounded-xl font-bold text-sm"
              >
                Create Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredJobs.map((job) => {
                const fin = calculateJobFinancials(job);
                return (
                  <div 
                    key={job.id}
                    className="bg-[#111111] border border-white/10 hover:border-white/20 rounded-2xl p-6 space-y-5 transition-all shadow-xl"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded border border-[#DC2626]/20">
                            {job.jobNumber}
                          </span>
                          <span className={getStatusBadge(job.status)}>{job.status}</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-white mt-2">{job.clientName}</h3>
                        <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#DC2626]" /> {job.jobAddress}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/50 uppercase font-medium">Contract Price</p>
                        <p className="text-2xl font-black text-white">${job.contractPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Cost Breakdown Grid */}
                    <div className="grid grid-cols-4 gap-2 bg-black/40 p-3.5 rounded-xl border border-white/5 text-center">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Materials</p>
                        <p className="text-xs font-bold text-white mt-0.5">${fin.matCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Labor</p>
                        <p className="text-xs font-bold text-white mt-0.5">${fin.labCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Equipment</p>
                        <p className="text-xs font-bold text-white mt-0.5">${fin.eqCost.toLocaleString()}</p>
                      </div>
                      <div className="border-l border-white/10 pl-1">
                        <p className="text-[10px] text-emerald-400 uppercase font-bold">Net Profit</p>
                        <p className="text-sm font-black text-emerald-400 mt-0.5">+${fin.profit.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Job Scope & Date */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-white/60 gap-2">
                      <div>
                        <span className="font-semibold text-white">Service: </span>
                        <span>{job.serviceType}</span>
                      </div>
                      {job.startDate && (
                        <div className="flex items-center gap-1 text-white/50">
                          <Calendar className="w-3.5 h-3.5 text-[#DC2626]" /> Start: {job.startDate}
                        </div>
                      )}
                    </div>

                    {/* Checklist summary */}
                    {job.checklist && (
                      <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2 text-[11px]">
                        <span className={`px-2 py-0.5 rounded ${job.checklist.sitePrepDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>Prep</span>
                        <span className={`px-2 py-0.5 rounded ${job.checklist.baseCompacted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>Base</span>
                        <span className={`px-2 py-0.5 rounded ${job.checklist.tackApplied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>Tack</span>
                        <span className={`px-2 py-0.5 rounded ${job.checklist.asphaltRolled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>Compacted</span>
                        <span className={`px-2 py-0.5 rounded ${job.checklist.cleanupComplete ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>Cleanup</span>
                      </div>
                    )}

                    {/* Action Row */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <button 
                        onClick={() => { setSelectedJob(job); setIsEditingJob(true); }}
                        className="flex-1 py-2.5 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Materials & Labor
                      </button>
                      <button 
                        onClick={() => { setSelectedJob(job); setIsEditingJob(false); }}
                        className="py-2.5 px-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Print Work Order"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ESTIMATES TAB                                         */}
      {/* ============================================================ */}
      {activeTab === "estimates" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Online Estimate Inquiries</h2>
          {estimates.length === 0 ? (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 text-center text-white/50">
              No estimate submissions found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...estimates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((estimate) => (
                <div key={estimate.id} className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">{estimate.name || 'Anonymous'}</h3>
                        <p className="text-xs text-white/40">{new Date(estimate.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={getStatusBadge(estimate.status || 'new')}>{estimate.status || 'New'}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4 bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-white/50">Job Type</div>
                        <div className="text-white font-semibold text-right">{estimate.jobType || 'N/A'}</div>
                        
                        <div className="text-white/50">Service</div>
                        <div className="text-white font-semibold text-right">{estimate.serviceType || 'N/A'}</div>
                        
                        <div className="text-white/50">Area</div>
                        <div className="text-white font-semibold text-right">{estimate.area} {estimate.areaUnit}</div>
                        
                        <div className="text-white/50 pt-2 border-t border-white/5">Ballpark Est.</div>
                        <div className="text-[#DC2626] font-bold text-right pt-2 border-t border-white/5">{estimate.estimatedCost || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4 text-xs">
                      {estimate.email && (
                        <a href={`mailto:${estimate.email}`} className="flex items-center gap-2 text-white/70 hover:text-white hover:underline">
                          <Mail className="w-4 h-4 text-[#002868]" /> {estimate.email}
                        </a>
                      )}
                      {estimate.phone && (
                        <a href={`tel:${estimate.phone}`} className="flex items-center gap-2 text-white/70 hover:text-white hover:underline">
                          <Phone className="w-4 h-4 text-[#DC2626]" /> {estimate.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex gap-2">
                    <select 
                      value={estimate.status || 'New'}
                      onChange={(e) => handleUpdateEstimateStatus(estimate.id, e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#DC2626]"
                    >
                      <option value="New">New</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <a 
                      href={`tel:${estimate.phone}`}
                      className="px-3 py-1.5 bg-[#002868] text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: CHAT LOGS TAB                                         */}
      {/* ============================================================ */}
      {activeTab === "chats" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">AI Assistant Conversation Logs</h2>
          {chatLogs.length === 0 ? (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 text-center text-white/50">
              No chat logs found.
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl">
              {[...chatLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((chat) => (
                <div key={chat.id} className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => toggleChat(chat.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#DC2626]/10 rounded-xl text-[#DC2626] border border-[#DC2626]/20">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{chat.leadName || 'Visitor'}</h3>
                          {chat.leadPhone && (
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                              {chat.leadPhone}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">{new Date(chat.createdAt).toLocaleString()} • {chat.messages?.length || 0} messages</p>
                      </div>
                    </div>
                    <div className="text-white/50">
                      {expandedChats[chat.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  {expandedChats[chat.id] && chat.messages && (
                    <div className="p-5 border-t border-white/10 bg-black/30 space-y-4 max-h-[500px] overflow-y-auto">
                      {chat.messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                            msg.role === 'user' 
                              ? 'bg-[#DC2626] text-white rounded-tr-sm' 
                              : 'bg-[#222222] text-white border border-white/10 rounded-tl-sm'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: LEAD DETAIL & FAST ACTION DRAWER                     */}
      {/* ============================================================ */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Client Lead Profile</span>
                <span className={getStatusBadge(selectedLead.status)}>{selectedLead.status}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedLead.name}</h2>
              <p className="text-xs text-white/50 mt-1">Received {new Date(selectedLead.createdAt).toLocaleString()} via {selectedLead.source}</p>
            </div>

            {/* 1-Tap Big Contact Action Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a 
                href={`tel:${selectedLead.phone}`}
                className="py-3 px-3 bg-[#002868] hover:bg-[#001f4d] text-white rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Call Client</span>
              </a>
              <a 
                href={`sms:${selectedLead.phone}`}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Text / SMS</span>
              </a>
              {selectedLead.email ? (
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="py-3 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              ) : (
                <div className="py-3 px-3 bg-white/5 text-white/30 rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>No Email</span>
                </div>
              )}
              {selectedLead.address ? (
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedLead.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#DC2626]" />
                  <span>GPS Map</span>
                </a>
              ) : (
                <div className="py-3 px-3 bg-white/5 text-white/30 rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>No Address</span>
                </div>
              )}
            </div>

            {/* Details Box */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50 text-xs">Phone Number:</span>
                <span className="font-mono font-bold text-white">{selectedLead.phone}</span>
              </div>
              {selectedLead.address && (
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50 text-xs">Job Location:</span>
                  <span className="font-semibold text-white text-right">{selectedLead.address}</span>
                </div>
              )}
              {selectedLead.service && (
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50 text-xs">Service Requested:</span>
                  <span className="font-semibold text-[#DC2626] text-right">{selectedLead.service}</span>
                </div>
              )}
              {selectedLead.message && (
                <div className="pt-1">
                  <span className="text-white/50 text-xs block mb-1">Inquiry Message:</span>
                  <p className="text-white/90 bg-white/5 p-3 rounded-xl italic">&ldquo;{selectedLead.message}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Quick Status Buttons */}
            <div>
              <label className="text-xs text-white/50 font-bold uppercase tracking-wider block mb-2">Update Lead Status</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['new', 'contacted', 'quoted', 'won', 'lost'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, st)}
                    className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                      selectedLead.status === st
                        ? 'bg-[#DC2626] text-white shadow-lg'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <label className="text-xs text-white/50 font-bold uppercase tracking-wider block">Job & Client Notes</label>
              <textarea
                value={leadNoteInput}
                onChange={(e) => setLeadNoteInput(e.target.value)}
                placeholder="Add notes from your phone call, site visit dimensions, or special customer requests..."
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#DC2626]"
              />
              <button
                onClick={handleSaveLeadNotes}
                className="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors"
              >
                Save Notes
              </button>
            </div>

            {/* Major CTA: Convert to Job */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => handleConvertLeadToJob(selectedLead)}
                className="w-full py-4 bg-gradient-to-r from-[#DC2626] to-[#b91c1c] text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#DC2626]/30 hover:opacity-90 transition-all"
              >
                <Briefcase className="w-5 h-5" /> Convert into Active Work Order / Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: FULL JOB WORK ORDER & COSTING EDITOR                */}
      {/* ============================================================ */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/15 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header & Financials Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#DC2626] bg-[#DC2626]/10 px-2.5 py-1 rounded border border-[#DC2626]/30">
                    {selectedJob.jobNumber}
                  </span>
                  <span className={getStatusBadge(selectedJob.status)}>{selectedJob.status}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">{selectedJob.clientName}</h2>
                <p className="text-xs text-white/50">{selectedJob.jobAddress} • {selectedJob.clientPhone}</p>
              </div>

              <div className="text-right bg-black/50 p-3.5 rounded-2xl border border-white/10 w-full sm:w-auto">
                <div className="text-xs text-white/50 font-medium">Contract Price</div>
                <div className="text-2xl font-black text-white">${selectedJob.contractPrice.toLocaleString()}</div>
              </div>
            </div>

            {/* Profit Margin Summary Banner */}
            {(() => {
              const fin = calculateJobFinancials(selectedJob);
              return (
                <div className="bg-gradient-to-r from-black/80 to-[#161616] p-4 rounded-2xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-bold">Materials Cost</span>
                    <p className="text-sm font-bold text-white mt-0.5">${fin.matCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-bold">Labor Cost</span>
                    <p className="text-sm font-bold text-white mt-0.5">${fin.labCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-bold">Equipment & Fuel</span>
                    <p className="text-sm font-bold text-white mt-0.5">${fin.eqCost.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-1 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold">Est. Gross Profit</span>
                    <p className="text-base font-black text-emerald-400 mt-0.5">+${fin.profit.toLocaleString()} ({fin.margin}%)</p>
                  </div>
                </div>
              );
            })()}

            {/* Job Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs text-white/50 font-bold uppercase tracking-wider">Job Workflow Status:</label>
              <div className="flex flex-wrap gap-1.5">
                {(['scheduled', 'in-progress', 'completed', 'invoiced', 'paid'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      const updated = { ...selectedJob, status: st };
                      handleSaveJob(updated);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      selectedJob.status === st 
                        ? 'bg-[#DC2626] text-white shadow-lg' 
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 1: MATERIALS */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                  1. Materials (Asphalt, Tack, Stone, Paint)
                </h3>
                <button
                  onClick={() => {
                    const newMat: JobMaterial = {
                      id: `m-${Date.now()}`,
                      item: "Surface Asphalt Hot Mix",
                      quantity: 10,
                      unit: "Tons",
                      unitCost: 85,
                      totalCost: 850
                    };
                    const updated = { ...selectedJob, materials: [...(selectedJob.materials || []), newMat] };
                    setSelectedJob(updated);
                  }}
                  className="text-xs text-[#DC2626] hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Material
                </button>
              </div>

              <div className="space-y-2">
                {(selectedJob.materials || []).map((mat, idx) => (
                  <div key={mat.id} className="grid grid-cols-12 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 items-center text-xs">
                    <input 
                      type="text" 
                      value={mat.item}
                      onChange={(e) => {
                        const newMats = [...selectedJob.materials];
                        newMats[idx].item = e.target.value;
                        setSelectedJob({ ...selectedJob, materials: newMats });
                      }}
                      className="col-span-5 bg-transparent border-0 text-white font-medium focus:outline-none" 
                    />
                    <div className="col-span-2 flex items-center gap-1">
                      <input 
                        type="number" 
                        value={mat.quantity}
                        onChange={(e) => {
                          const newMats = [...selectedJob.materials];
                          const q = Number(e.target.value) || 0;
                          newMats[idx].quantity = q;
                          newMats[idx].totalCost = q * newMats[idx].unitCost;
                          setSelectedJob({ ...selectedJob, materials: newMats });
                        }}
                        className="w-12 bg-white/5 text-center text-white rounded py-1" 
                      />
                      <span className="text-white/40">{mat.unit}</span>
                    </div>
                    <div className="col-span-2 text-white/70">
                      ${mat.unitCost}/u
                    </div>
                    <div className="col-span-2 text-right font-bold text-white">
                      ${mat.totalCost.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => {
                        const newMats = selectedJob.materials.filter((_, i) => i !== idx);
                        setSelectedJob({ ...selectedJob, materials: newMats });
                      }}
                      className="col-span-1 text-white/30 hover:text-red-400 flex justify-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: LABOR & CREW */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  2. Labor & Crew Hours
                </h3>
                <button
                  onClick={() => {
                    const newLab: JobLabor = {
                      id: `l-${Date.now()}`,
                      role: "Roller / Paver Operator",
                      crewCount: 2,
                      hours: 8,
                      hourlyRate: 35,
                      totalCost: 560
                    };
                    const updated = { ...selectedJob, labor: [...(selectedJob.labor || []), newLab] };
                    setSelectedJob(updated);
                  }}
                  className="text-xs text-blue-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Labor Row
                </button>
              </div>

              <div className="space-y-2">
                {(selectedJob.labor || []).map((lab, idx) => (
                  <div key={lab.id} className="grid grid-cols-12 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 items-center text-xs">
                    <input 
                      type="text" 
                      value={lab.role}
                      onChange={(e) => {
                        const newLab = [...selectedJob.labor];
                        newLab[idx].role = e.target.value;
                        setSelectedJob({ ...selectedJob, labor: newLab });
                      }}
                      className="col-span-5 bg-transparent border-0 text-white font-medium focus:outline-none" 
                    />
                    <div className="col-span-2 text-white/70">
                      {lab.crewCount} crew × {lab.hours}h
                    </div>
                    <div className="col-span-2 text-white/70">
                      ${lab.hourlyRate}/hr
                    </div>
                    <div className="col-span-2 text-right font-bold text-white">
                      ${lab.totalCost.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => {
                        const newLab = selectedJob.labor.filter((_, i) => i !== idx);
                        setSelectedJob({ ...selectedJob, labor: newLab });
                      }}
                      className="col-span-1 text-white/30 hover:text-red-400 flex justify-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: EQUIPMENT, FUEL & MAINTENANCE ALLOCATION */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  3. Equipment, Fuel & Maintenance Reserve
                </h3>
                <button
                  onClick={() => {
                    const newEq: JobEquipment = {
                      id: `e-${Date.now()}`,
                      equipmentName: "CAT CB64B Roller",
                      fuelCost: 150,
                      maintenanceReserve: 200,
                      rentalOrOperatingCost: 300,
                      totalCost: 650
                    };
                    const updated = { ...selectedJob, equipment: [...(selectedJob.equipment || []), newEq] };
                    setSelectedJob(updated);
                  }}
                  className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Equipment
                </button>
              </div>

              <div className="space-y-2">
                {(selectedJob.equipment || []).map((eq, idx) => (
                  <div key={eq.id} className="grid grid-cols-12 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 items-center text-xs">
                    <input 
                      type="text" 
                      value={eq.equipmentName}
                      onChange={(e) => {
                        const newEq = [...selectedJob.equipment];
                        newEq[idx].equipmentName = e.target.value;
                        setSelectedJob({ ...selectedJob, equipment: newEq });
                      }}
                      className="col-span-5 bg-transparent border-0 text-white font-medium focus:outline-none" 
                    />
                    <div className="col-span-2 text-white/70">
                      Fuel: ${eq.fuelCost}
                    </div>
                    <div className="col-span-2 text-white/70">
                      Maint: ${eq.maintenanceReserve}
                    </div>
                    <div className="col-span-2 text-right font-bold text-white">
                      ${eq.totalCost.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => {
                        const newEq = selectedJob.equipment.filter((_, i) => i !== idx);
                        setSelectedJob({ ...selectedJob, equipment: newEq });
                      }}
                      className="col-span-1 text-white/30 hover:text-red-400 flex justify-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: QUALITY CHECKLIST */}
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#DC2626]" /> On-Site Quality & Compaction Checklist
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'sitePrepDone', label: 'Site Prep & Grading' },
                  { key: 'baseCompacted', label: 'Base Compacted & Proof-Rolled' },
                  { key: 'tackApplied', label: 'Tack Coat Emulsion Applied' },
                  { key: 'asphaltRolled', label: 'Hot Mix Rolled to Density' },
                  { key: 'edgesTamped', label: 'Edges Tamped & Beveled' },
                  { key: 'cleanupComplete', label: 'Job Site Swept & Cleaned' },
                ].map(item => {
                  const isChecked = selectedJob.checklist ? (selectedJob.checklist as any)[item.key] : false;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        const updatedChecklist = {
                          ...(selectedJob.checklist || {}),
                          [item.key]: !isChecked
                        };
                        setSelectedJob({ ...selectedJob, checklist: updatedChecklist as any });
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                          : 'bg-white/5 border-white/5 text-white/40'
                      }`}
                    >
                      {isChecked ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4" />}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Work Order
                </button>
                <button
                  onClick={() => handleDeleteJob(selectedJob.id)}
                  className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>

              <button
                onClick={() => handleSaveJob(selectedJob)}
                className="w-full sm:w-auto px-8 py-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-extrabold rounded-xl text-sm shadow-xl shadow-[#DC2626]/20 transition-all"
              >
                Save Work Order & Costing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
