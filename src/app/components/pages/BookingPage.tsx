import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, X, CreditCard, Smartphone, Building2, Send } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';

// Color theme constants
const LOGO_PRIMARY = '#059669';
const LOGO_SECONDARY = '#06b6d4';
const LOGO_TERTIARY = '#f59e0b';

// Gradient configurations
const cardGradients = [
  'linear-gradient(135deg, #0d9488 0%, #99f6e4 100%)',
  'linear-gradient(135deg, #64748b 0%, #cbd5e1 100%)',
  'linear-gradient(135deg, #0d9488 0%, #ffffff 100%)',
  'linear-gradient(135deg, #64748b 0%, #f1f5f9 100%)',
  'linear-gradient(135deg, #0d9488 0%, #cbd5e1 100%)',
];

interface Room {
  id: number;
  title: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  grad: string;
}

const defaultRoom: Room = {
  id: 1,
  title: 'Shared Room',
  type: 'shared',
  price: 4500,
  image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
  features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan'],
  grad: cardGradients[0]
};

const roomTypes: Record<string, Room> = {
  'shared': defaultRoom,
  'semi-private': {
    id: 2,
    title: 'Semi-Private',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Wardrobe'],
    grad: cardGradients[1]
  },
  'premium': {
    id: 3,
    title: 'Premium Single',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-16638113493eff11?w=800',
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'High-Speed WiFi', 'Mini Fridge'],
    grad: cardGradients[2]
  }
};

interface PaymentResponse {
  status: 'success' | 'failed' | 'canceled';
  transactionId?: string;
  message?: string;
}

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const roomType = searchParams.get('room');
  const initialRoom = roomType && roomTypes[roomType] ? roomTypes[roomType] : defaultRoom;
  
  const [selectedRoom, setSelectedRoom] = useState<Room>(initialRoom);
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
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentResponse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [transactionId, setTransactionId] = useState('');

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!bookingData.name.trim()) errors.name = 'Name is required';
    if (!bookingData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(bookingData.email)) errors.email = 'Email is invalid';
    if (!bookingData.phone.trim()) errors.phone = 'Phone number is required';
    if (!bookingData.checkIn) errors.checkIn = 'Check-in date is required';
    if (!bookingData.checkOut) errors.checkOut = 'Check-out date is required';
    if (bookingData.checkIn && bookingData.checkOut && bookingData.checkIn >= bookingData.checkOut) {
      errors.checkOut = 'Check-out must be after check-in';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatusParam = urlParams.get('status');
    const tranId = urlParams.get('tran_id');

    if (paymentStatusParam && tranId) {
      if (paymentStatusParam === 'success') {
        setPaymentStatus({ status: 'success', transactionId: tranId, message: 'Payment successful!' });
        setTransactionId(tranId);
        setStep(4);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatusParam === 'failed') {
        setPaymentStatus({ status: 'failed', message: 'Payment failed. Please try again.' });
        setStep(3);
      } else if (paymentStatusParam === 'canceled') {
        setPaymentStatus({ status: 'canceled', message: 'Payment was canceled.' });
        setStep(3);
      }
    }
  }, []);

  const handleConfirmBooking = () => {
    if (!validateForm()) return;
    setStep(3);
  };

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
  };

  const initiateSSLCOMMERZPayment = async () => {
    setIsProcessing(true);
    try {
      const totalAmount = Math.round(selectedRoom.price * 2);
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(transactionId);

      const paymentData = {
        total_amount: totalAmount,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${window.location.origin}/payment/success`,
        fail_url: `${window.location.origin}/payment/fail`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        emi_option: 0,
        cus_name: bookingData.name,
        cus_email: bookingData.email,
        cus_phone: bookingData.phone,
        cus_add1: 'Booking Address',
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
        shipping_method: 'NO',
        product_name: selectedRoom.title,
        product_category: 'Accommodation',
        product_profile: 'general',
        room_id: selectedRoom.id,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests: bookingData.guests
      };

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        throw new Error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({ status: 'failed', message: 'Payment initiation failed. Please try again.' });
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transactionId = `CARD_${Date.now()}`;
      setTransactionId(transactionId);
      setPaymentStatus({ status: 'success', transactionId, message: 'Payment successful!' });
      setTimeout(() => {
        setStep(4);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      setPaymentStatus({ status: 'failed', message: 'Card payment failed. Please try again.' });
      setIsProcessing(false);
    }
  };

  const handleMobileBankingPayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transactionId = `MB_${Date.now()}`;
      setTransactionId(transactionId);
      setPaymentStatus({ status: 'success', transactionId, message: 'Payment successful!' });
      setTimeout(() => {
        setStep(4);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      setPaymentStatus({ status: 'failed', message: 'Mobile banking payment failed. Please try again.' });
      setIsProcessing(false);
    }
  };

  const handleNetBankingPayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transactionId = `NB_${Date.now()}`;
      setTransactionId(transactionId);
      setPaymentStatus({ status: 'success', transactionId, message: 'Payment successful!' });
      setTimeout(() => {
        setStep(4);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      setPaymentStatus({ status: 'failed', message: 'Net banking payment failed. Please try again.' });
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedPayment) return;

    setPaymentStatus(null);

    switch (selectedPayment) {
      case 'sslcommerz':
        await initiateSSLCOMMERZPayment();
        break;
      case 'credit-card':
        await handleCardPayment();
        break;
      case 'mobile-banking':
        await handleMobileBankingPayment();
        break;
      case 'net-banking':
        await handleNetBankingPayment();
        break;
      default:
        break;
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20 px-6">
        <AnimatedSection>
        <div className="relative text-center max-w-lg">
          <div className="inline-block mb-8">
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl bg-teal-600">
              <CheckCircle2 className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-4 text-teal-600">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">Your room has been reserved successfully.</p>
          <p className="text-gray-700 mb-4">A confirmation email has been sent to <span className="font-semibold text-gray-800">{bookingData.email}</span></p>

          {transactionId && (
            <div className="bg-white rounded-2xl p-6 mb-8 shadow border border-gray-200">
              <p className="text-sm text-teal-600 mb-1">Transaction ID</p>
              <p className="font-mono font-bold text-gray-800 text-lg">{transactionId}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="group px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-emerald-800 dark:text-emerald-200 rounded-2xl font-bold hover:bg-white dark:hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
              <button onClick={() => {setStep(2); setTransactionId(''); setPaymentStatus(null);}} className="group px-8 py-4 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center gap-3 animate-gradient-shift" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}>
                Book Another Room
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
          </div>
        </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {step === 2 && selectedRoom && (
          <AnimatedSection>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative min-h-[500px] lg:min-h-0">
                  <img src={selectedRoom.image} alt={selectedRoom.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="inline-block px-4 py-2 rounded-xl text-white font-black shadow-xl mb-4 bg-teal-600">
                      {selectedRoom.type.replace('-', ' ')}
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2">{selectedRoom.title}</h3>
                    <p className="text-white/80 text-xl">৳{selectedRoom.price.toLocaleString()}/month</p>
                  </div>
                </div>

                <div className="p-10">
                  <button
                    onClick={() => setStep(2)}
                    className="mb-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Booking
                  </button>

                  <h2 className="text-xl font-black mb-8 text-teal-600">Select Payment Method</h2>

                  <div className="mb-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <h4 className="text-lg font-black text-gray-800 mb-4">Booking Summary</h4>
                    <div className="space-y-3 text-gray-600">
                      <div className="text-m flex justify-between">
                        <span>Room Type</span>
                        <span className="font-bold text-gray-800">{selectedRoom.title}</span>
                      </div>
                      <div className="text-m flex justify-between">
                        <span>Monthly Rent</span>
                        <span className="font-bold text-gray-800">৳{selectedRoom.price.toLocaleString()}</span>
                      </div>
                      <div className="text-m flex justify-between">
                        <span>Security Deposit</span>
                        <span className="font-bold text-gray-800">৳{Math.round(selectedRoom.price * 2).toLocaleString()}</span>
                      </div>
                      <div className="text-m border-t border-gray-300 pt-3 mt-3 flex justify-between">
                        <span className="font-black text-lg text-gray-800">Total to Pay</span>
                        <span className="font-black text-2xl text-gray-800">৳{Math.round(selectedRoom.price * 2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {paymentStatus?.status === 'failed' ? (
                    <div className="text-center py-6 mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-800 mb-2">Payment Failed</h3>
                      <p className="text-gray-600 mb-4">{paymentStatus.message}</p>
                      <button
                        onClick={() => setPaymentStatus(null)}
                        className="px-6 py-3 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                        style={{background: '#0d9488'}}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : paymentStatus?.status === 'canceled' ? (
                    <div className="text-center py-6 mb-6">
                      <h3 className="text-2xl font-black text-gray-800 mb-4">Payment Canceled</h3>
                      <p className="text-gray-600 mb-4">{paymentStatus.message}</p>
                      <button
                        onClick={() => setPaymentStatus(null)}
                        className="px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all bg-gray-100"
                      >
                        Go Back
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-8">
                        <button
                          onClick={() => handlePaymentSelect('sslcommerz')}
                          disabled={isProcessing}
                          className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            selectedPayment === 'sslcommerz'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300 bg-white'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-teal-600">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="text-lg font-black text-gray-800">SSLCOMMERZ</h4>
                            <p className="text-sm text-gray-600">Pay securely with SSLCOMMERZ gateway</p>
                          </div>
                          {selectedPayment === 'sslcommerz' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-teal-600">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                          )}
                        </button>

                        <button
                          onClick={() => handlePaymentSelect('credit-card')}
                          disabled={isProcessing}
                          className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            selectedPayment === 'credit-card'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300 bg-white'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-teal-600">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="text-lg font-black text-gray-800">Credit/Debit Card</h4>
                            <p className="text-sm text-gray-600">Visa, MasterCard, American Express</p>
                          </div>
                          {selectedPayment === 'credit-card' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-teal-600">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                          )}
                        </button>

                        <button
                          onClick={() => handlePaymentSelect('mobile-banking')}
                          disabled={isProcessing}
                          className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            selectedPayment === 'mobile-banking'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300 bg-white'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-teal-600">
                            <Smartphone className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="text-lg font-black text-gray-800">Mobile Banking</h4>
                            <p className="text-sm text-gray-600">bKash, Nagad, Rocket, Upay</p>
                          </div>
                          {selectedPayment === 'mobile-banking' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-teal-600">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                          )}
                        </button>

                        <button
                          onClick={() => handlePaymentSelect('net-banking')}
                          disabled={isProcessing}
                          className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            selectedPayment === 'net-banking'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300 bg-white'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-teal-600">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="text-lg font-black text-gray-800">Net Banking</h4>
                            <p className="text-sm text-gray-600">All major banks supported</p>
                          </div>
                          {selectedPayment === 'net-banking' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-teal-600">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={handlePaymentConfirm}
                        disabled={!selectedPayment || isProcessing}
                        className={`w-full py-5 rounded-2xl font-bold text-white text-lg shadow transition-all flex items-center justify-center gap-3 ${
                          selectedPayment && !isProcessing
                            ? 'hover:shadow-xl hover:scale-[1.02]'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        style={selectedPayment && !isProcessing ? {background: '#0d9488'} : {}}
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-6 h-6" />
                            Pay Now ৳{Math.round(selectedRoom.price * 2).toLocaleString()}
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          </AnimatedSection>
        )}

        {step === 1 && (
          <AnimatedSection>
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-200">
              <h2 className="text-3xl font-black mb-8 text-teal-600">Booking Information</h2>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleConfirmBooking(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                        <label className="block text-sm font-bold text-teal-600 mb-3">Check-in Date</label>
                        <input
                          type="date"
                          className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 ${formErrors.checkIn ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'}`}
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                          required
                        />
                        {formErrors.checkIn && <p className="text-red-500 text-sm mt-1">{formErrors.checkIn}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-teal-600 mb-3">Check-out Date</label>
                        <input
                          type="date"
                          className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 ${formErrors.checkOut ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'}`}
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                          required
                        />
                        {formErrors.checkOut && <p className="text-red-500 text-sm mt-1">{formErrors.checkOut}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-teal-600 mb-3">Number of Guests</label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                        <label className="block text-sm font-bold text-teal-600 mb-3">Your Name</label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 placeholder:text-gray-400 ${formErrors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'}`}
                          value={bookingData.name}
                          onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                          required
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 placeholder:text-gray-400 ${formErrors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'}`}
                          value={bookingData.email}
                          onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                          required
                        />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-teal-600 mb-3">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 placeholder:text-gray-400 ${formErrors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'}`}
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      required
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-teal-600 mb-3">Special Requests (Optional)</label>
                      <textarea
                        placeholder="Any special requirements or preferences..."
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400 resize-none h-36"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
                      style={{background: '#0d9488'}}
                    >
                      Continue to Payment
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
            </div>
          </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}