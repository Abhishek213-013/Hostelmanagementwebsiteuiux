import { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, ArrowRight, Facebook, Instagram, Twitter, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';
import { cardGradients, LOGO_PRIMARY, LOGO_SECONDARY, LOGO_TERTIARY } from '../../constants';

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
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 animate-gradient-shift"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-bl from-emerald-400/40 via-teal-300/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-amber-400/40 via-orange-300/30 to-rose-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-300/30 via-teal-200/20 to-cyan-300/30 dark:from-emerald-800/30 dark:via-teal-800/20 dark:to-cyan-800/30 rounded-full blur-3xl animate-spin-slow"></div>
        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl animate-float shadow-lg shadow-emerald-400/50"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl animate-float-delayed shadow-lg shadow-amber-400/50"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl animate-float-slow shadow-lg shadow-cyan-400/50"></div>
        {/* Animated Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${['#059669', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]}, ${['#10b981', '#0891b2', '#fbbf24', '#f87171', '#a78bfa'][i % 5]})`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="group flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <AnimatedSection>
        <div className="relative group">
          <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-emerald-200/50 dark:border-emerald-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-md opacity-75 animate-pulse animate-ping-slow"></div>
                  <div className="relative p-3 rounded-2xl shadow-xl" style={{background: cardGradients[0]}}>
                    <Building2 className="w-7 h-7 text-white drop-shadow-lg" />
                  </div>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">SylhetStay</span>
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
              </div>
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-emerald-700 dark:text-emerald-300 text-lg">
                {isLogin ? 'Sign in to continue to your account' : 'Join our student community today'}
              </p>
            </div>

            {/* Toggle Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-500 ${
                    isLogin
                      ? 'text-white shadow-2xl scale-105 animate-gradient-shift'
                      : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                  style={isLogin ? {background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`} : {}}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-500 ${
                    !isLogin
                      ? 'text-white shadow-2xl scale-105 animate-gradient-shift'
                      : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                  style={!isLogin ? {background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`} : {}}
                >
                  Sign Up
                </button>
              </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800/50 dark:to-teal-800/50 border-2 border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-semibold text-emerald-800 dark:text-emerald-200 placeholder:text-emerald-400 hover:scale-105"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-800/50 dark:to-blue-800/50 border-2 border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all font-semibold text-cyan-800 dark:text-cyan-200 placeholder:text-cyan-400 hover:scale-105"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-3">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400 transition-colors" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-800/50 dark:to-orange-800/50 border-2 border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-semibold text-amber-800 dark:text-amber-200 placeholder:text-amber-400 hover:scale-105"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-800/50 dark:to-cyan-800/50 border-2 border-teal-300 dark:border-teal-600 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-teal-800 dark:text-teal-200 placeholder:text-teal-400 hover:scale-105"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800/50 dark:to-teal-800/50 border-2 border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-semibold text-emerald-800 dark:text-emerald-200 placeholder:text-emerald-400 hover:scale-105"
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
                    <input type="checkbox" className="w-5 h-5 rounded border-emerald-300 dark:border-emerald-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium group-hover:text-emerald-500 dark:group-hover:text-emerald-200 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Forgot password?</a>
                </div>
              )}

              {!isLogin && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 rounded border-emerald-300 dark:border-emerald-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                    required={!isLogin}
                  />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                    I agree to the <a href="#" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Privacy Policy</a>
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full group py-5 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg animate-gradient-shift"
                style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}
              >
                <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t-2 border-emerald-200 dark:border-emerald-700"></div>
                  <span className="flex-shrink-0 mx-4 text-emerald-500 dark:text-emerald-400 font-bold">or continue with</span>
                  <div className="flex-grow border-t-2 border-emerald-200 dark:border-emerald-700"></div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button className="flex-1 group py-4 rounded-2xl font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-emerald-200 dark:border-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-500">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button className="flex-1 group py-4 rounded-2xl font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-emerald-200 dark:border-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-500">
                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Facebook
                  </button>
                </div>
            </div>

              <p className="mt-8 text-center text-emerald-700 dark:text-emerald-300 font-medium">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="group text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </p>
          </div>
        </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
