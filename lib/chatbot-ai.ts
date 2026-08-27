// ==============================================================================
// ABWOW Paving - AI Assistant Knowledge Tree & Conversion Engine
// Full knowledge base of services, pricing, service areas, technical FAQs,
// and automated lead conversion funnels.
// ==============================================================================

export interface ChatLeadInfo {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  serviceInterest?: string;
}

// 1. EXTRACT LEAD DETAILS FROM CONVERSATION
export function extractLeadDetails(text: string): ChatLeadInfo {
  const info: ChatLeadInfo = {};

  // Extract phone (various standard US formats)
  const phoneMatch = text.match(/(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/);
  if (phoneMatch) {
    info.phone = phoneMatch[0].trim();
  }

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    info.email = emailMatch[0].trim();
  }

  // Extract name if provided explicitly (e.g. "My name is John", "I'm Mike", "This is Sarah")
  const nameMatch = text.match(/(?:my name is|i'm|i am|this is|call me)\s+([A-Za-z]+)/i);
  if (nameMatch && nameMatch[1]) {
    const rawName = nameMatch[1].trim();
    if (!["a", "the", "looking", "interested", "here", "just"].includes(rawName.toLowerCase())) {
      info.name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    }
  }

  // Extract address keywords
  const addressMatch = text.match(/(?:at|on|in|address is)\s+([0-9]+\s+[A-Za-z0-9\s,.]+)/i);
  if (addressMatch && addressMatch[1]) {
    info.address = addressMatch[1].trim();
  }

  return info;
}

// 2. COMPREHENSIVE KNOWLEDGE TREE
interface KnowledgeNode {
  keywords: RegExp;
  answer: string;
  ctaPrompt?: string;
  category: string;
}

const KNOWLEDGE_TREE: KnowledgeNode[] = [
  // --- PRICING & ESTIMATES ---
  {
    category: "pricing",
    keywords: /(price|cost|how much|ballpark|estimate|quote|rate|charge|afford|per sq|per square|expensive)/i,
    answer: `Here is a breakdown of our typical paving pricing across the Tri-Cities:

• **Residential Driveways**: Typically **$2,500 – $6,000+** depending on length, tear-out, and base condition (~$3.00–$5.00/sq ft for new paving, ~$2.00–$3.50/sq ft for overlays).
• **Commercial Parking Lots**: Ballpark **$5,000 – $30,000+** based on square footage, milling, and heavy binder specs.
• **Sealcoating & Maintenance**: **$250 – $800** for standard residential driveways; commercial lots quoted by total square footage.
• **Crack & Pothole Repair**: Custom based on linear feet of hot-pour crack seal.

*Every job is unique based on grading and subbase condition, so Alan provides 100% free, no-obligation on-site measurements.*`,
    ctaPrompt: "Would you like Alan to call you today with an exact quote for your property? Just share your phone number or call him directly at (423) 555-7283!"
  },

  // --- RESIDENTIAL DRIVEWAYS ---
  {
    category: "residential",
    keywords: /(driveway|home|residential|house|blacktop|pave my|asphalt driveway|front yard|extension)/i,
    answer: `We specialize in residential asphalt driveways built for the East Tennessee climate! 

Our residential services include:
1. **Brand New Paving**: Full subbase excavation, 4–6" crushed aggregate base compaction, and 2–3" hot-mix asphalt rolling.
2. **Resurfacing & Overlays**: Adding a fresh 1.5–2" structural asphalt topcoat over existing stable asphalt.
3. **Driveway Expansions & Widening**: Adding parking pads, turnaround areas, or extending existing driveways.
4. **Tear-Out & Replacement**: Removing failed, shattered pavement and rebuilding a rock-solid foundation.

Because Alan is on-site for every job, the slope, drainage, and edges are done right the first time.`,
    ctaPrompt: "If you're thinking about a driveway project, what city are you located in, or would you like Alan to come take a look for free?"
  },

  // --- COMMERCIAL PARKING LOTS ---
  {
    category: "commercial",
    keywords: /(commercial|parking lot|business|church|retail|shopping center|industrial|office|subdivision|hoa|striping|handicap|ada)/i,
    answer: `ABWOW Paving provides turnkey commercial asphalt services for businesses, churches, HOAs, and industrial properties across Northeast TN & Southwest VA:

• **Heavy-Duty Commercial Paving**: Commercial binder & surface hot mixes designed to handle heavy delivery trucks and daily traffic.
• **Milling & Resurfacing**: Precision asphalt milling to restore grades and curbs before fresh overlay.
• **ADA Line Striping & Stall Marking**: Crisp traffic marking paint, handicap stall stenciling, fire lanes, and directional arrows.
• **Phased Construction**: We work around your business hours or weekends to prevent customer disruption.`,
    ctaPrompt: "What is the approximate size or location of your parking lot? Drop your contact info or call Alan at (423) 555-7283 to schedule a site walk!"
  },

  // --- SEALCOATING ---
  {
    category: "sealcoating",
    keywords: /(sealcoat|seal coat|sealer|protect asphalt|black finish|maintenance|shine|weatherproof)/i,
    answer: `Sealcoating is the single best investment to double the lifespan of your asphalt pavement!

Why commercial sealcoating matters:
• **Blocks Water Penetration**: Stops rain and winter freeze-thaw cycles from cracking the asphalt.
• **Prevents UV Oxidation**: Keeps the sun from drying out asphalt oils and turning it brittle/gray.
• **Chemical & Oil Resistance**: Shields against gasoline, oil drips, and de-icing salts.
• **Deep Jet-Black Look**: Restores that rich, brand-new showroom finish.

We use commercial-grade coal-tar & asphalt emulsion sealers (never watered-down store buckets). We recommend sealcoating every **2 to 3 years**.`,
    ctaPrompt: "Has your driveway or lot been sealed in the last 2 years? Feel free to share your number and we can schedule a quick quote!"
  },

  // --- CRACK & POTHOLE REPAIR ---
  {
    category: "repair",
    keywords: /(repair|crack|pothole|patch|broken|sunken|damage|root|rut|alligator|crumbling)/i,
    answer: `Catching asphalt damage early prevents complete foundation failure!

Our asphalt repair methods:
• **Hot-Pour Rubberized Crack Filling**: Applied at 350°F to flex with summer heat and winter freezes, sealing out water.
• **Saw-Cut Full Depth Patching**: For severe potholes and alligator cracking, we saw-cut out the damaged section, re-compact the base, and lay hot asphalt.
• **Skin Patching & Surface Leveling**: For minor depressions and low spots that collect puddles.`,
    ctaPrompt: "Do you have active cracks or potholes forming? Give Alan a call at (423) 555-7283 or drop your info so we can inspect it before water causes more damage!"
  },

  // --- GRADING & BASE PREPARATION ---
  {
    category: "grading",
    keywords: /(grading|grade|site prep|subbase|crushed stone|drainage|water runoff|excavation|earthwork|slope|dirt)/i,
    answer: `A great asphalt job is only as good as the foundation underneath it!

Our site preparation and grading includes:
• **Laser Slope Grading**: Ensuring positive drainage away from your home, garage, or building foundations.
• **Heavy Subbase Compaction**: Multi-ton vibratory roller compaction of dense-grade aggregate (crushed stone).
• **Geotextile Soil Stabilization**: Installing heavy-duty road fabric when paving over soft Tennessee clay.`,
    ctaPrompt: "Need site grading or base work done? Call Alan at (423) 555-7283 to discuss your property layout!"
  },

  // --- SERVICE AREAS & LOCATIONS ---
  {
    category: "location",
    keywords: /(where|area|location|city|serve|service area|bristol|johnson city|kingsport|elizabethton|jonesborough|erwin|gray|bluff city|abingdon|gate city|tennessee|virginia|tri-cities)/i,
    answer: `ABWOW Paving proudly serves the entire Tri-Cities metropolitan area and surrounding communities:

• **Tennessee**: Bristol, Johnson City, Kingsport, Elizabethton, Jonesborough, Erwin, Gray, Bluff City, Piney Flats, Church Hill, Mount Carmel.
• **Virginia**: Bristol VA, Abingdon VA, Gate City VA, and surrounding Washington / Scott counties.

We are local, based right here in East Tennessee, and we come directly to your job site for free estimates.`,
    ctaPrompt: "What city or neighborhood is your project in? I'd be happy to connect you with Alan for a visit!"
  },

  // --- ABOUT ALAN BRACKEN & COMPANY ---
  {
    category: "about",
    keywords: /(who are you|about|alan|bracken|owner|company|experience|reputation|why choose|insured|licensed)/i,
    answer: `ABWOW Paving is owned and personally operated by **Alan Bracken**, an experienced paving contractor with deep roots in the Tri-Cities community.

Why customers choose ABWOW:
• **Owner on Every Job**: Alan personally oversees site prep, paving, compaction, and finishing. No subcontractors or absentee owners.
• **Direct Communication**: You deal directly with Alan—no sales reps or office runaround.
• **American Owned & Operated**: Built on hard work, veteran-inspired integrity, and doing the job right the first time.
• **Fully Licensed & Insured**: Complete peace of mind on both residential and commercial sites.`,
    ctaPrompt: "Would you like to speak directly with Alan? Call (423) 555-7283 or leave your contact number and he'll give you a call back!"
  },

  // --- SCHEDULE, TIMELINE & SEASONS ---
  {
    category: "timeline",
    keywords: /(when|schedule|timeline|how long|how soon|availability|season|winter|weather|rain|curing|dry time|drive on)/i,
    answer: `Here is our project timeline and scheduling guidance:

• **Scheduling**: Most projects can be booked within **1 to 2 weeks**, weather permitting.
• **Installation Time**: Standard residential driveways take **1 to 2 days**; commercial lots take **2 to 4 days**.
• **When can you drive on it?**: You can walk on new asphalt immediately, and drive passenger vehicles on it after **24 to 48 hours** (longer in extreme summer heat).
• **Paving Season**: Hot-mix asphalt requires ground temps above 50°F, making **Spring, Summer, and Fall** the prime paving months in Tennessee.`,
    ctaPrompt: "Do you have a target date in mind? Let us know when you'd like your project completed!"
  },

  // --- ASPHALT VS CONCRETE ---
  {
    category: "comparison",
    keywords: /(concrete|versus|vs|better than|asphalt or|durability|lifespan|years|how long last)/i,
    answer: `Asphalt is the #1 choice for East Tennessee properties for several major reasons:

1. **Cost-Effective**: Asphalt typically costs **40–50% less** to install than poured concrete.
2. **Flexibility & Freeze-Thaw**: Asphalt is flexible, allowing it to expand and contract with Tennessee temperature swings without cracking like rigid concrete.
3. **Fast Turnaround**: Driveable in 24–48 hours (concrete requires 7+ days).
4. **Easy Maintenance**: When asphalt shows wear after 15–20 years, an overlay can be installed in a single day at a fraction of the cost of tearing out concrete.
5. **Expected Lifespan**: **20 to 30 years** with regular sealcoating!`,
    ctaPrompt: "Interested in getting a free asphalt quote for your driveway? Drop your phone number or call Alan at (423) 555-7283!"
  },

  // --- FREE ESTIMATE REQUEST ---
  {
    category: "estimate_request",
    keywords: /(free estimate|free quote|come out|look at|measure|consultation|schedule an estimate)/i,
    answer: `We would love to provide you with a 100% free, no-obligation on-site estimate! Alan Bracken will personally inspect your property, measure the square footage, check grading/drainage, and give you an honest price quote on the spot.`,
    ctaPrompt: "What is the best phone number and address for Alan to reach you and schedule your free estimate?"
  },

  // --- DIRECT CONTACT INFO & HOURS ---
  {
    category: "contact",
    keywords: /(contact|call|phone|reach|talk to|number|email|hours|open|office)/i,
    answer: `You can reach ABWOW Paving directly through any of these channels:

• 📞 **Direct Call / Text**: **(423) 555-7283** (Speak directly with Alan Bracken)
• ✉️ **Email**: info@abwowpaving.com
• 🕒 **Hours**: Monday – Friday: 7:00 AM – 6:00 PM | Saturday: 8:00 AM – 2:00 PM
• 📍 **Service Area**: Bristol, Johnson City, Kingsport & Tri-Cities`,
    ctaPrompt: "Would you like me to have Alan call you right now? Just drop your phone number!"
  }
];

// 3. MAIN CONVERSATION ENGINE
export function getChatResponse(
  userMessage: string, 
  conversationHistory: { role: string; content: string }[]
): string {
  const normalized = userMessage.toLowerCase().trim();
  const historyLen = conversationHistory.length;
  
  // Extract any contact info provided in this message
  const extracted = extractLeadDetails(userMessage);
  
  // Check what the bot asked last
  const lastBotMessage = [...conversationHistory].reverse().find(m => m.role === 'assistant' || m.role === 'bot')?.content || "";
  const botAskedForContact = lastBotMessage.includes("phone number") || 
                             lastBotMessage.includes("reach you") || 
                             lastBotMessage.includes("contact info") || 
                             lastBotMessage.includes("call you");

  // A. IF USER PROVIDED A PHONE NUMBER
  if (extracted.phone) {
    let nameGreeting = extracted.name ? `Thanks ${extracted.name}! ` : "Thanks! ";
    return `${nameGreeting}I've securely logged your phone number (${extracted.phone}). 

Alan Bracken will review your inquiry and give you a call shortly to discuss your paving project and answer any questions. 

Is there any specific detail about your project (size, location, timeline) you'd like me to note down for Alan?`;
  }

  // B. IF USER PROVIDED A NAME ONLY AFTER BEING ASKED
  if (extracted.name && !extracted.phone && botAskedForContact) {
    return `Great to meet you, ${extracted.name}! What's the best phone number for Alan Bracken to reach you at?`;
  }

  // C. IF USER PROVIDED AN EMAIL ONLY
  if (extracted.email && !extracted.phone) {
    return `Got it, thank you! I've noted down ${extracted.email}. What is the best phone number for Alan to call or text you with your quote?`;
  }

  // D. MATCH AGAINST KNOWLEDGE TREE NODES
  for (const node of KNOWLEDGE_TREE) {
    if (node.keywords.test(normalized)) {
      let response = node.answer;
      if (node.ctaPrompt) {
        response += `\n\n👉 ${node.ctaPrompt}`;
      }
      return response;
    }
  }

  // E. GREETINGS (When message is purely a hello)
  const isPureGreeting = /^(hi|hello|hey|howdy|good morning|good afternoon|good evening|yo)\b/i.test(normalized);
  if (isPureGreeting && normalized.length < 25) {
    return `Hey there! 👋 Welcome to ABWOW Paving. I'm here to answer any questions about asphalt paving, driveways, commercial parking lots, sealcoating, and pricing in the Tri-Cities.

How can I help you today?
1. 💰 Get a ballpark price estimate
2. 🏡 Residential driveway paving or resurfacing
3. 🏢 Commercial parking lot & striping
4. 🛡️ Protective sealcoating & crack repair
5. 📞 Schedule a free on-site quote with Alan Bracken`;
  }

  // F. DEFAULT / FALLBACK (Friendly & pulls user to Alan)
  return `That's a great question! Because every paving job in the Tri-Cities depends on specific site conditions, grading, and subbase, Alan Bracken is always glad to discuss the exact details with you.

You can:
• Call Alan directly at **(423) 555-7283**
• Or reply here with your name and phone number, and I'll have Alan reach out to you today for a free estimate!

What type of paving project are you looking into?`;
}
