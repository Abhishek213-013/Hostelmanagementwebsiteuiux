import { useState } from 'react';
import { Building2, Award, Sparkles, Users, Star, BookOpen, Shield, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, Calendar, MapPin, Phone, Mail, TrendingUp, Heart, Clock, Target, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOGO_PRIMARY = '#0f172a';
const LOGO_SECONDARY = '#334155';

const teamMembers = [
  { name: 'Md. Rahman', role: 'Managing Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600', bio: 'Leading with vision and dedication' },
  { name: 'Fatima Hassan', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600', bio: 'Ensuring excellence in daily operations' },
  { name: 'Ahmed Khan', role: 'Facility Head', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600', bio: 'Maintaining world-class facilities' },
  { name: 'Sara Islam', role: 'Student Coordinator', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600', bio: 'Building vibrant student community' }
];

const milestones = [
  { year: '2020', title: 'The Beginning', desc: 'SylhetStay established with 50 premium rooms', icon: Building2 },
  { year: '2021', title: 'Rapid Growth', desc: 'Expanded to 100+ rooms with new amenities', icon: TrendingUp },
  { year: '2022', title: 'Industry Recognition', desc: 'Best Student Housing Award winner', icon: Award },
  { year: '2023', title: 'Strategic Expansion', desc: 'Opened second prime location', icon: MapPin },
  { year: '2024', title: 'Tech Innovation', desc: 'Smart room technology integration', icon: Sparkles },
  { year: '2025', title: 'Community Milestone', desc: '500+ happy students and counting', icon: Users }
];

const values = [
  { icon: Shield, title: 'Safety First', desc: '24/7 security monitoring with advanced surveillance systems and trained personnel', color: 'from-emerald-500 to-teal-600' },
  { icon: Heart, title: 'Community', desc: 'A warm, welcoming environment that fosters lifelong friendships and connections', color: 'from-pink-500 to-rose-600' },
  { icon: BookOpen, title: 'Academic Focus', desc: 'Study-optimized spaces designed for concentration and academic excellence', color: 'from-blue-500 to-indigo-600' },
  { icon: Target, title: 'Excellence', desc: 'Continuously raising the bar in student accommodation standards', color: 'from-violet-500 to-purple-600' }
];

export function AboutPage() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sky-200/30 to-blue-200/30 dark:from-sky-900/20 dark:to-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full shadow-lg shadow-slate-900/5 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all">
              <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">Est. 2020</span>
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1]">
              Creating
              <br />
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-900/50 dark:to-blue-900/50 blur-3xl opacity-40"></span>
                <span className="relative bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent">
                  Home Away
                </span>
              </span>
              <br />
              <span className="text-4xl lg:text-6xl text-slate-600 dark:text-slate-300 font-light">From Home</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Established in 2020, SylhetStay has redefined premium student accommodation. We blend comfort, technology, and community to create an environment where academic excellence thrives.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/booking" className="group relative px-8 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 flex items-center gap-3 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <Calendar className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Book a Tour</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-800 dark:text-white rounded-2xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-200 to-emerald-200 dark:from-sky-900/30 dark:to-emerald-900/30 rounded-[2.5rem] blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', label: 'Modern Rooms' },
                { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', label: 'Premium Suites' },
                { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', label: 'Study Areas' },
                { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', label: 'Common Spaces' }
              ].map((item, i) => (
                <div key={i} className={`group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 ${i % 2 === 1 ? 'mt-8' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={item.src} alt={item.label} className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-slate-900">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {[
            { num: '150+', label: 'Happy Students', icon: Users, gradient: 'from-sky-500 to-blue-600' },
            { num: '4.8', label: 'Rating', icon: Star, gradient: 'from-amber-500 to-orange-600', suffix: '/5' },
            { num: '50+', label: 'Room Options', icon: Building2, gradient: 'from-emerald-500 to-teal-600' },
            { num: '24/7', label: 'Security', icon: Shield, gradient: 'from-violet-500 to-purple-600' }
          ].map((stat, i) => (
            <div key={i} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-1">
                  {stat.num}
                  {stat.suffix && <span className="text-2xl text-slate-400 dark:text-slate-500">{stat.suffix}</span>}
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-semibold">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-32">
            <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Our Core <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">The principles that guide everything we do and define our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${value.color} opacity-5 rounded-full -mr-16 -mt-16`}></div>
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-32">
            <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Our <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">From humble beginnings to industry leadership</p>
          </div>

          <div className="relative">
             <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-sky-200 via-blue-200 to-emerald-200 dark:from-sky-900/50 dark:via-blue-900/50 dark:to-emerald-900/50"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {milestones.map((milestone, i) => (
                <div
                  key={i}
                  className="relative group"
                  onMouseEnter={() => setActiveMilestone(i)}
                  onMouseLeave={() => setActiveMilestone(null)}
                >
                   <div className={`relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-white font-black text-sm shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                     <milestone.icon className="w-8 h-8" />
                   </div>
                   <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50 transition-all duration-500 ${activeMilestone === i ? 'shadow-2xl -translate-y-2' : ''}`}>
                     <div className="text-center">
                       <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{milestone.year}</div>
                       <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{milestone.title}</h4>
                       <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{milestone.desc}</p>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-32">
            <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Meet Our <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Dedicated professionals committed to your success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl"></div>
                 <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 dark:border-slate-700/50 hover:shadow-3xl hover:-translate-y-3 transition-all duration-700">
                   <div className="relative h-72 overflow-hidden">
                     <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                   <div className="p-6">
                     <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{member.name}</h4>
                     <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">{member.role}</p>
                     <p className="text-sm text-slate-600 dark:text-slate-300">{member.bio}</p>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-20 text-white text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Join Our Community?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">Be part of a thriving student community that supports your academic journey and creates lifelong memories</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/booking" className="group px-10 py-5 bg-white text-slate-900 rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  Book Your Room
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-black border-2 border-white/30 hover:bg-white/20 transition-all flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}