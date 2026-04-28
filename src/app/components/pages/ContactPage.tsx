import { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Send, Clock, Facebook, Instagram, Twitter, Youtube, MessageCircle, Headphones, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+880 1711-123456', '+880 1811-654321'],
      gradient: 'from-sky-500 to-blue-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@sylhetstay.com', 'booking@sylhetstay.com'],
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Mon - Sat: 9AM - 8PM', 'Sun: 10AM - 4PM'],
      gradient: 'from-orange-500 to-amber-600'
    }
  ];

  const quickLinks = [
    { icon: Calendar, label: 'Schedule a Tour', href: '/booking', gradient: 'from-sky-500 to-blue-600' },
    { icon: MessageCircle, label: 'Live Chat', href: '#', gradient: 'from-emerald-500 to-teal-600' },
    { icon: Headphones, label: 'FAQs', href: '#', gradient: 'from-violet-500 to-purple-600' },
    { icon: Building2, label: 'Book a Room', href: '/booking', gradient: 'from-orange-500 to-amber-600' }
  ];

  return (
    <div className="min-h-screen relative pt-28 pb-20 overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-blue-200/20 dark:from-sky-900/20 dark:to-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass dark:glass-dark rounded-full shadow-lg mb-8">
            <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-xl">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-wider text-foreground uppercase">Contact Us</span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-foreground mb-6 leading-[1.1]">
            Get In
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
              Touch
            </span>
            <br />
            <span className="text-4xl lg:text-5xl text-muted-foreground font-light">With Us</span>
          </h1>
          <p className="text-xl text-muted-foreground">We'd love to hear from you. Send us a message!</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, i) => (
            <div
              key={i}
              className="group relative"
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${info.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-2xl`}></div>
               <div className={`relative glass dark:glass-dark rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 ${hoveredCard === i ? 'shadow-2xl -translate-y-3' : ''}`}>
                 <div className={`w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                   <info.icon className="w-8 h-8 text-white" />
                 </div>
                 <h3 className="text-xl font-black text-foreground mb-4">{info.title}</h3>
                 {info.details.map((detail, j) => (
                   <p key={j} className="text-muted-foreground font-medium leading-relaxed">{detail}</p>
                 ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/80 opacity-5 dark:opacity-20 rounded-3xl blur-2xl"></div>
              <div className="relative glass dark:glass-dark rounded-3xl shadow-2xl p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-foreground mb-4">Message Sent!</h2>
                  <p className="text-muted-foreground mb-8 text-lg">Thank you for reaching out. We'll get back to you soon.</p>
                 <button
                   onClick={() => setSubmitted(false)}
                   className="group px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                 >
                  Send Another Message
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-foreground mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                       <label className="block text-sm font-bold text-foreground mb-3">Your Name</label>
                       <input
                         type="text"
                         placeholder="Enter your name"
                         className="w-full px-5 py-4 rounded-2xl bg-input-background border-2 border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-semibold text-foreground placeholder:text-muted-foreground"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-foreground mb-3">Email Address</label>
                       <input
                         type="email"
                         placeholder="Enter your email"
                         className="w-full px-5 py-4 rounded-2xl bg-input-background border-2 border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-semibold text-foreground placeholder:text-muted-foreground"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         required
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold text-foreground mb-3">Phone Number</label>
                       <input
                         type="tel"
                         placeholder="Enter your phone number"
                         className="w-full px-5 py-4 rounded-2xl bg-input-background border-2 border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-semibold text-foreground placeholder:text-muted-foreground"
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-foreground mb-3">Subject</label>
                       <select
                         className="w-full px-5 py-4 rounded-2xl bg-input-background border-2 border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-semibold text-foreground"
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
                     <label className="block text-sm font-bold text-foreground mb-3">Your Message</label>
                     <textarea
                       placeholder="Type your message here..."
                       className="w-full px-5 py-4 rounded-2xl bg-input-background border-2 border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-semibold text-foreground placeholder:text-muted-foreground resize-none h-36"
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       required
                     />
                   </div>

                   <button
                     type="submit"
                     className="w-full group py-5 rounded-2xl font-bold text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg bg-gradient-to-r from-primary to-primary/80"
                   >
                    <Send className="w-6 h-6" />
                    Send Message
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </>
            )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             {/* Quick Actions */}
             <div className="relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/80 opacity-5 dark:opacity-20 rounded-3xl blur-2xl"></div>
               <div className="relative glass dark:glass-dark rounded-3xl shadow-2xl p-8">
                 <h2 className="text-2xl font-black text-foreground mb-6">Quick Actions</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {quickLinks.map((link, i) => (
                     <Link
                       key={i}
                       to={link.href}
                       className="group flex items-center gap-3 p-4 bg-input-background rounded-2xl hover:bg-background hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                     >
                       <div className={`p-2 rounded-xl bg-gradient-to-r ${link.gradient} group-hover:scale-110 transition-transform`}>
                         <link.icon className="w-5 h-5 text-white" />
                       </div>
                       <span className="font-semibold text-foreground">{link.label}</span>
                     </Link>
                   ))}
                 </div>
               </div>
             </div>

            {/* Social Media */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-4">Follow Us</h2>
                  <p className="mb-6 text-white/80">Stay connected with us on social media for updates and news.</p>
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

             {/* Emergency Contact */}
             <div className="relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-600 opacity-5 dark:opacity-20 rounded-3xl blur-2xl"></div>
               <div className="relative glass dark:glass-dark rounded-3xl shadow-xl p-8">
                 <h2 className="text-xl font-black text-foreground mb-4">Emergency Contact</h2>
                 <p className="text-muted-foreground mb-4">For urgent matters outside office hours, call our emergency line:</p>
                 <a href="tel:+8801711123456" className="group text-2xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent hover:from-sky-600 hover:to-blue-600 transition-all flex items-center gap-2">
                   +880 1711-123456
                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </a>
               </div>
             </div>
          </div>
        </div>

        {/* Map */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/80 opacity-5 dark:opacity-20 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-2xl"></div>
          <div className="relative glass dark:glass-dark rounded-3xl shadow-2xl overflow-hidden">
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
      </div>
    </div>
  );
}