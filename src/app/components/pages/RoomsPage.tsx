import { useState, useEffect } from 'react';
import { Building2, Star, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Calendar, Bed, Maximize2, Sparkles, ArrowRight, ChevronRight, Info } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

interface Room {
  id: number;
  title: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  available: number;
  popular?: boolean;
  description: string;
  size: string;
  capacity: number;
  gradient: string;
}

const rooms: Room[] = [
  {
    id: 1,
    title: 'Shared Room',
    type: 'shared',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan', 'Common Lounge Access'],
    available: 8,
    description: 'Perfect for budget-conscious students who enjoy a social living environment.',
    size: '200 sq ft',
    capacity: 4,
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    title: 'Semi-Private Room',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Balcony', 'Storage Space'],
    available: 4,
    popular: true,
    description: 'Ideal balance of privacy and affordability with modern amenities.',
    size: '300 sq ft',
    capacity: 2,
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 3,
    title: 'Premium Single Room',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'Study Table', 'Mini Fridge', 'Wardrobe', 'Desk Lamp'],
    available: 2,
    description: 'Luxury accommodation with premium furnishings and maximum privacy.',
    size: '400 sq ft',
    capacity: 1,
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 4,
    title: 'Deluxe Suite',
    type: 'deluxe',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    features: ['King Size Bed', 'Premium Bath', 'Split AC', 'Work Station', 'Mini Kitchen', 'Smart TV', 'Private Balcony', 'Room Service'],
    available: 1,
    description: 'Ultimate luxury living experience with hotel-like amenities and services.',
    size: '550 sq ft',
    capacity: 2,
    gradient: 'from-amber-500 to-orange-600'
  }
];

const amenities = [
  { icon: Wifi, label: 'High-Speed WiFi', desc: 'Fiber optic internet' },
  { icon: Wind, label: 'Climate Control', desc: 'AC & Fan in all rooms' },
  { icon: Shield, label: '24/7 Security', desc: 'CCTV & Security guards' },
  { icon: Car, label: 'Parking Space', desc: 'Secure parking area' },
  { icon: Utensils, label: 'Dining Hall', desc: '3 meals included' },
  { icon: BookOpen, label: 'Study Lounge', desc: 'Quiet study areas' },
  { icon: Dumbbell, label: 'Fitness Center', desc: 'Gym & equipment' },
  { icon: Coffee, label: 'Common Room', desc: 'Recreation space' }
];

export function RoomsPage() {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxSeats, setMaxSeats] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    const seatsFromUrl = searchParams.get('seats');
    const maxPriceFromUrl = searchParams.get('maxPrice');

    if (typeFromUrl) setSelectedType(typeFromUrl);
    if (seatsFromUrl) setMaxSeats(seatsFromUrl);
    if (maxPriceFromUrl) setMaxPrice(maxPriceFromUrl);
  }, [searchParams]);

  const filteredRooms = rooms.filter(room => {
    let match = true;
    if (selectedType !== 'all') match = match && room.type === selectedType;
    if (maxSeats) match = match && room.capacity <= parseInt(maxSeats);
    if (maxPrice) match = match && room.price <= parseInt(maxPrice);
    return match;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
            <div className="p-2 bg-teal-600 rounded-xl">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider text-teal-600 uppercase">Our Rooms</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black mb-6 leading-[1.1]">
            <span className="block text-teal-600">Find Your</span>
            <span className="text-gray-800 text-3xl lg:text-5xl">
              Perfect Space
            </span>
          </h1>
          <p className="text-x text-gray-600 max-w-2xl mx-auto leading-relaxed">Choose from our range of thoughtfully designed rooms that cater to every need and budget</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['all', 'shared', 'semi-private', 'premium', 'deluxe'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-500 capitalize ${
                selectedType === type
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border-2 border-gray-200'
              }`}
              style={selectedType === type ? {background: '#0d9488'} : {}}
            >
              {type === 'all' ? 'All Rooms' : type.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group"
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              {/* {room.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-2 bg-teal-600">
                  <Star className="w-4 h-4 fill-current" />
                  Most Popular
                </div>
              )} */}
              <div className="bg-white rounded-3xl overflow-hidden shadow border border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-72 overflow-hidden">
                  <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-sm">Up to {room.capacity}</span>
                  </div>
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full shadow-lg">
                    <span className="text-gray-800 font-black text-sm">{room.size}</span>
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="px-4 py-2 text-white rounded-xl font-black shadow-lg bg-teal-600">
                      ৳{room.price.toLocaleString()}<span className="text-xs font-normal">/mo</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black mb-3 text-teal-600">{room.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{room.description}</p>

                  <div className="space-y-3 mb-8">
                    {room.features.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-3 h-3 rounded-full ${room.available > 0 ? 'bg-teal-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-bold text-gray-700">
                        {room.available > 0 ? `${room.available} available` : 'Fully booked'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/rooms/${room.id}`}
                        className="group/btn px-6 py-3 bg-white text-gray-800 rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-gray-200"
                      >
                        See Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/booking"
                        className="px-6 py-3 text-white rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 bg-teal-600"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-bold tracking-wide text-teal-600 uppercase">Features</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black mb-6 text-teal-600">
              Room Amenities
            </h2>
            <p className="text-l text-gray-600">Every room comes with essential amenities for comfortable living</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {amenities.map((item, i) => (
               <div key={i} className="group bg-white rounded-2xl p-8 shadow border border-gray-200 hover:shadow-lg hover:-translate-y-2 hover:bg-teal-600 hover:border-teal-600 transition-all duration-500">
                   <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow bg-teal-600 group-hover:bg-white transition-colors duration-500">
                     <item.icon className="w-8 h-8 text-white group-hover:text-teal-600 transition-colors duration-500" />
                   </div>
                   <h3 className="text-lg font-black mb-2 text-center text-teal-600 group-hover:text-white transition-colors duration-500">{item.label}</h3>
                   <p className="text-gray-600 text-sm text-center group-hover:text-white/90 transition-colors duration-500">{item.desc}</p>
               </div>
             ))}
           </div>
        </div>

        {/* CTA Section */}
        <div className="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
            <h2 className="text-2xl lg:text-3xl font-black mb-6">Can't Find What You're Looking For?</h2>
            <p className="text-l text-white/80 mb-10 max-w-xl mx-auto">Contact us for custom room arrangements or special requirements</p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link to="/booking" className="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  Book a Room
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="px-10 py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-3">
                  <Info className="w-5 h-5" />
                  Contact Us
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
