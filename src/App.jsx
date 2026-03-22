import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  User, 
  Calendar, 
  Shield, 
  Zap, 
  Percent, 
  FileText,
  X,
  Menu,
  LayoutDashboard,
  ExternalLink,
  RefreshCw,
  Users,
  Lock,
  Quote,
  MessageCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Images
import starLogo from './assets/star.jfif';
import heroImg from './assets/loan1.jpeg';
import avatar1 from './assets/avatar1.png';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const LoginModal = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();
      if (username === 'star' && password === 'star1234') {
        setIsAdminAuthenticated(true);
        setShowDashboard(true);
        setShowLoginModal(false);
        setError('');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    };

    return (
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-10 shadow-premium overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-star-blue to-blue-400" />
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 text-star-blue rounded-2xl flex items-center justify-center mb-6">
                  <Lock size={30} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Admin Login</h2>
                <p className="text-slate-500 font-medium">Access your lead dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-star-blue focus:border-transparent transition-all outline-none font-medium"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-star-blue focus:border-transparent transition-all outline-none font-medium"
                    placeholder="••••••••"
                  />
                </div>
                
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-star-red text-sm font-bold text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-star-blue transition-all active:scale-[0.98] shadow-lg shadow-blue-100"
                >
                  Sign In
                </button>
              </form>

              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', age: '' });

  useEffect(() => {
    if (showDashboard) {
      fetchLeads();
      fetchStats();
    }
  }, [showDashboard]);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/leads`);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/submit_lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSubmitted(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error submitting lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FeatureCard = ({ icon: Icon, title, desc }) => (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-8 glass-card rounded-[32px] hover:bg-white/80 transition-all duration-500 group"
    >
      <div className="w-16 h-16 bg-blue-50 group-hover:bg-star-blue group-hover:text-white rounded-2xl flex items-center justify-center text-star-blue mb-8 transition-all duration-500 shadow-sm">
        <Icon size={30} />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-lg font-medium">{desc}</p>
    </motion.div>
  );

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-slate-50 font-outfit">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={starLogo} alt="Logo" className="h-10 w-10 rounded-lg object-cover" />
            <h1 className="text-xl font-extrabold text-star-blue tracking-tight">Star Health Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setIsAdminAuthenticated(false);
                setShowDashboard(false);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all border border-slate-200"
            >
              Logout
            </button>
            <button 
              onClick={() => setShowDashboard(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-star-blue text-star-blue font-bold hover:bg-star-blue hover:text-white transition-all shadow-sm"
            >
              <ExternalLink size={18} />
              View Website
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Lead Management</h1>
              <p className="text-slate-500 mt-2 text-lg">Overview of all collected insurance leads</p>
            </div>
            <button 
              onClick={() => { fetchLeads(); fetchStats(); }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-star-blue to-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw size={20} className="refresh-icon" />
              Refresh Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Leads', value: stats.total, icon: Users, color: 'blue' },
              { label: "Today's Leads", value: stats.today, icon: Calendar, color: 'red' },
              { label: 'System Status', value: 'Active', icon: Shield, color: 'green' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
                  <p className={cn(
                    "text-4xl font-extrabold mt-2",
                    stat.color === 'blue' ? 'text-star-blue' : stat.color === 'red' ? 'text-star-red' : 'text-emerald-500'
                  )}>{stat.value}</p>
                </div>
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center",
                  stat.color === 'blue' ? 'bg-blue-50 text-star-blue' : stat.color === 'red' ? 'bg-red-50 text-star-red' : 'bg-emerald-50 text-emerald-500'
                )}>
                  <stat.icon size={32} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-star-blue rounded-lg">
                <FileText size={20} />
              </div>
              Recent Leads
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Lead Details</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <motion.tr 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group"
                    >
                      <td className="px-6 py-5 bg-slate-50 group-hover:bg-white rounded-l-2xl border-y border-l border-transparent group-hover:border-slate-200 transition-all font-medium text-slate-500">
                        {lead.timestamp}
                      </td>
                      <td className="px-6 py-5 bg-slate-50 group-hover:bg-white border-y border-transparent group-hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-star-blue to-blue-400 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-100">
                            {lead.name[0]}
                          </div>
                          <span className="font-bold text-slate-900 text-lg">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 bg-slate-50 group-hover:bg-white border-y border-transparent group-hover:border-slate-200 transition-all">
                        <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-star-blue rounded-full font-bold hover:bg-star-blue hover:text-white transition-all">
                          <Phone size={14} />
                          +91 {lead.phone}
                        </a>
                      </td>
                      <td className="px-6 py-5 bg-slate-50 group-hover:bg-white border-y border-transparent group-hover:border-slate-200 transition-all">
                        <span className="bg-slate-200 px-3 py-1 rounded-lg text-sm font-bold text-slate-600">{lead.age} Yrs</span>
                      </td>
                      <td className="px-6 py-5 bg-slate-50 group-hover:bg-white rounded-r-2xl border-y border-r border-transparent group-hover:border-slate-200 transition-all">
                        <span className="inline-flex items-center gap-2 text-star-blue font-bold px-4 py-2 bg-blue-50 rounded-full text-sm">
                          <div className="w-2 h-2 bg-star-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(0,82,204,0.6)]" />
                          New Lead
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {leads.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-soft">
                    <FileText size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">No Leads Yet</h3>
                  <p className="text-slate-500 mt-2">When users submit the form, their details will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="mt-auto py-10 bg-white border-t border-slate-200 text-center">
          <p className="text-slate-500 font-medium">© 2026 Star Health Admin Panel. Confidentially Built. <Shield className="inline-block ml-2 text-star-blue" size={18} /></p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient font-outfit overflow-x-hidden relative">
      {/* Decorative Floating Blobs */}
      <div className="absolute top-[10%] -left-20 w-[600px] h-[600px] bg-star-blue/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[20%] -right-20 w-[500px] h-[500px] bg-star-red/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-2xl border-b border-white/20 px-6 py-5 lg:px-12">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <img src={starLogo} alt="Star Logo" className="h-12 w-12 rounded-xl object-cover shadow-soft group-hover:scale-110 transition-transform" />
              <div className="absolute -inset-1 bg-star-blue/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-star-blue tracking-tight">Star Health</h1>
          </div>
          <div className="hidden md:flex gap-10 items-center font-bold text-slate-600">
            {['Plans', 'Hospitals', 'Claims'].map((item) => (
              <a key={item} href="#" className="relative hover:text-star-blue transition-colors group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-star-blue transition-all group-hover:w-full" />
              </a>
            ))}
            <button 
              onClick={() => {
                if (isAdminAuthenticated) setShowDashboard(true);
                else setShowLoginModal(true);
              }}
              className="bg-white/80 hover:bg-star-blue hover:text-white text-slate-900 px-7 py-3 rounded-full transition-all flex items-center gap-2 shadow-sm border border-white/50 font-bold"
            >
              <LayoutDashboard size={18} />
              Admin
            </button>
          </div>
          <button className="md:hidden text-slate-900"><Menu /></button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md text-star-blue rounded-full font-bold text-sm mb-10 shadow-sm border border-white/50">
              <div className="w-2 h-2 bg-star-blue rounded-full animate-pulse" />
              India's Most Trusted Health Insurer
            </div>
            <h1 className="text-6xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-10">
              <span className="hero-text-gradient">Premium Healthcare</span> <br /> 
              <span className="text-slate-900">For You</span>
            </h1>
            <p className="text-2xl text-slate-500 leading-relaxed mb-12 max-w-xl font-medium">
              Experience the next generation of health insurance. Secure, seamless, and stunningly simple.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
              {[
                { text: 'Cashless in 2 Hrs', icon: Zap },
                { text: '14,000+ Hospitals', icon: Shield },
                { text: 'No Medical Checkup', icon: CheckCircle },
                { text: 'Instant Approval', icon: Zap }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-sm">
                  <div className="bg-star-blue/10 text-star-blue rounded-xl p-2.5">
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-slate-800">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative bg-slate-900 text-white px-12 py-6 rounded-full text-xl font-bold overflow-hidden shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-star-blue to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-3">
                  Check Eligible Plans
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-gradient-to-br from-star-blue/20 to-star-red/20 opacity-30 blur-3xl rounded-full animate-pulse-slow" />
            <div className="relative group">
              <img 
                src={heroImg} 
                alt="Hero" 
                className="relative rounded-[60px] shadow-premium object-cover aspect-[4/5] w-full transform group-hover:scale-[1.02] transition-transform duration-1000"
              />
              <div className="absolute inset-0 rounded-[60px] ring-1 ring-white/20" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-star-blue/[0.02] -skew-y-3 transform origin-right" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Happy Families', value: '1.2Cr+', icon: Users },
              { label: 'Network Hospitals', value: '14,000+', icon: Shield },
              { label: 'Claims Settled', value: '99.9%', icon: CheckCircle },
              { label: 'Cashless Support', value: '24/7', icon: Zap }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tighter">{stat.value}</div>
                <div className="text-lg font-bold text-star-blue uppercase tracking-widest flex items-center justify-center gap-2">
                  <stat.icon size={18} />
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-6">Real Stories from <br /><span className="text-star-blue">Real Families.</span></h2>
              <p className="text-xl text-slate-500 font-medium">Join over 12 million Indians who trust Star Health for their medical security.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-star-blue hover:text-star-blue cursor-pointer transition-all">
                <ArrowRight className="rotate-180" />
              </div>
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-star-blue cursor-pointer transition-all">
                <ArrowRight />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Rahul Sharma', 
                role: 'Father of 2', 
                text: 'The cashless process was incredibly smooth. My daughter was admitted and discharged without a single rupee out of pocket.',
                avatar: avatar1
              },
              { 
                name: 'Anjali Gupta', 
                role: 'Business Owner', 
                text: 'Best decision for my parents. The senior citizen plan is comprehensive and the customer support is available 24/7.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
              },
              { 
                name: 'The Vermas', 
                role: 'Family Plan', 
                text: 'We switched to Star Health last year. The mobile app makes it so easy to track claims and find network hospitals nearby.',
                avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=400&fit=crop'
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 bg-white rounded-[40px] shadow-soft border border-slate-100 relative group"
              >
                <div className="absolute -top-6 left-10 w-12 h-12 bg-star-blue text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform">
                  <Quote size={24} />
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt={t.name} />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{t.name}</h4>
                    <p className="text-star-blue font-bold text-sm uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Awards Bar */}
      <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm mb-12">Trusted & Recognized By</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {['ET Best Brands', 'Forbes 500', 'ISO Certified', 'Nidhi Award', 'FICCI'].map((award) => (
              <div key={award} className="text-2xl font-black text-slate-400 hover:text-star-blue transition-colors cursor-default whitespace-nowrap">
                {award}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-500 font-medium">Everything you need to know about our plans and services.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is a medical check-up mandatory?', a: 'No, for most plans up to age 50, no pre-insurance medical check-up is required.' },
              { q: 'How long does it take for cashless approval?', a: 'Our average turnaround time for cashless authorization is under 2 hours.' },
              { q: 'Can I cover my parents under my plan?', a: 'Yes, we have specialized family floater plans that cover parents and parents-in-law.' },
              { q: 'What is a No Claim Bonus?', a: 'It is a benefit awarded to the policyholder for every claim-free year, increasing the sum insured at no extra cost.' }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={false}
                className="border border-slate-100 rounded-[24px] overflow-hidden"
              >
                <button className="w-full p-8 text-left flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-star-blue">
                    <Zap size={16} />
                  </div>
                </button>
                <div className="px-8 py-6 text-slate-600 font-medium bg-white">
                  {faq.a}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Estimator Tool */}
      <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-star-blue/10 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative">
          <div>
            <h2 className="text-5xl font-black mb-8 leading-tight">Instant Premium <br /><span className="text-star-blue">Estimator.</span></h2>
            <p className="text-xl text-slate-400 font-medium mb-12 max-w-md">Get a quick estimate for your health cover in seconds. No personal details required for initial quote.</p>
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between font-bold text-lg uppercase tracking-widest text-slate-500">
                  <span>Age of Eldest Member</span>
                  <span className="text-star-blue">25 Yrs</span>
                </div>
                <input type="range" min="18" max="75" className="w-full accent-star-blue h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="space-y-6">
                <div className="flex justify-between font-bold text-lg uppercase tracking-widest text-slate-500">
                  <span>Sum Insured (Cover)</span>
                  <span className="text-star-blue">₹10 Lacs</span>
                </div>
                <input type="range" min="300000" max="10000000" step="100000" className="w-full accent-star-blue h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-[48px] p-12 border border-white/10 text-center">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-4">Estimated Yearly Premium</h3>
            <div className="text-7xl font-black text-white mb-4">₹12,450*</div>
            <p className="text-slate-500 mb-10 font-medium">Approx. ₹1,037 / month</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-star-blue text-white py-6 rounded-2xl text-xl font-bold shadow-2xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Custom Quote
            </button>
            <p className="text-[10px] text-slate-600 mt-6 uppercase font-bold tracking-[0.2em]">*Inclusive of GST. Final premium depends on health status.</p>
          </div>
        </div>
      </section>

      {/* Health Insights (Blog) */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 mb-6">Health <span className="text-star-blue">Insights.</span></h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Stay informed with the latest tips on wellness, insurance, and medical care.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Understanding Claim Settlements', 
                cat: 'insurance', 
                img: 'https://images.unsplash.com/photo-1454165833767-0266b196773b?w=800&q=80',
                date: 'Mar 15, 2026'
              },
              { 
                title: '5 Tips for a Healthy Heart', 
                cat: 'wellness', 
                img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
                date: 'Mar 12, 2026'
              },
              { 
                title: 'The Future of Telemedicine', 
                cat: 'tech', 
                img: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?w=800&q=80',
                date: 'Mar 10, 2026'
              }
            ].map((post, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-[32px] overflow-hidden mb-8 shadow-soft">
                  <img src={post.img} alt={post.title} className="w-full aspect-[4/3] object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-xl text-xs font-black uppercase tracking-widest text-star-blue">
                    {post.cat}
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-slate-400 font-bold text-sm mb-3">{post.date}</div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-star-blue transition-colors leading-tight">{post.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[50px] p-12 lg:p-20 relative overflow-hidden text-center lg:text-left">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-star-blue to-star-red" />
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Join the Star <br /><span className="text-star-blue">Inner Circle.</span></h2>
              <p className="text-slate-400 text-lg font-medium">Get exclusive health tips and priority plan updates directly in your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Drop your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:ring-2 focus:ring-star-blue transition-all font-bold"
              />
              <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-star-blue hover:text-white transition-all whitespace-nowrap">
                Stay Updated
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-20 mb-10">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <img src={starLogo} alt="Logo" className="h-12 w-12 rounded-xl" />
              <h2 className="text-3xl font-extrabold tracking-tight">Star Health</h2>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">The Health Insurance Specialist. Providing quality healthcare coverage for millions of families across India.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-8">Quick Links</h3>
            <div className="space-y-4 text-slate-400 font-medium">
              <a href="#" className="block hover:text-white transition-colors">Our Plans</a>
              <a href="#" className="block hover:text-white transition-colors">Network Hospitals</a>
              <a href="#" className="block hover:text-white transition-colors">About Us</a>
              <a href="#" className="block hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-8">Support</h3>
            <div className="space-y-4 text-slate-400 font-medium">
              <a href="#" className="block hover:text-white transition-colors">FAQs</a>
              <a href="#" className="block hover:text-white transition-colors">Downloads</a>
              <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
              <p className="text-white font-bold pt-4">+91 1800 425 2255</p>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-500 font-medium">© 2026 Star Health and Allied Insurance Co Ltd. All rights reserved.</p>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => { setIsModalOpen(false); setSubmitted(false); }}
                className="absolute right-8 top-8 text-slate-400 hover:text-star-red transition-colors"
              >
                <X size={28} />
              </button>

              <div className="p-12">
                {!submitted ? (
                  <>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Apply for Coverage</h2>
                    <p className="text-slate-500 mb-10 font-medium text-lg">Enter your details to check eligible plans.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-7">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                          <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            required
                            type="text" 
                            placeholder="Enter your name" 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-star-blue focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-slate-900"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Mobile Number</label>
                        <div className="relative flex">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <Phone size={18} className="text-slate-400" />
                            <span className="font-bold text-slate-400">+91</span>
                          </div>
                          <input 
                            required
                            pattern="[0-9]{10}"
                            type="tel" 
                            placeholder="10 digit number" 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-star-blue focus:bg-white rounded-2xl py-4 pl-24 pr-6 outline-none transition-all font-bold text-slate-900"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Age</label>
                        <div className="relative">
                          <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            required
                            min="21"
                            max="60"
                            type="number" 
                            placeholder="Your age" 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-star-blue focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-slate-900"
                            value={formData.age}
                            onChange={e => setFormData({...formData, age: e.target.value})}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-star-blue text-white py-5 rounded-2xl text-xl font-bold shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <RefreshCw className="animate-spin" />
                        ) : (
                          <>
                            View Plans
                            <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </form>
                    <p className="text-center text-slate-400 text-sm mt-8 font-medium">By clicking View Plans, you agree to our <span className="text-star-blue underline cursor-pointer">Terms & Conditions</span>.</p>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-50">
                      <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Recommended Plans</h2>
                    <p className="text-slate-500 mb-10 text-lg">Based on your age of {formData.age}, we suggest:</p>
                    
                    <div className="space-y-4 text-left">
                      {[
                        { name: 'Family Health Optima', sum: '₹25 Lacs', color: 'blue' },
                        { name: 'Star Comprehensive', sum: '₹1 Crore', color: 'red' }
                      ].map((plan, i) => (
                        <div key={i} className={cn(
                          "p-6 rounded-3xl border-2 transition-all cursor-pointer hover:scale-[1.02]",
                          plan.color === 'blue' ? 'border-star-blue bg-blue-50/50' : 'border-star-red bg-red-50/50'
                        )}>
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                              <p className="text-slate-600 font-bold mt-1">Sum Insured: {plan.sum}</p>
                            </div>
                            <ArrowRight className={plan.color === 'blue' ? 'text-star-blue' : 'text-star-red'} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs mt-8 font-bold uppercase tracking-widest leading-loose">* Indicative rates. Final premium subject to underwriting.</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <LoginModal />
    </div>
  );
}
