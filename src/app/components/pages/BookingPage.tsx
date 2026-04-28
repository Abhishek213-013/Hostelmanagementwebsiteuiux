import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, X, CreditCard, Smartphone, Building2 } from 'lucide-react';
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
    const paymentStatus = urlParams.get('status');
    const tranId = urlParams.get('tran_id');

    if (paymentStatus && tranId) {
      if (paymentStatus === 'success') {
        setPaymentStatus({ status: 'success', transactionId: tranId, message: 'Payment successful!' });
        setTransactionId(tranId);
        setStep(4);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatus === 'failed') {
        setPaymentStatus({ status: 'failed', message: 'Payment failed. Please try again.' });
        setStep(3);
      } else if (paymentStatus === 'canceled') {
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
          <p className="text-slate-500 dark:text-slate-400 mb-4">A confirmation email has been sent to <span className="font-semibold text-slate-700 dark:text-slate-300">{bookingData.email}</span></p>

          {transactionId && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-emerald-200 dark:border-emerald-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Transaction ID</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white text-lg">{transactionId}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="group px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-800 dark:text-white rounded-2xl font-bold hover:bg-white dark:hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
              <button onClick={() => {setStep(2); setTransactionId(''); setPaymentStatus(null);}} className="group px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
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
                  <button
                    onClick={() => setStep(2)}
                    className="mb-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Booking
                  </button>

                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Select Payment Method</h2>

                  <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600">
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
                        <span className="font-black text-lg text-slate-900 dark:text-white">Total to Pay</span>
                        <span className="font-black text-2xl text-slate-900 dark:text-white">৳{Math.round(selectedRoom.price * 2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {paymentStatus?.status === 'failed' ? (
                    <div className="text-center py-6 mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Payment Failed</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">{paymentStatus.message}</p>
                      <button
                        onClick={() => setPaymentStatus(null)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : paymentStatus?.status === 'canceled' ? (
                    <div className="text-center py-6 mb-6">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Payment Canceled</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">{paymentStatus.message}</p>
                      <button
                        onClick={() => setPaymentStatus(null)}
                        className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
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
                              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-slate-900 dark:text-white">SSLCOMMERZ</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Pay securely with SSLCOMMERZ gateway</p>
                          </div>
                          {selectedPayment === 'sslcommerz' && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
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
                              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-slate-900 dark:text-white">Credit/Debit Card</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Visa, MasterCard, American Express</p>
                          </div>
                          {selectedPayment === 'credit-card' && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
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
                              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-slate-900 dark:text-white">Mobile Banking</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">bKash, Nagad, Rocket, Upay</p>
                          </div>
                          {selectedPayment === 'mobile-banking' && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
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
                              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700/50'
                          } disabled:opacity-50`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-black text-slate-900 dark:text-white">Net Banking</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">All major banks supported</p>
                          </div>
                          {selectedPayment === 'net-banking' && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
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
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-2xl hover:scale-[1.02]'
                            : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                        }`}
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
        )}
      </div>
    </div>
  );
}