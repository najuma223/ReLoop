import express from 'express';

const router = express.Router();

// System prompt & comprehensive domain knowledge for ReLoop Water Assistant
const SYSTEM_KNOWLEDGE = `
You are the ReLoop 2.0 AI Water Assistant ("AquaBot"), an expert in sustainable water recycling, circular economy, and the ReLoop platform.
ReLoop connects water buyers (commercial, residential, landscaping, construction) with verified water suppliers (industries, STPs, tech parks, housing complexes) and transporters.

Key Knowledge Points:
1. ReLoop Roles:
   - Buyer: Purchases recycled water for non-potable applications, tracks deliveries, monitors ESG impact.
   - Seller/Supplier: Lists treated wastewater, RO reject, or greywater available for reuse.
   - Verifier: Tests water quality (pH, TDS, BOD, COD, Turbidity) and issues digital CPCB/TNPCB certificates.
   - Transporter: Fleet logistics with tanker tracking and GPS routing.

2. Water Categories & Usages:
   - Treated Wastewater (STP): Secondary/tertiary treated effluent suitable for landscaping, toilet flushing, and construction. Parameters: pH 6.5-8.5, BOD < 10 mg/L, TSS < 10 mg/L.
   - RO Reject Water: High TDS concentrate from reverse osmosis, ideal for dust suppression, road washing, and concrete curing.
   - Greywater: Sullage from laundry, sinks, and showers; treated for irrigation and gardening.
   - Industrial Recycled: Cooling tower blowdown and process water treated for heavy industrial cycles.

3. Quality Check & Certification:
   - Independent verifiers conduct lab audits before dispatch.
   - Key parameters: pH, Total Dissolved Solids (TDS), Turbidity, Biological Oxygen Demand (BOD), Chemical Oxygen Demand (COD).
   - Digital certificates are generated and logged in the immutable impact ledger.

4. ReLoop Rescue™:
   - Automated redundancy and failover system.
   - When a primary supplier experiences contamination or supply outage, ReLoop Rescue automatically detects the anomaly and scans within a 10 km radius for verified backup nodes (e.g. Apex STP, Tidel Park, Olympia Park) to reroute supply within seconds.

5. Economics & ESG Impact:
   - Recycled water costs ₹180 / kL compared to ₹500 / kL for municipal/commercial freshwater tankers (saving 60–65%).
   - Reusing 10,000 Litres saves equivalent freshwater and offsets approximately 18.4 kg of CO2 emissions.
`;

// Intelligent Rule-based NLP Engine for high-speed, 100% uptime answers
function generateIntelligentResponse(userMessage) {
  const q = userMessage.toLowerCase().trim();

  // 1. Greetings & Identity
  if (/^(hi|hello|hey|greetings|who are you|what can you do)/i.test(q)) {
    return {
      text: "Hello! I am your **ReLoop AI Water Copilot** 💧🌿. I can help you with:\n\n" +
        "• **Finding & Requesting Water:** Locating nearby suppliers and scheduling deliveries.\n" +
        "• **Quality Verification:** Explaining lab tests (pH, TDS, BOD) and CPCB compliance.\n" +
        "• **ReLoop Rescue™:** Understanding automated 10 km emergency failover.\n" +
        "• **Cost & ESG Savings:** Calculating freshwater and CO₂ offsets.\n" +
        "• **Platform Guides:** Step-by-step help for Buyers, Suppliers, and Transporters.\n\n" +
        "What would you like to know today?",
      suggestedQuestions: [
        "How do I request water?",
        "Do I need a Quality Check?",
        "What is ReLoop Rescue?",
        "How much can I save on water costs?"
      ]
    };
  }

  // 2. How to Request Water / Find Water
  if (/request.*water|how.*order|find.*water|how.*buy|place.*order|allocate/i.test(q)) {
    return {
      text: "### How to Request Recycled Water on ReLoop:\n\n" +
        "1. **Navigate to 'Find Water'** or browse the **Available Water Sources (Nearby)** table on your Dashboard.\n" +
        "2. **Select a Supplier:** View details like capacity, distance (e.g., Factory A at 2.8 km), and quality status.\n" +
        "3. **Click 'Request':** In the allocation modal, choose your registered demand and volume (in Litres).\n" +
        "4. **Quality Check Choice:** Choose whether you require independent lab testing before dispatch.\n" +
        "5. **Confirm:** Our matching engine links with certified tankers, passes lab QA, and tracks the delivery to your site!",
      actions: [{ label: "Browse Suppliers", tab: "find-water" }, { label: "Create Demand", tab: "my-demands" }],
      suggestedQuestions: ["Do I need a Quality Check?", "What are the payment rates?", "How long does delivery take?"]
    };
  }

  // 3. Quality Check / Verifier Questions
  if (/quality|check|test|lab|verifier|tds|ph|bod|cod|cpcb|tnpcb/i.test(q)) {
    return {
      text: "### ReLoop Quality Verification Standard 🧪\n\n" +
        "When requesting water, you can choose **Quality Check Required**:\n\n" +
        "• **Parameters Tested:**\n" +
        "  - **pH Level:** 6.5 – 8.5 (neutral balance)\n" +
        "  - **TDS (Total Dissolved Solids):** Tested per application (< 2,100 mg/L for landscaping)\n" +
        "  - **BOD & COD:** Organic purity standards\n" +
        "  - **Turbidity:** Clarity and suspended solids (< 10 NTU)\n\n" +
        "• **CPCB & TNPCB Compliance:** Every verified batch generates a cryptographic digital QA pass certificate.\n\n" +
        "• **Recommendation:** For gardens, cooling towers, and facility maintenance, a verified quality check ensures full regulatory safety.",
      suggestedQuestions: ["Can I skip quality check?", "How does lab verification work?", "Where can I view my certificate?"]
    };
  }

  // 4. ReLoop Rescue™
  if (/rescue|failover|backup|emergency|shortage|disrupt|redundancy|10\s*km/i.test(q)) {
    return {
      text: "### What is ReLoop Rescue™? 🛡️⚡\n\n" +
        "**ReLoop Rescue™** is our automated continuous supply protection shield:\n\n" +
        "1. **Instant Anomaly Detection:** Continuous IoT sensor & verifier audits catch water purity drops or supplier shortages before delivery.\n" +
        "2. **10 km Spatial Failover:** ReLoop automatically searches pre-qualified standby nodes within 10 km (e.g., Apex STP Basin, Tidel Tech Park, Olympia Park).\n" +
        "3. **Zero-Friction Rerouting:** Transporters are dynamically re-routed via GPS to collect fallback supply with zero downtime for your facility.",
      actions: [{ label: "Open ReLoop Rescue", tab: "reloop-rescue" }],
      suggestedQuestions: ["Where are the standby nodes in Chennai?", "How fast does Rescue trigger?"]
    };
  }

  // 5. Pricing, Costs & Savings
  if (/price|cost|rate|saving|expense|rupee|how much/i.test(q)) {
    return {
      text: "### Transparent Pricing & Cost Savings 💰\n\n" +
        "• **ReLoop Recycled Water:** **₹180 to ₹220 per kL** (1,000 Litres)\n" +
        "• **Traditional Freshwater Tanker:** **₹500 to ₹700 per kL**\n" +
        "• **Average Net Savings:** **60% to 65% cost reduction**!\n\n" +
        "**Example:** A 12,000 L monthly demand costs ~₹2,400 on ReLoop vs. ~₹7,200 from commercial freshwater tankers, saving your organization **₹4,800/month** while earning ESG green credits.",
      actions: [{ label: "View Impact Reports", tab: "impact-reports" }],
      suggestedQuestions: ["How is carbon offset calculated?", "Can I download an impact report?"]
    };
  }

  // 6. Water Types (STP, Greywater, RO Reject, Industrial)
  if (/type|category|stp|greywater|ro reject|industrial|treated wastewater/i.test(q)) {
    return {
      text: "### Supported Reusable Water Categories 💧\n\n" +
        "1. **Treated Wastewater (STP):** Secondary/tertiary biological aeration water; best for gardens, landscaping, road wash.\n" +
        "2. **RO Reject Water:** High mineral water from commercial reverse osmosis plants; ideal for dust suppression and construction curing.\n" +
        "3. **Greywater:** Shower and sink runoff treated via sand & carbon media filters; safe for non-contact flushing and turf irrigation.\n" +
        "4. **Industrial Recycled:** Cooling tower blowdown and process return water for heavy machinery cycles.",
      actions: [{ label: "Filter by Water Type", tab: "find-water" }],
      suggestedQuestions: ["Can RO reject be used for construction?", "What is greywater safe for?"]
    };
  }

  // 7. Impact Reports & ESG
  if (/impact|report|esg|co2|carbon|certificate|ledger|green/i.test(q)) {
    return {
      text: "### Environmental Impact & ESG Certification 🌿\n\n" +
        "Every drop recycled through ReLoop is cryptographically recorded:\n\n" +
        "• **Freshwater Conserved:** 1 litre of reused water saves 1-2 litres of ground/municipal freshwater extraction.\n" +
        "• **CO₂ Emissions Avoided:** ~1.84 kg of CO₂ emissions prevented per 1,000 Litres compared to deep groundwater pumping.\n" +
        "• **CPCB Green Certificate:** Download official Government TNPCB / CPCB circularity certificates to fulfill corporate ESG mandates.",
      actions: [{ label: "View Impact Reports", tab: "impact-reports" }],
      suggestedQuestions: ["How to download certificate?", "Who are the verified suppliers?"]
    };
  }

  // 8. Demands & Matching
  if (/demand|post demand|create demand|matching|lead time/i.test(q)) {
    return {
      text: "### Managing Water Demands 📋\n\n" +
        "• **Post Demand:** Click '+ Create Demand' from the top header or 'My Demands' tab.\n" +
        "• **Parameters:** Specify quantity (e.g. 4,000 L), intended purpose (Irrigation, Construction, Flushing, Cooling), and delivery site.\n" +
        "• **Automated Matching:** The engine scans active suppliers and assigns available tankers within 2.4 hours.",
      actions: [{ label: "Post New Demand", tab: "my-demands" }],
      suggestedQuestions: ["How do I track active deliveries?", "Can I cancel a demand?"]
    };
  }

  // 9. Deliveries & Transporters
  if (/transport|tanker|driver|eta|gps|delivery|track/i.test(q)) {
    return {
      text: "### Tanker Logistics & Tracking 🚚\n\n" +
        "• **Live GPS Stepper:** Track orders through *Deal Agreed ➔ Lab QA Passed ➔ Dispatched ➔ Delivered*.\n" +
        "• **Driver & Vehicle Details:** Every match displays driver name, phone number, vehicle plate number, and estimated ETA.\n" +
        "• **Confirm Receipt:** Inspect water quality on delivery and tap 'Confirm Receipt' to log the transaction in your ESG ledger.",
      actions: [{ label: "Open My Matches", tab: "my-matches" }],
      suggestedQuestions: ["Where do I find driver contacts?", "What if delivery is delayed?"]
    };
  }

  // 10. Default General Intelligent Answer
  return {
    text: `### Water Reuse Insights for: "${userMessage}"\n\n` +
      `ReLoop is designed to provide seamless circular water reuse for all urban, commercial, and industrial facilities in Chennai.\n\n` +
      `• **Key benefits:** Sourcing high-quality non-potable water, cutting water utility expenses by over 60%, and preventing ground aquifer depletion.\n` +
      `• **Next Steps:** You can browse verified regional suppliers in the **Find Water** tab, register demands in **My Demands**, or trigger **ReLoop Rescue** in case of water supply disruptions.\n\n` +
      `Feel free to ask about specific water quality parameters, pricing, CPCB compliance, or how to place your first allocation request!`,
    suggestedQuestions: [
      "How do I request water from Factory A?",
      "What are the CPCB reuse guidelines?",
      "How does ReLoop Rescue protect my supply?",
      "Calculate water savings for 10,000 Litres"
    ]
  };
}

// POST /api/chatbot/ask
router.post('/ask', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Gemini API key exists
    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${SYSTEM_KNOWLEDGE}\n\nUser Question: ${message}` }]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiReply) {
            return res.json({
              reply: aiReply,
              suggestedQuestions: [
                "How do I request water?",
                "What is tested in Quality Check?",
                "How does ReLoop Rescue work?"
              ]
            });
          }
        }
      } catch (geminiErr) {
        console.warn('[Chatbot] Gemini call error, falling back to local NLP engine:', geminiErr.message);
      }
    }

    // Fallback to our high-precision knowledge engine
    const answer = generateIntelligentResponse(message);
    res.json({
      reply: answer.text,
      actions: answer.actions || [],
      suggestedQuestions: answer.suggestedQuestions || []
    });
  } catch (err) {
    console.error('[Chatbot Error]', err);
    res.status(500).json({
      reply: "I am currently optimizing my water databases. You can ask me about finding water, quality checks, ReLoop Rescue, or cost savings!",
      suggestedQuestions: ["How do I request water?", "Do I need a Quality Check?"]
    });
  }
});

export default router;
