export function getChatResponse(userMessage: string, conversationHistory: {role: string, content: string}[]): string {
  const normalized = userMessage.toLowerCase().trim();
  const historyLen = conversationHistory.length;
  
  // Basic Regex Patterns
  const isGreeting = /^(hi|hello|hey|greetings|howdy)\b/.test(normalized);
  const isServices = /(services|what do you do|offerings)/.test(normalized);
  const isPricing = /(price|cost|how much|estimate|quote)/.test(normalized);
  const isResidential = /(driveway|residential|home)/.test(normalized);
  const isCommercial = /(parking lot|commercial|business)/.test(normalized);
  const isSealcoating = /(sealcoat|seal coat|seal)/.test(normalized);
  const isRepairs = /(repair|crack|pothole|fix)/.test(normalized);
  const isLocation = /(where|area|location|bristol|johnson|kingsport|tri-cities)/.test(normalized);
  const isSchedule = /(when|schedule|timeline|how long|how soon)/.test(normalized);
  const isFreeEstimate = /(estimate|quote|free)/.test(normalized);
  const isContact = /(contact|call|reach|talk|phone)/.test(normalized);
  const isAbout = /(alan|owner|about|who)/.test(normalized);
  const isHours = /(hours|open|available)/.test(normalized);
  const isPhone = /[\d\-\(\)\s]{10,}/.test(normalized); // loose phone regex

  let response = "";

  const lastBotMessage = [...conversationHistory].reverse().find(m => m.role === 'assistant' || m.role === 'bot')?.content || "";
  
  const askedForName = lastBotMessage.includes("share your name") || lastBotMessage.includes("who am I speaking with");
  const askedForPhone = lastBotMessage.includes("best number to reach you at");

  if (askedForPhone && isPhone) {
    return "Perfect! Alan will reach out to you shortly. Is there anything else I can help with?";
  }
  
  if (askedForName && !isPhone && !isGreeting && !isPricing && !isServices && !isLocation) {
    const name = normalized.split(" ")[0].replace(/[^a-z]/g, '');
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return `Great, thanks ${capitalizedName || 'there'}! And what's the best number to reach you at?`;
  }
  
  if (isPhone) {
    return "Got it! I've noted down your number. Alan will reach out soon. Anything else?";
  }

  // Prioritize specific questions over pure greetings
  if (isPricing) {
    response = "Pricing depends on the project size and condition — for a rough ballpark:\n• Residential driveways: $2,500 – $5,000+\n• Commercial parking lots: $5,000+\n• Sealcoating: $250 – $800\n\nWant a quick estimate? Try our instant estimator on the site, or I can connect you directly with Alan!";
  } else if (isResidential) {
    response = "We specialize in residential driveways across the Tri-Cities! From brand new asphalt installation to resurfacing and tear-outs, Alan ensures every job is built to last with proper base and compaction. Would you like a free quote?";
  } else if (isCommercial) {
    response = "For commercial properties, we handle parking lot paving, resurfacing, grading, and striping with minimal disruption to your business operations. Alan personally oversees commercial jobs to ensure full ADA compliance and durability.";
  } else if (isSealcoating) {
    response = "Professional sealcoating shields your asphalt from rain, snow, oxidation, and oil spills, extending the lifespan of your pavement by years while giving it that fresh, jet-black finish.";
  } else if (isRepairs) {
    response = "We handle hot-pour crack filling, pothole patching, and saw-cut repairs. Catching cracks early prevents water penetration and saves you from costly repaving down the road!";
  } else if (isServices) {
    response = "ABWOW Paving provides:\n1. Residential Driveway Paving & Resurfacing\n2. Commercial Parking Lots\n3. Protective Sealcoating\n4. Crack & Pothole Repair\n5. Site Grading & Base Preparation\n6. Parking Lot Line Striping\n\nWhich of these are you interested in?";
  } else if (isLocation) {
    response = "We proudly serve the entire Tri-Cities region — Bristol (TN/VA), Johnson City, Kingsport, Elizabethton, Jonesborough, Erwin, Gray, Bluff City, and surrounding areas in Northeast Tennessee & Southwest Virginia.";
  } else if (isSchedule) {
    response = "Most paving projects can be scheduled within 1–2 weeks weather permitting. A standard driveway typically takes 1–2 days. Would you like to set up a free on-site estimate?";
  } else if (isFreeEstimate) {
    response = "We offer 100% free, no-obligation estimates! You can:\n1. Use our instant online estimator above\n2. Call Alan directly at (423) 555-7283\n3. Submit the contact form below\n\nWhat works best for you?";
  } else if (isContact) {
    response = "You can reach Alan directly at (423) 555-7283 or email info@abwowpaving.com. He's always glad to discuss your project!";
  } else if (isAbout) {
    response = "ABWOW Paving is an American-owned, owner-operated paving company led by Alan Bracken in the Tri-Cities. Alan brings over a decade of paving expertise and personally oversees every job on-site.";
  } else if (isHours) {
    response = "We're available Monday–Friday 7:00 AM – 6:00 PM and Saturday 8:00 AM – 2:00 PM. You can also call (423) 555-7283 anytime!";
  } else if (isGreeting) {
    response = "Hey! How can I help you today? Looking for a paving estimate, curious about our services, or want to speak with Alan?";
  } else {
    response = "Thanks for asking! For specific job details and pricing, Alan Bracken can give you an accurate, free assessment. You can call him at (423) 555-7283 or leave your info here.";
  }

  // Lead capture prompt when conversation is engaged
  const hasAskedContact = conversationHistory.some(m => (m.role === 'assistant' || m.role === 'bot') && m.content.includes("share your name"));
  if (!hasAskedContact && !askedForName && !askedForPhone && !isPhone) {
    if (historyLen >= 4 || isPricing || isFreeEstimate) {
      response += "\n\nIf you'd like Alan to give you a quick call back, feel free to drop your name and phone number!";
    }
  }

  return response;
}
