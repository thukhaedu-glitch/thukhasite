import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Bot, Zap, Globe, Award, Linkedin, Mail, FileText, 
  LayoutGrid, Laptop, CheckCircle, ChevronRight, Code, MessageSquare, 
  X, GraduationCap, ArrowUpRight, Heart, Calendar, Play, Pause, 
  Image, Video, BookOpen, Clock, Sparkles, Film, Book
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import our interactive mockup components
import PricingCalculator from './components/PricingCalculator';
import SeoGrader from './components/SeoGrader';
import KpiDashboard from './components/KpiDashboard';
import EventTimeline from './components/EventTimeline';

import { Project, BlogPost } from './types';
import { usePortfolioContent } from './content';
import { useSeo } from './seo';

export default function App() {
  const {
    projects: projectsData,
    volunteering: volunteeringData,
    certifications: certificationsData,
    websites: websitesData,
    creativeItems: creativeItemsData,
    blogPosts: blogPostsData,
    settings,
  } = usePortfolioContent();
  // Navigation active state
  const [activeTab, setActiveTab] = useState('home');
  // Selected project for case study modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // Selected blog post for reader modal
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  // Selected laptop mockup tab
  const [activeMockType, setActiveMockType] = useState<'pricing-calculator' | 'seo-grader' | 'kpi-dashboard' | 'event-timeline'>('pricing-calculator');
  // Custom client-side CV toast notification feedback (replaces window.alert)
  const [cvToast, setCvToast] = useState(false);
  // Selected filter for creative artwork gallery
  const [activeCreativeFilter, setActiveCreativeFilter] = useState<'all' | 'graphics' | 'motion' | 'photography' | 'social'>('all');
  // Active playing simulated motion loop ID
  const [playingMotionId, setPlayingMotionId] = useState<string | null>(null);
  // Simulated video playback cycle state (0 to 100 percent)
  const [videoPlaybackProgress, setVideoPlaybackProgress] = useState<{ [key: string]: number }>({});
  useSeo(settings, selectedBlogPost || selectedProject || undefined);
  const activeWebsite = websitesData.find((website) => website.mockType === activeMockType);

  useEffect(() => {
    if (cvToast) {
      const timer = setTimeout(() => setCvToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [cvToast]);

  // Handle dynamic Simulated micro-video loop progression
  useEffect(() => {
    const interval = setInterval(() => {
      if (playingMotionId) {
        setVideoPlaybackProgress(prev => {
          const current = prev[playingMotionId] || 0;
          return {
            ...prev,
            [playingMotionId]: current >= 100 ? 0 : current + 2.5
          };
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [playingMotionId]);

  // Particle background coordinates for tech effect
  const particles = Array.from({ length: 15 }, (_, idx) => ({
    id: idx,
    top: `${Math.sin(idx) * 45 + 50}%`,
    left: `${Math.cos(idx * 3.14) * 45 + 50}%`,
    pDelay: idx * 0.1,
    pSpeed: 6 + (idx % 3) * 2
  }));

  // Automatic scroll listener to highlight active navigation header elements
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      const sections = ['home', 'about', 'projects', 'creative', 'volunteering', 'blog', 'contact'];
      
      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(sect);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080c14] text-[#cbd5e1] selection:bg-brand-purple/20 selection:text-white font-sans" id="root-viewport">
      
      {/* BACKGROUND ELEMENTS - Ambient dark grids & glowing meshes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sleek matrix lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1626_1px,transparent_1px),linear-gradient(to_bottom,#0f1626_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Soft glowing ambient vector blobs */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/[0.04] rounded-full filter blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-brand-emerald/[0.02] rounded-full filter blur-[110px] mix-blend-screen animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-slate-900/[0.05] rounded-full filter blur-[120px] mix-blend-screen" />
        
        {/* Small sparkling background nodes */}
        {particles.map((p) => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-white/[0.015] w-1.5 h-1.5 animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              animationDelay: `${p.pDelay}s`,
              animationDuration: `${p.pSpeed}s`
            }}
          />
        ))}
      </div>

      {/* HEADER FLOATING NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#080c14]/90 border-b border-slate-800/60" id="nav-header">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center space-x-3 group animate-fade-in">
            <div className="relative h-10 w-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center font-sans font-bold text-white text-xs tracking-wider transition-all duration-300 group-hover:border-brand-emerald">
              TA
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand-emerald ring-2 ring-[#080c14]" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold tracking-tight text-white leading-none text-sm group-hover:text-brand-emerald transition-colors">THUKHA AUNG</span>
              <span className="text-[9px] font-mono tracking-widest text-[#10b981] font-bold uppercase mt-1">Growth Specialist</span>
            </div>
          </a>

          {/* Large Screen Navigation Menu - Beautifully Clean and Streamlined */}
          <nav className="hidden lg:flex items-center space-x-2 text-xs">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Specialist' },
              { id: 'projects', label: 'Works & Sandbox' },
              { id: 'creative', label: 'Creative Studio' },
              { id: 'volunteering', label: 'Noble Impact' },
              { id: 'blog', label: 'Intel Blog' },
              { id: 'contact', label: 'Get In Touch' },
            ].map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={`px-3.5 py-2 rounded-full transition-all tracking-wide font-medium text-xs ${
                  activeTab === tab.id 
                    ? 'bg-blue-600/10 text-white font-semibold border border-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          {/* Let's Work Together Action */}
          <div className="hidden sm:flex items-center">
            <a 
              href="#contact" 
              className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30 text-xs px-5 py-2.5 rounded-full transition-all font-bold tracking-wide shadow-lg shadow-blue-900/25"
            >
              Let&apos;s Work Together
            </a>
          </div>
        </div>
      </header>

      {/* COMPACT FLOATING BAR FOR MOBILE NAVIGATION */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 max-w-lg mx-auto bg-[#0c1322]/95 backdrop-blur-xl border border-slate-800 rounded-full px-2.5 py-2 flex items-center justify-around text-center shadow-2xl">
        <a href="#home" className={`flex flex-col items-center p-1 ${activeTab === 'home' ? 'text-[#10b981]' : 'text-slate-400'}`}>
          <Zap size={14} />
          <span className="text-[8px] mt-0.5 font-semibold">Home</span>
        </a>
        <a href="#projects" className={`flex flex-col items-center p-1 ${activeTab === 'projects' ? 'text-[#10b981]' : 'text-slate-400'}`}>
          <Laptop size={14} />
          <span className="text-[8px] mt-0.5 font-semibold">Sandbox</span>
        </a>
        <a href="#creative" className={`flex flex-col items-center p-1 ${activeTab === 'creative' ? 'text-[#10b981]' : 'text-slate-400'}`}>
          <Film size={14} />
          <span className="text-[8px] mt-0.5 font-semibold">Creative</span>
        </a>
        <a href="#volunteering" className={`flex flex-col items-center p-1 ${activeTab === 'volunteering' ? 'text-[#10b981]' : 'text-slate-400'}`}>
          <Award size={14} />
          <span className="text-[8px] mt-0.5 font-semibold">Impact</span>
        </a>
        <a href="#blog" className={`flex flex-col items-center p-1 ${activeTab === 'blog' ? 'text-[#10b981]' : 'text-slate-400'}`}>
          <BookOpen size={14} />
          <span className="text-[8px] mt-0.5 font-semibold">Blog</span>
        </a>
        <a href="#contact" className={`flex flex-col items-center p-1 ${activeTab === 'contact' ? 'text-[#10b981]' : 'text-slate-400'}`}>
          <Mail size={14} />
          <span className="text-[8px] mt-0.5 font-semibold">Contact</span>
        </a>
      </div>

      {/* PRIMARY GRID CONTENT VIEWS */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 space-y-28 md:space-y-40 pb-36">
        
        {/* HOMEPAGE HERO SECTION */}
        <section 
          id="home" 
          className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 relative"
        >
          {/* Subtle blue backdrop glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/5 filter blur-[150px] rounded-full pointer-events-none animate-pulse" />

          {/* Top Status Pill */}
          <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 py-2 px-4 rounded-full mb-10 w-fit animate-fade-in group hover:border-slate-700 transition-all">
            <span className="h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider text-slate-300 uppercase font-semibold">
              Currently Scaling E-commerce Core Operations &bull; Dubai, UAE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Core Hero Text and Intent */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-block relative">
                <span className="text-sm font-semibold tracking-wider uppercase font-mono text-[#10b981]">
                  Growth Operations Specialist
                </span>
                <div className="h-[2px] w-12 bg-brand-emerald mt-1.5 rounded-full" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight select-none">
                I build digital experiences <br />
                that drive <span className="text-brand-emerald text-glow">real sales growth.</span>
              </h1>

              <p className="max-w-xl text-base text-slate-400 font-normal leading-relaxed">
                Helping consumer brands optimize multi-channel performance, coordinate pricing parity pipelines, and launch high-impact digital initiatives on <strong className="text-white font-semibold">Noon GCC</strong>, <strong className="text-white font-semibold">Amazon UAE</strong>, and <strong className="text-white font-semibold">Amazon US</strong>.
              </p>

              {/* Real Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <a 
                  href="#projects"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold uppercase rounded-md transition-all tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/20"
                >
                  <span>Interactive Sandbox Work</span>
                  <ChevronRight size={14} />
                </a>
                <a 
                  href="#contact"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-transparent hover:bg-slate-800/40 text-white text-xs font-bold uppercase rounded-md transition-all border border-slate-700 hover:border-brand-emerald tracking-wider flex items-center justify-center space-x-2"
                >
                  <FileText size={14} className="text-slate-400" />
                  <span>Download CV / Resume</span>
                </a>
              </div>
            </div>

            {/* Right Column: High-End Portrait Vector Mockup and Live KPIs overlay */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-[360px] h-[380px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-1 overflow-hidden group shadow-2xl flex items-end justify-center">
                {/* Glowing neon mesh backplate */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.06),transparent_70%)]" />
                <div className="absolute top-8 right-8 w-32 h-32 bg-blue-600/5 rounded-full filter blur-2xl transition-all duration-700" />
                
                {/* Stylized Avatar Silhouette representing Thukha Aung */}
                <svg className="w-10/12 h-5/6 text-slate-800 z-10 transition-transform duration-700 group-hover:scale-[1.02]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="45" r="32" fill="url(#avatarGlow)" opacity="0.25" />
                  <path d="M15 95 C15 70, 30 65, 50 65 C70 65, 85 70, 85 95 Z" fill="url(#shirtdark)" />
                  <path d="M42 63 L50 71 L58 63 L50 60 Z" fill="#0b0b0d" />
                  <path d="M35 32 C35 22, 40 18, 50 18 C60 18, 65 22, 65 32 C65 44, 58 48, 50 48 C42 48, 35 44, 35 32 Z" fill="#e9be9f" />
                  <path d="M32 28 C32 18, 42 12, 50 13 C58 12, 68 18, 68 28 C68 24, 64 16, 50 16 C36 16, 32 24, 32 28 Z" fill="#141416" />
                  <path d="M33 30 C33 22, 38 18, 50 18 C62 18, 67 22, 67 30 C64 26, 61 22, 50 22 C39 22, 36 26, 33 30 Z" fill="#1c1c1f" />
                  <path d="M34 30 C32 30, 32 36, 35 36 Z" fill="#ddaa87" />
                  <path d="M66 30 C68 30, 68 36, 65 36 Z" fill="#ddaa87" />
                  <path d="M38 29 H48 L46 33 H39 Z" stroke="#475569" strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
                  <path d="M52 29 H62 L61 33 H54 Z" stroke="#475569" strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
                  <path d="M48 30 H52" stroke="#475569" strokeWidth="1.2" />
                  
                  <defs>
                    <radialGradient id="avatarGlow" cx="50" cy="45" r="32" fx="50" fy="45" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="shirtdark" x1="15" y1="80" x2="85" y2="80" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="50%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Overlaid Growth KPI Cards */}
                <div className="absolute top-6 left-6 bg-slate-900/90 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md z-20 space-y-0.5 pointer-events-none">
                  <div className="text-[8px] font-mono tracking-widest text-[#10b981] font-bold uppercase">Average CTR</div>
                  <div className="text-base font-bold font-mono text-white tracking-tight flex items-baseline space-x-1">
                    <span>14.8%</span>
                    <span className="text-[9px] text-[#10b981] font-medium">+3.2%</span>
                  </div>
                </div>

                <div className="absolute bottom-10 right-6 bg-slate-900/90 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md z-20 space-y-0.5 pointer-events-none">
                  <div className="text-[8px] font-mono tracking-widest text-blue-400 font-bold uppercase">Platform ACoS</div>
                  <div className="text-sm font-bold font-mono text-white tracking-tight">
                     Optimized 11.2%
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Under Hero: Competencies simplified to elegant layout cards */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left relative z-20">
            
            {/* Card 1: Web Development */}
            <div className="bg-[#0e1422]/90 p-6 rounded-xl border border-slate-800/80 hover:border-blue-500/20 transition-all group duration-300">
              <div className="h-10 w-10 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:text-white transition-all">
                <Code size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">Web Optimization</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Constructing lightning-gated static application web layers with Vite and Tailwind focused on seamless user metrics.
              </p>
            </div>

            {/* Card 2: Digital Strategy */}
            <div className="bg-[#0e1422]/90 p-6 rounded-xl border border-slate-800/80 hover:border-emerald-500/20 transition-all group duration-300">
              <div className="h-10 w-10 rounded bg-emerald-600/10 border border-emerald-500/10 flex items-center justify-center text-brand-emerald mb-4 group-hover:text-white transition-all">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">Channel Growth</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Injecting catalog parity systems across Noon Gulf operations and Amazon US/UAE storefronts to preserve organic rank.
              </p>
            </div>

            {/* Card 3: Performance PPC */}
            <div className="bg-[#0e1422]/90 p-6 rounded-xl border border-slate-800/80 hover:border-blue-500/20 transition-all group duration-300">
              <div className="h-10 w-10 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:text-white transition-all">
                <Zap size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">Performance PPC</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Targeted marketing campaigns utilizing custom exact match keyword shielding to lower wasteful ACoS margins.
              </p>
            </div>

            {/* Card 4: UI/UX & Figma */}
            <div className="bg-[#0e1422]/90 p-6 rounded-xl border border-slate-800/80 hover:border-emerald-500/20 transition-all group duration-300">
              <div className="h-10 w-10 rounded bg-emerald-600/10 border border-emerald-500/10 flex items-center justify-center text-brand-emerald mb-4 group-hover:text-white transition-all">
                <Laptop size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">Creative Assets</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Developing professional Figma layouts and dynamic visual wireframes built around high-converting click-through benchmarks.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 1: ABOUT ME */}
        <section id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Story side */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">&bull; Section 01 // Credentials</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  UAE-Based Growth Specialist operating globally.
                </h2>
              </div>
              
              <div className="space-y-4 text-slate-300 font-sans text-sm tracking-wide leading-relaxed">
                <p>
                  I coordinate e-commerce, digital advertising, and high-quality creative workflows to scale brand metrics. Rather than adopting an isolated marketing approach, I specialize in the complete optimization of digital pipelines—integrating custom price auditing scripts, visual catalog assets, and keyword targeting.
                </p>
                <p>
                  My core experience is grounded in high-velocity Middle Eastern consumer marketplaces: optimizing listings, margin margins, and promotional channels across <strong className="text-white">Noon GCC</strong> and <strong className="text-white">Amazon UAE</strong>.
                </p>
                <p>
                  Devoted to humanitarian initiatives, I support volunteer network coordination as a Lead Google Certified Educator, empowering student communities in Southeast Asian branches (including Yangon UNICEF offices) with critical computing frameworks.
                </p>
              </div>

              {/* UAE Badge */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex items-center space-x-4">
                <div className="text-3xl select-none">🇦🇪</div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-white tracking-wider">CURRENT BASE</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Dubai, UAE &bull; Supporting GCC &amp; Global Timelines with Absolute Reliability</p>
                </div>
              </div>
            </div>

            {/* Quick stats grid / Bento Panel */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-[#0e1422] p-5 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-mono text-slate-500">Industry Base</div>
                <div className="text-base font-bold text-white tracking-tight">Growth Ops</div>
                <span className="text-[10px] text-[#10b981] font-mono block">eCommerce Core</span>
              </div>

              <div className="bg-[#0e1422] p-5 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-mono text-slate-500">PPC Frameworks</div>
                <div className="text-base font-bold text-white tracking-tight">Amazon &bull; Meta</div>
                <span className="text-[10px] text-[#10b981] font-mono block">Zero Wastage Target</span>
              </div>

              <div className="bg-[#0e1422] p-5 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-mono text-slate-500">Humanitarian</div>
                <div className="text-base font-bold text-white tracking-tight">UNICEF Co-Work</div>
                <span className="text-[10px] text-[#10b981] font-mono block">Field Facilitator</span>
              </div>

              <div className="bg-[#0e1422] p-5 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-mono text-slate-500">Certification</div>
                <div className="text-base font-bold text-white tracking-tight">Google Coach</div>
                <span className="text-[10px] text-[#10b981] font-mono block">Professional Instructor</span>
              </div>

              <div className="col-span-2 bg-gradient-to-br from-[#0e1422] to-slate-900/60 p-5 rounded-xl border border-slate-800/80 space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Active Catalog Environments</h4>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800">Noon GCC Market</span>
                  <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800">Amazon UAE Catalog</span>
                  <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800">Amazon USA Skincare</span>
                  <span className="bg-slate-900 text-slate-100 px-2 py-1 rounded border border-slate-700/60 font-semibold">Trained Google Educator</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WORKS, CASES & INTERACTIVE SANDBOX */}
        <section id="projects" className="scroll-mt-24 space-y-14">
          
          {/* Header area */}
          <div className="max-w-xl space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">&bull; Section 02 // Documented Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Selected Studies &bull; Live Sandbox
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Explore validated retail outcome portfolios underneath, alongside dynamic interactive calculators and dashboards running directly in the browser.
            </p>
          </div>

          {/* Cards Flex Grid - 3 High Impact Project Portfolios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsData.slice(0, 3).map((project) => (
              <div 
                key={project.id}
                className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800/85 flex flex-col justify-between hover:border-blue-500/30 hover:bg-[#121a2d] transition-all relative group shadow-lg"
              >
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-36 object-cover rounded-xl mb-5 border border-slate-800"
                  />
                )}
                <div className="absolute top-4 right-4 text-[9px] font-mono bg-blue-600/10 text-white font-semibold border border-blue-500/20 rounded px-2 py-0.5 uppercase">
                  {project.market}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-[#10b981] font-mono uppercase tracking-widest block font-bold">{project.industry}</span>
                    <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-[#10b981] transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal h-12 overflow-hidden">
                    {project.subtitle}
                  </p>

                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800/80">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Validated Value</span>
                    <div className="text-xs font-bold font-mono text-white mt-0.5">{project.stats}</div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-slate-800/80 pt-4">
                  <div className="flex space-x-1">
                    <span className="text-[9px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800/60">
                      Ops Optimized
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="text-[10px] font-mono font-bold uppercase text-white hover:text-brand-emerald transition-colors flex items-center space-x-1 p-1 focus:outline-none"
                  >
                    <span>Read Study</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Live Laptop Sandbox Frame rendering actual custom widgets! */}
          <div className="space-y-6 pt-6">
            <div className="border-b border-slate-800/60 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-xs font-mono font-bold text-[#10b981] uppercase tracking-wider">&bull; Technical Sandbox Portal</h4>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Toggle dynamic client widgets calculating real-world Gulf pricing commissions and analytics paths.</p>
              </div>
              
              {/* Sandbox Tab selectors */}
              <div className="flex bg-[#0a0f1d] p-1 rounded-lg border border-slate-800/80 w-fit">
                {websitesData.map((tab) => (
                  <button
                    key={tab.mockType}
                    onClick={() => setActiveMockType(tab.mockType as any)}
                    className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wide leading-none transition-all focus:outline-none font-bold ${
                      activeMockType === tab.mockType
                        ? 'bg-blue-600 text-white font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Laptop UI Screen Body */}
            <div className="bg-[#0e1422] rounded-2xl border border-slate-800/90 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60 text-[10px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/25" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/25" />
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />
                </div>
                <div className="bg-slate-900 border border-slate-800 px-5 py-0.5 rounded text-slate-400 font-mono text-[9px] w-64 sm:w-96 truncate text-center">
                  https://thukhaaung.com/sandbox/{activeMockType}
                </div>
                <span className="text-[9px] text-[#10b981] font-mono tracking-widest uppercase font-bold">200 DEPLOYED</span>
              </div>

              {/* Dynamic Sandbox Display */}
              <div className="min-h-[280px] flex flex-col justify-center">
                {activeWebsite && (
                  <div className="mb-5 px-2">
                    <h3 className="text-sm font-bold text-white">{activeWebsite.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{activeWebsite.description}</p>
                    {activeWebsite.liveUrl && (
                      <a
                        href={activeWebsite.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-[10px] font-mono text-emerald-400 mt-2"
                      >
                        Open live experience ↗
                      </a>
                    )}
                  </div>
                )}
                {activeMockType === 'pricing-calculator' && <PricingCalculator />}
                {activeMockType === 'seo-grader' && <SeoGrader />}
                {activeMockType === 'kpi-dashboard' && <KpiDashboard />}
                {activeMockType === 'event-timeline' && <EventTimeline />}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: CREATIVE STUDIO (GRAPHICS & MOTION VIDEOS) */}
        <section id="creative" className="scroll-mt-24 space-y-12">
          
          {/* Header area with elegant layout */}
          <div className="max-w-xl space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">&bull; Section 03 // Brand Artistry &amp; Media</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Creative Studio Portfolios
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Premium visual assets, high-conversion ad layouts, and kinetic motion videos designed to boost user engagement rates on Amazon US/UAE and Noon.
            </p>
          </div>

          {/* Filtering Pill Matrix */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800/50">
            {[
              { id: 'all', label: 'All Artifacts' },
              { id: 'graphics', label: 'Graphic Design' },
              { id: 'motion', label: 'Motion & Video' },
              { id: 'photography', label: 'Product Shoots' },
              { id: 'social', label: 'Social & NGO Campaigns' },
            ].map((filt) => {
              const count = filt.id === 'all' 
                ? creativeItemsData.length 
                : creativeItemsData.filter(c => c.category === filt.id).length;
              return (
                <button
                  key={filt.id}
                  onClick={() => setActiveCreativeFilter(filt.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center space-x-2 border transition-all duration-300 ${
                    activeCreativeFilter === filt.id
                      ? 'bg-blue-600/10 border-blue-500/40 text-white font-bold'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{filt.label}</span>
                  <span className={`text-[10px] font-mono leading-none px-1.5 py-0.5 rounded ${
                    activeCreativeFilter === filt.id ? 'bg-blue-600/30 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Beautiful interactive gallery display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creativeItemsData
              .filter(item => activeCreativeFilter === 'all' || item.category === activeCreativeFilter)
              .map((item) => {
                const isPlaying = playingMotionId === item.id;
                const progress = videoPlaybackProgress[item.id] || 0;
                
                return (
                  <div 
                    key={item.id}
                    className="bg-[#0e1422] rounded-2xl border border-slate-800/90 overflow-hidden hover:border-blue-500/30 hover:bg-[#121a2d] transition-all group flex flex-col justify-between"
                  >
                    
                    {/* Visual Preview Deck */}
                    <div className="relative aspect-[16/10] bg-slate-950 flex flex-col justify-center items-center overflow-hidden border-b border-slate-900">
                      
                      {/* Ambient Grid overlay to keep design elements perfectly framed */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1626_1px,transparent_1px),linear-gradient(to_bottom,#0f1626_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-25 z-0" />
                      
                      {/* CATEGORY & EMBED CONDITIONAL RENDERERS */}
                      {item.category === 'motion' && item.videoUrl ? (
                        <video
                          src={item.videoUrl}
                          poster={item.imageUrl?.startsWith('http') ? item.imageUrl : undefined}
                          controls
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 h-full w-full object-cover z-10"
                        />
                      ) : item.imageUrl?.startsWith('http') ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover z-10"
                        />
                      ) : item.category === 'motion' ? (
                        /* PREMIUM SIMULATED MOTION VIDEO PLAYER FRAME */
                        <div className="w-full h-full p-4 flex flex-col justify-between relative z-10 select-none">
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="flex items-center space-x-1 bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase tracking-wider">
                              <span className={`h-1.5 w-1.5 rounded-full bg-red-500 mr-1 ${isPlaying ? 'animate-pulse' : ''}`} />
                              {isPlaying ? 'ACTIVE LOOP' : 'VIDEO PAUSED'}
                            </span>
                            <span className="text-slate-500 font-mono text-[9px]">HD 60FPS</span>
                          </div>

                          {/* Dynamic audio waves / neon grid responding to play state */}
                          <div className="flex flex-col items-center justify-center space-y-3 my-auto py-4">
                            {isPlaying ? (
                              <div className="flex items-end justify-center space-x-1.5 h-12 w-full max-w-[160px] relative">
                                {/* SVG glowing path waves */}
                                <svg className="absolute inset-0 w-full h-full text-blue-500/10" viewBox="0 0 100 40">
                                  <path d="M0,20 Q25,0 50,20 T100,20" fill="none" stroke="currentColor" strokeWidth="1" className="animate-pulse" />
                                </svg>
                                {[12, 24, 40, 16, 28, 44, 32, 20, 8, 36].map((h, hIdx) => (
                                  <div 
                                    key={hIdx} 
                                    className="bg-gradient-to-t from-blue-500 to-emerald-400 w-1 rounded-t transition-all duration-100" 
                                    style={{ 
                                      height: `${Math.max(4, h * Math.sin((progress / 100) * Math.PI + hIdx))}%`,
                                      boxShadow: '0 0 10px rgba(96,165,250,0.5)'
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#10b981] group-hover:border-[#10b981]/40 transition-all cursor-pointer shadow-lg shadow-black/80">
                                <Play size={20} fill="currentColor" className="ml-0.5 text-glow" />
                              </div>
                            )}
                            <div className="text-center">
                              <span className="text-[10px] font-mono text-slate-400 block tracking-tight font-medium">
                                {isPlaying ? 'Simulating dynamic frame loop renders...' : 'Click to preview keyframes'}
                              </span>
                              {isPlaying && (
                                <span className="text-[9px] font-mono text-[#10b981] font-semibold">
                                  Frame index: {Math.floor(progress * 2.4)} / 240
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Video player console drawer */}
                          <div className="space-y-1.5 bg-slate-900/90 border border-slate-800/80 p-2 rounded-lg backdrop-blur-md">
                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPlayingMotionId(isPlaying ? null : item.id);
                                }}
                                className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer focus:outline-none"
                              >
                                {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                                <span className="font-bold tracking-wide uppercase">{isPlaying ? 'Pause' : 'Play Video'}</span>
                              </button>
                              <span>00:{progress < 10 ? '0' : ''}{Math.floor(progress / 10)} / 00:10</span>
                            </div>
                            
                            {/* Player Seek bar */}
                            <div 
                              className="h-1 bg-slate-850 rounded-full overflow-hidden cursor-pointer relative"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const percentage = (clickX / rect.width) * 100;
                                setVideoPlaybackProgress(prev => ({ ...prev, [item.id]: percentage }));
                              }}
                            >
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-100" 
                                style={{ width: `${progress}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      ) : item.category === 'graphics' ? (
                        /* BEAUTIFUL INTERACTIVE STATIC GRAPHIC ARTWORK POSTERS */
                        <div className="w-full h-full p-4 flex flex-col justify-between relative z-10 text-left select-none">
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider">
                              Noon Catalog Spec
                            </span>
                            <span className="text-slate-500">1080x1080 PX</span>
                          </div>

                          {/* Render beautiful simulated graphic design blocks */}
                          <div className="my-auto text-center space-y-2 py-6 px-2">
                            <div className="inline-block px-3 py-1 bg-yellow-400 text-slate-950 text-[10px] font-extrabold uppercase rounded shadow tracking-widest font-mono">
                              noon GCC EXCLUSIVE
                            </div>
                            <h4 className="text-lg font-extrabold text-white tracking-tight leading-none uppercase">
                              {item.id === 'c1' ? 'FMCG MegaDeals' : 'Apple Modern UX'}
                            </h4>
                            <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto leading-normal">
                              {item.id === 'c1' 
                                ? 'Engineered double-impact buy box banner formats representing 15% VAT thresholds.' 
                                : 'Slick glassmorphism styling utilizing precise light ratios and spacing bounds.'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-2 rounded-lg">
                            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Contrast Score:</span>
                            <span className="text-[10px] font-mono text-brand-emerald font-bold">Passes AAA (9.2:1)</span>
                          </div>
                        </div>
                      ) : item.category === 'social' ? (
                        /* SOCIAL CAMPAIGN CARD INFO SHARDS */
                        <div className="w-full h-full p-4 flex flex-col justify-between relative z-10 text-left select-none">
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="bg-emerald-600/10 text-brand-emerald px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                              UNICEF Impact
                            </span>
                            <span className="text-slate-500">SEA NGO Hub</span>
                          </div>

                          <div className="my-auto space-y-1.5 py-4">
                            <div className="text-[10px] text-brand-emerald font-mono font-bold uppercase tracking-wider">&bull; Regional Digital Advocacy</div>
                            <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                              Empowering Youth with Digital Literacy
                            </h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                              Coordinating communication toolsets and translation packs across regional Southeast Asian volunteer bureaus.
                            </p>
                          </div>

                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[9px] font-mono">
                            <span className="text-slate-500">Outreach Count:</span>
                            <span className="text-slate-200 font-bold">5K+ Students</span>
                          </div>
                        </div>
                      ) : (
                        /* PRODUCT PHOTOGRAPHY PACKSHOT MOCKUPS */
                        <div className="w-full h-full p-4 flex flex-col justify-between relative z-10 text-left select-none">
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="bg-[#14b8a6]/10 text-brand-teal px-2 py-0.5 rounded border border-[#14b8a6]/20 font-bold uppercase tracking-wider">
                              Studio Packshot
                            </span>
                            <span className="text-slate-500">RAW LIGHTROOM</span>
                          </div>

                          <div className="my-auto text-center space-y-3 py-6">
                            <div className="mx-auto w-14 h-14 rounded-full border border-slate-800 bg-[#0c1322] flex items-center justify-center text-brand-teal relative">
                              <span className="absolute inset-0 rounded-full bg-brand-teal/5 animate-pulse" />
                              <Image size={24} />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">FMCG Retail Packshots</h4>
                              <p className="text-[10px] text-slate-400">White studio light sweeps &amp; isolate masks</p>
                            </div>
                          </div>

                          <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-lg flex items-center justify-between text-[9px] font-mono">
                            <span className="text-slate-500">Lens Type:</span>
                            <span className="text-slate-300 font-medium">85mm Prime Macro</span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Metadata Drawer details */}
                    <div className="p-5 text-left space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] text-[#10b981] font-mono uppercase tracking-widest font-bold">
                          {item.category === 'motion' && 'Motion Asset Loop'}
                          {item.category === 'graphics' && 'Visual Graphic / Vector'}
                          {item.category === 'photography' && 'Marketing Photography'}
                          {item.category === 'social' && 'Advocacy Asset Pack'}
                        </span>
                        <h3 className="text-sm font-extrabold text-white tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Tech Used Pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.techUsed?.map((tech, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="bg-slate-950 border border-slate-800 py-0.5 px-2 rounded font-mono text-[9px] text-slate-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
          </div>

        </section>

        {/* SECTION 3: HUMANITARIAN NOBLE IMPACT */}
        <section id="volunteering" className="scroll-mt-24 space-y-12">
          
          <div className="max-w-xl space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">&bull; Section 03 // Volunteer Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Humanitarian &amp; Educational Outreach 
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Applying coordination benchmarks and digital literacy resource plans to support youth education programs in Southeast Asia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {volunteeringData.map((vol) => (
              <div 
                key={vol.id}
                className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between hover:border-emerald-500/20 transition-all shadow-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 bg-emerald-600/10 rounded border border-emerald-500/10 flex items-center justify-center text-brand-emerald font-extrabold text-xs select-none">
                      UNI
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{vol.period}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">{vol.organization}</h3>
                    <p className="text-xs text-[#10b981] font-mono font-bold">{vol.role}</p>
                    <span className="text-[10px] text-slate-500 block">{vol.location}</span>
                  </div>

                  <ul className="text-xs text-slate-400 space-y-2.5 font-sans leading-relaxed pt-2">
                    {vol.points.slice(0, 2).map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-2">
                        <span className="text-brand-emerald mt-1 font-bold">&bull;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold mb-1">Impact Metric</span>
                  <div className="text-xs font-bold font-mono text-white group-hover:text-[#10b981] transition-colors">{vol.impactStat}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Flat-Glass Verified Credentials List */}
          <div className="pt-8 border-t border-slate-800/50">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-6 text-center lg:text-left">
              &bull; Professional Credentials &amp; Certifications
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {certificationsData.slice(0, 4).map((cert) => (
                <div key={cert.id} className="bg-[#0e1422]/60 p-4 rounded-xl border border-slate-800/80 flex items-start space-x-3 hover:bg-[#11192b] transition-all">
                  <div className="p-2 rounded bg-blue-500/10 text-blue-400 mt-0.5">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">{cert.issuer}</span>
                    <h5 className="text-[11px] font-bold text-white leading-tight mt-0.5">{cert.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: INTEL BLOG (ARTICLE DEEP DIVES && GUIDES) */}
        <section id="blog" className="scroll-mt-24 space-y-12">
          
          <div className="max-w-xl space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">&bull; Section 05 // Strategy Playbooks</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              E-commerce Intel Blog
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              In-depth research briefings, pricing optimization studies, and PPC tactic breakdowns compiled from actual GCC and global skincare brand operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPostsData.map((post) => (
              <div 
                key={post.id} 
                className="bg-[#0e1422] p-6 sm:p-7 rounded-2xl border border-slate-800/90 flex flex-col justify-between hover:border-blue-500/20 hover:bg-[#121a2d] transition-all group shadow-md"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-44 object-cover rounded-xl mb-5 border border-slate-800"
                  />
                )}
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded text-[#10b981] font-bold">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Clock size={11} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">{post.date}</span>
                  <button 
                    onClick={() => setSelectedBlogPost(post)}
                    className="flex items-center space-x-1 font-mono font-bold uppercase text-white hover:text-[#10b981] transition-all cursor-pointer focus:outline-none"
                  >
                    <span>Read Insights</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* SECTION 4: CONTACT & DIRECT RESUME */}
        <section id="contact" className="scroll-mt-24 border-t border-slate-800/60 pt-16">
          <div className="bg-[#0e1422] rounded-3xl border border-slate-800/90 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            {/* Mesh glow effects inside */}
            <div className="absolute top-[-50%] right-[-10%] w-[350px] h-[350px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-40%] left-[-10%] w-[350px] h-[350px] bg-brand-emerald/5 rounded-full filter blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Action text */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">&bull; Get In Touch // Establish Hook</span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 leading-tight">
                    Let&apos;s build next.
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans mt-3">
                    Available to support premium GCC brands, formulate catalog pricing strategies, build custom Excel and React automation pipelines, or coordinate professional education instruction tracks.
                  </p>
                </div>

                {/* Direct quick links */}
                <div className="space-y-3 font-mono text-xs">
                  <a 
                    href="mailto:thukha.educatry@gmail.com" 
                    className="flex items-center space-x-3 text-slate-300 hover:text-white p-3 rounded-lg bg-slate-900/80 border border-slate-800 w-fit transition-all hover:border-slate-700"
                  >
                    <Mail size={16} className="text-[#10b981]" />
                    <span className="font-sans font-medium text-xs">thukha.educatry@gmail.com</span>
                  </a>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <a 
                      href="https://linkedin.com/in/thukhaaung" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300 hover:text-white transition-all hover:bg-slate-850"
                    >
                      <Linkedin size={14} className="text-[#10b981]" />
                      <span>/thukhaaung</span>
                    </a>

                    <a 
                      href="https://github.com/thukha-educatry" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300 hover:text-white transition-all hover:bg-slate-850"
                    >
                      <Code size={14} className="text-blue-400" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>

                {/* Simulated CV Button */}
                <div className="pt-3 relative">
                  <button 
                    onClick={() => setCvToast(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-sans text-xs font-bold uppercase tracking-wider py-4 px-7 rounded-lg transition-all focus:outline-none hover:shadow-lg shadow-blue-900/25 cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>Download CV / Resume</span>
                  </button>

                  <AnimatePresence>
                    {cvToast && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 -top-12 bg-slate-900 border border-slate-750 px-3 py-2 rounded-lg text-xs font-sans text-brand-emerald shadow-xl z-20 flex items-center space-x-1.5"
                      >
                        <CheckCircle size={13} />
                        <span>Starting thukha_aung_cv.pdf download...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right: Clean, Uncluttered Resume preview card */}
              <div className="lg:col-span-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-xs font-bold font-mono text-white">THUKHA AUNG</h4>
                    <p className="text-[10px] text-slate-500 font-mono">GCC E-commerce Ops &amp; Technical Systems</p>
                  </div>
                  <span className="text-[9px] font-mono bg-blue-600/10 text-white font-bold border border-blue-500/20 rounded px-2 py-0.5 uppercase">LATEST PDF</span>
                </div>

                <div className="space-y-4 text-xs text-slate-300 font-sans leading-normal">
                  <p className="text-slate-400">
                    Surgical execution of digital marketplace metrics across the Middle East. Expert in automated margin modeling, direct index search algorithms, and UNICEF global educational teaching campaigns.
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-blue-400 font-bold tracking-wider block">EXPERTISE FOCUS</span>
                      <ul className="space-y-1 text-slate-400 text-xs">
                        <li>&bull; Noon KSA &amp; UAE Catalog</li>
                        <li>&bull; Keyword Targeting Index</li>
                        <li>&bull; Automated Margin Models</li>
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-blue-400 font-bold tracking-wider block">CORE TECHNOLOGY</span>
                      <ul className="space-y-1 text-slate-400 text-xs">
                        <li>&bull; Advanced Excel Analytics</li>
                        <li>&bull; React, Tailwind &amp; UI</li>
                        <li>&bull; Google Educator Tools</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-lg flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Global Search Identifier:</span>
                  <span className="text-white font-semibold">@thukhaaung</span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* REUSABLE LIGHTBOX MODAL FOR CASE STUDIES AND FULL DATA */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" 
            />

            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative z-10 max-h-[85vh] overflow-y-auto space-y-6"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-full bg-slate-900 p-1.5 border border-slate-800 focus:outline-none transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center text-[10px] font-mono text-brand-emerald uppercase tracking-widest font-bold">
                  <span>{selectedProject.industry}</span>
                  <span>{selectedProject.market}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mr-6">
                  {selectedProject.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-[#10b981] pl-3 text-left">
                &quot;{selectedProject.subtitle}&quot;
              </p>

              {selectedProject.coverImage && (
                <img src={selectedProject.coverImage} alt={selectedProject.title} className="w-full rounded-xl border border-slate-800" />
              )}
              {selectedProject.videoUrl && (
                <video src={selectedProject.videoUrl} controls playsInline className="w-full rounded-xl border border-slate-800" />
              )}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Validated Value metrics</span>
                <div className="text-base font-bold font-mono text-[#10b981] mt-0.5">{selectedProject.stats}</div>
              </div>

              <div className="space-y-2 text-left">
                <h4 className="font-mono text-[10px] uppercase font-bold text-slate-400">Core Services Performed</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.services.map((svc, sIdx) => (
                    <span key={sIdx} className="bg-slate-950 border border-slate-800 py-1 px-2.5 rounded-md text-slate-300 font-mono text-[10px]">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-slate-300 font-sans text-xs leading-relaxed text-left">
                <h4 className="font-mono text-[10px] uppercase font-bold text-slate-400">Detailed Analytical Execution</h4>
                <p>{selectedProject.fullDetails}</p>
              </div>

              <div className="space-y-2 text-slate-350 text-xs text-left">
                <h4 className="font-mono text-[10px] uppercase font-bold text-slate-400">Key Outcomes</h4>
                <ul className="space-y-2">
                  {selectedProject.results.map((res, rIdx) => (
                    <li key={rIdx} className="flex items-start space-x-2">
                      <span className="text-[#10b981] font-bold">✔</span>
                      <span className="font-sans">{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs font-semibold focus:outline-none transition-all cursor-pointer"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTEL BLOG READER LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedBlogPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlogPost(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" 
            />

            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative z-10 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedBlogPost(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-full bg-slate-900 p-1.5 border border-slate-800 focus:outline-none transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center text-[10px] font-mono text-brand-emerald uppercase tracking-widest font-bold">
                  <span>{selectedBlogPost.category}</span>
                  <span>{selectedBlogPost.date} &bull; {selectedBlogPost.readTime}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mr-6 leading-snug">
                  {selectedBlogPost.title}
                </h3>
              </div>

              {selectedBlogPost.coverImage && (
                <img src={selectedBlogPost.coverImage} alt={selectedBlogPost.title} className="w-full rounded-xl border border-slate-800" />
              )}
              {selectedBlogPost.videoUrl && (
                <video src={selectedBlogPost.videoUrl} controls playsInline className="w-full rounded-xl border border-slate-800" />
              )}

              {/* Render Block dynamically parsing the custom Markdown elements cleanly and beautifully */}
              <div className="text-xs sm:text-sm text-slate-300 space-y-5 leading-relaxed text-left border-t border-slate-800/80 pt-6">
                {selectedBlogPost.content.split('\n\n').map((para, pIdx) => {
                  if (para.startsWith('###')) {
                    return (
                      <h4 key={pIdx} className="text-sm font-bold text-white uppercase font-mono tracking-wider pt-2">
                        {para.replace('###', '').trim()}
                      </h4>
                    );
                  }
                  if (para.startsWith('*') || para.startsWith('-')) {
                    return (
                      <ul key={pIdx} className="space-y-2 pl-4 list-disc text-slate-300">
                        {para.split('\n').map((line, lIdx) => (
                          <li key={lIdx} className="font-sans">
                            {line.replace(/^[\s*-]+/, '').trim()}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.match(/^\d+\./)) {
                    return (
                      <ol key={pIdx} className="space-y-2 pl-4 list-decimal text-slate-300">
                        {para.split('\n').map((line, lIdx) => (
                          <li key={lIdx} className="font-sans">
                            {line.replace(/^\d+\.\s*/, '').trim()}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  
                  // Handle dynamic styled strong attributes inline
                  const parts = para.split(/(\*\*.*?\*\*)/g);
                  const renderedParts = parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={partIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  });

                  return <p key={pIdx} className="font-sans">{renderedParts}</p>;
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedBlogPost(null)}
                  className="px-5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs font-semibold focus:outline-none transition-all cursor-pointer"
                >
                  Close Playbook
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MINIMAL FOOTER ACCORDING TO GUIDELINES */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 text-center text-xs text-slate-500 font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">THUKHA AUNG</span>
            <span>&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex space-x-5">
            <a href="https://linkedin.com/in/thukhaaung" target="_blank" referrerPolicy="no-referrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="mailto:thukha.educatry@gmail.com" className="hover:text-white transition-colors">Email</a>
            <a href="https://github.com/thukha-educatry" target="_blank" referrerPolicy="no-referrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
