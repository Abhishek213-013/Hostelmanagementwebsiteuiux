import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Maximize2, Bed, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Star, Sparkles, Building2, X } from 'lucide-react';

const LOGO_PRIMARY = '#0f172a';
const LOGO_SECONDARY = '#334155';

interface Room {
  id: number;
  title: string;
  type: string;
  price: number;
  image: string;
  gallery: string[];
  features: string[];
  amenities: {
    icon: string;
    name: string;
    available: boolean;
  }[];
  available: number;
  popular?: boolean;
  description: string;
  size: string;
  capacity: number;
  bedType: string;
  bathroom: string;
  floor: string;
  view: string;
  gradient: string;
  policies: {
    smoking: boolean;
    pets: boolean;
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}

const rooms: Room[] = [
  {
    id: 1,
    title: 'Shared Room',
    type: 'shared',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
      'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600'
    ],
    features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan', 'Common Lounge Access'],
    amenities: [
      { icon: 'Wifi', name: 'High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Ceiling Fan', available: true },
      { icon: 'Coffee', name: 'Common Kitchenette', available: true },
      { icon: 'BookOpen', name: 'Study Lounge', available: true },
      { icon: 'Dumbbell', name: 'Fitness Center', available: true },
      { icon: 'Car', name: 'Parking', available: true },
      { icon: 'Shield', name: '24/7 Security', available: true },
      { icon: 'Utensils', name: 'Meal Service', available: false }
    ],
    available: 8,
    description: 'Perfect for budget-conscious students who enjoy a social living environment. This shared room offers a vibrant community atmosphere with all essential amenities for comfortable student living.',
    size: '200 sq ft',
    capacity: 4,
    bedType: '4 Bunk Beds',
    bathroom: 'Shared (2 per floor)',
    floor: 'Ground - 2nd Floor',
    view: 'Garden View',
    gradient: 'from-emerald-500 to-teal-600',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '07:00 AM',
      checkOut: '09:00 PM',
      cancellation: '12/24 hours before'
    }
  },
  {
    id: 2,
    title: 'Semi-Private Room',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1771327811795-6197403af846?w=600',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Balcony', 'Storage Space'],
    amenities: [
      { icon: 'Wifi', name: 'High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Ceiling Fan', available: true },
      { icon: 'Coffee', name: 'Mini Kitchenette', available: true },
      { icon: 'BookOpen', name: 'Study Desk', available: true },
      { icon: 'Dumbbell', name: 'Fitness Center', available: true },
      { icon: 'Car', name: 'Parking', available: true },
      { icon: 'Shield', name: '24/7 Security', available: true },
      { icon: 'Utensils', name: 'Meal Service', available: true }
    ],
    available: 4,
    popular: true,
    description: 'Ideal balance of privacy and affordability with modern amenities. Perfect for students who want personal space while staying within budget.',
    size: '300 sq ft',
    capacity: 2,
    bedType: '2 Single Beds',
    bathroom: 'Attached Private',
    floor: '1st - 3rd Floor',
    view: 'City View',
    gradient: 'from-sky-500 to-blue-600',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellation: '48 hours before check-in'
    }
  },
  {
    id: 3,
    title: 'Premium Single Room',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=600',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'Study Table', 'Mini Fridge', 'Wardrobe', 'Desk Lamp'],
    amenities: [
      { icon: 'Wifi', name: 'High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Split Air Conditioning', available: true },
      { icon: 'Coffee', name: 'Mini Fridge', available: true },
      { icon: 'BookOpen', name: 'Ergonomic Study Desk', available: true },
      { icon: 'Dumbbell', name: 'Fitness Center', available: true },
      { icon: 'Car', name: 'Priority Parking', available: true },
      { icon: 'Shield', name: '24/7 Security', available: true },
      { icon: 'Utensils', name: 'Meal Service', available: true }
    ],
    available: 2,
    description: 'Luxury accommodation with premium furnishings and maximum privacy. Designed for students who demand the best in comfort and convenience.',
    size: '400 sq ft',
    capacity: 1,
    bedType: '1 Queen Size Bed',
    bathroom: 'Attached Premium',
    floor: '2nd - 4th Floor',
    view: 'Garden & Pool View',
    gradient: 'from-violet-500 to-purple-600',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '1:00 PM',
      checkOut: '12:00 PM',
      cancellation: '72 hours before check-in'
    }
  },
  {
    id: 4,
    title: 'Deluxe Suite',
    type: 'deluxe',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    features: ['King Size Bed', 'Premium Bath', 'Split AC', 'Work Station', 'Mini Kitchen', 'Smart TV', 'Private Balcony', 'Room Service'],
    amenities: [
      { icon: 'Wifi', name: 'Ultra High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Climate Control AC', available: true },
      { icon: 'Coffee', name: 'Full Kitchenette', available: true },
      { icon: 'BookOpen', name: 'Executive Work Station', available: true },
      { icon: 'Dumbbell', name: 'Premium Fitness Access', available: true },
      { icon: 'Car', name: 'Valet Parking', available: true },
      { icon: 'Shield', name: 'VIP Security', available: true },
      { icon: 'Utensils', name: 'Room Service', available: true }
    ],
    available: 1,
    description: 'Ultimate luxury living experience with hotel-like amenities and services. The perfect choice for those who want the very best in student accommodation.',
    size: '550 sq ft',
    capacity: 2,
    bedType: '1 King Size Bed',
    bathroom: 'Luxury En-suite',
    floor: 'Top Floor (Penthouse)',
    view: 'Panoramic City View',
    gradient: 'from-amber-500 to-orange-600',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '12:00 PM',
      checkOut: '1:00 PM',
      cancellation: '7 days before check-in'
    }
  }
];

export function RoomDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const room = rooms.find(r => r.id === Number(id));
  const [currentImage, setCurrentImage] = useState(room?.image || '');

  useEffect(() => {
    if (room) {
      setCurrentImage(room.image);
    }
  }, [id]);

  if (!room) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 pt-24">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">Room Not Found</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">The room you're looking for doesn't exist.</p>
            <Link
              to="/rooms"
              className="px-8 py-4 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
              style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Rooms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-24">
      <div className="bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:scale-105 transition-all font-semibold text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Rooms
          </Link>
        </div>

        {/* Room Details Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Room Image */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl blur-2xl" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={currentImage}
                    alt={room.title}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                  {/* Price Badge on Image */}
                  <div className="absolute top-6 left-6">
                    <div className="px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl font-black shadow-2xl text-lg">
                      ৳{room.price.toLocaleString()}<span className="text-sm font-normal">/mo</span>
                    </div>
                  </div>

                  {room.popular && (
                    <div className="absolute top-6 right-6 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold shadow-2xl flex items-center gap-2">
                      <Star className="w-5 h-5 fill-current" />
                      Most Popular
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Users className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">Up to {room.capacity} {room.capacity > 1 ? 'People' : 'Person'}</span>
                  </div>

                  <div className="absolute bottom-6 right-6 px-5 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg">
                    <span className="text-slate-900 dark:text-white font-black">{room.size}</span>
                  </div>
                </div>
              </div>

               {/* Gallery Thumbnails */}
               <div className="grid grid-cols-4 gap-4">
                 {room.gallery.map((img, i) => (
                   <div
                     key={i}
                     onClick={() => setCurrentImage(img)}
                     className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 ${
                       currentImage === img
                         ? 'border-slate-900 dark:border-white shadow-xl scale-105'
                         : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                     }`}
                   >
                     <img src={img} alt={`${room.title} ${i + 1}`} className="w-full h-24 object-cover" />
                   </div>
                 ))}
               </div>
            </div>

            {/* Right Side - Room Details Stacked */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Room Type Badge */}
              <div>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}1a, ${LOGO_SECONDARY}1a)`}}>
                  <Sparkles className="w-5 h-5" style={{color: LOGO_PRIMARY}} />
                  <span className="text-sm font-bold tracking-wide" style={{color: LOGO_PRIMARY}}>{room.type.charAt(0).toUpperCase() + room.type.slice(1).replace('-', ' ')}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white">{room.title}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">৳{room.price.toLocaleString()}</span>
                <span className="text-xl text-slate-500 dark:text-slate-400">/month</span>
              </div>

              {/* Availability Status */}
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${room.available > 0 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-red-500'}`}></div>
                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {room.available > 0 ? `${room.available} rooms available` : 'Fully booked'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">{room.description}</p>

              {/* Room Specifications - 2 Columns */}
              <div className="grid grid-cols-2 gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5" style={{color: LOGO_PRIMARY}} />
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Bed Type</div>
                    <div className="font-bold text-slate-900 dark:text-white">{room.bedType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Maximize2 className="w-5 h-5" style={{color: LOGO_PRIMARY}} />
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Room Size</div>
                    <div className="font-bold text-slate-900 dark:text-white">{room.size}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{color: LOGO_PRIMARY}} />
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Capacity</div>
                    <div className="font-bold text-slate-900 dark:text-white">{room.capacity} Person{room.capacity > 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" style={{color: LOGO_PRIMARY}} />
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Bathroom</div>
                    <div className="font-bold text-slate-900 dark:text-white">{room.bathroom}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" style={{color: LOGO_PRIMARY}} />
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Floor</div>
                    <div className="font-bold text-slate-900 dark:text-white">{room.floor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" style={{color: LOGO_PRIMARY}} />
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">View</div>
                    <div className="font-bold text-slate-900 dark:text-white">{room.view}</div>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <Link
                to="/booking"
                className="group px-10 py-5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
              >
                Book Now
                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mt-20 mb-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-12 text-center">
              Room <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Amenities</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {room.amenities.map((amenity, i) => {
                  const iconColor = amenity.available ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400';
                  const bgColor = amenity.available ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-100 dark:bg-slate-700';
                  const opacity = !amenity.available ? 'opacity-50' : '';
                  
                  return (
                    <div key={i} className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
                      <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex items-center gap-4 ${opacity}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                          {amenity.icon === 'Wifi' && <Wifi className={`w-6 h-6 ${iconColor}`} />}
                          {amenity.icon === 'Wind' && <Wind className={`w-6 h-6 ${iconColor}`} />}
                          {amenity.icon === 'Coffee' && <Coffee className={`w-6 h-6 ${iconColor}`} />}
                          {amenity.icon === 'BookOpen' && <BookOpen className={`w-6 h-6 ${iconColor}`} />}
                          {amenity.icon === 'Dumbbell' && <Dumbbell className={`w-6 h-6 ${iconColor}`} />}
                          {amenity.icon === 'Car' && <Car className={`w-6 h-6 ${iconColor}`} />}
                          {amenity.icon === 'Shield' && <Shield className={`w-6 h-6 ${iconColor}`} />}
                          {amenity.icon === 'Utensils' && <Utensils className={`w-6 h-6 ${iconColor}`} />}
                        </div>
                        <div className="flex-1">
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">{amenity.name}</span>
                          {!amenity.available && <span className="text-xs text-slate-400 ml-2">(Not Available)</span>}
                        </div>
                        {amenity.available && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Room Policies Section */}
          <div className="mt-20 mb-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-12 text-center">
              Room <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Policies</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Main Gate Opens</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">{room.policies.checkIn}</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Main Gate Closes</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">{room.policies.checkOut}</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Meal Cancellation</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">{room.policies.cancellation}</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${room.policies.smoking ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50'} flex items-center justify-center`}>
                    {room.policies.smoking ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <X className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Smoking</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">{room.policies.smoking ? 'Allowed' : 'Not Allowed'}</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${room.policies.pets ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50'} flex items-center justify-center`}>
                    {room.policies.pets ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <X className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Pets</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">{room.policies.pets ? 'Allowed' : 'Not Allowed'}</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-20 mb-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-12 text-center">
              Room <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Features</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {room.features.map((feature, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl" style={{background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`}}></div>
                  <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/50">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}