import { useState, useEffect, useRef } from 'react';
import { Search, Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, MapPin, Phone, Mail, Menu, X, Home, Utensils, Dumbbell, Camera, CheckCircle2, Star, Sparkles, Award, ArrowRight, Calendar, Download, TrendingUp, ChevronRight } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LoginPage } from './components/pages/LoginPage';
import { BookingPage } from './components/pages/BookingPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ContactPage } from './components/pages/ContactPage';
import { AboutPage } from './components/pages/AboutPage';
import { RoomsPage } from './components/pages/RoomsPage';
import { RoomDetailsPage } from './components/pages/RoomDetailsPage';
import { FacilitiesPage } from './components/pages/FacilitiesPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from './components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Move these constants here - outside of any function
const LOGO_PRIMARY = '#059669';
const LOGO_SECONDARY = '#06b6d4';
const LOGO_TERTIARY = '#f59e0b';

const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function App() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    roomType: '',
    seats: '',
    maxPrice: ''
  });
  const [scrolled, setScrolled] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isHomePage = location.pathname === '/' || location.pathname === '';

  const cardGradients = [
    'linear-gradient(135deg, #0d9488 0%, #0d9488 100%)',
    'linear-gradient(135deg, #0d9488 0%, #0d9488 100%)',
    'linear-gradient(135deg, #0d9488 0%, #0d9488 100%)',
    'linear-gradient(135deg, #0d9488 0%, #0d9488 100%)',
    'linear-gradient(135deg, #0d9488 0%, #0d9488 100%)',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  const renderHomePage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative">
      <Header />
      
      {/* Vibrant Hero Section - Full Width with Background Images */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">

        <div className="relative w-full">
          {/* Carousel - Full width with background images */}
          <Carousel
             opts={{ loop: true }}
             plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
             className="w-full"
             setApi={setCarouselApi}
           >
            <CarouselContent>
              {/* Slide 1 */}
              <CarouselItem>
                <div className="relative w-full min-h-screen flex items-center justify-center">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920&q=80"
                      alt="Modern student accommodation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </div>
                  {/* Centered Text Content */}
                  <div className="relative z-10 text-center text-white px-6 lg:px-12 max-w-[1400px] mx-auto space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                      <MapPin className="w-5 h-5 text-teal-400" />
                      <span className="text-sm font-bold text-white tracking-wide">
                        Sylhet, Bangladesh
                      </span>
                    </div>
                    <div className="space-y-6">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                        <span className="block text-white">Your Home</span>
                        <span className="block text-white">Away From Home</span>
                        <span className="block mt-2 text-teal-400">
                          in Sylhet
                        </span>
                      </h1>
                      <p className="text-l sm:text-xl text-gray-200 leading-relaxed font-medium max-w-3xl mx-auto">
                        Experience premium student accommodation with <span className="text-teal-400 font-bold">cutting-edge amenities</span>, <span className="text-white font-bold">vibrant community</span>, and an environment designed for success.
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

               {/* Slide 2 */}
                <CarouselItem>
                  <div className="relative w-full min-h-screen flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                      <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
                        alt="Comfortable study room"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                    <div className="relative z-10 text-center text-white px-6 lg:px-12 max-w-[1400px] mx-auto space-y-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        <MapPin className="w-5 h-5 text-teal-400" />
                        <span className="text-sm font-bold text-white">Prime Location</span>
                      </div>
                      <div className="space-y-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                          <span className="block text-white">Study in</span>
                          <span className="block text-teal-400">Comfort</span>
                        </h1>
                        <p className="text-l sm:text-xl text-gray-200 leading-relaxed font-medium max-w-3xl mx-auto">
                          Fully furnished rooms with <span className="text-teal-400 font-bold">modern furniture</span>, <span className="text-white font-bold">high-speed WiFi</span>, and dedicated study areas.
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>

                {/* Slide 3 */}
                <CarouselItem>
                  <div className="relative w-full min-h-screen flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                      <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
                        alt="Student community"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                    <div className="relative z-10 text-center text-white px-6 lg:px-12 max-w-[1400px] mx-auto space-y-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        <MapPin className="w-5 h-5 text-teal-400" />
                        <span className="text-sm font-bold text-white">Community Living</span>
                      </div>
                      <div className="space-y-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                          <span className="block text-white">Build Your</span>
                          <span className="block text-teal-400">Network</span>
                        </h1>
                        <p className="text-l sm:text-xl text-gray-200 leading-relaxed font-medium max-w-3xl mx-auto">
                          Join a <span className="text-teal-400 font-bold">vibrant community</span> of students from top universities with <span className="text-teal-400 font-bold">networking events</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
            </CarouselContent>
            {/* Slider Indicator Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
           </Carousel>

           {/* Search Widget - Full Width Container */}
            <div className="w-full px-6 lg:px-12 mt-12">
              <div className="max-w-[1400px] mx-auto">
                <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-teal-600 tracking-wide uppercase">Room Type</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-teal-500 focus:outline-none font-semibold text-gray-800"
                        value={searchFilters.roomType}
                        onChange={(e) => setSearchFilters({...searchFilters, roomType: e.target.value})}
                      >
                        <option value="">All Types</option>
                        <option value="single">Single</option>
                        <option value="shared">Shared</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-teal-600 tracking-wide uppercase">Seats</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-teal-500 focus:outline-none font-semibold text-gray-800"
                        value={searchFilters.seats}
                        onChange={(e) => setSearchFilters({...searchFilters, seats: e.target.value})}
                      >
                        <option value="">Any</option>
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="4">4 People</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-teal-600 tracking-wide uppercase">Max Price</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-teal-500 focus:outline-none font-semibold text-gray-800"
                        value={searchFilters.maxPrice}
                        onChange={(e) => setSearchFilters({...searchFilters, maxPrice: e.target.value})}
                      >
                        <option value="">Any Budget</option>
                        <option value="5000">৳5,000/mo</option>
                        <option value="8000">৳8,000/mo</option>
                        <option value="12000">৳12,000/mo</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button className="w-full px-8 py-3 text-white rounded-xl font-bold" style={{background: '#0d9488'}}>
                        <span className="flex items-center justify-center gap-3">
                          <Search className="w-5 h-5" />
                          Search
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


        </div>
      </section>

         {/* Availability Cards */}
         <section className="py-16">
           <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                  { icon: Users, title: '12 Seats Available', desc: 'Across all room types', price: '৳4,500/mo', badge: 'Available Now' },
                  { icon: Award, title: 'Premium Rooms', desc: 'AC + Attached Bath', price: '৳10,500/mo', badge: 'Popular' },
                  { icon: Sparkles, title: 'Early Bird Discount', desc: 'Book 3 months, get 10% off', price: 'Save ৳1,350', badge: 'Limited' }
                ].map((card, i) => (
                  <AnimatedSection key={i}>
                    <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-4 rounded-2xl bg-teal-600">
                          <card.icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="px-4 py-2 text-white rounded-full text-sm font-bold bg-teal-600">
                          {card.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black mb-2 text-teal-600">{card.title}</h3>
                      <p className="text-gray-600 mb-8">{card.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-black text-teal-600">
                           {card.price}
                        </div>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-600">
                          <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
             </div>
           </div>
         </section>

         {/* About Section */}
          <section id="about" className="py-16">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <AnimatedSection>
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200">
                      <div className="p-2 bg-teal-600 rounded-xl">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold tracking-wider text-teal-600 uppercase">Est. 2020</span>
                    </div>

                    <h2 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                       <span className="block text-teal-600 text-4xl lg:text-5xl">Welcome to</span>
                       <span className="block mt-2 text-teal-600 text-4xl lg:text-5xl">
                         SylhetStay
                       </span>
                    </h2>

                     <p className="text-l text-gray-600 leading-relaxed">
                       Providing exceptional accommodation to students pursuing their academic dreams. We understand the importance of a <span className="text-teal-600 font-bold">comfortable</span>, <span className="text-gray-800 font-bold">safe</span>, and <span className="text-teal-600 font-bold">study-conducive</span> environment.
                     </p>

                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl border border-gray-200">
                          <div className="flex -space-x-2">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{background: '#0d9488'}}></div>
                            ))}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-teal-600">150+ Students</div>
                            <div className="text-xs text-gray-600">Living Here</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl border border-gray-200">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-amber-600">4.8/5.0</div>
                            <div className="text-xs text-gray-600">Rating</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl border border-gray-200">
                          <TrendingUp className="w-6 h-6 text-teal-600" />
                          <div className="text-left">
                            <div className="font-bold text-teal-600">98% Occupied</div>
                            <div className="text-xs text-gray-600">High Demand</div>
                          </div>
                        </div>
                      </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', label: 'Modern Rooms' },
                      { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', label: 'Premium Suites' },
                      { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', label: 'Study Areas' },
                      { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', label: 'Common Spaces' }
                    ].map((item, i) => (
                      <div key={i} className={`relative rounded-2xl overflow-hidden shadow ${i % 2 === 1 ? 'mt-8' : ''}`}>
                        <img src={item.src} alt={item.label} className="w-full h-60 object-cover" />
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-gray-800">{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>

         {/* Facilities */}
         <section className="py-16">
           <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
             <AnimatedSection>
               <div className="text-center mb-16">
                 <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
                   <span className="text-sm font-bold tracking-wide text-teal-600">Premium Amenities</span>
                 </div>
                 <h2 className="text-3xl lg:text-4xl font-black mb-6 text-teal-600">
                    World-Class Facilities
                  </h2>
                  <p className="text-l text-gray-600 max-w-2xl mx-auto">Everything you need for <span className="text-teal-600 font-bold">success</span>, all under one roof</p>
               </div>
             </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Wifi, label: 'High-Speed WiFi', desc: '100 Mbps fiber' },
                  { icon: Wind, label: 'Air Conditioning', desc: 'Premium rooms' },
                  { icon: Utensils, label: 'Dining Hall', desc: '3 meals daily' },
                  { icon: Coffee, label: 'Common Room', desc: 'Recreation area' },
                  { icon: BookOpen, label: 'Study Rooms', desc: 'Quiet & peaceful' },
                  { icon: Shield, label: '24/7 Security', desc: 'CCTV & guards' },
                  { icon: Car, label: 'Parking', desc: 'Bike & car spaces' },
                  { icon: Dumbbell, label: 'Fitness Center', desc: 'Modern equipment' }
                ].map((item, i) => (
                  <AnimatedSection key={i}>
                    <div className="bg-white rounded-xl p-6 shadow border border-gray-200 text-center hover:bg-teal-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                         <div className="w-16 h-16 mx-auto mb-4 bg-teal-600 group-hover:bg-white rounded-xl flex items-center justify-center transition-all duration-500">
                           <item.icon className="w-8 h-8 text-white group-hover:text-teal-600" />
                         </div>
                         <h4 className="text-lg font-black mb-2 text-teal-600 group-hover:text-white transition-colors duration-500">{item.label}</h4>
                         <p className="text-sm text-gray-600 group-hover:text-teal-100 transition-colors duration-500">{item.desc}</p>
                       </div>
                    </AnimatedSection>
                  ))}
             </div>
           </div>
         </section>

          {/* Rooms */}
          <section className="py-16">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <AnimatedSection>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
                    <div className="p-2 bg-teal-600 rounded-xl">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold tracking-wider text-teal-600 uppercase">Find Your Space</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1]">
                     Choose Your Perfect Room
                   </h2>
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', title: 'Shared Room', desc: 'Perfect for vibrant community', price: '৳4,500', features: ['4 bunk beds', 'Shared bathroom', 'Study desk', 'Wardrobe'], popular: false },
                  { img: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800', title: 'Semi-Private', desc: 'Balance of privacy & affordability', price: '৳7,500', features: ['2 single beds', 'Attached bath', 'Study desks', 'Ceiling fan'], popular: true },
                  { img: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800', title: 'Premium Single', desc: 'Ultimate privacy & comfort', price: '৳10,500', features: ['Private room', 'Attached bath', 'Air conditioning', 'Premium furniture'], popular: false }
                ].map((room, i) => (
                  <AnimatedSection key={i}>
                    <div className="relative">
                      {room.popular && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-2 bg-teal-600">
                          <Star className="w-4 h-4 fill-current" />
                          Most Popular
                        </div>
                      )}
                      <div className="bg-white rounded-2xl overflow-hidden shadow border border-gray-200">
                         <div className="relative h-64 overflow-hidden">
                           <img src={room.img} alt={room.title} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                         </div>
                         <div className="p-6">
                           <h3 className="text-2xl font-black mb-3 text-teal-600">{room.title}</h3>
                           <p className="text-gray-600 mb-6">{room.desc}</p>
                           <div className="space-y-3 mb-8">
                             {room.features.map((feature, j) => (
                               <div key={j} className="flex items-center gap-3">
                                 <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                   <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                 </div>
                                 <span className="text-gray-700 font-medium">{feature}</span>
                               </div>
                             ))}
                           </div>
                           <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                             <div>
                               <div className="text-sm text-teal-600 mb-1">Starting from</div>
                                <div className="text-2xl font-black text-teal-600">
                                  {room.price}<span className="text-lg">/mo</span>
                                </div>
                              </div>
                             <button className="px-6 py-3 bg-white text-teal-800 rounded-xl font-bold shadow border border-gray-200 flex items-center gap-2">
                               Book Now
                               <ArrowRight className="w-4 h-4" />
                             </button>
                           </div>
                         </div>
                       </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

         {/* Gallery */}
         <section className="py-16">
           <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
             <AnimatedSection>
               <div className="text-center mb-16">
                 <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
                   <div className="p-2 bg-teal-600 rounded-xl">
                     <Camera className="w-4 h-4 text-white" />
                   </div>
                   <span className="text-sm font-bold tracking-wider text-teal-600 uppercase">Photo Gallery</span>
                 </div>
                 <h2 className="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1]">
                    Explore Our Beautiful Space
                  </h2>
                 <p className="text-l text-gray-600">Take a visual tour of your new home</p>
               </div>
             </AnimatedSection>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', label: 'Modern Rooms' },
                  { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', label: 'Premium Suites' },
                  { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', label: 'Study Areas' },
                  { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', label: 'Common Spaces' },
                  { src: 'https://images.unsplash.com/photo-1723259457560-b76d597f709b?w=600', label: 'Lounge Area' },
                  { src: 'https://images.unsplash.com/photo-1635321349359-333da6bb6da9?w=600', label: 'Reception' },
                  { src: 'https://images.unsplash.com/photo-1772944780860-e99bd902d59a?w=600', label: 'Corridor' }
                ].map((item, i) => (
                  <div key={i} className={`relative rounded-2xl overflow-hidden shadow group hover:opacity-80 transition-all duration-300 ${i % 2 === 1 ? 'mt-8' : ''}`}>
                    <img src={item.src} alt={item.label} className="w-full h-60 object-cover brightness-110 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-gray-800">{item.label}</span>
                    </div>
                  </div>
                ))}
               <div className="relative rounded-2xl overflow-hidden flex items-center justify-center bg-gray-700">
                 <div className="text-center text-white">
                   <div className="text-5xl font-black mb-2">+24</div>
                   <div className="font-bold">More Photos</div>
                 </div>
               </div>
             </div>
           </div>
         </section>

         {/* Testimonials */}
          <section className="py-16">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <AnimatedSection>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-bold tracking-wide text-teal-600">The People</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black mb-6 text-teal-600">
                     What Students Say
                   </h2>
                  <p className="text-l text-gray-600">Hear from our happy residents</p>
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Arafat Rahman', uni: 'SUST, Computer Science', text: 'The facilities are excellent, and the staff is incredibly supportive. The study environment here helped me maintain my GPA!' },
                  { name: 'Fatima Hassan', uni: 'Metropolitan University', text: 'WiFi is super fast, and the food quality is great. Made lots of friends here. Highly recommended!' },
                  { name: 'Mehedi Khan', uni: 'Sylhet Medical College', text: 'The hostel management made the transition so smooth. Feels like a second home!' }
                ].map((testimonial, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow border border-gray-200">
                     <div className="flex gap-1 mb-6">
                       {[...Array(5)].map((_, j) => (
                         <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                       ))}
                     </div>
                     <p className="text-gray-700 mb-8 leading-relaxed">{testimonial.text}</p>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                          <span className="text-white font-bold text-base">{testimonial.name[0]}</span>
                        </div>
                       <div>
                         <div className="font-black text-gray-800">{testimonial.name}</div>
                         <div className="text-sm text-teal-600">{testimonial.uni}</div>
                       </div>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </section>

         {/* CTA Section */}
         <section className="py-16">
           <div className="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center mx-6 lg:mx-12">
             <h2 className="text-2xl lg:text-3xl font-black mb-6">Ready to Join Our Community?</h2>
             <p className="text-l text-white/90 mb-10 max-w-2xl mx-auto">Be part of a thriving student community that supports your academic journey and creates lifelong memories</p>
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
         </section>

         {/* Sticky Button */}
          <Link to="/rooms" className="fixed bottom-8 right-8 px-8 py-4 text-white rounded-full font-black shadow-lg z-50 flex items-center gap-3 bg-teal-600">
            <Home className="w-6 h-6" />
            <span>Book Your Seat</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
       </div>
       <Footer />
     </div>
   );

  if (!isHomePage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking" element={<><Header /><BookingPage /><Footer /></>} />
        <Route path="/gallery" element={<><Header /><GalleryPage /><Footer /></>} />
        <Route path="/contact" element={<><Header /><ContactPage /><Footer /></>} />
        <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
        <Route path="/rooms" element={<><Header /><RoomsPage /><Footer /></>} />
        <Route path="/rooms/:id" element={<><Header /><RoomDetailsPage /><Footer /></>} />
        <Route path="/facilities" element={<><Header /><FacilitiesPage /><Footer /></>} />
          <Route path="*" element={
            <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950" style={{'--logo-primary': LOGO_PRIMARY, '--logo-secondary': LOGO_SECONDARY, '--logo-tertiary': LOGO_TERTIARY} as React.CSSProperties}>
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 animate-gradient-shift"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-bl from-emerald-400/40 via-teal-300/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-bl from-amber-400/40 via-orange-300/30 to-rose-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
              </div>
              <div className="relative text-center">
                <div className="mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-md opacity-75 animate-ping-slow"></div>
                    <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}>
                      <span className="text-6xl font-black text-white">404</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Page Not Found</h2>
                <p className="text-xl text-emerald-700 dark:text-emerald-300 mb-8">The page you're looking for doesn't exist.</p>
                <Link to="/" className="group px-10 py-5 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all inline-flex items-center gap-3 animate-gradient-shift overflow-hidden" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY}, ${LOGO_TERTIARY}, ${LOGO_PRIMARY})`}}>
                  <span className="relative z-10">Go Home</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          } />
      </Routes>
    );
  }

  return renderHomePage();
}