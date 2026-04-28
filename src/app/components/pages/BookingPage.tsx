import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
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
  gradient: string;
}

const defaultRoom: Room = {
  id: 1,
  title: 'Shared Room',
  type: 'shared',
  price: 4500,
  image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
  features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan'],
  gradient: 'from-emerald-500 to-teal-600'
};

export function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room>(defaultRoom);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [step, setStep] = useState(2);

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
              <button onClick={() => setStep(2)} className="group px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
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