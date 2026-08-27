"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Calculator, MessageSquare, 
  Phone, Mail, Calendar, MapPin, ChevronDown, ChevronUp, Trash2
} from "lucide-react";
import { 
  getLeads, updateLead, deleteLead, 
  getEstimates, updateEstimate, 
  getChatLogs, getDashboardStats 
} from '@/lib/store';
import type { Lead, Estimate, ChatLog } from '@/lib/store';

type TabType = "dashboard" | "leads" | "estimates" | "chats";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // States for expandable rows
  const [expandedChats, setExpandedChats] = useState<Record<string, boolean>>({});

  const loadData = () => {
    setLeads(getLeads());
    setEstimates(getEstimates());
    setChatLogs(getChatLogs());
    setStats(getDashboardStats());
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleUpdateLeadStatus = (id: string, status: string) => {
    updateLead(id, { status: status as Lead["status"] });
    loadData();
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id);
      loadData();
    }
  };

  const handleUpdateEstimateStatus = (id: string, status: string) => {
    updateEstimate(id, { status: status as Estimate["status"] });
    loadData();
  };

  const toggleChat = (id: string) => {
    setExpandedChats(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const statusColors: Record<string, string> = {
    'new': 'bg-green-500/20 text-green-400 border-green-500/30',
    'contacted': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'quoted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'won': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'lost': 'bg-red-500/20 text-red-400 border-red-500/30',
    'reviewed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'scheduled': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'closed': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    const colorClass = statusColors[s] || 'bg-white/10 text-white/70 border-white/20';
    return `px-2 py-1 rounded-full text-xs font-medium border ${colorClass} uppercase tracking-wider`;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto bg-[#111111] p-1 rounded-lg border border-white/10 hide-scrollbar">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "leads", label: "Leads", icon: Users },
          { id: "estimates", label: "Estimates", icon: Calculator },
          { id: "chats", label: "Chat Logs", icon: MessageSquare }
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

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Total Leads", value: stats.totalLeads, icon: Users },
                { label: "New Leads", value: stats.newLeads, icon: Users },
                { label: "Today's Leads", value: stats.todayLeads, icon: Calendar },
                { label: "Estimates", value: stats.totalEstimates, icon: Calculator },
                { label: "Chats", value: stats.totalChats, icon: MessageSquare },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-[#111111] border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white/50 text-sm">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{stat.value || 0}</h3>
                      </div>
                      <div className="p-2.5 bg-[#DC2626]/10 rounded-xl border border-[#DC2626]/20">
                        <Icon className="w-5 h-5 text-[#DC2626]" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Leads by Source</h3>
                <div className="space-y-4">
                  {(stats.leadsBySource || []).map((source: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-white/70">{source.name}</span>
                      <span className="font-semibold text-white">{source.count}</span>
                    </div>
                  ))}
                  {(!stats.leadsBySource || stats.leadsBySource.length === 0) && (
                    <p className="text-white/50 text-sm">No source data available.</p>
                  )}
                </div>
              </div>

              <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Leads</h3>
                <div className="space-y-4">
                  {(stats.recentLeads || []).map((lead: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-white">{lead.name || 'Anonymous'}</p>
                        <p className="text-xs text-white/50">{new Date(lead.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={getStatusBadge(lead.status || 'new')}>{lead.status || 'New'}</span>
                    </div>
                  ))}
                  {(!stats.recentLeads || stats.recentLeads.length === 0) && (
                    <p className="text-white/50 text-sm">No recent leads found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Lead Management</h2>
            {leads.length === 0 ? (
              <div className="bg-[#111111] border border-white/10 rounded-xl p-8 text-center text-white/50">
                No leads found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((lead) => (
                  <div key={lead.id} className="bg-[#111111] border border-white/10 rounded-xl p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">{lead.name || 'Anonymous'}</h3>
                        <p className="text-xs text-white/40">{new Date(lead.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={getStatusBadge(lead.status)}>{lead.status}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4 flex-grow">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:underline">
                          <Mail className="w-4 h-4 text-[#002868]" /> {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:underline">
                          <Phone className="w-4 h-4 text-[#DC2626]" /> {lead.phone}
                        </a>
                      )}
                      {lead.service && (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <LayoutDashboard className="w-4 h-4 text-white/50" /> {lead.service}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <MapPin className="w-4 h-4 text-white/50" /> Source: {lead.source || 'N/A'}
                      </div>
                      
                      {lead.notes && (
                        <div className="mt-4 pt-4 border-t border-white/5 text-sm text-white/60 bg-white/5 p-3 rounded">
                          <strong>Notes:</strong> {lead.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 mt-auto">
                      <div className="flex gap-2 items-center">
                        <select 
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#DC2626] flex-grow"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ESTIMATES TAB */}
        {activeTab === "estimates" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Estimate Requests</h2>
            {estimates.length === 0 ? (
              <div className="bg-[#111111] border border-white/10 rounded-xl p-8 text-center text-white/50">
                No estimates found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...estimates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((estimate) => (
                  <div key={estimate.id} className="bg-[#111111] border border-white/10 rounded-xl p-5 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">{estimate.name || 'Anonymous'}</h3>
                        <p className="text-xs text-white/40">{new Date(estimate.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={getStatusBadge(estimate.status || 'new')}>{estimate.status || 'New'}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4 bg-black/30 p-3 rounded-lg border border-white/5">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-white/50">Job Type</div>
                        <div className="text-white font-medium text-right">{estimate.jobType || 'N/A'}</div>
                        
                        <div className="text-white/50">Service</div>
                        <div className="text-white font-medium text-right">{estimate.serviceType || 'N/A'}</div>
                        
                        <div className="text-white/50">Area</div>
                        <div className="text-white font-medium text-right">{estimate.area || 'N/A'}</div>
                        
                        <div className="text-white/50 pt-2 border-t border-white/5">Est. Cost</div>
                        <div className="text-[#DC2626] font-bold text-right pt-2 border-t border-white/5">{estimate.estimatedCost || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {estimate.email && (
                        <a href={`mailto:${estimate.email}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:underline">
                          <Mail className="w-4 h-4 text-[#002868]" /> {estimate.email}
                        </a>
                      )}
                      {estimate.phone && (
                        <a href={`tel:${estimate.phone}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:underline">
                          <Phone className="w-4 h-4 text-[#DC2626]" /> {estimate.phone}
                        </a>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 mt-auto">
                      <select 
                        value={estimate.status || 'New'}
                        onChange={(e) => handleUpdateEstimateStatus(estimate.id, e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#DC2626]"
                      >
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHAT LOGS TAB */}
        {activeTab === "chats" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Chat Logs</h2>
            {chatLogs.length === 0 ? (
              <div className="bg-[#111111] border border-white/10 rounded-xl p-8 text-center text-white/50">
                No chat logs found.
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                {[...chatLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((chat) => (
                  <div key={chat.id} className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleChat(chat.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#DC2626]/10 rounded-xl text-[#DC2626] border border-[#DC2626]/20">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{chat.leadName || 'Anonymous User'}</h3>
                          <p className="text-xs text-white/50">{new Date(chat.createdAt).toLocaleString()} • {chat.messages?.length || 0} messages</p>
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

      </div>
    </div>
  );
}
