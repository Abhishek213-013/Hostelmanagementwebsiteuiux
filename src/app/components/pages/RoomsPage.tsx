import { useState } from 'react';
import { Building2, Star, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Calendar, Bed, Maximize2, Sparkles, Home, ArrowRight, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardGradients, LOGO_PRIMARY, LOGO_SECONDARY, LOGO_TERTIARY } from '../../constants';

interface Room {
  id: number;
  title: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  available: number;
  popular?: boolean;
  description: string;
  size: string;
  capacity: number;
  gradient: string;
}

const rooms: Room[] = [
  {
    id: 1,
    title: 'Shared Room',
    type: 'shared',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan', 'Common Lounge Access'],
    available: 8,
    description: 'Perfect for budget-conscious students who enjoy a social living environment.',
    size: '200 sq ft',
    capacity: 4,
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    title: 'Semi-Private Room',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Balcony', 'Storage Space'],
    available: 4,
    popular: true,
    description: 'Ideal balance of privacy and affordability with modern amenities.',
    size: '300 sq ft',
    capacity: 2,
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 3,
    title: 'Premium Single Room',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'Study Table', 'Mini Fridge', 'Wardrobe', 'Desk Lamp'],
    available: 2,
    description: 'Luxury accommodation with premium furnishings and maximum privacy.',
    size: '400 sq ft',
    capacity: 1,
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 4,
    title: 'Deluxe Suite',
    type: 'deluxe',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    features: ['King Size Bed', 'Premium Bath', 'Split AC', 'Work Station', 'Mini Kitchen', 'Smart TV', 'Private Balcony', 'Room Service'],
    available: 1,
    description: 'Ultimate luxury living experience with hotel-like amenities and services.',
    size: '550 sq ft',
    capacity: 2,
    gradient: 'from-amber-500 to-orange-600'
  }
];

const amenities = [
  { icon: Wifi, label: 'High-Speed WiFi', desc: 'Fiber optic internet', gradient: 'from-sky-500 to-blue-600' },
  { icon: Wind, label: 'Climate Control', desc: 'AC & Fan in all rooms', gradient: 'from-cyan-500 to-sky-600' },
  { icon: Shield, label: '24/7 Security', desc: 'CCTV & Security guards', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Car, label: 'Parking Space', desc: 'Secure parking area', gradient: 'from-violet-500 to-purple-600' },
  { icon: Utensils, label: 'Dining Hall', desc: '3 meals included', gradient: 'from-orange-500 to-amber-600' },
  { icon: BookOpen, label: 'Study Lounge', desc: 'Quiet study areas', gradient: 'from-indigo-500 to-violet-600' },
  { icon: Dumbbell, label: 'Fitness Center', desc: 'Gym & equipment', gradient: 'from-rose-500 to-pink-600' },
  { icon: Coffee, label: 'Common Room', desc: 'Recreation space', gradient: 'from-yellow-500 to-amber-600' }
];

export function RoomsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);

  const filteredRooms = selectedType === 'all' ? rooms : rooms.filter(room => room.type === selectedType);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 animate-gradient-shift"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-bl from-emerald-400/40 via-teal-300/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-bl from-amber-400/40 via-orange-300/30 to-rose-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl animate-float shadow-lg shadow-emerald-400/50"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl animate-float-delayed shadow-lg shadow-amber-400/50"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl animate-float-slow shadow-lg shadow-cyan-400/50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-emerald-900/90 backdrop-blur-xl rounded-full shadow-xl shadow-emerald-500/20 border border-emerald-300/50 dark:border-emerald-600/50 mb-8 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent uppercase">Our Rooms</span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1]">
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent animate-gradient-x">Find Your</span>
            <br />
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-3xl opacity-40 animate-pulse"></span>
              <span className="relative bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent text-4xl lg:text-6xl">
                Perfect Space
              </span>
            </span>
          </h1>
          <p className="text-xl text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto leading-relaxed">Choose from our range of thoughtfully designed rooms that cater to every need and budget</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['all', 'shared', 'semi-private', 'premium', 'deluxe'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-500 capitalize ${
                selectedType === type
                  ? 'text-white shadow-2xl scale-105'
                  : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg border-2 border-emerald-200/50 dark:border-emerald-700/50'
              }`}
              style={selectedType === type ? {background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`} : {}}
            >
              {type === 'all' ? 'All Rooms' : type.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group relative"
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              {room.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 text-white rounded-full text-sm font-bold shadow-2xl flex items-center gap-2" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}>
                  <Star className="w-4 h-4 fill-current" />
                  Most Popular
                </div>
              )}
              <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: cardGradients[room.id % 5]}}></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-3xl transition-all duration-700 hover:-translate-y-3">
                <div className="relative h-72 overflow-hidden">
                  <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/30 to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-sm">Up to {room.capacity}</span>
                  </div>
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg">
                    <span className="text-emerald-800 dark:text-emerald-200 font-black text-sm">{room.size}</span>
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="px-4 py-2 text-white rounded-xl font-black shadow-2xl" style={{background: cardGradients[room.id % 5]}}>
                      ৳{room.price.toLocaleString()}<span className="text-xs font-normal">/mo</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black mb-3" style={{background: cardGradients[room.id % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{room.title}</h3>
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-6 leading-relaxed">{room.description}</p>

                  <div className="space-y-3 mb-8">
                    {room.features.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${room.available > 0 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        {room.available > 0 ? `${room.available} available` : 'Fully booked'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/rooms/${room.id}`}
                        className="group/btn px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-emerald-800 dark:text-emerald-200 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-emerald-200 dark:border-emerald-700"
                      >
                        See Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/booking"
                        className="group/btn px-6 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 animate-gradient-shift"
                        style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-emerald-300/50 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800/50 dark:to-teal-800/50 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Room </span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Amenities</span>
            </h2>
            <p className="text-xl text-emerald-700 dark:text-emerald-300">Every room comes with essential amenities for comfortable living</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((item, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: cardGradients[i % 5]}}></div>
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all" style={{background: cardGradients[i % 5]}}>
                    <item.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-lg font-black mb-2 text-center" style={{background: cardGradients[i % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{item.label}</h3>
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm text-center">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl blur-2xl animate-gradient-shift"></div>
          <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-12 md:p-20 text-white text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Can't Find What You're Looking For?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Contact us for custom room arrangements or special requirements</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/booking" className="group px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  Book a Room
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="px-10 py-5 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-black border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-3">
                  <Info className="w-5 h-5" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
