import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, X, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';
import { cardGradients, LOGO_PRIMARY, LOGO_SECONDARY, LOGO_TERTIARY } from '../../constants';

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

interface PaymentResponse {
  status: 'success' | 'failed' | 'canceled';
  transactionId?: string;
  message?: string;
}

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
      <div className="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 animate-gradient-shift"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/40 to-teal-400/40 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-amber-400/40 to-orange-400/40 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <AnimatedSection>
        <div className="relative text-center max-w-lg">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
            <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl" style={{background: cardGradients[0]}}>
              <CheckCircle2 className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Booking Confirmed!</h1>
          <p className="text-xl text-emerald-700 dark:text-emerald-300 mb-2">Your room has been reserved successfully.</p>
          <p className="text-emerald-600 dark:text-emerald-400 mb-4">A confirmation email has been sent to <span className="font-semibold text-emerald-800 dark:text-emerald-200">{bookingData.email}</span></p>

          {transactionId && (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl p-6 mb-8 border-2 border-emerald-200/50 dark:border-emerald-700/50">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Transaction ID</p>
              <p className="font-mono font-bold text-emerald-800 dark:text-emerald-200 text-lg">{transactionId}</p>
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
    <div className="min-h-screen relative pt-28 pb-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
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

      <div className="relative max-w-6xl mx-auto">
        {step === 2 && selectedRoom && (
          <AnimatedSection>
          <div className="relative group">
            <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: selectedRoom.grad}}></div>
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-200/50 dark:border-emerald-700/50">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative min-h-[500px] lg:min-h-0">
                  <img src={selectedRoom.image} alt={selectedRoom.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="inline-block px-4 py-2 rounded-xl text-white font-black shadow-xl mb-4" style={{background: selectedRoom.grad}}>
                      {selectedRoom.type.replace('-', ' ')}
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2">{selectedRoom.title}</h3>
                    <p className="text-white/80 text-xl">৳{selectedRoom.price.toLocaleString()}/month</p>
                  </div>
                </div>

                <div className="p-10">
                  <button
                    onClick={() => setStep(2)}
                    className="mb-6 text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Booking
                  </button>

                  <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Select Payment Method</h2>

                  <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700">
                    <h4 className="font-black text-emerald-800 dark:text-emerald-200 mb-4">Booking Summary</h4>
                    <div className="space-y-3 text-emerald-700 dark:text-emerald-300">
                      <div className="flex justify-between">
                        <span>Room Type</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-200">{selectedRoom.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Rent</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-200">৳{selectedRoom.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security Deposit</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-200">৳{Math.round(selectedRoom.price * 2).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-emerald-300 dark:border-emerald-700 pt-3 mt-3 flex justify-between">
                        <span className="font-black text-lg text-emerald-800 dark:text-emerald-200">Total to Pay</span>
                        <span className="font-black text-2xl text-emerald-800 dark:text-emerald-200">৳{Math.round(selectedRoom.price * 2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {paymentStatus?.status === 'failed' ? (
                    <div className="text-center py-6 mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mb-2">Payment Failed</h3>
                      <p className="text-emerald-700 dark:text-emerald-300 mb-4">{paymentStatus.message}</p>
                      <button
                        onClick={() => setPaymentStatus(null)}
                        className="px-6 py-3 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all animate-gradient-shift"
                        style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : paymentStatus?.status === 'canceled' ? (
                    <div className="text-center py-6 mb-6">
                      <h3 className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mb-4">Payment Canceled</h3>
                      <p className="text-emerald-700 dark:text-emerald-300 mb-4">{paymentStatus.message}</p>
                      <button
                        onClick={() => setPaymentStatus(null)}
                        className="px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                        style={{background: cardGradients[3]}}
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
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{background: cardGradients[2]}}>
                            <CreditCard className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-emerald-800 dark:text-emerald-200">SSLCOMMERZ</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">Pay securely with SSLCOMMERZ gateway</p>
                          </div>
                          {selectedPayment === 'sslcommerz' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: cardGradients[0]}}>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => handlePaymentSelect('credit-card')}
                          disabled={isProcessing}
                          className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            selectedPayment === 'credit-card'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{background: cardGradients[3]}}>
                            <CreditCard className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-emerald-800 dark:text-emerald-200">Credit/Debit Card</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">Visa, MasterCard, American Express</p>
                          </div>
                          {selectedPayment === 'credit-card' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: cardGradients[0]}}>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => handlePaymentSelect('mobile-banking')}
                          disabled={isProcessing}
                          className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            selectedPayment === 'mobile-banking'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{background: cardGradients[1]}}>
                            <Smartphone className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-emerald-800 dark:text-emerald-200">Mobile Banking</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">bKash, Nagad, Rocket, Upay</p>
                          </div>
                          {selectedPayment === 'mobile-banking' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: cardGradients[0]}}>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => handlePaymentSelect('net-banking')}
                          disabled={isProcessing}
                          className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            selectedPayment === 'net-banking'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{background: cardGradients[4]}}>
                            <Building2 className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-emerald-800 dark:text-emerald-200">Net Banking</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">All major banks supported</p>
                          </div>
                          {selectedPayment === 'net-banking' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: cardGradients[0]}}>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={handlePaymentConfirm}
                        disabled={!selectedPayment || isProcessing}
                        className={`w-full py-5 rounded-2xl font-bold text-white text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                          selectedPayment && !isProcessing
                            ? 'hover:shadow-2xl hover:scale-[1.02] animate-gradient-shift'
                            : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                        }`}
                        style={selectedPayment && !isProcessing ? {background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`} : {}}
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

        {step === 3 && (
          <AnimatedSection>
          <div className="relative max-w-2xl mx-auto">
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border-2 border-emerald-200/50 dark:border-emerald-700/50">
              <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Booking Information</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">Check-in Date</label>
                    <input
                      type="date"
                      className={`w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800 dark:to-teal-800 border-2 focus:outline-none focus:ring-4 transition-all font-semibold text-emerald-800 dark:text-emerald-200 hover:scale-105 ${formErrors.checkIn ? 'border-red-500' : 'border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20'}`}
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                      required
                    />
                    {formErrors.checkIn && <p className="text-red-500 text-sm mt-1">{formErrors.checkIn}</p>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-3">Check-out Date</label>
                    <input
                      type="date"
                      className={`w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-800 dark:to-orange-800 border-2 focus:outline-none focus:ring-4 transition-all font-semibold text-amber-800 dark:text-amber-200 hover:scale-105 ${formErrors.checkOut ? 'border-red-500' : 'border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20'}`}
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                      required
                    />
                    {formErrors.checkOut && <p className="text-red-500 text-sm mt-1">{formErrors.checkOut}</p>}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">Number of Guests</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-800 dark:to-blue-800 border-2 border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all font-semibold text-cyan-800 dark:text-cyan-200 hover:scale-105"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 People</option>
                    <option value={3}>3 People</option>
                    <option value={4}>4 People</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800 dark:to-teal-800 border-2 focus:outline-none focus:ring-4 transition-all font-semibold text-emerald-800 dark:text-emerald-200 placeholder:text-emerald-400 hover:scale-105 ${formErrors.name ? 'border-red-500' : 'border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20'}`}
                    value={bookingData.name}
                    onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                    required
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-3">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-800 dark:to-orange-800 border-2 focus:outline-none focus:ring-4 transition-all font-semibold text-amber-800 dark:text-amber-200 placeholder:text-amber-400 hover:scale-105 ${formErrors.email ? 'border-red-500' : 'border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20'}`}
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      required
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className={`w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-800 dark:to-blue-800 border-2 focus:outline-none focus:ring-4 transition-all font-semibold text-cyan-800 dark:text-cyan-200 placeholder:text-cyan-400 hover:scale-105 ${formErrors.phone ? 'border-red-500' : 'border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20'}`}
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      required
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">Special Requests (Optional)</label>
                  <textarea
                    placeholder="Any special requirements or requests..."
                    className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-800 dark:to-cyan-800 border-2 border-teal-300 dark:border-teal-600 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-teal-800 dark:text-teal-200 placeholder:text-teal-400 resize-none h-32 hover:scale-105"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-emerald-800 dark:text-emerald-200 rounded-2xl font-bold border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="flex-1 group py-4 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center gap-3 animate-gradient-shift"
                    style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
