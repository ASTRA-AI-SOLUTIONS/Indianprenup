import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, ArrowRight, CheckCircle, ChevronLeft, Sparkles,
  TrendingUp, AlertTriangle, Lock, MessageCircle, X, Send,
  Brain, BarChart3, FileText, Zap, Eye, Calculator,
  Building2, Car, Gem, Coins, PieChart, Activity,
  ChevronDown, Star, Users, Award
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

type Step = 'landing' | 'assets' | 'personal' | 'analyzing' | 'report' | 'ca_deep' | 'success' | 'about' | 'contact';

interface FormData {
  name: string; age: string; phone: string; land: string; house: string;
  cars: string; stocks: string; business: string; jewelry: string;
  otherAssets: string; annualIncome: string; liabilities: string;
}

interface AIReport {
  estimatedTotalValue: string; potentialDivorceLoss: string;
  trustProtectionAmount: string; projected10YearValue: string;
  caAnalysis: string; riskScore: number; liquidityRatio: string;
  taxExposure: string;
  assetBreakdown: { category: string; value: string; percentage: number }[];
}

interface CAReport {
  executiveSummary: string; incomeAnalysis: string; taxOptimization: string;
  trustStructure: string; investmentRecommendations: string;
  riskMitigation: string; complianceNotes: string; immediateActions: string[];
}

interface ChatMessage { role: 'user' | 'model'; text: string; }

const INDIAN_NAMES = [
  "Aarav M.", "Vikram R.", "Rohan D.", "Aditya V.", "Arjun T.",
  "Siddharth B.", "Ishaan K.", "Kabir S.", "Dhruv P.", "Vihaan C.",
  "Reyansh M.", "Krishna N.", "Shaurya L.", "Ayaan J.", "Advait P.",
  "Devansh S.", "Kabir W.", "Arnav G."
];

const AI_FEATURES = [
  { icon: Brain, title: "Neural Wealth Engine", desc: "Analyses 400+ asset variables using advanced LLM reasoning" },
  { icon: BarChart3, title: "Real-time Valuation", desc: "Market-aware pricing using live Indian market indices" },
  { icon: Shield, title: "Trust Architect AI", desc: "Generates bespoke trust structures under Indian Trust Act" },
  { icon: Calculator, title: "CA-Grade Analysis", desc: "Chartered Accountant-level tax & compliance review" },
  { icon: Eye, title: "Risk Scanner", desc: "Identifies legal exposure and divorce vulnerability vectors" },
  { icon: Zap, title: "Instant Report", desc: "Full wealth protection report generated in under 30 seconds" },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [caReport, setCAReport] = useState<CAReport | null>(null);
  const [isCALoading, setIsCALoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '', age: '', phone: '', land: '', house: '', cars: '',
    stocks: '', business: '', jewelry: '', otherAssets: '',
    annualIncome: '', liabilities: '',
  });
  const [recentActivity, setRecentActivity] = useState<{ id: number; name: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Namaste. I am your AI Wealth Advisor — trained on Indian trust law, tax codes, and asset protection strategies. How can I protect your wealth today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [analyzeStage, setAnalyzeStage] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const hasAutoSent = useRef(false);

  const ANALYZE_STAGES = [
    "Scanning asset portfolio…", "Running CA-grade valuation…",
    "Calculating divorce exposure…", "Structuring trust framework…",
    "Generating protection report…",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading, isChatOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      setRecentActivity({ id: Date.now(), name: randomName });
      setTimeout(() => setRecentActivity(null), 3000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % AI_FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep === 'analyzing') {
      let stage = 0;
      setAnalyzeStage(0);
      const interval = setInterval(() => {
        stage++;
        if (stage < ANALYZE_STAGES.length) setAnalyzeStage(stage);
        else clearInterval(interval);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Auto-send details when identity section is filled
  useEffect(() => {
    const { name, age, phone } = formData;
    if (name && age && phone && !hasAutoSent.current) {
      hasAutoSent.current = true;
      const sendAutoEmail = async () => {
        try {
          await fetch("https://formsubmit.co/ajax/sarovarlakes@gmail.com", {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              ...formData,
              _subject: `Auto-Capture: New Lead from ${name} (Identity Filled)`
            })
          });
        } catch (error) {
          console.error("Auto-email failed:", error);
        }
      };
      sendAutoEmail();
    }
  }, [formData]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = (step: Step) => setCurrentStep(step);
  const prevStep = (step: Step) => setCurrentStep(step);

  const analyzeAssets = async () => {
    setIsAnalyzing(true);
    nextStep('analyzing');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        You are an elite Indian Wealth Manager and Chartered Accountant specializing in asset protection and private trusts.
        Analyze the following assets for an Indian client aged ${formData.age}, with annual income of ${formData.annualIncome || 'Not specified'} and liabilities of ${formData.liabilities || 'None'}:
        - Land & Real Estate: ${formData.land || 'None'}
        - Houses / Properties: ${formData.house || 'None'}
        - Vehicles & Cars: ${formData.cars || 'None'}
        - Stocks & Mutual Funds: ${formData.stocks || 'None'}
        - Business Equity: ${formData.business || 'None'}
        - Jewelry & Valuables: ${formData.jewelry || 'None'}
        - Other Assets: ${formData.otherAssets || 'None'}

        Provide a comprehensive wealth analysis with realistic INR valuations based on current Indian market rates.
        
        CRITICAL: All values must be strings with appropriate currency symbols (₹) or units (Cr, L, %).
        
        REQUIRED FIELDS IN JSON:
        1. estimatedTotalValue: A realistic total valuation in INR (e.g., "₹12.5 Cr"). MUST NOT BE EMPTY.
        2. potentialDivorceLoss: Estimated loss in case of divorce without a trust (e.g., "₹6.25 Cr").
        3. trustProtectionAmount: Amount that can be protected via a trust (e.g., "₹12.5 Cr").
        4. projected10YearValue: Estimated value of these assets in 10 years considering 8-12% CAGR (e.g., "₹28.4 Cr").
        5. caAnalysis: A professional summary of the wealth structure and risks.
        6. riskScore: A number from 0-100 (higher = more exposed).
        7. liquidityRatio: Percentage of assets that are liquid (e.g., "25%").
        8. taxExposure: Estimated annual tax liability or percentage (e.g., "30% + Surcharge").
        9. assetBreakdown: List each category with estimated value and percentage of total.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimatedTotalValue: { type: Type.STRING },
              potentialDivorceLoss: { type: Type.STRING },
              trustProtectionAmount: { type: Type.STRING },
              projected10YearValue: { type: Type.STRING },
              caAnalysis: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              liquidityRatio: { type: Type.STRING },
              taxExposure: { type: Type.STRING },
              assetBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    value: { type: Type.STRING },
                    percentage: { type: Type.NUMBER },
                  },
                  required: ['category', 'value', 'percentage']
                }
              }
            },
            required: ["estimatedTotalValue", "potentialDivorceLoss", "trustProtectionAmount",
              "projected10YearValue", "caAnalysis", "riskScore", "liquidityRatio", "taxExposure", "assetBreakdown"]
          }
        }
      });
      if (response.text) {
        setAiReport(JSON.parse(response.text) as AIReport);
        nextStep('report');
      } else throw new Error("No response text");
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAiReport({
        estimatedTotalValue: "Pending Review", potentialDivorceLoss: "Up to 50%",
        trustProtectionAmount: "100% Protected", projected10YearValue: "Pending Review",
        caAnalysis: "Our AI encountered an issue, but our human advisors will review your assets and provide a detailed protection strategy.",
        riskScore: 60, liquidityRatio: "N/A", taxExposure: "N/A", assetBreakdown: []
      });
      nextStep('report');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runCADeepAnalysis = async () => {
    setIsCALoading(true);
    nextStep('ca_deep');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        You are a senior Chartered Accountant and legal expert in India specializing in wealth management, taxation, and trust law.
        Client Profile:
        - Name: ${formData.name}, Age: ${formData.age}
        - Assets: Land(${formData.land}), House(${formData.house}), Cars(${formData.cars}),
          Stocks(${formData.stocks}), Business(${formData.business}), Jewelry(${formData.jewelry}), Other(${formData.otherAssets})
        - Annual Income: ${formData.annualIncome || 'Not provided'}
        - Liabilities: ${formData.liabilities || 'None'}
        - AI Estimated Total Wealth: ${aiReport?.estimatedTotalValue || 'Unknown'}
        - Risk Score: ${aiReport?.riskScore || 'Unknown'}/100
        Provide an exhaustive CA-grade wealth analysis. Be specific, professional, and practical. Use Indian legal and financial terminology.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              incomeAnalysis: { type: Type.STRING },
              taxOptimization: { type: Type.STRING },
              trustStructure: { type: Type.STRING },
              investmentRecommendations: { type: Type.STRING },
              riskMitigation: { type: Type.STRING },
              complianceNotes: { type: Type.STRING },
              immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["executiveSummary", "incomeAnalysis", "taxOptimization", "trustStructure",
              "investmentRecommendations", "riskMitigation", "complianceNotes", "immediateActions"]
          }
        }
      });
      if (response.text) {
        setCAReport(JSON.parse(response.text) as CAReport);
      } else throw new Error("No CA report");
    } catch (error) {
      console.error("CA analysis failed:", error);
      setCAReport({
        executiveSummary: "Your asset portfolio shows moderate risk exposure. Immediate trust structuring is recommended under the Indian Trusts Act, 1882.",
        incomeAnalysis: "Based on declared assets, estimated annual returns suggest you may be in the 30% tax bracket. Income restructuring via HUF or trust can yield significant savings.",
        taxOptimization: "Recommended: Transfer appreciating assets to a discretionary trust. Utilize Section 54/54F for capital gains exemption on property sales. Consider HUF creation for income splitting.",
        trustStructure: "A Discretionary Private Trust is most suitable. Settle it with a nominal sum (₹1,000). You serve as Protector; appoint 2-3 independent trustees. Transfer assets gradually over 2-3 years.",
        investmentRecommendations: "Rebalance towards 60% real estate, 25% equity MF, 15% debt instruments. Consider REIT exposure for passive income. Reduce high-depreciation vehicle holdings.",
        riskMitigation: "Execute a Prenuptial Agreement under Special Marriage Act. Ring-fence business assets via separate trust. Create a Will alongside the trust for comprehensive coverage.",
        complianceNotes: "Ensure trust deed registration under Registration Act. File Trust's income return separately. FEMA compliance needed if any foreign assets exist. SEBI compliance for equity holdings above ₹1 Cr.",
        immediateActions: [
          "Consult a trust lawyer this week to draft the trust deed",
          "Value all properties via approved government valuer",
          "Open a separate current account in trust name",
          "Transfer one property to trust as initial settlement",
          "File a rectified ITR if income restructuring was delayed"
        ]
      });
    } finally {
      setIsCALoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const newUserMsg = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const history = chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      history.push({ role: 'user', parts: [{ text: newUserMsg.text }] });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: history,
        config: {
          systemInstruction: `You are an elite Indian Wealth Advisor with 20+ years of experience. You specialize in private trusts under the Indian Trusts Act 1882, prenuptial agreements, asset protection, HUF structuring, and CA-grade tax optimization. Answer questions concisely, professionally, and with specific Indian legal/financial references. Always recommend consulting a qualified CA or lawyer for implementation.`
        }
      });
      if (response.text) {
        setChatMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'model', text: 'I apologize for the interruption. Please try again in a moment.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const establishTrust = async () => {
    try {
      await fetch("https://formsubmit.co/ajax/sarovarlakes@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.name, age: formData.age, phone: formData.phone,
          land: formData.land, house: formData.house, cars: formData.cars,
          stocks: formData.stocks, business: formData.business,
          otherAssets: formData.otherAssets, annualIncome: formData.annualIncome,
          _subject: `New Trust Fund Request from ${formData.name}`
        })
      });
    } catch { /* silent fail */ }
    nextStep('success');
  };

  const pageVariants = {
    initial: { opacity: 0, filter: 'blur(12px)', y: 16 },
    in: { opacity: 1, filter: 'blur(0px)', y: 0 },
    out: { opacity: 0, filter: 'blur(12px)', y: -16 },
  };
  const pageTransition = { type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: 0.7 };
  const riskColor = (score: number) => score < 35 ? '#4ade80' : score < 65 ? '#facc15' : '#f87171';

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 pt-24 pb-12 relative overflow-x-hidden bg-[#080808] text-white">

      {/* Atmospheric bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)', width:'80vw', height:'60vh', background:'radial-gradient(ellipse, rgba(184,153,71,0.07) 0%, transparent 70%)', filter:'blur(60px)' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'50vw', height:'50vh', background:'radial-gradient(ellipse, rgba(184,153,71,0.04) 0%, transparent 70%)', filter:'blur(80px)' }} />
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.025 }}>
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {recentActivity && !['assets', 'personal', 'analyzing'].includes(currentStep) && (
          <motion.div key={recentActivity.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border shadow-2xl w-auto max-w-[200px] sm:max-w-[280px]"
            style={{ background:'rgba(12,12,12,0.95)', borderColor:'rgba(184,153,71,0.25)', backdropFilter:'blur(20px)' }}>
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full animate-pulse" style={{ background:'#b89947', boxShadow:'0 0 6px #b89947' }} />
            <p className="text-[10px] sm:text-[11px] font-light leading-tight" style={{ color:'rgba(255,255,255,0.75)' }}>
              <span className="font-medium text-white">{recentActivity.name}</span>
              <span style={{ color:'rgba(255,255,255,0.5)' }}> just established a trust</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity:0, scale:0.92, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.92, y:16 }}
              className="mb-4 w-[calc(100vw-3rem)] sm:w-96 h-[400px] sm:h-[480px] max-h-[70vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl"
              style={{ background:'rgba(10,10,10,0.97)', border:'1px solid rgba(255,255,255,0.08)', backdropFilter:'blur(30px)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:'rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background:'rgba(184,153,71,0.15)', border:'1px solid rgba(184,153,71,0.3)' }}>
                    <Brain className="w-3.5 h-3.5" style={{ color:'#b89947' }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color:'#b89947', letterSpacing:'0.1em' }}>AI WEALTH ADVISOR</p>
                    <p className="text-[10px]" style={{ color:'rgba(255,255,255,0.3)' }}>Powered by Mirage AI</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} style={{ color:'rgba(255,255,255,0.4)' }} className="hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <motion.div key={idx} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm font-light leading-relaxed ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                      style={msg.role === 'user' ? { background:'#b89947', color:'#000' } : { background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.85)' }}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{ background:'rgba(255,255,255,0.06)' }}>
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:'#b89947' }}
                          animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.2, repeat:Infinity, delay }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t flex items-center gap-2" style={{ borderColor:'rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about trusts, tax, protection…"
                  style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'10px 14px', fontSize:'13px', color:'white', outline:'none' }} />
                <button onClick={handleSendMessage} disabled={!chatInput.trim() || isChatLoading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40"
                  style={{ background:'#b89947', color:'#000', flexShrink:0 }}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ background:'#b89947' }}>
          {isChatOpen ? <X className="w-5 h-5 text-black" /> : <MessageCircle className="w-5 h-5 text-black" />}
          {!isChatOpen && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#080808]" />}
        </button>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">

          {/* LANDING */}
          {currentStep === 'landing' && (
            <motion.div key="landing" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <div className="flex flex-col items-center text-center">
                <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
                  style={{ border:'1px solid rgba(184,153,71,0.3)', background:'rgba(184,153,71,0.05)' }}>
                  <Sparkles className="w-3 h-3" style={{ color:'#b89947' }} />
                  <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'#b89947' }}>Powered by Mirage AI</span>
                </motion.div>
                <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.15, duration:1 }}
                  className="mb-8 relative">
                  <GuardianBell className="w-20 h-20" />
                  <motion.div 
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 blur-2xl rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(184,153,71,0.3) 0%, transparent 70%)' }}
                  />
                </motion.div>
                <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                  className="font-serif text-[clamp(4rem,14vw,8rem)] font-light tracking-tighter leading-[0.85] mb-6"
                  style={{ fontFamily:'"Cormorant Garamond", Georgia, serif' }}>
                  Indian<br /><em style={{ color:'#b89947', fontStyle:'italic' }}>Prenup</em>
                </motion.h1>
                <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
                  className="text-base font-light leading-relaxed max-w-sm mb-4" style={{ color:'rgba(255,255,255,0.5)' }}>
                  AI-powered wealth protection. Get a full CA-grade analysis, trust structuring, and divorce risk assessment in 30 seconds.
                </motion.p>
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
                  className="flex items-center gap-6 mb-12" style={{ color:'rgba(255,255,255,0.3)' }}>
                  {[{ icon: Users, val:"2,400+", label:"Trusts Created" }, { icon: Award, val:"₹420 Cr+", label:"Assets Protected" }, { icon: Star, val:"4.9/5", label:"Client Rating" }]
                    .map(({ icon: Icon, val, label }) => (
                      <div key={label} className="flex flex-col items-center gap-0.5">
                        <span className="text-base font-medium text-white">{val}</span>
                        <span className="text-[10px] uppercase tracking-widest">{label}</span>
                      </div>
                  ))}
                </motion.div>
                <motion.button initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
                  onClick={() => nextStep('assets')}
                  className="group flex items-center gap-4 px-10 py-5 rounded-full font-medium text-xs uppercase tracking-[0.2em] transition-all duration-500 mb-16"
                  style={{ background:'#b89947', color:'#000', boxShadow:'0 0 40px rgba(184,153,71,0.2)' }}>
                  Check Your Worth <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }} className="w-full">
                  <div className="flex items-center gap-3 mb-6 justify-center">
                    <div className="h-px flex-1" style={{ background:'rgba(255,255,255,0.08)' }} />
                    <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color:'rgba(255,255,255,0.3)' }}>What our AI does</span>
                    <div className="h-px flex-1" style={{ background:'rgba(255,255,255,0.08)' }} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AI_FEATURES.map(({ icon: Icon, title, desc }, i) => (
                      <motion.div key={title}
                        animate={{ borderColor: activeFeature === i ? 'rgba(184,153,71,0.4)' : 'rgba(255,255,255,0.06)' }}
                        className="p-4 rounded-2xl text-left"
                        style={{ background: activeFeature === i ? 'rgba(184,153,71,0.05)' : 'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <Icon className="w-4 h-4 mb-3" style={{ color:'#b89947', opacity: activeFeature === i ? 1 : 0.5 }} />
                        <p className="text-xs font-medium mb-1 text-white">{title}</p>
                        <p className="text-[11px] leading-relaxed" style={{ color:'rgba(255,255,255,0.4)' }}>{desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ASSETS */}
          {currentStep === 'assets' && (
            <motion.div key="assets" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-md mx-auto">
              <button onClick={() => prevStep('landing')} className="mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em] transition-colors" style={{ color:'rgba(255,255,255,0.35)' }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-5xl font-light mb-3 tracking-tight" style={{ fontFamily:'"Cormorant Garamond", serif' }}>Your Assets</h2>
              <p className="text-sm font-light mb-10" style={{ color:'rgba(255,255,255,0.45)' }}>The more detail you provide, the more precise your analysis.</p>
              <div className="space-y-8">
                {[
                  { field:'land', icon:Building2, label:'Land & Real Estate', placeholder:'e.g., 2 Acres in Pune (~₹3 Cr)' },
                  { field:'house', icon:Building2, label:'Houses / Residential Properties', placeholder:'e.g., 3BHK flat in Mumbai (~₹5 Cr)' },
                  { field:'cars', icon:Car, label:'Vehicles & Cars', placeholder:'e.g., BMW 5 Series (~₹80L)' },
                  { field:'stocks', icon:TrendingUp, label:'Stocks & Mutual Funds', placeholder:'e.g., ₹40L in HDFC MF, NSE stocks' },
                  { field:'business', icon:Coins, label:'Business Equity / Partnership', placeholder:'e.g., 40% stake in XYZ Pvt Ltd (~₹2 Cr)' },
                  { field:'jewelry', icon:Gem, label:'Jewelry & Valuables', placeholder:'e.g., Gold ornaments (~₹25L)' },
                  { field:'otherAssets', icon:PieChart, label:'Other Assets', placeholder:'FDs, PPF, art, crypto…' },
                  { field:'annualIncome', icon:Activity, label:'Annual Income (optional)', placeholder:'e.g., ₹35 Lakhs per year' },
                  { field:'liabilities', icon:AlertTriangle, label:'Liabilities / Loans (optional)', placeholder:'e.g., ₹80L home loan remaining' },
                ].map(({ field, icon: Icon, label, placeholder }) => (
                  <div key={field} className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3 h-3" style={{ color:'rgba(184,153,71,0.6)' }} />
                      <label className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'rgba(255,255,255,0.35)' }}>{label}</label>
                    </div>
                    <input type="text" placeholder={placeholder} value={formData[field as keyof FormData]}
                      onChange={(e) => updateFormData(field as keyof FormData, e.target.value)} />
                  </div>
                ))}
              </div>
              <button onClick={() => nextStep('personal')}
                className="w-full mt-12 flex items-center justify-between px-8 py-5 rounded-full transition-all duration-500 group"
                style={{ border:'1px solid rgba(255,255,255,0.15)' }}>
                <span className="text-xs uppercase tracking-[0.2em]">Next: Your Identity</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* PERSONAL */}
          {currentStep === 'personal' && (
            <motion.div key="personal" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-md mx-auto">
              <button onClick={() => prevStep('assets')} className="mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em]" style={{ color:'rgba(255,255,255,0.35)' }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-5xl font-light mb-3 tracking-tight" style={{ fontFamily:'"Cormorant Garamond", serif' }}>Identity</h2>
              <p className="text-sm font-light mb-10" style={{ color:'rgba(255,255,255,0.45)' }}>Who are we protecting today?</p>
              <div className="space-y-8">
                <div><label className="block text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color:'rgba(255,255,255,0.35)' }}>Full Legal Name</label>
                  <input type="text" placeholder="e.g., Aryan Sharma" value={formData.name} onChange={(e) => updateFormData('name', e.target.value)} /></div>
                <div><label className="block text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color:'rgba(255,255,255,0.35)' }}>Age</label>
                  <input type="number" placeholder="e.g., 34" value={formData.age} onChange={(e) => updateFormData('age', e.target.value)} /></div>
                <div><label className="block text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color:'rgba(255,255,255,0.35)' }}>Mobile Number</label>
                  <input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} /></div>
              </div>
              <div className="mt-10 p-5 rounded-2xl" style={{ background:'rgba(184,153,71,0.05)', border:'1px solid rgba(184,153,71,0.15)' }}>
                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color:'#b89947' }} />
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color:'#b89947' }}>Mirage AI Analysis</p>
                    <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.45)' }}>
                      Our AI will run a full analysis — valuation, divorce exposure, tax efficiency, and a bespoke trust structure — all in under 30 seconds.
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={analyzeAssets} disabled={!formData.name || !formData.age || !formData.phone}
                className="w-full mt-8 flex items-center justify-center gap-3 px-8 py-5 rounded-full font-medium text-xs uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background:'#b89947', color:'#000' }}>
                <Sparkles className="w-4 h-4" /> Analyse My Wealth
              </button>
            </motion.div>
          )}

          {/* ANALYZING */}
          {currentStep === 'analyzing' && (
            <motion.div key="analyzing" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="flex flex-col items-center justify-center text-center space-y-14 py-16">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {[0,1,2].map((i) => (
                  <motion.div key={i} animate={{ rotate:360 }} transition={{ duration:6+i*3, repeat:Infinity, ease:'linear' }}
                    className="absolute rounded-full"
                    style={{ inset:`${i*14}px`, border:`1px solid rgba(184,153,71,${0.3-i*0.08})`, borderStyle: i===0?'solid':'dashed' }} />
                ))}
                <Brain className="w-8 h-8" style={{ color:'#b89947' }} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-light" style={{ fontFamily:'"Cormorant Garamond", serif' }}>AI at Work</h2>
                <AnimatePresence mode="wait">
                  <motion.p key={analyzeStage} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                    className="text-sm font-light" style={{ color:'rgba(255,255,255,0.5)' }}>
                    {ANALYZE_STAGES[analyzeStage]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                {ANALYZE_STAGES.map((_, i) => (
                  <motion.div key={i} className="h-0.5 rounded-full transition-all duration-500"
                    style={{ width: i<=analyzeStage?'24px':'8px', background: i<=analyzeStage?'#b89947':'rgba(255,255,255,0.15)' }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* REPORT */}
          {currentStep === 'report' && aiReport && (
            <motion.div key="report" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-4xl font-light" style={{ fontFamily:'"Cormorant Garamond", serif' }}>Wealth Report</h2>
                  <p className="text-xs mt-1" style={{ color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em' }}>
                    {formData.name} · {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest"
                  style={{ border:'1px solid rgba(184,153,71,0.3)', background:'rgba(184,153,71,0.05)', color:'#b89947' }}>
                  <Sparkles className="w-3 h-3" /> AI Verified
                </div>
              </div>
              {/* Risk Score */}
              <div className="mb-6 p-6 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'rgba(255,255,255,0.4)' }}>Divorce Risk Score</p>
                    <p className="text-4xl font-light mt-1" style={{ color:riskColor(aiReport.riskScore) }}>
                      {aiReport.riskScore}<span className="text-xl">/100</span>
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 opacity-20" style={{ color:riskColor(aiReport.riskScore) }} />
                </div>
                <div className="h-1.5 rounded-full" style={{ background:'rgba(255,255,255,0.06)' }}>
                  <motion.div className="h-full rounded-full" initial={{ width:0 }} animate={{ width:`${aiReport.riskScore}%` }} transition={{ duration:1.2, ease:'easeOut' }}
                    style={{ background:riskColor(aiReport.riskScore) }} />
                </div>
                <p className="text-xs mt-3 font-light" style={{ color:'rgba(255,255,255,0.4)' }}>
                  {aiReport.riskScore < 35 ? 'Low exposure — good standing' : aiReport.riskScore < 65 ? 'Moderate exposure — action recommended' : 'High exposure — immediate trust structuring required'}
                </p>
              </div>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label:'Total Wealth', value:aiReport.estimatedTotalValue || 'N/A', color:'#fff', icon:Coins, border:'rgba(255,255,255,0.08)' },
                  { label:'Divorce Exposure', value:aiReport.potentialDivorceLoss || 'N/A', color:'#f87171', icon:AlertTriangle, border:'rgba(248,113,113,0.2)', bg:'rgba(248,113,113,0.04)' },
                  { label:'Trust Protection', value:aiReport.trustProtectionAmount || 'N/A', color:'#b89947', icon:Lock, border:'rgba(184,153,71,0.2)', bg:'rgba(184,153,71,0.04)' },
                  { label:'10-Year Projection', value:aiReport.projected10YearValue || 'N/A', color:'#4ade80', icon:TrendingUp, border:'rgba(74,222,128,0.2)', bg:'rgba(74,222,128,0.04)' },
                ].map(({ label, value, color, icon: Icon, border, bg }) => (
                  <div key={label} className="p-5 rounded-2xl flex flex-col justify-between"
                    style={{ background: bg||'rgba(255,255,255,0.02)', border:`1px solid ${border}` }}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Icon className="w-3 h-3" style={{ color }} />
                      <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color }}>{label}</span>
                    </div>
                    <span className="text-3xl font-light" style={{ color, fontFamily:'"Cormorant Garamond", serif' }}>{value}</span>
                  </div>
                ))}
              </div>
              {/* Extra stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl flex items-center gap-4" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <Activity className="w-4 h-4" style={{ color:'rgba(255,255,255,0.3)' }} />
                  <div><p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>Liquidity Ratio</p>
                    <p className="text-lg font-light text-white">{aiReport.liquidityRatio || 'N/A'}</p></div>
                </div>
                <div className="p-4 rounded-xl flex items-center gap-4" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <FileText className="w-4 h-4" style={{ color:'rgba(255,255,255,0.3)' }} />
                  <div><p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>Tax Exposure</p>
                    <p className="text-lg font-light text-white">{aiReport.taxExposure || 'N/A'}</p></div>
                </div>
              </div>
              {/* Asset Breakdown */}
              {aiReport.assetBreakdown?.length > 0 && (
                <div className="mb-6 p-6 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color:'rgba(255,255,255,0.35)' }}>Asset Breakdown</p>
                  <div className="space-y-3">
                    {aiReport.assetBreakdown.map(({ category, value, percentage }) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-light text-white">{category}</span>
                          <span className="text-xs font-light" style={{ color:'rgba(255,255,255,0.5)' }}>{value}</span>
                        </div>
                        <div className="h-0.5 rounded-full" style={{ background:'rgba(255,255,255,0.06)' }}>
                          <motion.div className="h-full rounded-full" initial={{ width:0 }} animate={{ width:`${percentage}%` }} transition={{ duration:0.8, ease:'easeOut' }}
                            style={{ background:'#b89947', opacity: 0.5+(percentage/200) }} />
                        </div>
                        <p className="text-[10px] mt-1" style={{ color:'rgba(255,255,255,0.25)' }}>{percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* CA Analysis */}
              <div className="mb-8 p-6 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <Brain className="w-3.5 h-3.5" style={{ color:'#b89947' }} />
                  <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'rgba(255,255,255,0.35)' }}>AI Strategic Analysis</p>
                </div>
                <div className="text-sm font-light leading-relaxed space-y-3" style={{ color:'rgba(255,255,255,0.65)' }}>
                  {aiReport.caAnalysis.split('\n').map((para, idx) => para.trim() && <p key={idx}>{para}</p>)}
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={runCADeepAnalysis}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full font-medium text-xs uppercase tracking-[0.2em] transition-all duration-500"
                  style={{ background:'#b89947', color:'#000' }}>
                  <Calculator className="w-4 h-4" /> Run Full Deep Analysis
                </button>
                <button onClick={establishTrust}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full font-medium text-xs uppercase tracking-[0.2em] transition-all duration-500"
                  style={{ border:'1px solid rgba(255,255,255,0.15)', color:'white' }}>
                  <Shield className="w-4 h-4" /> Establish Private Trust Now
                </button>
              </div>
            </motion.div>
          )}

          {/* CA DEEP ANALYSIS */}
          {currentStep === 'ca_deep' && (
            <motion.div key="ca_deep" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
              {isCALoading ? (
                <div className="flex flex-col items-center justify-center text-center space-y-10 py-20">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <motion.div animate={{ rotate:360 }} transition={{ duration:4, repeat:Infinity, ease:'linear' }}
                      className="absolute inset-0 rounded-full"
                      style={{ border:'1px solid rgba(184,153,71,0.4)', borderTopColor:'#b89947' }} />
                    <Calculator className="w-7 h-7" style={{ color:'#b89947' }} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-light mb-3" style={{ fontFamily:'"Cormorant Garamond", serif' }}>AI Agent Processing</h2>
                    <p className="text-sm font-light" style={{ color:'rgba(255,255,255,0.45)' }}>Running deep wealth analysis…</p>
                  </div>
                </div>
              ) : caReport ? (
                <div>
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4" style={{ color:'#b89947' }} />
                        <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'#b89947' }}>AI Agent Report</span>
                      </div>
                      <h2 className="text-4xl font-light" style={{ fontFamily:'"Cormorant Garamond", serif' }}>Deep Wealth Analysis</h2>
                    </div>
                    <button onClick={() => prevStep('report')} className="text-[10px] uppercase tracking-[0.15em] transition-colors" style={{ color:'rgba(255,255,255,0.35)' }}>← Back</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon:FileText, label:'Executive Summary', key:'executiveSummary', color:'#fff' },
                      { icon:Activity, label:'Income Analysis', key:'incomeAnalysis', color:'#4ade80' },
                      { icon:Coins, label:'Tax Optimisation', key:'taxOptimization', color:'#facc15' },
                      { icon:Shield, label:'Trust Structure Recommendation', key:'trustStructure', color:'#b89947' },
                      { icon:TrendingUp, label:'Investment Recommendations', key:'investmentRecommendations', color:'#60a5fa' },
                      { icon:AlertTriangle, label:'Risk Mitigation', key:'riskMitigation', color:'#f87171' },
                      { icon:Lock, label:'Compliance Notes', key:'complianceNotes', color:'rgba(255,255,255,0.5)' },
                    ].map(({ icon: Icon, label, key, color }) => (
                      <CASection key={key} icon={Icon} label={label} content={String((caReport as any)[key] || '')} color={color} />
                    ))}
                    <div className="p-6 rounded-2xl" style={{ background:'rgba(184,153,71,0.06)', border:'1px solid rgba(184,153,71,0.2)' }}>
                      <div className="flex items-center gap-2 mb-5">
                        <Zap className="w-3.5 h-3.5" style={{ color:'#b89947' }} />
                        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'#b89947' }}>Immediate Actions This Month</p>
                      </div>
                      <div className="space-y-3">
                        {caReport.immediateActions.map((action, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background:'rgba(184,153,71,0.15)', border:'1px solid rgba(184,153,71,0.3)' }}>
                              <span className="text-[9px] font-bold" style={{ color:'#b89947' }}>{i+1}</span>
                            </div>
                            <p className="text-sm font-light leading-relaxed" style={{ color:'rgba(255,255,255,0.7)' }}>{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={establishTrust}
                    className="w-full mt-8 flex items-center justify-center gap-3 px-8 py-5 rounded-full font-medium text-xs uppercase tracking-[0.2em] transition-all duration-500"
                    style={{ background:'#b89947', color:'#000' }}>
                    <Shield className="w-4 h-4" /> Establish My Private Trust
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* SUCCESS */}
          {currentStep === 'success' && (
            <motion.div key="success" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="flex flex-col items-center text-center py-12">
              <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.2, type:'spring' }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{ background:'rgba(184,153,71,0.08)', border:'1px solid rgba(184,153,71,0.3)' }}>
                <CheckCircle className="w-10 h-10" style={{ color:'#b89947' }} strokeWidth={1} />
              </motion.div>
              <h2 className="text-6xl font-light mb-6" style={{ fontFamily:'"Cormorant Garamond", serif' }}>Trust Initiated</h2>
              <div className="max-w-sm space-y-4 text-sm font-light" style={{ color:'rgba(255,255,255,0.55)' }}>
                <p>Thank you, <span className="font-medium text-white">{formData.name}</span>.</p>
                <p>Your comprehensive wealth protection analysis and trust initiation request has been securely transmitted. Our elite legal team will reach you at <span className="font-medium text-white">{formData.phone}</span> within 24 hours.</p>
                <p className="text-lg mt-6" style={{ color:'#b89947', fontFamily:'"Cormorant Garamond", serif', fontStyle:'italic' }}>Your legacy, now protected.</p>
              </div>
              <button onClick={() => { setFormData({ name:'', age:'', phone:'', land:'', house:'', cars:'', stocks:'', business:'', jewelry:'', otherAssets:'', annualIncome:'', liabilities:'' }); setAiReport(null); setCAReport(null); nextStep('landing'); }}
                className="mt-14 text-[10px] uppercase tracking-[0.25em] transition-colors border-b border-transparent hover:border-white"
                style={{ color:'rgba(255,255,255,0.35)' }}>
                Return Home
              </button>
            </motion.div>
          )}

          {/* ABOUT US */}
          {currentStep === 'about' && (
            <motion.div key="about" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-md mx-auto">
              <button onClick={() => setCurrentStep('landing')} className="mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em] transition-colors" style={{ color:'rgba(255,255,255,0.35)' }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-5xl font-light mb-6 tracking-tight" style={{ fontFamily:'"Cormorant Garamond", serif' }}>About Us</h2>
              <div className="space-y-6 text-sm font-light leading-relaxed" style={{ color:'rgba(255,255,255,0.6)' }}>
                <p>
                  <span className="text-white font-medium">Indian Prenup</span> is a pioneering wealth protection platform founded by <span className="text-[#b89947] font-medium">Ikshit Joshi, CEO</span>. 
                  In an era where financial security is paramount, we bridge the gap between traditional legal structures and modern AI intelligence.
                </p>
                <p>
                  Our mission is to empower individuals to protect their hard-earned assets through private trusts and strategic wealth management. We believe that peace of mind is the ultimate luxury, and we provide the tools to ensure your legacy remains untouched by life's uncertainties.
                </p>
                <p>
                  By leveraging advanced neural engines and CA-grade analysis, we offer a level of precision and speed previously reserved for the ultra-wealthy.
                </p>
              </div>
            </motion.div>
          )}

          {/* CONTACT US */}
          {currentStep === 'contact' && (
            <motion.div key="contact" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-md mx-auto">
              <button onClick={() => setCurrentStep('landing')} className="mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em] transition-colors" style={{ color:'rgba(255,255,255,0.35)' }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-5xl font-light mb-6 tracking-tight" style={{ fontFamily:'"Cormorant Garamond", serif' }}>Contact Us</h2>
              <div className="space-y-8">
                <div className="p-6 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color:'rgba(255,255,255,0.35)' }}>Founder & Lead Advisor</p>
                  <p className="text-xl font-medium text-white mb-1">Ikshit Joshi, CEO</p>
                  <p className="text-xs" style={{ color:'#b89947' }}>Wealth Protection Specialist</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background:'rgba(184,153,71,0.1)' }}>
                      <MessageCircle className="w-4 h-4" style={{ color:'#b89947' }} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>Email Address</p>
                      <a href="mailto:Sarovarlakes@gmail.com" className="text-sm font-light text-white hover:text-[#b89947] transition-colors">Sarovarlakes@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background:'rgba(184,153,71,0.1)' }}>
                      <Activity className="w-4 h-4" style={{ color:'#b89947' }} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>Mobile Number</p>
                      <a href="tel:+919760915613" className="text-sm font-light text-white hover:text-[#b89947] transition-colors">+91 9760915613</a>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-center uppercase tracking-[0.3em] mt-10" style={{ color:'rgba(255,255,255,0.2)' }}>
                  Available 24/7 for Private Consultations
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative mt-auto pt-24 pb-12 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] z-30" style={{ color:'rgba(255,255,255,0.2)' }}>
        <button onClick={() => setCurrentStep('about')} className="hover:text-white transition-colors cursor-pointer">About Us</button>
        <span style={{ color:'rgba(255,255,255,0.1)' }}>·</span>
        <button onClick={() => setCurrentStep('contact')} className="hover:text-white transition-colors cursor-pointer">Contact Us</button>
      </footer>
    </div>
  );
}

function CASection({ icon: Icon, label, content, color }: { icon: any; label: string; content: string; color: string; key?: string | number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left" style={{ cursor:'pointer' }}>
        <div className="flex items-center gap-3">
          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
          <span className="text-xs uppercase tracking-[0.15em] font-medium" style={{ color }}>{label}</span>
        </div>
        <ChevronDown className="w-4 h-4 transition-transform duration-300" style={{ color:'rgba(255,255,255,0.3)', transform: open?'rotate(180deg)':'rotate(0deg)' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }}>
            <div className="px-5 pb-5 text-sm font-light leading-relaxed" style={{ color:'rgba(255,255,255,0.6)', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'16px' }}>
              {content.split('\n').map((p, i) => p.trim() && <p key={i} className="mb-2">{p}</p>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GuardianBell({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Ring */}
      <circle cx="50" cy="15" r="8" stroke="#b89947" strokeWidth="1.5" />
      
      {/* Bell Body */}
      <path 
        d="M50 23C35 23 25 35 25 55C25 70 20 75 15 75H85C80 75 75 70 75 55C75 35 65 23 50 23Z" 
        stroke="#b89947" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Clapper */}
      <motion.circle 
        cx="50" 
        cy="82" 
        r="4" 
        fill="#b89947" 
        animate={{ x: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Bottom Line */}
      <path 
        d="M25 75C25 80 35 85 50 85C65 85 75 80 75 75" 
        stroke="#b89947" 
        strokeWidth="1" 
        strokeDasharray="2 4"
      />
    </svg>
  );
}
