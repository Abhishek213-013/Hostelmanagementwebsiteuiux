import { useState } from 'react';
import { Camera, ChevronRight, Sparkles, ArrowRight, Utensils, Dumbbell, Wifi, Car, BookOpen, X, ChevronLeft, ChevronRight as ChevronRightIcon, MapPin, Phone, Mail, Wind, Coffee, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=1200', category: 'rooms', title: 'Modern Bedroom', gradient: 'from-sky-500 to-blue-600' },
  { id: 2, src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=1200', category: 'rooms', title: 'Premium Suite', gradient: 'from-violet-500 to-purple-600' },
  { id: 3, src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=1200', category: 'rooms', title: 'Living Area', gradient: 'from-emerald-500 to-teal-600' },
  { id: 4, src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=1200', category: 'rooms', title: 'Study Room', gradient: 'from-amber-500 to-orange-600' },
  { id: 5, src: 'https://images.unsplash.com/photo-1723259457560-b76d597f709b?w=1200', category: 'common', title: 'Lounge Area', gradient: 'from-cyan-500 to-sky-600' },
  { id: 6, src: 'https://images.unsplash.com/photo-1635321349359-333da6bb6da9?w=1200', category: 'common', title: 'Reception', gradient: 'from-indigo-500 to-violet-600' },
  { id: 7, src: 'https://images.unsplash.com/photo-1772944780860-e99bd902d59a?w=1200', category: 'common', title: 'Corridor', gradient: 'from-pink-500 to-rose-600' },
  { id: 8, src: 'https://images.unsplash.com/photo-1630694144867-37acec97af5c?w=1200', category: 'dining', title: 'Dining Hall', gradient: 'from-orange-500 to-red-600' },
  { id: 9, src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', category: 'dining', title: 'Kitchen', gradient: 'from-yellow-500 to-amber-600' },
  { id: 10, src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200', category: 'facilities', title: 'Gym', gradient: 'from-rose-500 to-pink-600' },
  { id: 11, src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200', category: 'facilities', title: 'Study Lounge', gradient: 'from-blue-500 to-indigo-600' },
  { id: 12, src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200', category: 'facilities', title: 'Outdoor Area', gradient: 'from-green-500 to-emerald-600' },
];

const categories = [
  { id: 'all', label: 'All Photos', gradient: 'from-slate-900 to-slate-700' },
  { id: 'rooms', label: 'Rooms', gradient: 'from-sky-500 to-blue-600' },
  { id: 'common', label: 'Common Areas', gradient: 'from-violet-500 to-purple-600' },
  { id: 'dining', label: 'Dining', gradient: 'from-orange-500 to-red-600' },
  { id: 'facilities', label: 'Facilities', gradient: 'from-emerald-500 to-teal-600' }
];

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(galleryImages[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
            <div className="p-2 bg-teal-600 rounded-xl">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider text-teal-600 uppercase">Photo Gallery</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1]">
            <span className="block text-teal-600">Explore Our</span>
            <span className="block text-gray-800">
              Beautiful Space
            </span>
          </h1>
          <p className="text-xl text-gray-600">Take a visual tour of your new home</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-500 ${
                selectedCategory === cat.id
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border-2 border-gray-200'
              }`}
              style={selectedCategory === cat.id ? {background: '#0d9488'} : {}}
            >
              {cat.label}
              {selectedCategory === cat.id && <ChevronRight className="w-4 h-4 inline ml-2" />}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow hover:shadow-xl transition-all duration-500"
              onClick={() => setSelectedImage(image)}
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent transition-opacity duration-500 ${hoveredImage === image.id ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block px-4 py-2 rounded-xl text-white font-bold shadow-lg bg-teal-600">
                    {image.category}
                  </div>
                  <h4 className="text-white font-bold text-lg">{image.title}</h4>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visit Info Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-10 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Visit Us Today</h2>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                  Schedule a tour to see our beautiful facilities in person. We'd love to show you around!
                </p>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, label: 'Location', value: '123 Akhalia Road, Sylhet 3100, Bangladesh' },
                    { icon: Phone, label: 'Phone', value: '+880 1711-123456' },
                    { icon: Mail, label: 'Email', value: 'info@sylhetstay.com' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-teal-600">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.label}</p>
                        <p className="text-gray-600">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wifi, label: '100 Mbps WiFi' },
                  { icon: Wind, label: 'AC Available' },
                  { icon: Utensils, label: 'Meal Plans' },
                  { icon: Coffee, label: 'Common Room' },
                  { icon: BookOpen, label: 'Study Rooms' },
                  { icon: Shield, label: '24/7 Security' },
                  { icon: Car, label: 'Parking' },
                  { icon: Dumbbell, label: 'Gym' }
                ].map((item, i) => (
                  <div key={i} className="group/item flex items-center gap-3 p-4 bg-gray-50 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200">
                    <div className="p-2 rounded-xl shadow-lg bg-teal-600">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        <p className="text-center text-gray-600 mt-12 font-medium">
          {filteredImages.length} photos {selectedCategory !== 'all' && `in ${categories.find(c => c.id === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-xl"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>

          <button
            className="absolute left-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            className="absolute right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110"
            onClick={handleNextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[80vh] mx-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-6">
              <span className="inline-block px-4 py-2 text-white rounded-xl font-bold shadow-xl bg-teal-600">
                {selectedImage.category}
              </span>
              <p className="text-white text-center mt-4 font-bold text-xl">{selectedImage.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}