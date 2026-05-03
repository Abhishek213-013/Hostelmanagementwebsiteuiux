// import { useState } from 'react';
// import { Building2, MapPin, Phone, Mail, Send, Clock, Facebook, Instagram, Twitter, Youtube, MessageCircle, Headphones, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { AnimatedSection } from '../ui/AnimatedSection';

// export function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   });
//   const [submitted, setSubmitted] = useState(false);
//   const [hoveredCard, setHoveredCard] = useState<number | null>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Contact form submitted:', formData);
//     setSubmitted(true);
//   };

//   const contactInfo = [
//     {
//       icon: MapPin,
//       title: 'Visit Us',
//       details: ['123 Akhalia Road', 'Sylhet 3100, Bangladesh'],
//     },
//     {
//       icon: Phone,
//       title: 'Call Us',
//       details: ['+880 1711-123456', '+880 1811-654321'],
//     },
//     {
//       icon: Mail,
//       title: 'Email Us',
//       details: ['info@sylhetstay.com', 'booking@sylhetstay.com'],
//     },
//     {
//       icon: Clock,
//       title: 'Office Hours',
//       details: ['Mon - Sat: 9AM - 8PM', 'Sun: 10AM - 4PM'],
//     }
//   ];

//   const quickLinks = [
//     { icon: Calendar, label: 'Schedule a Tour', href: '/booking' },
//     { icon: MessageCircle, label: 'Live Chat', href: '#' },
//     { icon: Headphones, label: 'FAQs', href: '#' },
//     { icon: Building2, label: 'Book a Room', href: '/booking' }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">

//         {/* Header */}
//         <AnimatedSection>
//         <div className="text-center mb-20">
//           <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
//             <div className="p-2 bg-teal-600 rounded-xl">
//               <MessageCircle className="w-4 h-4 text-white" />
//             </div>
//             <span className="text-sm font-bold tracking-wider text-teal-600 uppercase">Contact Us</span>
//           </div>

//           <h1 className="text-3xl lg:text-5xl font-black mb-6 leading-[1.1]">
//             <span className="block text-teal-600">Get In Touch</span>
//             <span className="text-4xl lg:text-5xl text-gray-700 font-light">With Us</span>
//           </h1>
//           <p className="text-lg text-gray-600">We'd love to hear from you. Send us a message!</p>
//         </div>
//         </AnimatedSection>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
//           {contactInfo.map((info, i) => (
//             <AnimatedSection key={i} delay={i * 100}>
//               <div
//                 className="bg-white rounded-2xl p-6 shadow border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
//                 onMouseEnter={() => setHoveredCard(i)}
//                 onMouseLeave={() => setHoveredCard(null)}
//               >
//                   <div className="w-10 h-10 mb-6 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
//                     <info.icon className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="text-xl font-black mb-4 text-teal-600">{info.title}</h3>
//                   {info.details.map((detail, j) => (
//                     <p key={j} className="text-gray-600 font-medium leading-relaxed">{detail}</p>
//                   ))}
//                </div>
//             </AnimatedSection>
//           ))}
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
//           {/* Contact Form */}
//             <AnimatedSection>
//             <div className="bg-white rounded-2xl shadow border border-gray-200 p-10">
//               {submitted ? (
//                 <div className="text-center py-12">
//                   <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-teal-600 flex items-center justify-center shadow-2xl">
//                     <CheckCircle2 className="w-12 h-12 text-white" />
//                   </div>
//                   <h2 className="text-3xl font-black mb-4 text-teal-600">Message Sent!</h2>
//                   <p className="text-gray-600 mb-8 text-lg">Thank you for reaching out. We'll get back to you soon.</p>
//                  <button
//                    onClick={() => setSubmitted(false)}
//                    className="px-8 py-4 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all mx-auto"
//                    style={{background: '#0d9488'}}
//                  >
//                   <span>Send Another Message</span>
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <h2 className="text-3xl font-black mb-8 text-teal-600">Send us a Message</h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                         <label className="block text-sm font-bold text-teal-600 mb-3">Your Name</label>
//                         <input
//                           type="text"
//                           placeholder="Enter your name"
//                           className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                           value={formData.name}
//                           onChange={(e) => setFormData({...formData, name: e.target.value})}
//                           required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
//                         <input
//                           type="email"
//                           placeholder="Enter your email"
//                           className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                           value={formData.email}
//                           onChange={(e) => setFormData({...formData, email: e.target.value})}
//                           required
//                         />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-bold text-teal-600 mb-3">Phone Number</label>
//                         <input
//                           type="tel"
//                           placeholder="Enter your phone number"
//                           className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400"
//                           value={formData.phone}
//                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                           required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold text-teal-600 mb-3">Subject</label>
//                         <select
//                           className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800"
//                           value={formData.subject}
//                           onChange={(e) => setFormData({...formData, subject: e.target.value})}
//                           required
//                         >
//                          <option value="">Select a subject</option>
//                          <option value="booking">Room Booking</option>
//                          <option value="inquiry">General Inquiry</option>
//                          <option value="complaint">Complaint</option>
//                          <option value="suggestion">Suggestion</option>
//                          <option value="other">Other</option>
//                        </select>
//                      </div>
//                    </div>

//                    <div>
//                       <label className="block text-sm font-bold text-teal-600 mb-3">Your Message</label>
//                       <textarea
//                         placeholder="Type your message here..."
//                         className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400 resize-none h-36"
//                         value={formData.message}
//                         onChange={(e) => setFormData({...formData, message: e.target.value})}
//                         required
//                       />
//                     </div>

//                     <button
//                       type="submit"
//                       className="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
//                       style={{background: '#0d9488'}}
//                     >
//                      <span className="flex items-center gap-3"><Send className="w-6 h-6" />
//                      Send Message
//                      <ChevronRight className="w-6 h-6" /></span>
//                    </button>
//                  </form>
//               </>
//             )}
//             </div>
//             </AnimatedSection>

//           {/* Sidebar */}
//           <div className="space-y-8">
//              {/* Quick Actions */}
//              <AnimatedSection delay={100}>
//              <div className="bg-white rounded-2xl shadow border border-gray-200 p-8">
//                  <h2 className="text-2xl font-black mb-6 text-teal-600">Quick Actions</h2>
//                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                    {quickLinks.map((link, i) => (
//                      <Link
//                        key={i}
//                        to={link.href}
//                        className="group flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:scale-105"
//                      >
//                        <div className="p-2 rounded-xl bg-teal-600 group-hover:scale-110 transition-transform">
//                          <link.icon className="w-5 h-5 text-white" />
//                        </div>
//                        <span className="font-semibold text-gray-800">{link.label}</span>
//                      </Link>
//                    ))}
//                  </div>
//                </div>
//              </AnimatedSection>

//             {/* Social Media */}
//             <AnimatedSection delay={200}>
//             <div className="bg-gray-900 rounded-2xl p-8 text-white">
//                 <h2 className="text-2xl font-black mb-4">Follow Us</h2>
//                 <p className="mb-6 text-white/90">Stay connected with us on social media for updates and news.</p>
//                 <div className="flex gap-4">
//                   {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
//                     <a key={i} href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
//                       <Icon className="w-6 h-6" />
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </AnimatedSection>

//              {/* Emergency Contact */}
//              <AnimatedSection delay={300}>
//              <div className="bg-white rounded-2xl shadow border border-gray-200 p-8">
//                  <h2 className="text-xl font-black mb-4 text-teal-600">Emergency Contact</h2>
//                  <p className="text-gray-600 mb-4">For urgent matters outside office hours, call our emergency line:</p>
//                  <a href="tel:+8801711123456" className="group text-2xl font-black flex items-center gap-2 text-teal-600">
//                    +880 1711-123456
//                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                  </a>
//                </div>
//              </AnimatedSection>
//           </div>
//         </div>

//         {/* Map */}
//         <AnimatedSection>
//         <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.727256099589!2d92.01732531540178!3d24.89774928036656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751f2d53c30e91%3A0x3b85a6b1e8e7e8a8!2sSylhet%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
//               width="100%"
//               height="400"
//               style={{border: 0}}
//               allowFullScreen
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             ></iframe>
//           </div>
//         </AnimatedSection>
//       </div>
//     </div>
//   );
// }
