import { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, ArrowRight, Facebook, Instagram, Twitter, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    agreeTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDafault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sky-200/30 to-blue-200/30 dark:from-sky-800/20 dark:to-blue-800/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-800/20 dark:to-teal-800/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-sky-100/20 via-blue-100/10 to-emerald-100/20 dark:from-sky-900/20 dark:via-blue-900/10 dark:to-emerald-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-8 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-700 opacity-5 dark:opacity-10 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50 dark:border-slate-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-2xl blur-md opacity-50 animate-pulse"></div>
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">SylhetStay</span>
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                {isLogin ? 'Sign in to continue to your account' : 'Join our student community today'}
              </p>
            </div>

            {/* Toggle Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-500 ${
                    isLogin
                      ? 'text-white shadow-2xl scale-105 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
                      : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-500 ${
                    !isLogin
                      ? 'text-white shadow-2xl scale-105 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
                      : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pl-14 pr-14 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="w-full pl-14 pr-14 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700/50 transition-all font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-500 focus:ring-offset-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-bold text-slate-900 dark:text-white hover:underline">Forgot password?</a>
                </div>
              )}

              {!isLogin && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 rounded border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-500 focus:ring-offset-0"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                    required={!isLogin}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    I agree to the <a href="#" className="text-slate-900 dark:text-white font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-slate-900 dark:text-white font-bold hover:underline">Privacy Policy</a>
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full group py-5 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t-2 border-slate-200 dark:border-slate-700"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-500 dark:text-slate-400 font-bold">or continue with</span>
                  <div className="flex-grow border-t-2 border-slate-200 dark:border-slate-700"></div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button className="flex-1 group py-4 rounded-2xl font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button className="flex-1 group py-4 rounded-2xl font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500">
                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Facebook
                  </button>
                </div>
            </div>

              <p className="mt-8 text-center text-slate-600 dark:text-slate-300 font-medium">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="group text-slate-900 dark:text-white font-bold hover:underline inline-flex items-center gap-1"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}