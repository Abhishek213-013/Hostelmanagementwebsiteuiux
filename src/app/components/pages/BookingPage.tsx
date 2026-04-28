import { useState } from 'react';
import { Building2, ArrowRight, ArrowLeft, Calendar, Users, CheckCircle2, Star, Wifi, Wind, Coffee, Dumbbell, Shield, Car, BookOpen, Utensils, ChevronRight, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOGO_PRIMARY = '#0f172a';
const LOGO_SECONDARY = '#334155';

interface Room {
  id: number;
  title: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  available: number;
  popular?: boolean;
  gradient: string;
}

const rooms: Room[] = [
  {
    id: 1,
    title: 'Shared Room',
    type: 'shared',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan'],
    available: 8,
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    title: 'Semi-Private Room',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Balcony'],
    available: 4,
    popular: true,
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 3,
    title: 'Premium Single Room',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'Study Table', 'Mini Fridge'],
    available: 2,
    gradient: 'from-violet-500 to-purple-600'
  }
];

export function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [step, setStep] = useState(1);
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room);
    setStep(2);
  };

  const handleConfirmBooking = () => {
    console.log('Booking confirmed:', { room: selectedRoom, ...bookingData });
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-sky-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative text-center max-w-lg">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">Your room has been reserved successfully.</p>
          <p className="text-slate-500 dark:text-slate-400 mb-10">A confirmation email has been sent to <span className="font-semibold text-slate-700 dark:text-slate-300">{bookingData.email}</span></p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="group px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-800 dark:text-white rounded-2xl font-bold hover:bg-white dark:hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <button onClick={() => setStep(1)} className="group px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              Book Another Room
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-28 pb-20 px-6 overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-blue-200/20 dark:from-sky-900/20 dark:to-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {step === 1 && (
          <>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-8">
                <div className="p-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 rounded-xl">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">Room Booking</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1]">
                Choose Your
                <br />
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent">
                  Perfect Room
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300">Select your ideal accommodation and book instantly</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
              {rooms.map((room) => (
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
                   <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-2xl" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
                   <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 dark:border-slate-700/50 hover:shadow-3xl transition-all duration-700 hover:-translate-y-3">
                    <div className="relative h-72 overflow-hidden">
                      <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

                      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        <Users className="w-4 h-4 text-white" />
                        <span className="text-white font-bold text-sm">{room.available} available</span>
                      </div>

                      <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg">
                        <span className="text-slate-900 dark:text-white font-black text-sm">{room.type.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{room.title}</h3>
                        <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${room.gradient} text-white font-black shadow-lg`}>
                          ৳{room.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {room.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleBookNow(room)}
                        className="w-full group/btn py-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                      >
                        Book Now
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Facilities */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 opacity-5 dark:opacity-10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50 dark:border-slate-700/50">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 text-center">Our Premium Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { icon: Wifi, label: 'High-Speed WiFi', gradient: 'from-sky-500 to-blue-600' },
                    { icon: Wind, label: 'Air Conditioning', gradient: 'from-cyan-500 to-sky-600' },
                    { icon: Utensils, label: 'Dining Hall', gradient: 'from-orange-500 to-amber-600' },
                    { icon: Coffee, label: 'Common Room', gradient: 'from-yellow-500 to-amber-600' },
                    { icon: BookOpen, label: 'Study Rooms', gradient: 'from-indigo-500 to-violet-600' },
                    { icon: Shield, label: '24/7 Security', gradient: 'from-emerald-500 to-teal-600' },
                    { icon: Car, label: 'Parking', gradient: 'from-violet-500 to-purple-600' },
                    { icon: Dumbbell, label: 'Fitness', gradient: 'from-rose-500 to-pink-600' },
                    { icon: Users, label: 'Community', gradient: 'from-blue-500 to-indigo-600' },
                    { icon: Building2, label: 'Laundry', gradient: 'from-slate-500 to-slate-600' },
                    { icon: Sparkles, label: 'Housekeeping', gradient: 'from-amber-500 to-orange-600' },
                    { icon: CheckCircle2, label: 'Maintenance', gradient: 'from-green-500 to-emerald-600' }
                  ].map((item, i) => (
                    <div key={i} className="group/item flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${item.gradient} group-hover/item:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && selectedRoom && (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 opacity-10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-slate-700/50">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative min-h-[500px] lg:min-h-0">
                  <img src={selectedRoom.image} alt={selectedRoom.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className={`inline-block px-4 py-2 rounded-xl bg-gradient-to-r ${selectedRoom.gradient} text-white font-black shadow-xl mb-4`}>
                      {selectedRoom.type.replace('-', ' ')}
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2">{selectedRoom.title}</h3>
                    <p className="text-white/80 text-xl">৳{selectedRoom.price.toLocaleString()}/month</p>
                  </div>
                </div>

                <div className="p-10">
                  <button onClick={() => setStep(1)} className="group flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mb-8 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Rooms
                  </button>

                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Complete Your Booking</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Check-in Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Check-out Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Number of Guests</label>
                      <select
                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white"
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Special Requests (Optional)</label>
                      <textarea
                        placeholder="Any special requests or requirements..."
                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none h-24"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                      />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-600">
                      <h4 className="font-black text-slate-900 dark:text-white mb-4">Booking Summary</h4>
                      <div className="space-y-3 text-slate-600 dark:text-slate-300">
                        <div className="flex justify-between">
                          <span>Room Type</span>
                          <span className="font-bold text-slate-900 dark:text-white">{selectedRoom.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Rent</span>
                          <span className="font-bold text-slate-900 dark:text-white">৳{selectedRoom.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Security Deposit</span>
                          <span className="font-bold text-slate-900 dark:text-white">৳{Math.round(selectedRoom.price * 2).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-300 dark:border-slate-600 pt-3 mt-3 flex justify-between">
                          <span className="font-black text-lg text-slate-900 dark:text-white">Total to Pay Now</span>
                          <span className="font-black text-2xl text-slate-900 dark:text-white">৳{Math.round(selectedRoom.price * 2).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      className="w-full group py-5 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
                      style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      Confirm Booking
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}