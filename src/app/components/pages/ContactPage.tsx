import { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Send, Clock, Facebook, Instagram, Twitter, Youtube, MessageCircle, Headphones, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';
import { cardGradients, LOGO_PRIMARY, LOGO_SECONDARY, LOGO_TERTIARY } from '../../constants';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Akhalia Road', 'Sylhet 3100, Bangladesh'],
      grad: cardGradients[0]
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+880 1711-123456', '+880 1811-654321'],
      grad: cardGradients[1]
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@sylhetstay.com', 'booking@sylhetstay.com'],
      grad: cardGradients[3]
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Mon - Sat: 9AM - 8PM', 'Sun: 10AM - 4PM'],
      grad: cardGradients[4]
    }
  ];

  const quickLinks = [
    { icon: Calendar, label: 'Schedule a Tour', href: '/booking', grad: cardGradients[1] },
    { icon: MessageCircle, label: 'Live Chat', href: '#', grad: cardGradients[0] },
    { icon: Headphones, label: 'FAQs', href: '#', grad: cardGradients[3] },
    { icon: Building2, label: 'Book a Room', href: '/booking', grad: cardGradients[4] }
  ];

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

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
        {/* Header */}
        <AnimatedSection>
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-emerald-900/90 backdrop-blur-xl rounded-full shadow-xl shadow-emerald-500/20 border border-emerald-300/50 dark:border-emerald-600/50 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 group mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-ping-slow"></div>
              <div className="relative p-2 rounded-xl" style={{background: cardGradients[0]}}>
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent uppercase">Contact Us</span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent animate-gradient-x">Get In</span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent animate-gradient-x" style={{animationDelay: '0.5s'}}>Touch</span>
            <br />
            <span className="text-4xl lg:text-5xl text-emerald-700 dark:text-emerald-300 font-light">With Us</span>
          </h1>
          <p className="text-xl text-emerald-700 dark:text-emerald-300">We'd love to hear from you. Send us a message!</p>
        </div>
        </AnimatedSection>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, i) => (
            <AnimatedSection key={i} delay={i * 100}>
            <div
              className="group relative"
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: info.grad}}></div>
               <div className={`relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 transition-all duration-700 ${hoveredCard === i ? 'shadow-2xl -translate-y-3' : ''}`}>
                 <div className="relative w-16 h-16 mb-6">
                   <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse" style={{background: info.grad}}></div>
                   <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all" style={{background: info.grad}}>
                     <info.icon className="w-8 h-8 text-white drop-shadow-lg" />
                   </div>
                 </div>
                 <h3 className="text-xl font-black mb-4" style={{background: info.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{info.title}</h3>
                 {info.details.map((detail, j) => (
                   <p key={j} className="text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">{detail}</p>
                 ))}
              </div>
            </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Contact Form */}
            <AnimatedSection>
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border-2 border-emerald-200/50 dark:border-emerald-700/50">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
                    <div className="relative w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-2xl" style={{background: cardGradients[0]}}>
                      <CheckCircle2 className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black mb-4" style={{background: cardGradients[0], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Message Sent!</h2>
                  <p className="text-emerald-700 dark:text-emerald-300 mb-8 text-lg">Thank you for reaching out. We'll get back to you soon.</p>
                 <button
                   onClick={() => setSubmitted(false)}
                   className="group px-8 py-4 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center gap-3 mx-auto animate-gradient-shift"
                   style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}
                 >
                  <span className="relative z-10">Send Another Message</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                       <label className="block text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">Your Name</label>
                       <input
                         type="text"
                         placeholder="Enter your name"
                         className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800 dark:to-teal-800 border-2 border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-semibold text-emerald-800 dark:text-emerald-200 placeholder:text-emerald-400 hover:scale-105"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-3">Email Address</label>
                       <input
                         type="email"
                         placeholder="Enter your email"
                         className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-800 dark:to-orange-800 border-2 border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-semibold text-amber-800 dark:text-amber-200 placeholder:text-amber-400 hover:scale-105"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         required
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">Phone Number</label>
                       <input
                         type="tel"
                         placeholder="Enter your phone number"
                         className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-800 dark:to-blue-800 border-2 border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all font-semibold text-cyan-800 dark:text-cyan-200 placeholder:text-cyan-400 hover:scale-105"
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">Subject</label>
                       <select
                         className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800 dark:to-teal-800 border-2 border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-semibold text-emerald-800 dark:text-emerald-200 hover:scale-105"
                         value={formData.subject}
                         onChange={(e) => setFormData({...formData, subject: e.target.value})}
                         required
                       >
                        <option value="">Select a subject</option>
                        <option value="booking">Room Booking</option>
                        <option value="inquiry">General Inquiry</option>
                        <option value="complaint">Complaint</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">Your Message</label>
                     <textarea
                       placeholder="Type your message here..."
                       className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-800 dark:to-cyan-800 border-2 border-teal-300 dark:border-teal-600 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-teal-800 dark:text-teal-200 placeholder:text-teal-400 resize-none h-36 hover:scale-105"
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       required
                     />
                   </div>

                   <button
                     type="submit"
                     className="w-full group py-5 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg animate-gradient-shift"
                     style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}
                   >
                    <span className="relative z-10 flex items-center gap-3"><Send className="w-6 h-6" />
                    Send Message
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>
              </>
            )}
            </div>
            </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             {/* Quick Actions */}
             <AnimatedSection delay={100}>
             <div className="relative group">
               <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
               <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-emerald-200/50 dark:border-emerald-700/50">
                 <h2 className="text-2xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Quick Actions</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {quickLinks.map((link, i) => (
                     <Link
                       key={i}
                       to={link.href}
                       className="group flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:scale-105"
                     >
                       <div className="p-2 rounded-xl group-hover:scale-110 transition-transform" style={{background: link.grad}}>
                         <link.icon className="w-5 h-5 text-white drop-shadow-lg" />
                       </div>
                       <span className="font-semibold text-emerald-800 dark:text-emerald-200">{link.label}</span>
                     </Link>
                   ))}
                 </div>
               </div>
             </div>
             </AnimatedSection>

            {/* Social Media */}
            <AnimatedSection delay={200}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-shift rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-4">Follow Us</h2>
                  <p className="mb-6 text-white/90">Stay connected with us on social media for updates and news.</p>
                  <div className="flex gap-4">
                    {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                      <a key={i} href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                        <Icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </AnimatedSection>

             {/* Emergency Contact */}
             <AnimatedSection delay={300}>
             <div className="relative group">
               <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: cardGradients[1]}}></div>
               <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border-2 border-emerald-200/50 dark:border-emerald-700/50">
                 <h2 className="text-xl font-black mb-4" style={{background: cardGradients[1], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Emergency Contact</h2>
                 <p className="text-emerald-700 dark:text-emerald-300 mb-4">For urgent matters outside office hours, call our emergency line:</p>
                 <a href="tel:+8801711123456" className="group text-2xl font-black flex items-center gap-2" style={{background: cardGradients[1], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                   +880 1711-123456
                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </a>
               </div>
             </div>
             </AnimatedSection>
          </div>
        </div>

        {/* Map */}
        <AnimatedSection>
        <div className="relative group">
          <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-200/50 dark:border-emerald-700/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.727256099589!2d92.01732531540178!3d24.89774928036656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751f2d53c30e91%3A0x3b85a6b1e8e7e8a8!2sSylhet%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
              width="100%"
              height="400"
              style={{border: 0}}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        </AnimatedSection>
      </div>
  );
}