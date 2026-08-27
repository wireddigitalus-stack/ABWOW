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

export interface JobMaterial {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface JobLabor {
  id: string;
  role: string;
  crewCount: number;
  hours: number;
  hourlyRate: number;
  totalCost: number;
}

export interface JobEquipment {
  id: string;
  equipmentName: string;
  fuelCost: number;
  maintenanceReserve: number; // Allocated wear, tear & repair
  rentalOrOperatingCost: number;
  totalCost: number;
}

export interface Job {
  id: string;
  leadId?: string;
  jobNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  jobAddress: string;
  serviceType: string;
  contractPrice: number;
  status: "scheduled" | "in-progress" | "completed" | "invoiced" | "paid";
  startDate?: string;
  targetCompletionDate?: string;
  materials: JobMaterial[];
  labor: JobLabor[];
  equipment: JobEquipment[];
  notes?: string;
  checklist?: {
    sitePrepDone: boolean;
    baseCompacted: boolean;
    tackApplied: boolean;
    asphaltRolled: boolean;
    edgesTamped: boolean;
    cleanupComplete: boolean;
  };
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
  jobs: "abwow-jobs",
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

const SAMPLE_JOBS: Job[] = [
  {
    id: "job-1",
    jobNumber: "JOB-2026-001",
    leadId: "lead-2",
    clientName: "Rachel Holston",
    clientPhone: "(423) 914-7720",
    clientEmail: "rachel@holstongroup.com",
    jobAddress: "310 State St, Bristol, TN",
    serviceType: "Commercial Parking Lot Resurfacing & Striping",
    contractPrice: 18500,
    status: "in-progress",
    startDate: "2026-08-27",
    targetCompletionDate: "2026-08-29",
    materials: [
      { id: "m1", item: "Surface Hot Mix Asphalt", quantity: 65, unit: "Tons", unitCost: 85, totalCost: 5525 },
      { id: "m2", item: "SS-1h Tack Coat", quantity: 50, unit: "Gallons", unitCost: 8.5, totalCost: 425 },
      { id: "m3", item: "Traffic Grade Yellow Paint", quantity: 8, unit: "Gallons", unitCost: 38, totalCost: 304 }
    ],
    labor: [
      { id: "l1", role: "Paving Operator / Foreman", crewCount: 1, hours: 16, hourlyRate: 45, totalCost: 720 },
      { id: "l2", role: "Roller & Screed Operators", crewCount: 2, hours: 16, hourlyRate: 35, totalCost: 1120 },
      { id: "l3", role: "Rakers & Ground Laborers", crewCount: 3, hours: 16, hourlyRate: 25, totalCost: 1200 }
    ],
    equipment: [
      { id: "e1", equipmentName: "CAT CB64B Asphalt Roller", fuelCost: 180, maintenanceReserve: 250, rentalOrOperatingCost: 350, totalCost: 780 },
      { id: "e2", equipmentName: "Weiler Asphalt Paver", fuelCost: 240, maintenanceReserve: 350, rentalOrOperatingCost: 500, totalCost: 1090 },
      { id: "e3", equipmentName: "Tri-Axle Dump Hauler", fuelCost: 220, maintenanceReserve: 150, rentalOrOperatingCost: 400, totalCost: 770 }
    ],
    checklist: {
      sitePrepDone: true,
      baseCompacted: true,
      tackApplied: true,
      asphaltRolled: false,
      edgesTamped: false,
      cleanupComplete: false
    },
    notes: "Owner requested weekend morning striping to avoid blocking customer parking.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "job-2",
    jobNumber: "JOB-2026-002",
    leadId: "lead-4",
    clientName: "Pastor David Walker",
    clientPhone: "(423) 764-5510",
    clientEmail: "dwalker@bristolchurch.org",
    jobAddress: "Bristol, VA",
    serviceType: "Church Parking Lot Paving",
    contractPrice: 12200,
    status: "completed",
    startDate: "2026-08-20",
    targetCompletionDate: "2026-08-22",
    materials: [
      { id: "m4", item: "Base Binder Asphalt", quantity: 42, unit: "Tons", unitCost: 80, totalCost: 3360 },
      { id: "m5", item: "Tack Coat", quantity: 30, unit: "Gallons", unitCost: 8.5, totalCost: 255 }
    ],
    labor: [
      { id: "l4", role: "Paving Crew (4 Person)", crewCount: 4, hours: 14, hourlyRate: 32, totalCost: 1792 }
    ],
    equipment: [
      { id: "e4", equipmentName: "CAT Roller & Support Truck", fuelCost: 260, maintenanceReserve: 200, rentalOrOperatingCost: 450, totalCost: 910 }
    ],
    checklist: {
      sitePrepDone: true,
      baseCompacted: true,
      tackApplied: true,
      asphaltRolled: true,
      edgesTamped: true,
      cleanupComplete: true
    },
    notes: "Job inspected and approved by church board. Payment received in full.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
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
    if (key === STORAGE_KEYS.jobs) {
      setItems(STORAGE_KEYS.jobs, SAMPLE_JOBS);
      return SAMPLE_JOBS as unknown as T[];
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

// Jobs
export function getJobs(): Job[] {
  return getItems<Job>(STORAGE_KEYS.jobs);
}

export function addJob(job: Omit<Job, "id" | "createdAt" | "jobNumber"> & { jobNumber?: string }): Job {
  const jobs = getJobs();
  const year = new Date().getFullYear();
  const nextNum = String(jobs.length + 1).padStart(3, "0");
  const newJob: Job = {
    ...job,
    id: generateId(),
    jobNumber: job.jobNumber || `JOB-${year}-${nextNum}`,
    createdAt: new Date().toISOString(),
    checklist: job.checklist || {
      sitePrepDone: false,
      baseCompacted: false,
      tackApplied: false,
      asphaltRolled: false,
      edgesTamped: false,
      cleanupComplete: false
    }
  };
  jobs.unshift(newJob);
  setItems(STORAGE_KEYS.jobs, jobs);
  return newJob;
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const jobs = getJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates };
    setItems(STORAGE_KEYS.jobs, jobs);
  }
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter((j) => j.id !== id);
  setItems(STORAGE_KEYS.jobs, jobs);
}

export function createJobFromLead(lead: Lead, contractPrice = 0): Job {
  const newJob = addJob({
    leadId: lead.id,
    clientName: lead.name,
    clientPhone: lead.phone,
    clientEmail: lead.email,
    jobAddress: lead.address || "Tri-Cities Job Site",
    serviceType: lead.service || "Paving Project",
    contractPrice: contractPrice || 3500,
    status: "scheduled",
    startDate: new Date().toISOString().split("T")[0],
    materials: [
      { id: generateId(), item: "Hot Mix Asphalt", quantity: 20, unit: "Tons", unitCost: 85, totalCost: 1700 },
      { id: generateId(), item: "Tack Coat Emulsion", quantity: 15, unit: "Gallons", unitCost: 8.5, totalCost: 127.50 }
    ],
    labor: [
      { id: generateId(), role: "Paving Crew (3 Person)", crewCount: 3, hours: 8, hourlyRate: 30, totalCost: 720 }
    ],
    equipment: [
      { id: generateId(), equipmentName: "CAT Roller & Truck", fuelCost: 120, maintenanceReserve: 150, rentalOrOperatingCost: 200, totalCost: 470 }
    ],
    notes: lead.message ? `From Lead Inquiry: ${lead.message}` : "",
  });

  // Mark lead as won
  updateLead(lead.id, { status: "won" });

  return newJob;
}

// Dashboard stats
export function getDashboardStats() {
  const leads = getLeads();
  const jobs = getJobs();
  const estimates = getEstimates();
  const chatLogs = getChatLogs();
  const today = new Date().toDateString();

  // Financial totals across jobs
  const totalRevenue = jobs.reduce((sum, j) => sum + (j.contractPrice || 0), 0);
  const totalCosts = jobs.reduce((sum, j) => {
    const matCost = (j.materials || []).reduce((mSum, m) => mSum + (m.totalCost || 0), 0);
    const labCost = (j.labor || []).reduce((lSum, l) => lSum + (l.totalCost || 0), 0);
    const eqCost = (j.equipment || []).reduce((eSum, e) => eSum + (e.totalCost || 0), 0);
    return sum + matCost + labCost + eqCost;
  }, 0);
  const grossProfit = totalRevenue - totalCosts;

  return {
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    todayLeads: leads.filter(
      (l) => new Date(l.createdAt).toDateString() === today
    ).length,
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "in-progress" || j.status === "scheduled").length,
    completedJobs: jobs.filter((j) => j.status === "completed" || j.status === "paid").length,
    totalRevenue,
    totalCosts,
    grossProfit,
    profitMargin: totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0,
    totalEstimates: estimates.length,
    newEstimates: estimates.filter((e) => e.status === "new").length,
    totalChats: chatLogs.length,
    leadsBySource: [
      { name: "Contact Form", count: leads.filter((l) => l.source === "contact").length },
      { name: "Job Estimator", count: leads.filter((l) => l.source === "estimator").length },
      { name: "AI Chatbot", count: leads.filter((l) => l.source === "chatbot").length },
    ],
    recentLeads: leads.slice(0, 5),
    recentJobs: jobs.slice(0, 5),
  };
}
