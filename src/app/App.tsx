import { useState } from 'react';
import { Search, Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, MapPin, Phone, Mail, Menu, X, Home, Utensils, Dumbbell, Camera, CheckCircle2, Star, ChevronRight, Building2 } from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    roomType: '',
    seats: '',
    maxPrice: ''
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">SylhetStay Hostel</h1>
                <p className="text-xs text-muted-foreground">Premium Student Living</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#rooms" className="text-sm text-foreground hover:text-primary transition-colors">Rooms</a>
              <a href="#facilities" className="text-sm text-foreground hover:text-primary transition-colors">Facilities</a>
              <a href="#gallery" className="text-sm text-foreground hover:text-primary transition-colors">Gallery</a>
              <a href="#about" className="text-sm text-foreground hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-sm text-foreground hover:text-primary transition-colors">Contact</a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#rooms" className="block py-2 text-foreground hover:text-primary">Rooms</a>
              <a href="#facilities" className="block py-2 text-foreground hover:text-primary">Facilities</a>
              <a href="#gallery" className="block py-2 text-foreground hover:text-primary">Gallery</a>
              <a href="#about" className="block py-2 text-foreground hover:text-primary">About</a>
              <a href="#contact" className="block py-2 text-foreground hover:text-primary">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/50 to-secondary/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-sm">Located in Sylhet, Bangladesh</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Your Home Away From Home in <span className="text-primary">Sylhet</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience premium student accommodation with modern amenities, study-friendly environment, and a vibrant community in the heart of Sylhet.
            </p>

            {/* Search Widget */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-left">Room Type</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchFilters.roomType}
                    onChange={(e) => setSearchFilters({...searchFilters, roomType: e.target.value})}
                  >
                    <option value="">All Types</option>
                    <option value="single">Single</option>
                    <option value="shared">Shared</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-left">Seats</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchFilters.seats}
                    onChange={(e) => setSearchFilters({...searchFilters, seats: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="4">4 People</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-left">Max Price</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Availability Cards */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">Available Now</span>
              </div>
              <h3 className="text-xl mb-2">12 Seats Available</h3>
              <p className="text-muted-foreground text-sm mb-4">Across all room types</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-primary">৳4,500/mo</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Popular</span>
              </div>
              <h3 className="text-xl mb-2">Premium Rooms</h3>
              <p className="text-muted-foreground text-sm mb-4">AC + Attached Bath</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-primary">৳10,500/mo</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Limited Offer</span>
              </div>
              <h3 className="text-xl mb-2">Early Bird Discount</h3>
              <p className="text-white/90 text-sm mb-4">Book 3 months, get 10% off</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">Save ৳1,350</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Overview */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Welcome to <span className="text-primary">SylhetStay</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Established in 2020, SylhetStay Hostel has been providing exceptional accommodation to students pursuing their academic dreams in Sylhet. We understand the importance of a comfortable, safe, and study-conducive environment.
              </p>
              <p className="text-muted-foreground mb-8">
                Our hostel combines modern amenities with traditional hospitality, creating a perfect balance for students from all over Bangladesh and beyond. With state-of-the-art facilities and a supportive community, we ensure your stay is memorable and productive.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">150+</div>
                  <div className="text-sm text-muted-foreground">Happy Students</div>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">4.8</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Room Options</div>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Security</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1620332372374-f108c53d2e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern hostel room"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1753505888770-46be3b748b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Study area"
                className="rounded-xl shadow-lg w-full h-64 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1721299417031-de890ff33b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Bunk beds"
                className="rounded-xl shadow-lg w-full h-64 object-cover -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1753505889211-9cfbac527474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cozy bedroom"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section id="facilities" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              World-Class <span className="text-primary">Facilities</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for a comfortable and productive stay, all under one roof
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-7 h-7 text-primary" />
              </div>
              <h4 className="mb-2">High-Speed WiFi</h4>
              <p className="text-sm text-muted-foreground">100 Mbps fiber optic</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="w-7 h-7 text-secondary" />
              </div>
              <h4 className="mb-2">Air Conditioning</h4>
              <p className="text-sm text-muted-foreground">In premium rooms</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-7 h-7 text-primary" />
              </div>
              <h4 className="mb-2">Dining Hall</h4>
              <p className="text-sm text-muted-foreground">3 meals daily</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-7 h-7 text-secondary" />
              </div>
              <h4 className="mb-2">Common Room</h4>
              <p className="text-sm text-muted-foreground">Recreation area</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h4 className="mb-2">Study Rooms</h4>
              <p className="text-sm text-muted-foreground">Quiet & peaceful</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-secondary" />
              </div>
              <h4 className="mb-2">24/7 Security</h4>
              <p className="text-sm text-muted-foreground">CCTV & guards</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-7 h-7 text-primary" />
              </div>
              <h4 className="mb-2">Parking</h4>
              <p className="text-sm text-muted-foreground">Bike & car spaces</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-7 h-7 text-secondary" />
              </div>
              <h4 className="mb-2">Fitness Center</h4>
              <p className="text-sm text-muted-foreground">Modern equipment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Perfect Room</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Flexible options to match your budget and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGRvcm0lMjByb29tfGVufDF8fHx8MTc3NzIwMzU3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Shared room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                  4 Beds
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Shared Room</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Perfect for students looking for an affordable option with a vibrant community
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    4 bunk beds
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Shared bathroom
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Study desk & chair
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Wardrobe space
                  </li>
                </ul>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">৳4,500</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border-2 border-primary hover:shadow-xl transition-shadow relative">
              <div className="absolute top-4 left-4 bg-secondary text-white px-4 py-1 rounded-full text-sm z-10">
                Most Popular
              </div>
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1771327811795-6197403af846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Semi-private room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                  2 Beds
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Semi-Private</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Great balance of privacy and affordability with modern amenities
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    2 single beds
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Attached bathroom
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Individual study desks
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Ceiling fan
                  </li>
                </ul>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">৳7,500</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1663811397091-9a13493eff11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Premium room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                  1 Bed
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Premium Single</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Ultimate privacy and comfort with premium features for serious students
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Private room
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Attached bathroom
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Air conditioning
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Premium furniture
                  </li>
                </ul>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">৳10,500</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section id="gallery" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Explore Our <span className="text-primary">Space</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Take a virtual tour of our modern facilities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group overflow-hidden rounded-xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1620332372374-f108c53d2e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Gallery 1"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1721299417031-de890ff33b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Gallery 2"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1753505888770-46be3b748b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Gallery 3"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1753505889211-9cfbac527474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Gallery 4"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1723259457560-b76d597f709b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Gallery 5"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1635321349359-333da6bb6da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3MjAzNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Gallery 6"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1772944780860-e99bd902d59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGRvcm0lMjByb29tfGVufDF8fHx8MTc3NzIwMzU3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Gallery 7"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer">
              <div className="text-center text-white">
                <div className="text-3xl font-bold mb-2">+24</div>
                <div className="text-sm">More Photos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our <span className="text-primary">Students Say</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Real experiences from our hostel community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "SylhetStay has been my home for the past 2 years. The facilities are excellent, and the staff is incredibly supportive. The study environment here helped me maintain my GPA!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">AR</span>
                </div>
                <div>
                  <div className="font-semibold">Arafat Rahman</div>
                  <div className="text-sm text-muted-foreground">SUST, Computer Science</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "The location is perfect, close to my university. WiFi is super fast, and the food quality is great. Made lots of friends here. Highly recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-secondary font-semibold">FH</span>
                </div>
                <div>
                  <div className="font-semibold">Fatima Hassan</div>
                  <div className="text-sm text-muted-foreground">Metropolitan University</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "As a first-year student from Dhaka, I was nervous about living away from home. The hostel management made the transition so smooth. Feels like a second home!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">MK</span>
                </div>
                <div>
                  <div className="font-semibold">Mehedi Khan</div>
                  <div className="text-sm text-muted-foreground">Sylhet Medical College</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Regulations */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-primary">Rules</span> & Guidelines
              </h2>
              <p className="text-muted-foreground text-lg">
                Simple rules to ensure a safe and harmonious living environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2">Entry & Exit Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Main gate closes at 10 PM. Late entry requires prior permission from management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2">Visitor Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      Visitors allowed in common areas only, between 9 AM - 6 PM with prior notice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="mb-2">Quiet Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintain silence in corridors and rooms after 11 PM to respect others' study time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="mb-2">Cleanliness</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep your room and common areas clean. Weekly room inspections conducted.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2">Food & Cooking</h4>
                    <p className="text-sm text-muted-foreground">
                      No cooking in rooms. Meals provided in dining hall. Outside food allowed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2">Safety & Security</h4>
                    <p className="text-sm text-muted-foreground">
                      ID cards must be carried always. Report any suspicious activity immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Find <span className="text-primary">Our Location</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Conveniently located in the heart of Sylhet
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-muted/50 rounded-2xl overflow-hidden aspect-video lg:aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">SylhetStay Hostel</h3>
                <p className="text-muted-foreground">
                  123 Akhalia Road, Sylhet 3100<br />
                  Near SUST Campus<br />
                  Sylhet, Bangladesh
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-accent/50 rounded-xl p-6">
                <h4 className="mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Nearby Landmarks
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    SUST Campus - 5 min walk
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Metropolitan University - 10 min
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Sylhet Medical College - 15 min
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Akhalia Bus Stand - 8 min walk
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Jalalabad Ragib Rabeya Medical College - 20 min
                  </li>
                </ul>
              </div>

              <div className="bg-accent/50 rounded-xl p-6">
                <h4 className="mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-secondary" />
                  Local Amenities
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-secondary" />
                    Restaurants & Cafes nearby
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-secondary" />
                    Grocery stores within walking distance
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-secondary" />
                    Banks & ATMs available
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-secondary" />
                    Pharmacy & medical facilities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to Make SylhetStay Your Home?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join our community of successful students. Contact us today for a tour or to reserve your spot!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h4 className="mb-2">Call Us</h4>
                <p className="text-white/90">+880 1711-123456</p>
                <p className="text-white/90">+880 1811-654321</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h4 className="mb-2">Email Us</h4>
                <p className="text-white/90">info@sylhetstay.com</p>
                <p className="text-white/90">booking@sylhetstay.com</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <MapPin className="w-8 h-8 mx-auto mb-3" />
                <h4 className="mb-2">Visit Us</h4>
                <p className="text-white/90">123 Akhalia Road</p>
                <p className="text-white/90">Sylhet 3100, BD</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Schedule a Tour
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6" />
                <span className="font-semibold">SylhetStay</span>
              </div>
              <p className="text-white/70 text-sm">
                Premium student accommodation in the heart of Sylhet, Bangladesh.
              </p>
            </div>

            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#rooms" className="hover:text-white">Room Types</a></li>
                <li><a href="#facilities" className="hover:text-white">Facilities</a></li>
                <li><a href="#gallery" className="hover:text-white">Gallery</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Admission Process</a></li>
                <li><a href="#" className="hover:text-white">Payment Options</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>123 Akhalia Road, Sylhet 3100</li>
                <li>+880 1711-123456</li>
                <li>info@sylhetstay.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2026 SylhetStay Hostel. All rights reserved. | Powered by Modern Hostel Management System</p>
          </div>
        </div>
      </footer>

      {/* Sticky Book Button */}
      <button className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-8 py-4 rounded-full shadow-2xl hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 z-40">
        <Home className="w-5 h-5" />
        Apply / Book Seat
      </button>
    </div>
  );
}
