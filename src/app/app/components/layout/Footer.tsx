// import { Building2, Facebook, Instagram, Twitter, Youtube, Mail as MailIcon, Send } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const LOGO_PRIMARY = '#1a1a1a';
// const LOGO_SECONDARY = '#525252';

// export function Footer() {
//   return (
//     <footer className="relative bg-slate-900 dark:bg-slate-950 text-white py-20">
//       <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
//           <div className="space-y-6">
//             <Link to="/" className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-sky-400 to-emerald-500 rounded-2xl">
//                 <Building2 className="w-6 h-6" />
//               </div>
//               <span className="font-black text-2xl">SylhetStay</span>
//             </Link>
//             <p className="text-slate-400 mb-6">Premium student accommodation in Sylhet, Bangladesh.</p>
//             <div className="flex gap-4">
//               <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
//                 <Facebook className="w-5 h-5" />
//               </a>
//               <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
//                 <Instagram className="w-5 h-5" />
//               </a>
//               <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
//                 <Twitter className="w-5 h-5" />
//               </a>
//               <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-all cursor-pointer">
//                 <Youtube className="w-5 h-5" />
//               </a>
//             </div>
//           </div>

//           {[
//             { title: 'Quick Links', links: [
//               { label: 'Rooms', path: '/rooms' },
//               { label: 'Facilities', path: '/facilities' },
//               { label: 'Gallery', path: '/gallery' },
//               { label: 'About Us', path: '/about' }
//             ]},
//             { title: 'Information', links: [
//               { label: 'Admission', path: '#' },
//               { label: 'Payment', path: '#' },
//               { label: 'FAQs', path: '#' },
//               { label: 'Terms', path: '#' }
//             ]},
//             { title: 'Contact', links: [
//               { label: '123 Akhalia Road', path: '#' },
//               { label: '+880 1711-123456', path: 'tel:+8801711123456' },
//               { label: 'info@sylhetstay.com', path: 'mailto:info@sylhetstay.com' }
//             ]}
//           ].map((col, i) => (
//             <div key={i}>
//               <h4 className="font-black mb-6">{col.title}</h4>
//               <div className="space-y-3">
//                 {col.links.map((link, j) => (
//                   <div key={j}>
//                     {link.path.startsWith('#') || link.path.startsWith('tel:') || link.path.startsWith('mailto:') ? (
//                       <a href={link.path} className="text-slate-400 hover:text-white transition-colors cursor-pointer">{link.label}</a>
//                     ) : (
//                       <Link to={link.path} className="text-slate-400 hover:text-white transition-colors cursor-pointer">{link.label}</Link>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Newsletter */}
//          <div className="bg-gradient-to-r from-sky-500/20 to-emerald-500/20 dark:from-sky-500/30 dark:to-emerald-500/30 rounded-3xl p-8 mb-12 border border-white/10">
//            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//              <div className="text-center md:text-left">
//                <h4 className="font-black text-2xl mb-2">Subscribe to Our Newsletter</h4>
//                <p className="text-slate-400">Get the latest updates and offers directly to your inbox</p>
//              </div>
//              <div className="flex gap-3 w-full md:w-auto">
//                <div className="relative flex-1 md:w-72">
//                  <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                  <input 
//                    type="email" 
//                    placeholder="Enter your email"
//                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all"
//                  />
//                </div>
//                <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2">
//                  <Send className="w-5 h-5" />
//                </button>
//              </div>
//            </div>
//          </div>

//          <div className="border-t border-slate-800 dark:border-slate-700 pt-8 text-center text-slate-400">
//            <p>&copy; 2026 SylhetStay Hostel. All rights reserved.</p>
//          </div>
//       </div>
//     </footer>
//   );
// }
