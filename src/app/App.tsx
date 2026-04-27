import { useState, useEffect } from 'react';
import { Search, Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, MapPin, Phone, Mail, Menu, X, Home, Utensils, Dumbbell, Camera, CheckCircle2, Star, ChevronRight, Building2, Sparkles, Award, ArrowRight, Calendar, Download, TrendingUp, Zap, Heart } from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    roomType: '',
    seats: '',
    maxPrice: ''
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Ultra-Modern Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-2xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50'
          : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-sky-400 via-blue-500 to-emerald-500 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  SylhetStay
                </h1>
                <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Premium Living</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              {['Rooms', 'Facilities', 'Gallery', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors duration-300 group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-emerald-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                </a>
              ))}
              <a
                href="#contact"
                className="relative px-8 py-3.5 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-white rounded-2xl font-bold overflow-hidden group shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl hover:bg-slate-100 transition-colors duration-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-200/50">
            <div className="px-6 py-6 space-y-4">
              {['Rooms', 'Facilities', 'Gallery', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-3 text-slate-700 hover:text-sky-600 font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Ultra-Modern Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50/30 to-emerald-50/30"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-sky-200/30 via-blue-100/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/30 via-teal-100/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-sky-100/20 via-blue-100/10 to-emerald-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <div className="text-center max-w-5xl mx-auto space-y-12">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full shadow-xl shadow-sky-500/10 border border-sky-100/50 hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 hover:scale-105 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-wide">
                Sylhet, Bangladesh
              </span>
              <Sparkles className="w-5 h-5 text-sky-500 animate-pulse" />
            </div>

            {/* Hero Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                <span className="block text-slate-900">Your Home</span>
                <span className="block text-slate-900">Away From Home</span>
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-500 blur-2xl opacity-30 animate-pulse"></span>
                    <span className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      in Sylhet
                    </span>
                  </span>
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Experience premium student accommodation with cutting-edge amenities, vibrant community, and an environment designed for success.
              </p>
            </div>

            {/* Modern Search Widget */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-900/10 p-10 border border-slate-200/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-900 tracking-wide uppercase">Room Type</label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 font-semibold text-slate-800"
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
                    <label className="block text-sm font-bold text-slate-900 tracking-wide uppercase">Seats</label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 font-semibold text-slate-800"
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
                    <label className="block text-sm font-bold text-slate-900 tracking-wide uppercase">Max Price</label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 font-semibold text-slate-800"
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
                    <button className="w-full group relative px-8 py-4 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-white rounded-2xl font-bold overflow-hidden shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/40 transition-all duration-500 hover:scale-105">
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <Search className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        Search
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-emerald-500 border-2 border-white"></div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900">150+ Students</div>
                  <div className="text-xs text-slate-500">Living Here</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900">4.8/5.0</div>
                  <div className="text-xs text-slate-500">Rating</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                <div className="text-left">
                  <div className="font-bold text-slate-900">98% Occupied</div>
                  <div className="text-xs text-slate-500">High Demand</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full p-1">
            <div className="w-1.5 h-3 bg-gradient-to-b from-sky-500 to-emerald-500 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Availability Cards */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: '12 Seats Available', desc: 'Across all room types', price: '৳4,500/mo', badge: 'Available Now', color: 'from-sky-500 to-blue-600' },
              { icon: Award, title: 'Premium Rooms', desc: 'AC + Attached Bath', price: '৳10,500/mo', badge: 'Popular', color: 'from-blue-500 to-emerald-600' },
              { icon: Sparkles, title: 'Early Bird Discount', desc: 'Book 3 months, get 10% off', price: 'Save ৳1,350', badge: 'Limited', color: 'from-emerald-500 to-teal-600' }
            ].map((card, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-br ${card.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-slate-900/10 border border-slate-200/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-2xl blur-xl opacity-30`}></div>
                      <div className={`relative p-4 bg-gradient-to-br ${card.color} rounded-2xl`}>
                        <card.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <span className={`px-4 py-2 bg-gradient-to-r ${card.color} text-white rounded-full text-sm font-bold shadow-lg`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-600 mb-8">{card.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {card.price}
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern About Section */}
      <section id="about" className="relative py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-sky-100 to-emerald-100 rounded-full border border-sky-200">
                <Award className="w-5 h-5 text-sky-600" />
                <span className="text-sm font-bold text-sky-900 tracking-wide">Est. 2020</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-slate-900 block">Welcome to</span>
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  SylhetStay
                </span>
              </h2>

              <p className="text-xl text-slate-600 leading-relaxed">
                Providing exceptional accommodation to students pursuing their academic dreams. We understand the importance of a comfortable, safe, and study-conducive environment.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: '150+', label: 'Happy Students' },
                  { num: '4.8', label: 'Average Rating', icon: true },
                  { num: '50+', label: 'Room Options' },
                  { num: '24/7', label: 'Security' }
                ].map((stat, i) => (
                  <div key={i} className="group relative p-6 bg-white rounded-2xl shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                        {stat.num}
                        {stat.icon && <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <div className="text-sm font-semibold text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=800',
                'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=800',
                'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=800',
                'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=800'
              ].map((img, i) => (
                <div key={i} className={`group relative overflow-hidden rounded-3xl shadow-2xl ${i % 2 === 1 ? 'mt-12' : ''}`}>
                  <img src={img} alt={`Room ${i + 1}`} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Facilities */}
      <section id="facilities" className="relative py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-sky-100/50 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-sky-100 to-emerald-100 rounded-full mb-6 border border-sky-200">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span className="text-sm font-bold text-sky-900 tracking-wide">Premium Amenities</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-slate-900">World-Class </span>
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">Facilities</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need for success, all under one roof</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Wifi, label: 'High-Speed WiFi', desc: '100 Mbps fiber', color: 'from-sky-500 to-blue-600' },
              { icon: Wind, label: 'Air Conditioning', desc: 'Premium rooms', color: 'from-blue-500 to-emerald-600' },
              { icon: Utensils, label: 'Dining Hall', desc: '3 meals daily', color: 'from-emerald-500 to-teal-600' },
              { icon: Coffee, label: 'Common Room', desc: 'Recreation area', color: 'from-sky-500 to-blue-600' },
              { icon: BookOpen, label: 'Study Rooms', desc: 'Quiet & peaceful', color: 'from-blue-500 to-emerald-600' },
              { icon: Shield, label: '24/7 Security', desc: 'CCTV & guards', color: 'from-emerald-500 to-teal-600' },
              { icon: Car, label: 'Parking', desc: 'Bike & car spaces', color: 'from-sky-500 to-blue-600' },
              { icon: Dumbbell, label: 'Fitness Center', desc: 'Modern equipment', color: 'from-blue-500 to-emerald-600' }
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-lg opacity-30`}></div>
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">{item.label}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern Rooms */}
      <section id="rooms" className="relative py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-sky-100 to-emerald-100 rounded-full mb-6 border border-sky-200">
              <Home className="w-5 h-5 text-sky-600" />
              <span className="text-sm font-bold text-sky-900 tracking-wide">Find Your Space</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-slate-900">Choose Your </span>
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">Perfect Room</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', title: 'Shared Room', desc: 'Perfect for vibrant community', price: '৳4,500', features: ['4 bunk beds', 'Shared bathroom', 'Study desk', 'Wardrobe'] },
              { img: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800', title: 'Semi-Private', desc: 'Balance of privacy & affordability', price: '৳7,500', features: ['2 single beds', 'Attached bath', 'Study desks', 'Ceiling fan'], popular: true },
              { img: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800', title: 'Premium Single', desc: 'Ultimate privacy & comfort', price: '৳10,500', features: ['Private room', 'Attached bath', 'Air conditioning', 'Premium furniture'] }
            ].map((room, i) => (
              <div key={i} className="group relative">
                {room.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                )}
                <div className="absolute -inset-1 bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-3">
                  <div className="relative h-80 overflow-hidden">
                    <img src={room.img} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-3xl font-black text-slate-900 mb-3">{room.title}</h3>
                    <p className="text-slate-600 mb-6">{room.desc}</p>
                    <div className="space-y-3 mb-8">
                      {room.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-slate-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Starting from</div>
                        <div className="text-4xl font-black bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                          {room.price}<span className="text-lg text-slate-400">/mo</span>
                        </div>
                      </div>
                      <button className="px-8 py-4 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern Gallery */}
      <section id="gallery" className="relative py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-sky-100 to-emerald-100 rounded-full mb-6 border border-sky-200">
              <Camera className="w-5 h-5 text-sky-600" />
              <span className="text-sm font-bold text-sky-900 tracking-wide">Visual Tour</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-slate-900">Explore Our </span>
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">Space</span>
            </h2>
          </div>

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
              <div key={i} className="group relative overflow-hidden rounded-3xl aspect-square shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
            <div className="group relative overflow-hidden rounded-3xl aspect-square bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500 flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="text-center text-white">
                <div className="text-5xl font-black mb-2">+24</div>
                <div className="font-bold">More Photos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Testimonials */}
      <section className="relative py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-slate-900">What Students </span>
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Arafat Rahman', uni: 'SUST, Computer Science', text: 'The facilities are excellent, and the staff is incredibly supportive. The study environment here helped me maintain my GPA!' },
              { name: 'Fatima Hassan', uni: 'Metropolitan University', text: 'WiFi is super fast, and the food quality is great. Made lots of friends here. Highly recommended!' },
              { name: 'Mehedi Khan', uni: 'Sylhet Medical College', text: 'The hostel management made the transition so smooth. Feels like a second home!' }
            ].map((testimonial, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-8 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-emerald-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-black text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.uni}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern Contact */}
      <section id="contact" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center text-white">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-full mb-8 border border-white/30">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wide">Get Started Today</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black mb-8">Ready to Make<br/>SylhetStay Your Home?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-16 text-white/90">Join our community of successful students today</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Phone, title: 'Call Us', lines: ['+880 1711-123456', '+880 1811-654321'] },
              { icon: Mail, title: 'Email Us', lines: ['info@sylhetstay.com', 'booking@sylhetstay.com'] },
              { icon: MapPin, title: 'Visit Us', lines: ['123 Akhalia Road', 'Sylhet 3100, BD'] }
            ].map((contact, i) => (
              <div key={i} className="group p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <contact.icon className="w-8 h-8" />
                </div>
                <h4 className="font-black text-xl mb-4">{contact.title}</h4>
                {contact.lines.map((line, j) => (
                  <p key={j} className="text-white/90">{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-5 bg-white text-sky-600 rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center justify-center gap-3">
              <Calendar className="w-6 h-6" />
              Schedule a Tour
            </button>
            <button className="px-10 py-5 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-black border-2 border-white/30 hover:bg-white/30 transition-all flex items-center justify-center gap-3">
              <Download className="w-6 h-6" />
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Footer */}
      <footer className="relative bg-slate-900 text-white py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-sky-400 to-emerald-500 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="font-black text-2xl">SylhetStay</span>
              </div>
              <p className="text-slate-400 mb-6">Premium student accommodation in Sylhet, Bangladesh.</p>
            </div>

            {[
              { title: 'Quick Links', links: ['Room Types', 'Facilities', 'Gallery', 'About'] },
              { title: 'Information', links: ['Admission', 'Payment', 'FAQs', 'Terms'] },
              { title: 'Contact', links: ['123 Akhalia Road', '+880 1711-123456', 'info@sylhetstay.com'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-black mb-6">{col.title}</h4>
                <div className="space-y-3">
                  {col.links.map((link, j) => (
                    <div key={j} className="text-slate-400 hover:text-white transition-colors cursor-pointer">{link}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2026 SylhetStay Hostel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Ultra-Modern Sticky Button */}
      <button className="group fixed bottom-8 right-8 px-10 py-5 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-white rounded-full font-black shadow-2xl hover:shadow-3xl hover:scale-110 transition-all z-50 flex items-center gap-3">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-sky-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Home className="w-6 h-6 relative z-10" />
        <span className="relative z-10">Book Your Seat</span>
        <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
