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

// Generic helpers
function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
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
    leadsToday: leads.filter(
      (l) => new Date(l.createdAt).toDateString() === today
    ).length,
    totalEstimates: estimates.length,
    newEstimates: estimates.filter((e) => e.status === "new").length,
    totalChats: chatLogs.length,
    leadsBySource: {
      contact: leads.filter((l) => l.source === "contact").length,
      estimator: leads.filter((l) => l.source === "estimator").length,
      chatbot: leads.filter((l) => l.source === "chatbot").length,
    },
  };
}
