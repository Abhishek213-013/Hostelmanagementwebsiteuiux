import { useState, useEffect, useRef } from 'react';
import { Sparkles, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Home, Tv, Gamepad2, Droplets, ShoppingBag, Clock, Phone, MapPin, Star, CheckCircle2, Zap, Mic, Camera, Sun, Trees, Bed, Bath, WashingMachine, Refrigerator, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardGradients, LOGO_PRIMARY, LOGO_SECONDARY, LOGO_TERTIARY } from '../../constants';

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

const facilityCategories = [
  {
    title: 'Living & Comfort',
    icon: Home,
    gradient: 'from-emerald-500 to-teal-600',
    facilities: [
      { icon: Wind, name: 'Air Conditioning', desc: 'Climate control in all rooms', image: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', gradient: 'from-cyan-500 to-sky-600' },
      { icon: Wifi, name: 'High-Speed WiFi', desc: 'Fiber optic internet throughout', image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600', gradient: 'from-sky-500 to-blue-600' },
      { icon: Sun, name: 'Natural Lighting', desc: 'Large windows in every room', image: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', gradient: 'from-amber-500 to-orange-600' },
      { icon: Bed, name: 'Premium Bedding', desc: 'Comfortable mattresses provided', image: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', gradient: 'from-violet-500 to-purple-600' }
    ]
  },
  {
    title: 'Dining & Kitchen',
    icon: Utensils,
    gradient: 'from-orange-500 to-amber-600',
    facilities: [
      { icon: Utensils, name: 'Dining Hall', desc: 'Spacious dining area with 3 meals', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', gradient: 'from-orange-500 to-red-600' },
      { icon: Coffee, name: 'Common Kitchen', desc: 'Fully equipped shared kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', gradient: 'from-yellow-500 to-amber-600' },
      { icon: Refrigerator, name: 'Fridge Access', desc: 'Personal fridge in premium rooms', image: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', gradient: 'from-blue-500 to-indigo-600' },
      { icon: ShoppingBag, name: 'Vending Machines', desc: '24/7 snacks and drinks', image: 'https://images.unsplash.com/photo-1620799140408-edc7fdaa47c9?w=600', gradient: 'from-pink-500 to-rose-600' }
    ]
  },
  {
    title: 'Recreation & Fitness',
    icon: Dumbbell,
    gradient: 'from-rose-500 to-pink-600',
    facilities: [
      { icon: Dumbbell, name: 'Fitness Center', desc: 'Modern gym equipment', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', gradient: 'from-rose-500 to-red-600' },
      { icon: Tv, name: 'Entertainment Room', desc: 'Smart TV & gaming consoles', image: 'https://images.unsplash.com/photo-1489599746744-5bace50f4768?w=600', gradient: 'from-violet-500 to-purple-600' },
      { icon: Gamepad2, name: 'Game Zone', desc: 'Indoor games & recreation', image: 'https://images.unsplash.com/photo-1511512578048-dfb367046420?w=600', gradient: 'from-indigo-500 to-blue-600' },
      { icon: Trees, name: 'Garden Area', desc: 'Peaceful outdoor space', image: 'https://images.unsplash.com/photo-1585320806297-4c64695cc6952?w=600', gradient: 'from-emerald-500 to-green-600' }
    ]
  },
  {
    title: 'Study & Work',
    icon: BookOpen,
    gradient: 'from-blue-500 to-indigo-600',
    facilities: [
      { icon: BookOpen, name: 'Study Lounge', desc: 'Quiet study environment', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600', gradient: 'from-blue-500 to-cyan-600' },
      { icon: Mic, name: 'Meeting Rooms', desc: 'For group discussions', image: 'https://images.unsplash.com/photo-1497366216548-c64695cc6952?w=600', gradient: 'from-violet-500 to-purple-600' },
      { icon: Zap, name: 'Power Backup', desc: '24/7 uninterrupted power', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600', gradient: 'from-amber-500 to-yellow-600' },
      { icon: Camera, name: 'Print Station', desc: 'Printing & scanning facilities', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', gradient: 'from-slate-500 to-slate-600' }
    ]
  },
  {
    title: 'Services & Security',
    icon: Shield,
    gradient: 'from-emerald-500 to-teal-600',
    facilities: [
      { icon: Shield, name: '24/7 Security', desc: 'CCTV & security personnel', image: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=600', gradient: 'from-emerald-500 to-green-600' },
      { icon: Car, name: 'Parking Space', desc: 'Secure parking for residents', image: 'https://images.unsplash.com/photo-1626668890516-8dca865627ef?w=600', gradient: 'from-sky-500 to-blue-600' },
      { icon: WashingMachine, name: 'Laundry Service', desc: 'Washing machines available', image: 'https://images.unsplash.com/photo-1545173168-9f1c6e193c3b?w=600', gradient: 'from-cyan-500 to-sky-600' },
      { icon: Droplets, name: 'Housekeeping', desc: 'Regular cleaning service', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600', gradient: 'from-blue-500 to-indigo-600' }
    ]
  }
];

const stats = [
  { icon: Wifi, number: '1 Gbps', label: 'Internet Speed', gradient: 'from-sky-500 to-blue-600' },
  { icon: Shield, number: '24/7', label: 'Security', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Droplets, number: 'Daily', label: 'Housekeeping', gradient: 'from-blue-500 to-indigo-600' },
  { icon: Clock, number: '24hrs', label: 'Power Backup', gradient: 'from-amber-500 to-orange-600' }
];

export function FacilitiesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 animate-gradient-shift"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-400/40 via-teal-300/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-400/40 via-orange-300/30 to-rose-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-emerald-300/30 via-teal-200/20 to-cyan-300/30 dark:from-emerald-800/30 dark:via-teal-800/20 dark:to-cyan-800/30 rounded-full blur-3xl animate-spin-slow"></div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl animate-float shadow-lg shadow-emerald-400/50"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl animate-float-delayed shadow-lg shadow-amber-400/50"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl animate-float-slow shadow-lg shadow-cyan-400/50"></div>

        {/* Animated Particles */}
        {[...Array(15)].map((_, i) => (
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
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-amber-300/50 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800/50 dark:to-orange-800/50 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
              <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Premium Amenities</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">World-Class</span>
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Facilities</span>
            </h1>
            <p className="text-xl text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto leading-relaxed">
              Everything you need for <span className="text-amber-600 dark:text-amber-400 font-bold">success</span>, all under one roof
            </p>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="group relative">
                <div className="absolute -inset-2 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: cardGradients[i % 5]}}></div>
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl p-8 shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-2 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse" style={{background: cardGradients[i % 5]}}></div>
                    <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all shadow-xl" style={{background: cardGradients[i % 5]}}>
                      <stat.icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="text-4xl font-black mb-2" style={{background: cardGradients[i % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{stat.number}</div>
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{stat.label}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Categories */}
        {facilityCategories.map((category, catIdx) => (
          <AnimatedSection key={catIdx} delay={catIdx * 100}>
            <div className="mb-24">
              <div className="flex items-center gap-6 mb-12">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse" style={{background: cardGradients[catIdx % 5]}}></div>
                  <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl" style={{background: cardGradients[catIdx % 5]}}>
                    <category.icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black mb-2" style={{background: cardGradients[catIdx % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{category.title}</h2>
                  <p className="text-emerald-700 dark:text-emerald-300 text-lg">Everything you need for comfortable living</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.facilities.map((facility, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -inset-2 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: cardGradients[(catIdx + i) % 5]}}></div>
                    <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-2">
                      <div className="relative h-56 overflow-hidden">
                        <img src={facility.image} alt={facility.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110" style={{background: cardGradients[(catIdx + i) % 5]}}>
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-xl blur-lg opacity-50 animate-pulse" style={{background: cardGradients[(catIdx + i) % 5]}}></div>
                            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl" style={{background: cardGradients[(catIdx + i) % 5]}}>
                              <facility.icon className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                          </div>
                          <h3 className="text-lg font-black text-transparent bg-clip-text" style={{backgroundImage: cardGradients[(catIdx + i) % 5], WebkitBackgroundClip: 'text'}}>{facility.name}</h3>
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">{facility.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}

        {/* CTA Section */}
        <AnimatedSection delay={200}>
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-gradient-shift" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}></div>
            <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 rounded-3xl p-12 md:p-20 text-white text-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">Want to Experience Our Facilities?</h2>
                <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">Book your room today and enjoy all these premium amenities from day one</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/booking" className="group relative px-10 py-5 text-white rounded-2xl font-bold overflow-hidden shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl animate-gradient-shift" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}>
                    <span className="relative z-10 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                      Book Your Room
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link to="/rooms" className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-bold border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all flex items-center gap-3">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                    View Rooms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}