import { useState, useEffect, useRef } from 'react';
import { Search, Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, MapPin, Phone, Mail, Menu, X, Home, Utensils, Dumbbell, Camera, CheckCircle2, Star, Sparkles, Award, ArrowRight, Calendar, Download, TrendingUp } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LoginPage } from './components/pages/LoginPage';
import { BookingPage } from './components/pages/BookingPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ContactPage } from './components/pages/ContactPage';
import { AboutPage } from './components/pages/AboutPage';
import { RoomsPage } from './components/pages/RoomsPage';
import { RoomDetailsPage } from './components/pages/RoomDetailsPage';
import { FacilitiesPage } from './components/pages/FacilitiesPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

const LOGO_PRIMARY = '#059669';
const LOGO_SECONDARY = '#06b6d4';
const LOGO_TERTIARY = '#f59e0b';

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    roomType: '',
    seats: '',
    maxPrice: ''
  });
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = location.pathname === '/' || location.pathname === '';

  const cardGradients = [
    'linear-gradient(135deg, #059669 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #10b981 0%, #f59e0b 100%)',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 overflow-x-hidden" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
      <Header />
      {/* Vibrant Hero */}
       <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
         {/* Animated Background */}
         <div className="absolute inset-0">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 animate-gradient-shift"></div>
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-400/40 via-teal-300/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-400/40 via-orange-300/30 to-rose-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-emerald-300/30 via-teal-200/20 to-cyan-300/30 dark:from-emerald-800/30 dark:via-teal-800/20 dark:to-cyan-800/30 rounded-full blur-3xl animate-spin-slow"></div>
          {/* Floating Shapes */}
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl animate-float shadow-lg shadow-emerald-400/50"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl animate-float-delayed shadow-lg shadow-amber-400/50"></div>
          <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl animate-float-slow shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-lg animate-bounce-slow"></div>
          {/* Animated Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, ${['#059669', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]}, ${['#10b981', '#0891b2', '#fbbf24', '#f87171', '#a78bfa'][i % 5]})`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <div className="text-center max-w-5xl mx-auto space-y-12">
            {/* Location Badge */}
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-emerald-900/90 backdrop-blur-xl rounded-full shadow-xl shadow-emerald-500/20 border border-emerald-300/50 dark:border-emerald-600/50 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 group animate-pulse-slow">
               <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-ping-slow"></div>
                 <div className="relative w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
               </div>
               <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
               <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-wide animate-gradient-x">
                 Sylhet, Bangladesh
               </span>
               <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
             </div>

             {/* Hero Title */}
             <div className="space-y-6">
               <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                 <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent animate-gradient-x">Your Home</span>
                 <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent animate-gradient-x" style={{animationDelay: '0.5s'}}>Away From Home</span>
                 <span className="block mt-2">
                   <span className="relative inline-block">
                     <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-3xl opacity-40 animate-pulse"></span>
                     <span className="relative bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                       in Sylhet
                     </span>
                   </span>
                 </span>
               </h1>

               <p className="text-xl sm:text-2xl text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto leading-relaxed font-medium">
                 Experience premium student accommodation with <span className="text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text font-bold">cutting-edge amenities</span>, <span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text font-bold">vibrant community</span>, and an environment designed for success.
               </p>
             </div>

            {/* Vibrant Search Widget */}
             <div className="relative group">
               <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-gradient-shift" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}></div>
               <div className="relative bg-gradient-to-br from-white/95 to-emerald-50/95 dark:from-emerald-900/95 dark:to-teal-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-emerald-500/20 p-10 border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-emerald-500/30 transition-all duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="space-y-3">
                     <label className="block text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent tracking-wide uppercase">Room Type</label>
                     <select
                       className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800 dark:to-teal-800 border-2 border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 font-semibold text-emerald-800 dark:text-emerald-200 hover:scale-105"
                       value={searchFilters.roomType}
                       onChange={(e) => setSearchFilters({...searchFilters, roomType: e.target.value})}
                     >
                       <option value="">All Types</option>
                       <option value="single">Single</option>
                       <option value="shared">Shared</option>
                       <option value="premium">Premium</option>
                     </select>
                   </div>

                   <div className="space-y-3">
                     <label className="block text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent tracking-wide uppercase">Seats</label>
                     <select
                       className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-800 dark:to-orange-800 border-2 border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-semibold text-amber-800 dark:text-amber-200 hover:scale-105"
                       value={searchFilters.seats}
                       onChange={(e) => setSearchFilters({...searchFilters, seats: e.target.value})}
                     >
                       <option value="">Any</option>
                       <option value="1">1 Person</option>
                       <option value="2">2 People</option>
                       <option value="4">4 People</option>
                     </select>
                   </div>

                   <div className="space-y-3">
                     <label className="block text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wide uppercase">Max Price</label>
                     <select
                       className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-800 dark:to-blue-800 border-2 border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 font-semibold text-cyan-800 dark:text-cyan-200 hover:scale-105"
                       value={searchFilters.maxPrice}
                       onChange={(e) => setSearchFilters({...searchFilters, maxPrice: e.target.value})}
                     >
                       <option value="">Any Budget</option>
                       <option value="5000">৳5,000/mo</option>
                       <option value="8000">৳8,000/mo</option>
                       <option value="12000">৳12,000/mo</option>
                     </select>
                   </div>

                  <div className="flex items-end">
                    <button className="w-full group relative px-8 py-4 text-white rounded-2xl font-bold overflow-hidden shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl animate-gradient-shift" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}>
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <Search className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                        Search
                      </span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
             <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
               <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800/80 dark:to-teal-800/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-emerald-500/20 border border-emerald-300/50 dark:border-emerald-600/50 hover:scale-110 transition-transform duration-300">
                 <div className="flex -space-x-2">
                   {[...Array(4)].map((_, i) => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-emerald-900 shadow-lg" style={{background: cardGradients[i % 5]}}></div>
                   ))}
                 </div>
                 <div className="text-left">
                   <div className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">150+ Students</div>
                   <div className="text-xs text-emerald-700 dark:text-emerald-300">Living Here</div>
                 </div>
               </div>

               <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800/80 dark:to-orange-800/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-amber-500/20 border border-amber-300/50 dark:border-amber-600/50 hover:scale-110 transition-transform duration-300">
                 <div className="flex items-center">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-lg" />
                   ))}
                 </div>
                 <div className="text-left">
                   <div className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">4.8/5.0</div>
                   <div className="text-xs text-amber-700 dark:text-amber-300">Rating</div>
                 </div>
               </div>

               <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-800/80 dark:to-blue-800/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-cyan-500/20 border border-cyan-300/50 dark:border-cyan-600/50 hover:scale-110 transition-transform duration-300">
                 <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-bounce" />
                 <div className="text-left">
                   <div className="font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">98% Occupied</div>
                   <div className="text-xs text-cyan-700 dark:text-cyan-300">High Demand</div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-8 h-12 border-2 border-emerald-400 rounded-full p-1 shadow-lg shadow-emerald-400/50">
            <div className="w-2 h-4 rounded-full mx-auto animate-pulse" style={{background: `linear-gradient(to bottom, #059669, #06b6d4, #f59e0b)`}}></div>
          </div>
        </div>
      </section>

      {/* Vibrant Availability Cards */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 via-teal-100/50 to-cyan-100/50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 animate-gradient-shift"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
               { icon: Users, title: '12 Seats Available', desc: 'Across all room types', price: '৳4,500/mo', badge: 'Available Now', grad: cardGradients[0] },
               { icon: Award, title: 'Premium Rooms', desc: 'AC + Attached Bath', price: '৳10,500/mo', badge: 'Popular', grad: cardGradients[1] },
               { icon: Sparkles, title: 'Early Bird Discount', desc: 'Book 3 months, get 10% off', price: 'Save ৳1,350', badge: 'Limited', grad: cardGradients[2] }
             ].map((card, i) => (
               <AnimatedSection key={i} delay={i * 150}>
                 <div className="group relative">
                   <div className="absolute -inset-2 rounded-3xl blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{background: card.grad}}></div>
                   <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1">
                     <div className="flex items-start justify-between mb-6">
                       <div className="relative">
                         <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse" style={{background: card.grad}}></div>
                         <div className="relative p-4 rounded-2xl shadow-lg" style={{background: card.grad}}>
                           <card.icon className="w-7 h-7 text-white drop-shadow-lg" />
                         </div>
                       </div>
                       <span className="px-4 py-2 text-white rounded-full text-sm font-bold shadow-xl animate-pulse" style={{background: card.grad}}>
                         {card.badge}
                       </span>
                     </div>
                     <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">{card.title}</h3>
                     <p className="text-emerald-700 dark:text-emerald-300 mb-8">{card.desc}</p>
                     <div className="flex items-center justify-between">
                       <div className="text-4xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                         {card.price}
                       </div>
                       <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all shadow-xl" style={{background: card.grad}}>
                         <ArrowRight className="w-6 h-6 text-white drop-shadow-lg" />
                       </div>
                     </div>
                   </div>
                 </div>
               </AnimatedSection>
             ))}
          </div>
        </div>
      </section>

      {/* Vibrant About Section */}
       <section id="about" className="relative py-32 bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 overflow-hidden">
         <div className="absolute inset-0 opacity-30">
           <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-3xl animate-float"></div>
           <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-3xl animate-float-delayed"></div>
         </div>
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <AnimatedSection>
               <div className="space-y-8">
                 <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border-2 border-emerald-300/50 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800/50 dark:to-teal-800/50 shadow-lg shadow-emerald-500/20">
                   <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                   <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Est. 2020</span>
                 </div>

                 <h2 className="text-5xl lg:text-6xl font-black leading-tight">
                    <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Welcome to</span>
                    <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
                      SylhetStay
                    </span>
                 </h2>

                  <p className="text-xl text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    Providing exceptional accommodation to students pursuing their academic dreams. We understand the importance of a <span className="text-amber-600 dark:text-amber-400 font-bold">comfortable</span>, <span className="text-teal-600 dark:text-teal-400 font-bold">safe</span>, and <span className="text-cyan-600 dark:text-cyan-400 font-bold">study-conducive</span> environment.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { num: '150+', label: 'Happy Students', grad: cardGradients[0] },
                      { num: '4.8', label: 'Average Rating', icon: true, grad: cardGradients[1] },
                      { num: '50+', label: 'Room Options', grad: cardGradients[3] },
                      { num: '24/7', label: 'Security', grad: cardGradients[4] }
                    ].map((stat, i) => (
                      <div key={i} className="group relative p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: `${cardGradients[i % 5]}33`}}></div>
                        <div className="relative">
                          <div className="text-4xl font-black mb-2 flex items-center gap-2" style={{background: cardGradients[i % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                            {stat.num}
                            {stat.icon && <Star className="w-6 h-6 fill-amber-400 text-amber-400" />}
                          </div>
                          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
             </AnimatedSection>

             <AnimatedSection delay={200}>
               <div className="grid grid-cols-2 gap-6">
                 {[
                   'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=800',
                   'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=800',
                   'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=800',
                   'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=800'
                 ].map((img, i) => (
                   <div key={i} className={`group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 ${i % 2 === 1 ? 'mt-12' : ''}`} style={{border: `3px solid ${['#059669', '#06b6d4', '#f59e0b', '#8b5cf6'][i]}33`}}>
                     <img src={img} alt={`Room ${i + 1}`} className="w-full h-80 object-cover group-hover:scale-125 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: cardGradients[i % 5]}}>
                       <Sparkles className="w-5 h-5 text-white" />
                     </div>
                   </div>
                 ))}
               </div>
             </AnimatedSection>
           </div>
         </div>
       </section>

      {/* Vibrant Facilities */}
      <section id="facilities" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 via-teal-100/30 to-cyan-100/30 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 animate-gradient-shift"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-amber-300/50 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800/50 dark:to-orange-800/50 shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
                <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Premium Amenities</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black mb-6">
                 <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">World-Class </span>
                 <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Facilities</span>
               </h2>
               <p className="text-xl text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">Everything you need for <span className="text-amber-600 dark:text-amber-400 font-bold">success</span>, all under one roof</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Wifi, label: 'High-Speed WiFi', desc: '100 Mbps fiber', grad: cardGradients[0] },
              { icon: Wind, label: 'Air Conditioning', desc: 'Premium rooms', grad: cardGradients[1] },
              { icon: Utensils, label: 'Dining Hall', desc: '3 meals daily', grad: cardGradients[2] },
              { icon: Coffee, label: 'Common Room', desc: 'Recreation area', grad: cardGradients[3] },
              { icon: BookOpen, label: 'Study Rooms', desc: 'Quiet & peaceful', grad: cardGradients[4] },
              { icon: Shield, label: '24/7 Security', desc: 'CCTV & guards', grad: cardGradients[0] },
              { icon: Car, label: 'Parking', desc: 'Bike & car spaces', grad: cardGradients[1] },
              { icon: Dumbbell, label: 'Fitness Center', desc: 'Modern equipment', grad: cardGradients[2] }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group relative">
                  <div className="absolute -inset-2 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: item.grad}}></div>
                 <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl p-8 shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-2 text-center">
                     <div className="relative w-20 h-20 mx-auto mb-6">
                       <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse" style={{background: item.grad}}></div>
                       <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all shadow-xl" style={{background: item.grad}}>
                         <item.icon className="w-10 h-10 text-white drop-shadow-lg" />
                       </div>
                     </div>
                     <h4 className="font-black text-transparent bg-clip-text mb-2" style={{backgroundImage: item.grad, WebkitBackgroundClip: 'text'}}>{item.label}</h4>
                     <p className="text-sm text-emerald-700 dark:text-emerald-300">{item.desc}</p>
                   </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Vibrant Rooms */}
       <section id="rooms" className="relative py-32 bg-gradient-to-b from-teal-50 via-cyan-50 to-emerald-50 dark:from-teal-950 dark:via-cyan-950 dark:to-emerald-950 overflow-hidden">
         <div className="absolute inset-0 opacity-40">
           <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl animate-float"></div>
           <div className="absolute bottom-40 right-40 w-96 h-96 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full blur-3xl animate-float-delayed"></div>
         </div>
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
           <AnimatedSection>
             <div className="text-center mb-20">
               <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-teal-300/50 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-800/50 dark:to-cyan-800/50 shadow-lg shadow-teal-500/20">
                 <Home className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-bounce" />
                 <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Find Your Space</span>
               </div>
               <h2 className="text-5xl lg:text-6xl font-black mb-6">
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Choose Your </span>
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Perfect Room</span>
                </h2>
             </div>
           </AnimatedSection>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
               { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', title: 'Shared Room', desc: 'Perfect for vibrant community', price: '৳4,500', features: ['4 bunk beds', 'Shared bathroom', 'Study desk', 'Wardrobe'], grad: cardGradients[0] },
               { img: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800', title: 'Semi-Private', desc: 'Balance of privacy & affordability', price: '৳7,500', features: ['2 single beds', 'Attached bath', 'Study desks', 'Ceiling fan'], popular: true, grad: cardGradients[1] },
               { img: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800', title: 'Premium Single', desc: 'Ultimate privacy & comfort', price: '৳10,500', features: ['Private room', 'Attached bath', 'Air conditioning', 'Premium furniture'], grad: cardGradients[2] }
             ].map((room, i) => (
               <AnimatedSection key={i} delay={i * 150}>
                 <div className="group relative">
                   {room.popular && (
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 text-white rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-pulse" style={{background: room.grad}}>
                       <Star className="w-4 h-4 fill-current animate-spin-slow" />
                       Most Popular
                     </div>
                   )}
                   <div className="absolute -inset-2 rounded-3xl blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: room.grad}}></div>
                   <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1">
                      <div className="relative h-80 overflow-hidden">
                        <img src={room.img} alt={room.title} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent"></div>
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110" style={{background: room.grad}}>
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-3xl font-black mb-3" style={{background: room.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{room.title}</h3>
                        <p className="text-emerald-700 dark:text-emerald-300 mb-6">{room.desc}</p>
                        <div className="space-y-3 mb-8">
                          {room.features.map((feature, j) => (
                            <div key={j} className="flex items-center gap-3 group/feature hover:translate-x-2 transition-transform">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover/feature:scale-110 transition-transform" style={{background: room.grad}}>
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-emerald-800 dark:text-emerald-200 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t-2 border-emerald-200/50 dark:border-emerald-700/50">
                          <div>
                            <div className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Starting from</div>
                            <div className="text-4xl font-black" style={{background: room.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                              {room.price}<span className="text-lg text-emerald-400">/mo</span>
                            </div>
                          </div>
                          <button className="px-8 py-4 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all animate-gradient-shift" style={{background: room.grad}}>
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                 </div>
               </AnimatedSection>
             ))}
           </div>
         </div>
       </section>

      {/* Vibrant Gallery */}
      <section id="gallery" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 via-teal-100/30 to-cyan-100/30 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 animate-gradient-shift"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
          <AnimatedSection>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-purple-300/50 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50 shadow-lg shadow-purple-500/20">
                <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Visual Tour</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black mb-6">
                 <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Explore Our </span>
                 <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">Space</span>
               </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600',
              'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600',
              'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600',
              'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600',
              'https://images.unsplash.com/photo-1723259457560-b76d597f709b?w=600',
              'https://images.unsplash.com/photo-1635321349359-333da6bb6da9?w=600',
              'https://images.unsplash.com/photo-1772944780860-e99bd902d59a?w=600'
            ].map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl aspect-square shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 hover:rotate-2" style={{border: `3px solid ${['#059669', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#f97316'][i]}50`}}>
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-125 transition-transform">
                    <Camera className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
            <div className="group relative overflow-hidden rounded-3xl aspect-square flex items-center justify-center cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 hover:rotate-2" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)'}}>
              <div className="text-center text-white z-10">
                <div className="text-5xl font-black mb-2 animate-pulse">+24</div>
                <div className="font-bold">More Photos</div>
              </div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vibrant Testimonials */}
       <section className="relative py-32 bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950 overflow-hidden">
         <div className="absolute inset-0 opacity-30">
           <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-3xl animate-float"></div>
           <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-3xl animate-float-delayed"></div>
         </div>
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
           <AnimatedSection>
             <div className="text-center mb-20">
               <h2 className="text-5xl lg:text-6xl font-black mb-6">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">What Students </span>
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Say</span>
                </h2>
             </div>
           </AnimatedSection>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { name: 'Arafat Rahman', uni: 'SUST, Computer Science', text: 'The facilities are excellent, and the staff is incredibly supportive. The study environment here helped me maintain my GPA!', grad: cardGradients[0] },
               { name: 'Fatima Hassan', uni: 'Metropolitan University', text: 'WiFi is super fast, and the food quality is great. Made lots of friends here. Highly recommended!', grad: cardGradients[1] },
               { name: 'Mehedi Khan', uni: 'Sylhet Medical College', text: 'The hostel management made the transition so smooth. Feels like a second home!', grad: cardGradients[2] }
             ].map((testimonial, i) => (
               <div key={i} className="group relative">
                 <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: testimonial.grad}}></div>
                  <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border-2 border-amber-200/50 dark:border-amber-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-lg" />
                      ))}
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-300 mb-8 leading-relaxed">{testimonial.text}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl" style={{background: testimonial.grad}}>
                        <span className="text-white font-bold text-lg">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-black" style={{background: testimonial.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{testimonial.name}</div>
                        <div className="text-sm text-amber-700 dark:text-amber-300">{testimonial.uni}</div>
                      </div>
                    </div>
                  </div>
               </div>
             ))}
           </div>
         </div>
       </section>

      {/* Vibrant Contact */}
      <section id="contact" className="relative py-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-shift"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center text-white">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-full mb-6 border-2 border-white/40 animate-pulse-slow">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span className="text-sm font-bold tracking-wide">Get Started Today</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black mb-4">Ready to Make<br/><span className="text-amber-200">SylhetStay</span> Your Home?</h2>
          <p className="text-base max-w-2xl mx-auto mb-6 text-white/90">Join our community of <span className="text-amber-200 font-bold">successful students</span> today</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Phone, title: 'Call Us', lines: ['+880 1711-123456', '+880 1811-654321'], grad: 'from-emerald-400 to-teal-400' },
              { icon: Mail, title: 'Email Us', lines: ['info@sylhetstay.com', 'booking@sylhetstay.com'], grad: 'from-amber-400 to-orange-400' },
              { icon: MapPin, title: 'Visit Us', lines: ['123 Akhalia Road', 'Sylhet 3100, BD'], grad: 'from-cyan-400 to-blue-400' }
            ].map((contact, i) => (
              <div key={i} className="group p-6 bg-white/10 backdrop-blur-xl rounded-3xl border-2 border-white/30 hover:bg-white/20 transition-all hover:-translate-y-3 hover:scale-105">
                <div className={`w-14 h-14 bg-gradient-to-r ${contact.grad} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all shadow-xl`}>
                  <contact.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-black text-lg mb-3">{contact.title}</h4>
                {contact.lines.map((line, j) => (
                  <p key={j} className="text-white/90 hover:text-amber-200 transition-colors">{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center gap-3 hover:bg-amber-50">
              <Calendar className="w-5 h-5" />
              Schedule a Tour
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-black border-2 border-white/40 hover:bg-white/30 hover:scale-110 transition-all flex items-center justify-center gap-3">
              <Download className="w-5 h-5" />
              Download Brochure
            </button>
          </div>
        </div>
      </section>



      {/* Vibrant Sticky Button */}
       <Link to="/rooms" className="group fixed bottom-8 right-8 px-10 py-5 text-white rounded-full font-black shadow-2xl hover:shadow-3xl hover:scale-125 transition-all z-50 flex items-center gap-3 animate-gradient-shift border-2 border-white/30" style={{background: `linear-gradient(135deg, #059669, #06b6d4, #f59e0b, #ef4444)`, backgroundSize: '300% 300%'}}>
         <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <Home className="w-6 h-6 relative z-10 drop-shadow-lg" />
         <span className="relative z-10 drop-shadow-lg">Book Your Seat</span>
         <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-3 transition-transform drop-shadow-lg" />
       </Link>
      <Footer />
    </div>
  );

  if (!isHomePage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking" element={<><Header /><BookingPage /><Footer /></>} />
        <Route path="/gallery" element={<><Header /><GalleryPage /><Footer /></>} />
        <Route path="/contact" element={<><Header /><ContactPage /><Footer /></>} />
        <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
        <Route path="/rooms" element={<><Header /><RoomsPage /><Footer /></>} />
        <Route path="/rooms/:id" element={<><Header /><RoomDetailsPage /><Footer /></>} />
        <Route path="/facilities" element={<><Header /><FacilitiesPage /><Footer /></>} />
          <Route path="*" element={
           <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #99f6e4 100%)'}}>
             <div className="text-center">
               <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">404</h1>
               <p className="text-xl text-emerald-700 dark:text-emerald-300 mb-8">Page not found</p>
               <Link to="/" className="px-8 py-4 text-white rounded-2xl font-bold shadow-xl hover:scale-110 transition-transform inline-block animate-gradient-shift" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY})`}}>
                 Go Home
               </Link>
             </div>
           </div>
         } />
      </Routes>
    );
  }

  return renderHomePage();
}
