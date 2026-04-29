import { useState } from 'react';
import { Building2, Award, Sparkles, Users, Star, BookOpen, Shield, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, Calendar, MapPin, Phone, Mail, TrendingUp, Heart, Clock, Target, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';
import { cardGradients, LOGO_PRIMARY, LOGO_SECONDARY, LOGO_TERTIARY } from '../../constants';

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
  { icon: Shield, title: 'Safety First', desc: '24/7 security monitoring with advanced surveillance systems and trained personnel', grad: cardGradients[0] },
  { icon: Heart, title: 'Community', desc: 'A warm, welcoming environment that fosters lifelong friendships and connections', grad: cardGradients[1] },
  { icon: BookOpen, title: 'Academic Focus', desc: 'Study-optimized spaces designed for concentration and academic excellence', grad: cardGradients[3] },
  { icon: Target, title: 'Excellence', desc: 'Continuously raising the bar in student accommodation standards', grad: cardGradients[4] }
];

export function AboutPage() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 animate-gradient-shift"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-bl from-emerald-400/40 via-teal-300/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-amber-400/40 via-orange-300/30 to-rose-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-r from-emerald-300/30 via-teal-200/20 to-cyan-300/30 dark:from-emerald-800/30 dark:via-teal-800/20 dark:to-cyan-800/30 rounded-full blur-3xl animate-spin-slow"></div>
        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl animate-float shadow-lg shadow-emerald-400/50"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl animate-float-delayed shadow-lg shadow-amber-400/50"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl animate-float-slow shadow-lg shadow-cyan-400/50"></div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
        {/* Hero Section */}
        <AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-emerald-900/90 backdrop-blur-xl rounded-full shadow-xl shadow-emerald-500/20 border border-emerald-300/50 dark:border-emerald-600/50 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-ping-slow"></div>
                <div className="relative p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent uppercase">Est. 2020</span>
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent animate-gradient-x">Creating</span>
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent animate-gradient-x" style={{animationDelay: '0.5s'}}>Home Away</span>
              <span className="block mt-2">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-3xl opacity-40 animate-pulse"></span>
                  <span className="relative bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent text-4xl lg:text-6xl">
                    From Home
                  </span>
                </span>
              </span>
            </h1>

            <p className="text-xl text-emerald-700 dark:text-emerald-300 leading-relaxed max-w-xl">
              Established in 2020, SylhetStay has redefined premium student accommodation. We blend <span className="text-amber-600 dark:text-amber-400 font-bold">comfort</span>, <span className="text-teal-600 dark:text-teal-400 font-bold">technology</span>, and <span className="text-cyan-600 dark:text-cyan-400 font-bold">community</span> to create an environment where academic excellence thrives.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/booking" className="group relative px-8 py-4 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-500 flex items-center gap-3 overflow-hidden animate-gradient-shift" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Calendar className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Book a Tour</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-emerald-800 dark:text-emerald-200 rounded-2xl font-bold border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-[2.5rem] blur-2xl opacity-30 animate-pulse-slow"></div>
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', label: 'Modern Rooms' },
                { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', label: 'Premium Suites' },
                { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', label: 'Study Areas' },
                { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', label: 'Common Spaces' }
              ].map((item, i) => (
                <div key={i} className={`group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 ${i % 2 === 1 ? 'mt-8' : ''}`} style={{border: `3px solid ${['#059669', '#06b6d4', '#f59e0b', '#8b5cf6'][i]}33`}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={item.src} alt={item.label} className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-emerald-900">{item.label}</span>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{background: cardGradients[i % 5]}}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </AnimatedSection>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {[
            { num: '150+', label: 'Happy Students', icon: Users, grad: cardGradients[0] },
            { num: '4.8', label: 'Rating', icon: Star, grad: cardGradients[1], suffix: '/5' },
            { num: '50+', label: 'Room Options', icon: Building2, grad: cardGradients[3] },
            { num: '24/7', label: 'Security', icon: Shield, grad: cardGradients[4] }
          ].map((stat, i) => (
            <AnimatedSection key={i} delay={i * 100}>
            <div className="group relative">
              <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: stat.grad}}></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 transition-all duration-500">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse" style={{background: stat.grad}}></div>
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all" style={{background: stat.grad}}>
                    <stat.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="text-5xl font-black mb-2 flex items-center justify-center gap-1" style={{background: stat.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  {stat.num}
                  {stat.suffix && <span className="text-2xl text-emerald-400">{stat.suffix}</span>}
                </div>
                <div className="text-emerald-700 dark:text-emerald-300 font-semibold">{stat.label}</div>
              </div>
            </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Values Section */}
        <AnimatedSection>
        <div className="mb-32">
            <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-emerald-300/50 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800/50 dark:to-teal-800/50 shadow-lg shadow-emerald-500/20">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Our Principles</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Core </span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">The principles that guide everything we do and define our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={i} delay={i * 100}>
              <div className="group relative">
                <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: value.grad}}></div>
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl hover:-translate-y-3 hover:rotate-2 transition-all duration-700 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-5" style={{background: value.grad}}></div>
                  <div className="relative w-16 h-16 rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all" style={{background: value.grad}}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-3" style={{background: value.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{value.title}</h3>
                  <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">{value.desc}</p>
                </div>
              </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        </AnimatedSection>

        {/* Timeline Section */}
        <AnimatedSection>
        <div className="mb-32">
            <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-amber-300/50 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800/50 dark:to-orange-800/50 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
              <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Our Story</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Our </span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl text-emerald-700 dark:text-emerald-300">From humble beginnings to industry leadership</p>
          </div>

          <div className="relative">
             <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 dark:from-emerald-800/50 dark:via-teal-800/50 dark:to-cyan-800/50"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {milestones.map((milestone, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                <div
                  className="relative group"
                  onMouseEnter={() => setActiveMilestone(i)}
                  onMouseLeave={() => setActiveMilestone(null)}
                >
                   <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{background: cardGradients[i % 5]}}>
                     <milestone.icon className="w-8 h-8 drop-shadow-lg" />
                   </div>
                   <div className={`relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 transition-all duration-500 ${activeMilestone === i ? 'shadow-2xl -translate-y-2 border-emerald-400/50' : ''}`}>
                     <div className="text-center">
                       <div className="text-2xl font-black mb-1" style={{background: cardGradients[i % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{milestone.year}</div>
                       <h4 className="text-lg font-black mb-2" style={{background: cardGradients[i % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{milestone.title}</h4>
                       <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">{milestone.desc}</p>
                     </div>
                   </div>
                </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
        </AnimatedSection>

        {/* Team Section */}
        <AnimatedSection>
        <div className="mb-32">
            <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border-2 border-cyan-300/50 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-800/50 dark:to-blue-800/50 shadow-lg shadow-cyan-500/20">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-bounce" />
              <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">The People</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Meet Our </span>
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-emerald-700 dark:text-emerald-300">Dedicated professionals committed to your success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <AnimatedSection key={i} delay={i * 150}>
              <div className="group relative">
                <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{background: cardGradients[i % 5]}}></div>
                 <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-3xl hover:-translate-y-4 hover:rotate-1 transition-all duration-700">
                   <div className="relative h-72 overflow-hidden">
                     <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent"></div>
                     <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110" style={{background: cardGradients[i % 5]}}>
                       <Sparkles className="w-5 h-5 text-white" />
                     </div>
                   </div>
                   <div className="p-6">
                     <h4 className="text-xl font-black mb-1" style={{background: cardGradients[i % 5], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{member.name}</h4>
                     <p className="text-sm font-bold mb-2" style={{color: '#059669'}}>{member.role}</p>
                     <p className="text-sm text-emerald-700 dark:text-emerald-300">{member.bio}</p>
                   </div>
                 </div>
              </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-shift rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-12 md:p-20 text-white text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Join Our Community?</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">Be part of a thriving student community that supports your academic journey and creates lifelong memories</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/booking" className="group px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  Book Your Room
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="px-10 py-5 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-black border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
        </AnimatedSection>
      </div>
    </div>
  );
}