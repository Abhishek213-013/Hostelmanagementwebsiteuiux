import { useState } from 'react';
import { Building2, Camera, X, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Wifi, Wind, Utensils, Coffee, Dumbbell, BookOpen, Shield, Car, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOGO_PRIMARY = '#0f172a';
const LOGO_SECONDARY = '#334155';

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
    <div className="min-h-screen relative pt-28 pb-20 overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-blue-200/20 dark:from-sky-900/20 dark:to-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-8">
            <div className="p-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 rounded-xl">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">Photo Gallery</span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Explore Our
            <br />
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent">
              Beautiful Space
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Take a visual tour of your new home</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group px-6 py-3 rounded-full font-bold transition-all duration-500 ${
                selectedCategory === cat.id
                  ? 'text-white shadow-2xl scale-105'
                  : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-600 dark:text-slate-300 hover:bg-white hover:dark:bg-slate-700 hover:shadow-lg'
              }`}
              style={selectedCategory === cat.id ? {background: `linear-gradient(to right, ${LOGO_PRIMARY}, ${LOGO_SECONDARY})`} : {}}
            >
              {cat.label}
              {selectedCategory === cat.id && <ChevronRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-3xl cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700"
              onClick={() => setSelectedImage(image)}
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
              style={{animationDelay: `${index * 50}ms`}}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${image.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-10"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-20 transition-opacity duration-500 ${hoveredImage === image.id ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${image.gradient} text-white rounded-xl font-bold shadow-xl mb-2`}>
                    {image.category}
                  </div>
                  <h4 className="text-white font-bold text-lg">{image.title}</h4>
                </div>
              </div>
              <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visit Info Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-900 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-16 border border-white/50 dark:border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">Visit Us Today</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                  Schedule a tour to see our beautiful facilities in person. We'd love to show you around!
                </p>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, label: 'Location', value: '123 Akhalia Road, Sylhet 3100, Bangladesh', gradient: 'from-emerald-500 to-teal-600' },
                    { icon: Phone, label: 'Phone', value: '+880 1711-123456', gradient: 'from-sky-500 to-blue-600' },
                    { icon: Mail, label: 'Email', value: 'info@sylhetstay.com', gradient: 'from-violet-500 to-purple-600' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-slate-600 dark:text-slate-300">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wifi, label: '100 Mbps WiFi', gradient: 'from-sky-500 to-blue-600' },
                  { icon: Wind, label: 'AC Available', gradient: 'from-cyan-500 to-sky-600' },
                  { icon: Utensils, label: 'Meal Plans', gradient: 'from-orange-500 to-amber-600' },
                  { icon: Coffee, label: 'Common Room', gradient: 'from-yellow-500 to-amber-600' },
                  { icon: BookOpen, label: 'Study Rooms', gradient: 'from-indigo-500 to-violet-600' },
                  { icon: Shield, label: '24/7 Security', gradient: 'from-emerald-500 to-teal-600' },
                  { icon: Car, label: 'Parking', gradient: 'from-violet-500 to-purple-600' },
                  { icon: Dumbbell, label: 'Gym', gradient: 'from-rose-500 to-pink-600' }
                ].map((item, i) => (
                  <div key={i} className="group/item flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${item.gradient} group-hover/item:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-12 font-medium">
          {filteredImages.length} photos {selectedCategory !== 'all' && `in ${categories.find(c => c.id === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-xl"
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
              <span className={`inline-block px-4 py-2 bg-gradient-to-r ${selectedImage.gradient} text-white rounded-xl font-bold shadow-xl`}>
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