// import { useState } from 'react';
// import { Building2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, ArrowRight, Facebook, Instagram, Twitter, ChevronRight, Sparkles } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { AnimatedSection } from '../ui/AnimatedSection';

// export function LoginPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     fullName: '',
//     phone: '',
//     agreeTerms: false
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20 px-6">
//       <div className="w-full max-w-6xl">
//         <Link to="/" className="group flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 mb-8 font-medium transition-colors">
//           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//           Back to Home
//         </Link>

//         <AnimatedSection>
//         <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
//           {/* Left Side - Image */}
//           <div className="md:w-1/2 bg-gradient-to-br from-teal-500 to-emerald-600 p-12 flex items-center justify-center relative overflow-hidden">
//             <div className="absolute inset-0 bg-black/20"></div>
//             <div className="relative z-10 text-center text-white">
//               <Building2 className="w-24 h-24 mx-auto mb-6 text-white/90" />
//               <h2 className="text-4xl font-black mb-4">SylhetStay</h2>
//               <p className="text-xl text-white/80">Find your perfect student accommodation</p>
//               <div className="mt-8 space-y-4">
//                 <div className="flex items-center gap-3 justify-center">
//                   <Sparkles className="w-5 h-5" />
//                   <span className="text-lg">Premium student housing</span>
//                 </div>
//                 <div className="flex items-center gap-3 justify-center">
//                   <Sparkles className="w-5 h-5" />
//                   <span className="text-lg">Verified properties</span>
//                 </div>
//                 <div className="flex items-center gap-3 justify-center">
//                   <Sparkles className="w-5 h-5" />
//                   <span className="text-lg">Hassle-free booking</span>
//                 </div>
//               </div>
//             </div>
//             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full"></div>
//             <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full"></div>
//           </div>

//           {/* Right Side - Form */}
//           <div className="md:w-1/2 p-8 md:p-10">
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-2xl shadow bg-teal-600">
//                   <Building2 className="w-7 h-7 text-white" />
//                 </div>
//                 <span className="text-3xl font-black text-teal-600">SylhetStay</span>
//               </div>
//               <h1 className="text-4xl font-black mb-2 text-teal-600">
//                 {isLogin ? 'Welcome Back!' : 'Create Account'}
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 {isLogin ? 'Sign in to continue to your account' : 'Join our student community today'}
//               </p>
//             </div>

//               {/* Toggle Buttons */}
//               <div className="flex gap-3 mb-8">
//                 <button
//                   onClick={() => setIsLogin(true)}
//                   className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-500 ${
//                     isLogin
//                       ? 'text-white shadow-lg scale-105'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                   style={isLogin ? {background: '#0d9488'} : {}}
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   onClick={() => setIsLogin(false)}
//                   className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-500 ${
//                     !isLogin
//                       ? 'text-white shadow-lg scale-105'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                   style={!isLogin ? {background: '#0d9488'} : {}}
//                 >
//                   Sign Up
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {!isLogin && (
//                   <div className="group">
//                     <label className="block text-sm font-bold text-teal-600 mb-3">Full Name</label>
//                     <div className="relative">
//                       <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
//                       <input
//                         type="text"
//                         placeholder="Enter your full name"
//                         className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                         value={formData.fullName}
//                         onChange={(e) => setFormData({...formData, fullName: e.target.value})}
//                         required={!isLogin}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div className="group">
//                   <label className="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
//                   <div className="relative">
//                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
//                     <input
//                       type="email"
//                       placeholder="Enter your email"
//                       className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                       value={formData.email}
//                       onChange={(e) => setFormData({...formData, email: e.target.value})}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {!isLogin && (
//                   <div className="group">
//                     <label className="block text-sm font-bold text-teal-600 mb-3">Phone Number</label>
//                     <div className="relative">
//                       <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
//                       <input
//                         type="tel"
//                         placeholder="Enter your phone number"
//                         className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                         value={formData.phone}
//                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                         required={!isLogin}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div className="group">
//                   <label className="block text-sm font-bold text-teal-600 mb-3">Password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Enter your password"
//                       className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                       value={formData.password}
//                       onChange={(e) => setFormData({...formData, password: e.target.value})}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors"
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {!isLogin && (
//                   <div className="group">
//                     <label className="block text-sm font-bold text-teal-600 mb-3">Confirm Password</label>
//                     <div className="relative">
//                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="Confirm your password"
//                         className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                         value={formData.confirmPassword}
//                         onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//                         required={!isLogin}
//                       />
//                     </div>
//                   </div>
//                 )}

//               {isLogin && (
//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center gap-3 cursor-pointer group">
//                     <input type="checkbox" className="w-5 h-5 rounded border-emerald-300 dark:border-emerald-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" />
//                     <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium group-hover:text-emerald-500 dark:group-hover:text-emerald-200 transition-colors">Remember me</span>
//                   </label>
//                   <a href="#" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Forgot password?</a>
//                 </div>
//               )}

//               {!isLogin && (
//                 <label className="flex items-start gap-3 cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     className="w-5 h-5 mt-0.5 rounded border-emerald-300 dark:border-emerald-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
//                     checked={formData.agreeTerms}
//                     onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
//                     required={!isLogin}
//                   />
//                   <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
//                     I agree to the <a href="#" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Privacy Policy</a>
//                   </span>
//                 </label>
//               )}

//                 <button
//                   type="submit"
//                   className="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
//                   style={{background: '#0d9488'}}
//                 >
//                   <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </button>
//               </form>

//               {/* Social Login */}
//               <div className="mt-8">
//                   <div className="relative flex py-2 items-center">
//                     <div className="flex-grow border-t-2 border-gray-200"></div>
//                     <span className="flex-shrink-0 mx-4 text-gray-500 font-bold">or continue with</span>
//                     <div className="flex-grow border-t-2 border-gray-200"></div>
//                   </div>

//                   <div className="flex gap-4 mt-4">
//                     <button className="flex-1 group py-4 rounded-2xl font-bold bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-gray-200">
//                       <svg className="w-5 h-5" viewBox="0 0 24 24">
//                         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                       </svg>
//                       Google
//                     </button>
//                     <button className="flex-1 group py-4 rounded-2xl font-bold bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-gray-200">
//                       <Facebook className="w-5 h-5" />
//                       Facebook
//                     </button>
//                   </div>
//               </div>

//                 <p className="mt-8 text-center text-gray-600 font-medium">
//                   {isLogin ? "Don't have an account? " : "Already have an account? "}
//                   <button
//                     onClick={() => setIsLogin(!isLogin)}
//                     className="group text-teal-600 font-bold hover:underline inline-flex items-center gap-1"
//                   >
//                     {isLogin ? 'Sign Up' : 'Sign In'}
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </p>
//                </div>
//            </div>
//          </AnimatedSection>
//        </div>
//      </div>
//    );
//  }
