import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Zap, Target, Users, Check, ArrowRight, Battery, Wifi, Signal, Play, Send, Menu, X, Home, BookOpen, CreditCard, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-primary rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <span className="font-display font-bold text-lg md:text-xl text-brand-dark">AI Academy</span>
      </Link>
      <Link to="/signup" className="flex items-center bg-brand-dark text-white px-5 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-brand-primary transition-colors cursor-pointer">
        Get Started
      </Link>
    </div>
  </nav>
);

export const AppNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "My Courses", path: "/course", icon: BookOpen },
    { name: "Billing", path: "/billing", icon: CreditCard },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Clear cookies/localStorage and redirect
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-[#0A5E53] to-[#0a4a42] text-white flex-col z-40 pt-8"
      >
        {/* Logo */}
        <Link to="/dashboard" className="px-6 mb-12 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Zap className="text-[#0A5E53] w-6 h-6" />
          </div>
          <span className="font-bold text-xl">AI Academy</span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40"
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0A5E53] rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900">AI Academy</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-100 z-30"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? "bg-[#0A5E53]/10 text-[#0A5E53] font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Hero = () => (
  <section className="pt-32 pb-20 px-6 text-center overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-[1.1] mb-6 max-w-4xl mx-auto">
        Start Your AI <br />
        <span className="text-brand-secondary inline-flex items-center gap-2">
          Journey for Free <Zap className="fill-brand-secondary animate-pulse" />
        </span>
      </h1>
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
        Chat with our AI assistant on WhatsApp and unlock AI skills step-by-step. 
        No complex platforms, just a conversation that grows your intelligence.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open('https://wa.me/919499238456?text=AI-Academy', '_blank')}
        className="bg-brand-secondary text-white px-8 py-4 rounded-2xl font-bold text-lg md:text-xl shadow-lg shadow-brand-secondary/25 flex items-center gap-3 mx-auto mb-10 transition-transform cursor-pointer"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
        Start on WhatsApp
      </motion.button>

      <div className="flex items-center justify-center gap-3">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              src={`https://picsum.photos/seed/user${i}/100/100`}
              className="w-10 h-10 rounded-full border-2 border-white"
              alt="User"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
        <span className="text-gray-500 font-medium text-sm">Join 10,000+ learners</span>
      </div>
    </motion.div>
  </section>
);

export const StatsCard = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative max-w-md mx-auto bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 overflow-hidden mb-24"
  >
    <div className="mb-8">
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Knowledge Growth</p>
      <h3 className="text-4xl font-display font-bold text-gray-900">+84%</h3>
    </div>
    
    <div className="flex items-end gap-3 h-40 mb-8 px-2">
      {[40, 60, 25, 85, 100, 75].map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          transition={{ duration: 1, delay: i * 0.1 }}
          className={`flex-1 rounded-t-xl ${i === 4 ? 'bg-brand-primary' : 'bg-gray-100'}`}
        />
      ))}
    </div>

    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute top-1/2 left-0 bg-white shadow-lg border border-gray-100 py-3 px-4 rounded-r-2xl flex items-center gap-3 -translate-y-12"
    >
      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
        <Check className="text-white w-4 h-4" />
      </div>
      <span className="text-sm font-bold text-gray-800">New Skill Unlocked</span>
    </motion.div>

    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.4 }}
      className="absolute bottom-1/4 right-0 bg-brand-light py-4 px-6 rounded-l-3xl border-l-[6px] border-brand-primary flex items-center gap-4 shadow-sm"
    >
      <div className="text-right">
        <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest leading-none mb-1">Daily Streak</p>
        <p className="text-xl font-display font-bold text-brand-dark">7 Days</p>
      </div>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
        <Zap className="text-brand-secondary w-6 h-6 fill-brand-secondary" />
      </div>
    </motion.div>
  </motion.div>
);

export const SectionTitle = ({ title, subtitle, dark = false }: { title: string, subtitle: string, dark?: boolean }) => (
  <div className="text-center px-6 mb-16">
    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
    <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
  </div>
);

type Message = {
  id: number;
  text: string | ReactNode;
  sender: 'ai' | 'user';
  delay: number;
};

const MESSAGES: Message[] = [
  { id: 1, sender: 'ai', text: "Welcome to Day 1! 🌿 Today we'll cover the basics of Prompt Engineering. Ready to dive in?", delay: 1000 },
  { id: 2, sender: 'user', text: "Yes, let's do this! 🚀", delay: 1500 },
  { id: 3, sender: 'ai', text: (
    <>
      Awesome! A "prompt" is simply the instruction you give an AI. <br /><br />
      <div className="bg-gray-100 p-3 rounded-lg text-xs leading-relaxed font-mono border-l-2 border-brand-primary">
        Bad: "write an email."<br />
        Good: "Write a polite email to my manager asking for next Friday off for a family event."
      </div>
      <br />
      Can you see why the second one is much more effective?
    </>
  ), delay: 2000 },
  { id: 4, sender: 'user', text: "It's way more specific! 💡", delay: 1500 },
];

export const ChatMockup = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageIndex = useRef(0);

  useEffect(() => {
    if (messageIndex.current < MESSAGES.length) {
      const nextMessage = MESSAGES[messageIndex.current];
      
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, nextMessage]);
          messageIndex.current += 1;
        }, 1500);
      }, nextMessage.delay);

      return () => clearTimeout(timer);
    } else {
      // Reset after a while
      const resetTimer = setTimeout(() => {
        setMessages([]);
        messageIndex.current = 0;
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <section className="bg-gray-50 py-24 px-6">
      <SectionTitle 
        title="Chat Like You're Talking to a Friend"
        subtitle="No portals, no passwords. Our WhatsApp curriculum delivers bite-sized lessons, interactive quizzes, and instant feedback directly to your favorite app."
      />

      <div className="max-w-[380px] mx-auto relative">
        {/* Device Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[54px] p-2.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[8px] border-[#1A1A1A] relative overflow-hidden"
        >
          {/* Status Bar */}
          <div className="h-6 flex justify-between items-center px-8 mt-2 mb-2">
            <span className="text-[10px] font-bold">9:41</span>
            <div className="flex gap-1.5 items-center">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-[18px] z-20" />
          
          {/* WhatsApp Header */}
          <div className="pt-8 pb-4 px-5 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-primary rounded-full flex items-center justify-center overflow-hidden">
                <Zap className="text-white w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">AI Academy Guide</h4>
                <span className="text-[9px] text-brand-secondary font-semibold">Online</span>
              </div>
            </div>
            <div className="flex gap-3 text-brand-primary opacity-60">
              <div className="w-4 h-4 bg-gray-100 rounded-full" />
              <div className="w-4 h-4 bg-gray-100 rounded-full" />
            </div>
          </div>

          {/* Chat Canvas with Wallpaper */}
          <div 
            ref={scrollRef}
            className="p-4 space-y-4 h-[420px] overflow-y-auto scroll-smooth bg-[#E5DDD5] rounded-3xl"
            style={{ backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`, backgroundSize: '200px' }}
          >
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={m.sender === 'ai' ? 'chat-bubble-ai border-none' : 'chat-bubble-user'}
                >
                  <p className="text-[13px] leading-relaxed">{m.text}</p>
                  <span className="block text-[8px] opacity-40 text-right mt-1">9:41 AM</span>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="chat-bubble-ai border-none w-16"
                >
                  <div className="flex gap-1">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white flex items-center gap-2">
            <div className="flex-1 bg-gray-100 h-10 rounded-full px-4 flex items-center text-gray-400 text-xs">
              Type a message...
            </div>
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <Send className="text-white w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all h-full group"
  >
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
      <Icon className="text-white w-7 h-7" />
    </div>
    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed font-sans">{description}</p>
  </motion.div>
);

export const FeatureGrid = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto">
    <SectionTitle 
      title="The Cultivated Approach to Learning AI"
      subtitle="We've rebuilt education from the ground up for the AI era."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <FeatureCard 
        icon={Zap}
        title="Learn at the Speed of Chat"
        description="No heavy portals or complex dashboards. Just quick, effective lessons delivered straight to your WhatsApp."
        color="bg-brand-primary"
      />
      <FeatureCard 
        icon={Target}
        title="Real-World Prompts"
        description="Focus on actionable skills you can use immediately at work or in daily life."
        color="bg-orange-500"
      />
      <FeatureCard 
        icon={Users}
        title="Interactive Quizzes"
        description="Test your knowledge immediately after each concept to reinforce your learning path."
        color="bg-blue-500"
      />
      <FeatureCard 
        icon={ArrowRight}
        title="Thriving Community"
        description="Join thousands of others. Discuss, share prompts, and grow together in our dedicated channels."
        color="bg-purple-500"
      />
    </div>
  </section>
);

export const Pricing = () => (
  <section className="py-32 px-6 bg-[#0A0A0A] overflow-hidden relative">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/10 blur-[120px] rounded-full -ml-48 -mb-48 pointer-events-none" />

    <SectionTitle 
      dark
      title="Invest in Your Intelligence"
      subtitle="Master the tools that define the future. Lifetime access to the world's most accessible AI education."
    />

    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1">
        <ul className="space-y-6">
          {[
            "Lifetime access to all modules",
            "30+ Real-world Prompt Templates",
            "Exclusive WhatsApp community access",
            "Direct mentor support via chat",
            "Official certificate of completion",
            "Monthly content updates"
          ].map((feature, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 text-gray-400 group"
            >
              <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-colors">
                <Check className="w-3.5 h-3.5 text-brand-primary group-hover:text-white" />
              </div>
              <span className="text-lg font-medium group-hover:text-white transition-colors">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="order-1 md:order-2 bg-[#141414] border border-white/10 p-12 rounded-[48px] shadow-2xl relative"
      >
        <div className="absolute top-8 right-12">
          <span className="px-5 py-2 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest">Limited Offer</span>
        </div>

        <div className="mb-10 pt-4">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">Total Value Portfolio</p>
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-7xl font-display font-bold text-white tracking-tight">₹499</span>
            <span className="text-2xl text-gray-600 line-through font-bold">₹1000</span>
          </div>
          <p className="text-gray-400 text-lg">One-time payment. Zero recurring fees.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white text-black py-6 rounded-2xl font-bold text-xl hover:bg-brand-secondary hover:text-white transition-all cursor-pointer shadow-lg shadow-white/5"
        >
          Begin Learning Now
        </motion.button>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm font-medium">
          <Zap className="w-4 h-4 text-brand-secondary fill-brand-secondary" />
          <span>Used by teams at Google, Meta, and Netflix</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="py-20 px-6 bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
      <div className="max-w-xs">
        <div className="flex items-center gap-2 mb-6 text-brand-dark">
          <Zap className="w-8 h-8 fill-brand-primary text-brand-primary" />
          <span className="font-display font-bold text-2xl tracking-tight">AI Academy</span>
        </div>
        <p className="text-gray-400 leading-relaxed text-sm">
          Democratizing intelligence through the power of conversation. Join the largest mobile-first AI community today.
        </p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <span className="font-display font-bold uppercase tracking-[0.2em] text-[10px] text-gray-900 mb-2">Academy</span>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Course Deck</a>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Skill Roadmap</a>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Mentorship</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-display font-bold uppercase tracking-[0.2em] text-[10px] text-gray-900 mb-2">Connect</span>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">WhatsApp</a>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">LinkedIn</a>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Discord</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-display font-bold uppercase tracking-[0.2em] text-[10px] text-gray-900 mb-2">Legal</span>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Privacy</a>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Terms</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-display font-bold uppercase tracking-[0.2em] text-[10px] text-gray-900 mb-2">Support</span>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Help Bot</a>
          <a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Contact</a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-100 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300">
      <span>© 2024 AI Academy</span>
      <span>Cultivating Intelligence</span>
    </div>
  </footer>
);