import { Sparkles, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Home, Tv, Gamepad2, Droplets, ShoppingBag, Clock, Phone, MapPin, Star, CheckCircle2, Zap, Mic, Camera, Sun, Trees, Bed, Bath, WashingMachine, Refrigerator, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardGradients, LOGO_PRIMARY, LOGO_SECONDARY, LOGO_TERTIARY } from '../../constants';

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
    <div className="min-h-screen relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-blue-200/20 dark:from-sky-900/20 dark:to-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-8">
            <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">Our Facilities</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Premium
            <br />
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent">
              Amenities
            </span>
            <br />
            <span className="text-4xl lg:text-5xl text-slate-600 dark:text-slate-300 font-light">For You</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">Experience world-class facilities designed to make your stay comfortable, productive, and enjoyable</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="group relative">
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.number}</div>
                <div className="text-slate-600 dark:text-slate-300 font-semibold">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        {facilityCategories.map((category, catIdx) => (
          <div key={catIdx} className="mb-24">
            <div className="flex items-center gap-6 mb-12">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center shadow-2xl flex-shrink-0`}>
                <category.icon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">{category.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg">Everything you need for comfortable living</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.facilities.map((facility, i) => (
                <div key={i} className="group relative">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${facility.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                  <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-3 transition-all duration-700">
                    <div className="relative h-56 overflow-hidden">
                      <img src={facility.image} alt={facility.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${facility.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <facility.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{facility.name}</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{facility.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-20 text-white text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Want to Experience Our Facilities?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Book your room today and enjoy all these premium amenities from day one</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/booking" className="group px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Book Your Room
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/rooms" className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-black border-2 border-white/30 hover:bg-white/20 transition-all flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  View Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}