// Data store for leads, estimates, and chat logs
// Uses localStorage for persistence (upgradeable to Firebase/Supabase)

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  service?: string;
  message?: string;
  source: "contact" | "estimator" | "chatbot";
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  notes?: string;
  createdAt: string;
}

export interface Estimate {
  id: string;
  leadId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  jobType: string;
  area: number;
  areaUnit: string;
  serviceType: string;
  estimatedCost: string;
  notes?: string;
  status: "new" | "reviewed" | "quoted" | "accepted" | "declined";
  createdAt: string;
}

export interface ChatLog {
  id: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  leads: "abwow-leads",
  estimates: "abwow-estimates",
  chatLogs: "abwow-chatlogs",
};

const SAMPLE_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Marcus Vance",
    email: "marcus.vance@gmail.com",
    phone: "(423) 483-2911",
    address: "1420 W Market St, Johnson City, TN",
    service: "Residential Driveway",
    message: "Looking to replace our cracked 2,000 sq ft asphalt driveway before winter. Please call for on-site quote.",
    source: "contact",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: "lead-2",
    name: "Rachel Holston",
    email: "rachel@holstongroup.com",
    phone: "(423) 914-7720",
    address: "310 State St, Bristol, TN",
    service: "Commercial Parking Lot",
    message: "Need 6,500 sq ft commercial lot resurfaced and restriped near downtown Bristol.",
    source: "estimator",
    status: "contacted",
    notes: "Left voicemail with Rachel on 8/26. Waiting on callback.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "lead-3",
    name: "David Miller",
    email: "dmiller84@yahoo.com",
    phone: "(423) 292-3004",
    address: "Kingsport, TN",
    service: "Sealcoating & Crack Repair",
    message: "Estimate request: 1500 sq ft Residential Driveway (Sealcoating). Estimated: $375 - $1,125",
    source: "estimator",
    status: "quoted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "lead-4",
    name: "Pastor David Walker",
    email: "dwalker@bristolchurch.org",
    phone: "(423) 764-5510",
    address: "Bristol, VA",
    service: "Commercial Parking Lot",
    message: "Church parking lot paving project completed.",
    source: "contact",
    status: "won",
    notes: "Job completed successfully. Great referral source.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  }
];

const SAMPLE_ESTIMATES: Estimate[] = [
  {
    id: "est-1",
    name: "David Miller",
    email: "dmiller84@yahoo.com",
    phone: "(423) 292-3004",
    address: "Kingsport, TN",
    jobType: "Residential Driveway",
    area: 1500,
    areaUnit: "sq ft",
    serviceType: "Sealcoating",
    estimatedCost: "$375 – $1,125",
    status: "reviewed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "est-2",
    name: "Rachel Holston",
    email: "rachel@holstongroup.com",
    phone: "(423) 914-7720",
    address: "310 State St, Bristol, TN",
    jobType: "Commercial Parking Lot",
    area: 6500,
    areaUnit: "sq ft",
    serviceType: "Resurfacing / Overlay",
    estimatedCost: "$13,000 – $22,750",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  }
];

const SAMPLE_CHATS: ChatLog[] = [
  {
    id: "chat-1",
    leadName: "Marcus Vance",
    leadPhone: "(423) 483-2911",
    messages: [
      { role: "bot", content: "Hey there! 👋 I'm the ABWOW Paving assistant. Ask me anything about our paving services, get a quick price estimate, or I can connect you with Alan directly. How can I help?", timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
      { role: "user", content: "Do you pave residential driveways in Johnson City?", timestamp: new Date(Date.now() - 1000 * 60 * 49).toISOString() },
      { role: "bot", content: "We specialize in residential driveways across the Tri-Cities! From brand new asphalt installation to resurfacing and tear-outs, Alan ensures every job is built to last with proper base and compaction. Would you like a free quote?", timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString() },
      { role: "user", content: "Yes please, my name is Marcus Vance and number is (423) 483-2911", timestamp: new Date(Date.now() - 1000 * 60 * 46).toISOString() },
      { role: "bot", content: "Got it! I've noted down your number. Alan will reach out soon. Anything else?", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

// Generic helpers
function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    
    // Seed initial data if empty
    if (key === STORAGE_KEYS.leads) {
      setItems(STORAGE_KEYS.leads, SAMPLE_LEADS);
      return SAMPLE_LEADS as unknown as T[];
    }
    if (key === STORAGE_KEYS.estimates) {
      setItems(STORAGE_KEYS.estimates, SAMPLE_ESTIMATES);
      return SAMPLE_ESTIMATES as unknown as T[];
    }
    if (key === STORAGE_KEYS.chatLogs) {
      setItems(STORAGE_KEYS.chatLogs, SAMPLE_CHATS);
      return SAMPLE_CHATS as unknown as T[];
    }
    return [];
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Leads
export function getLeads(): Lead[] {
  return getItems<Lead>(STORAGE_KEYS.leads);
}

export function addLead(lead: Omit<Lead, "id" | "createdAt" | "status">): Lead {
  const newLead: Lead = {
    ...lead,
    id: generateId(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const leads = getLeads();
  leads.unshift(newLead);
  setItems(STORAGE_KEYS.leads, leads);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): void {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updates };
    setItems(STORAGE_KEYS.leads, leads);
  }
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  setItems(STORAGE_KEYS.leads, leads);
}

// Estimates
export function getEstimates(): Estimate[] {
  return getItems<Estimate>(STORAGE_KEYS.estimates);
}

export function addEstimate(
  estimate: Omit<Estimate, "id" | "createdAt" | "status">
): Estimate {
  const newEstimate: Estimate = {
    ...estimate,
    id: generateId(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const estimates = getEstimates();
  estimates.unshift(newEstimate);
  setItems(STORAGE_KEYS.estimates, estimates);

  // Also add as a lead
  addLead({
    name: estimate.name,
    email: estimate.email,
    phone: estimate.phone,
    address: estimate.address,
    service: `${estimate.jobType} - ${estimate.serviceType}`,
    message: `Estimate request: ${estimate.area} ${estimate.areaUnit} ${estimate.jobType} (${estimate.serviceType}). Estimated: ${estimate.estimatedCost}`,
    source: "estimator",
  });

  return newEstimate;
}

export function updateEstimate(id: string, updates: Partial<Estimate>): void {
  const estimates = getEstimates();
  const index = estimates.findIndex((e) => e.id === id);
  if (index !== -1) {
    estimates[index] = { ...estimates[index], ...updates };
    setItems(STORAGE_KEYS.estimates, estimates);
  }
}

// Chat Logs
export function getChatLogs(): ChatLog[] {
  return getItems<ChatLog>(STORAGE_KEYS.chatLogs);
}

export function addChatLog(chatLog: Omit<ChatLog, "id" | "createdAt">): ChatLog {
  const newLog: ChatLog = {
    ...chatLog,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const logs = getChatLogs();
  logs.unshift(newLog);
  setItems(STORAGE_KEYS.chatLogs, logs);

  // If lead info was captured, add as a lead
  if (chatLog.leadName || chatLog.leadEmail || chatLog.leadPhone) {
    addLead({
      name: chatLog.leadName || "Chat Visitor",
      email: chatLog.leadEmail || "",
      phone: chatLog.leadPhone || "",
      source: "chatbot",
      message: `Chat conversation with ${chatLog.messages.length} messages`,
    });
  }

  return newLog;
}

// Dashboard stats
export function getDashboardStats() {
  const leads = getLeads();
  const estimates = getEstimates();
  const chatLogs = getChatLogs();
  const today = new Date().toDateString();

  return {
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    todayLeads: leads.filter(
      (l) => new Date(l.createdAt).toDateString() === today
    ).length,
    totalEstimates: estimates.length,
    newEstimates: estimates.filter((e) => e.status === "new").length,
    totalChats: chatLogs.length,
    leadsBySource: [
      { name: "Contact Form", count: leads.filter((l) => l.source === "contact").length },
      { name: "Job Estimator", count: leads.filter((l) => l.source === "estimator").length },
      { name: "AI Chatbot", count: leads.filter((l) => l.source === "chatbot").length },
    ],
    recentLeads: leads.slice(0, 5),
  };
}
