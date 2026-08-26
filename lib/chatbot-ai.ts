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
    // Basic assumption it's a name if it doesn't match other major intents
    const name = normalized.split(" ")[0].replace(/[^a-z]/g, '');
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return `Great, thanks ${capitalizedName || 'there'}! And what's the best number to reach you at?`;
  }
  
  if (isPhone) {
      return "Got it! I've noted down your number. Alan will reach out soon. Anything else?";
  }

  if (isGreeting) {
    response = "Hey there! 👋 Welcome to ABWOW Paving. I'm here to help you with any paving questions. Are you looking for a quote, want to know about our services, or have a specific question?";
  } else if (isServices) {
    response = "We offer a full range of paving services, including:\n1. Residential Driveways\n2. Commercial Parking Lots\n3. Sealcoating\n4. Asphalt Repair & Patching\n5. Line Striping\n6. Resurfacing/Overlays\n\nWhich of these are you interested in?";
  } else if (isPricing) {
    response = "Pricing depends on the project — for a rough ballpark: driveways typically start around $2,500-$5,000, parking lots from $5,000+, and sealcoating from $250+. Want an instant estimate? Use our estimator above, or I can connect you with Alan directly!";
  } else if (isResidential) {
    response = "We specialize in residential driveways! From new installations to replacements and resurfacing, a fresh blacktop driveway adds incredible curb appeal to your home. Would you like a free quote?";
  } else if (isCommercial) {
    response = "For businesses, we handle full parking lot paving, expansions, and maintenance. We know how important it is to minimize disruption to your customers.";
  } else if (isSealcoating) {
    response = "Sealcoating is the best way to protect your asphalt investment. It extends the life of your driveway or parking lot by protecting against UV rays, water, and oil damage.";
  } else if (isRepairs) {
    response = "Got cracks or potholes? We can definitely fix those. Catching small issues early with hot rubber crack filling and patching prevents costly full replacements down the road.";
  } else if (isLocation) {
    response = "We serve the entire Tri-Cities area — Bristol, Johnson City, Kingsport — plus Elizabethton, Jonesborough, Erwin, Gray, Bluff City, and surrounding areas in Northeast TN and Southwest VA.";
  } else if (isSchedule) {
    response = "Most projects can be scheduled within 1-2 weeks. Timeline depends on the project size — a driveway typically takes 1-2 days, while larger commercial projects may take a week or more. Want to schedule a free estimate?";
  } else if (isFreeEstimate) {
    response = "Absolutely! We offer free, no-obligation estimates. You can: \n1. Use our instant estimator above \n2. Call Alan directly at (423) 555-7283 \n3. Fill out our contact form \nWhat works best for you?";
  } else if (isContact) {
    response = "You can reach Alan directly at (423) 555-7283 or email us at info@abwowpaving.com. Would you like me to have him call you?";
  } else if (isAbout) {
    response = "ABWOW Paving is owned and operated by Alan Bracken, an experienced paving professional with deep roots in the Tri-Cities community. Alan personally oversees every project — when you work with us, you're working directly with the owner.";
  } else if (isHours) {
    response = "We're available Monday-Friday 7AM-6PM and Saturday 8AM-2PM. You can always leave a message and Alan will get back to you promptly!";
  } else {
    response = "That's a great question! For the most accurate answer, I'd recommend speaking directly with Alan at (423) 555-7283. He's always happy to chat about your project. Is there anything else I can help with?";
  }

  // Lead capture logic
  // If the conversation seems warm (3+ messages) or they're asking about pricing/estimates, see if we can capture lead info
  const hasAskedContact = conversationHistory.some(m => (m.role === 'assistant' || m.role === 'bot') && m.content.includes("share your name"));
  if (!hasAskedContact && !askedForName && !askedForPhone && !isPhone) {
    if (historyLen >= 4 || isPricing || isFreeEstimate) {
      response += "\n\nBy the way, if you'd like, I can have Alan reach out to you directly. Just share your name and phone number!";
    }
  }

  return response;
}
