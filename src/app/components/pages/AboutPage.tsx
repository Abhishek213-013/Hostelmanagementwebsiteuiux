import { useState } from 'react';
import { Building2, Award, Sparkles, Users, Star, BookOpen, Shield, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, Calendar, MapPin, Phone, Mail, TrendingUp, Heart, Clock, Target, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';

// Add the cardGradients array here
const cardGradients = [
  'linear-gradient(135deg, #0d9488 0%, #99f6e4 100%)',
  'linear-gradient(135deg, #64748b 0%, #cbd5e1 100%)',
  'linear-gradient(135deg, #0d9488 0%, #ffffff 100%)',
  'linear-gradient(135deg, #64748b 0%, #f1f5f9 100%)',
  'linear-gradient(135deg, #0d9488 0%, #cbd5e1 100%)',
];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
        {/* Hero Section */}
        <AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200">
              <div className="p-2 bg-teal-600 rounded-xl">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-wider text-teal-600 uppercase">Est. 2020</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              <span className="block text-teal-600">Creating</span>
              <span className="block text-gray-800">Home Away</span>
              <span className="block mt-2 text-teal-600 text-4xl lg:text-6xl">
                From Home
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Established in 2020, SylhetStay has redefined premium student accommodation. We blend <span className="text-teal-600 font-bold">comfort</span>, <span className="text-gray-800 font-bold">technology</span>, and <span className="text-teal-600 font-bold">community</span> to create an environment where academic excellence thrives.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/booking" className="group px-8 py-4 text-white rounded-2xl font-bold shadow hover:shadow-xl flex items-center gap-3" style={{background: '#0d9488'}}>
                <Calendar className="w-5 h-5" />
                <span>Book a Tour</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white text-teal-800 rounded-2xl font-bold border-2 border-gray-200 hover:border-teal-500 transition-all flex items-center gap-3 shadow hover:shadow-xl">
                <Phone className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>

           <div className="relative">
             <div className="relative grid grid-cols-2 gap-4">
               {[
                 { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', label: 'Modern Rooms' },
                 { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', label: 'Premium Suites' },
                 { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', label: 'Study Areas' },
                 { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', label: 'Common Spaces' }
               ].map((item, i) => (
                 <div key={i} className={`group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 ${i % 2 === 1 ? 'mt-8' : ''} border-2 border-gray-200`}>
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                   <img src={item.src} alt={item.label} className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-gray-800">{item.label}</span>
                   </div>
                   <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-teal-600">
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
            { num: '150+', label: 'Happy Students', icon: Users },
            { num: '4.8', label: 'Rating', icon: Star, suffix: '/5' },
            { num: '50+', label: 'Room Options', icon: Building2 },
            { num: '24/7', label: 'Security', icon: Shield }
          ].map((stat, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-white rounded-2xl p-6 shadow border border-gray-200 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black mb-2 text-teal-600 flex items-center justify-center gap-1">
                  {stat.num}
                  {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Values Section */}
        <AnimatedSection>
        <div className="mb-32">
            <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
              <Award className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-bold tracking-wide text-teal-600 uppercase">Our Principles</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-teal-600">
              Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do and define our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
                  <div className="w-16 h-16 rounded-2xl mb-6 bg-teal-600 flex items-center justify-center shadow">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black mb-3 text-teal-600">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
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
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold tracking-wide text-teal-600 uppercase">Our Story</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-teal-600">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">From humble beginnings to industry leadership</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gray-200"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {milestones.map((milestone, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                <div
                  className="relative group"
                  onMouseEnter={() => setActiveMilestone(i)}
                  onMouseLeave={() => setActiveMilestone(null)}
                >
                   <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow bg-teal-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                     <milestone.icon className="w-8 h-8" />
                   </div>
                   <div className={`bg-white rounded-2xl p-6 shadow border border-gray-200 transition-all duration-500 ${activeMilestone === i ? 'shadow-lg -translate-y-2 border-teal-400' : ''}`}>
                     <div className="text-center">
                       <div className="text-2xl font-black mb-1 text-teal-600">{milestone.year}</div>
                       <h4 className="text-lg font-black mb-2 text-teal-600">{milestone.title}</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">{milestone.desc}</p>
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
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
              <Users className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-bold tracking-wide text-teal-600 uppercase">The People</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-teal-600">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">Dedicated professionals committed to your success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <AnimatedSection key={i} delay={i * 150}>
              <div className="bg-white rounded-2xl overflow-hidden shadow border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                 <div className="relative h-72 overflow-hidden">
                   <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                 </div>
                 <div className="p-6">
                   <h4 className="text-xl font-black mb-1 text-teal-600">{member.name}</h4>
                   <p className="text-sm font-bold mb-2 text-gray-700">{member.role}</p>
                   <p className="text-sm text-gray-600">{member.bio}</p>
                 </div>
              </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
        <div className="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">Be part of a thriving student community that supports your academic journey and creates lifelong memories</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              Book Your Room
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="px-10 py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-3">
              <Phone className="w-5 h-5" />
              Contact Us
            </Link>
          </div>
        </div>
        </AnimatedSection>
      </div>
    </div>
  );
}