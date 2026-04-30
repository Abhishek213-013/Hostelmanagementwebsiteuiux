import { useState, useEffect, useRef } from 'react';
import { Sparkles, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Home, Tv, Gamepad2, Droplets, ShoppingBag, Clock, Phone, MapPin, Star, CheckCircle2, Zap, Mic, Camera, Sun, Trees, Bed, Bath, WashingMachine, Refrigerator, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold tracking-wide text-teal-600 uppercase">Premium Amenities</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-6">
              <span className="block text-teal-600">World-Class</span>
              <span className="block text-gray-800">Facilities</span>
            </h1>
            <p className="text-l text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need for <span className="text-teal-600 font-bold">success</span>, all under one roof
            </p>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="group bg-white rounded-2xl p-8 shadow border border-gray-200 text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-500 hover:bg-teal-600">
                  <div className="w-15 h-15 mx-auto mb-6 rounded-2xl bg-teal-600 flex items-center justify-center shadow group-hover:bg-white transition-all duration-500">
                    <stat.icon className="w-10 h-10 text-white group-hover:text-teal-600" />
                  </div>
                  <div className="text-2xl font-black mb-2 text-teal-600 group-hover:text-white transition-all duration-500">{stat.number}</div>
                  <div className="text-sm font-semibold text-gray-600 group-hover:text-gray-200 transition-all duration-500">{stat.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Categories */}
        {facilityCategories.map((category, catIdx) => (
          <AnimatedSection key={catIdx} delay={catIdx * 100}>
            <div className="mb-24">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-15 h-15 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
                  <category.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-black mb-2 text-teal-600">{category.title}</h2>
                  <p className="text-gray-600 text-m">Everything you need for comfortable living</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.facilities.map((facility, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-500">
                      <div className="relative h-56 overflow-hidden">
                        <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center shadow">
                              <facility.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-black text-teal-600">{facility.name}</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{facility.desc}</p>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}

        {/* CTA Section */}
        <AnimatedSection delay={200}>
          <div className="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
              <h2 className="text-2xl lg:text-3xl font-black mb-6">Want to Experience Our Facilities?</h2>
              <p className="text-l text-white/90 mb-10 max-w-2xl mx-auto">Book your room today and enjoy all these premium amenities from day one</p>
              <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/booking" className="px-10 py-5 bg-white text-teal-600 rounded-xl font-bold flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all">
                    <CheckCircle2 className="w-5 h-5" />
                    Book Your Room
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/rooms" className="px-10 py-5 bg-teal-700 text-white rounded-xl font-bold border-2 border-teal-500 flex items-center gap-3 hover:bg-teal-800 transition-all">
                    <Sparkles className="w-5 h-5" />
                    View Rooms
                  </Link>
              </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}