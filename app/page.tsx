'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Shield, Mail, MessageCircle, Clock, Award, Send, Menu, X, User } from 'lucide-react'

// ============================================
// REVIEWS DATA
// ============================================
const reviews = [
  {
    id: 1,
    name: 'John Anderson',
    amount: '$245,000',
    date: '2 days ago',
    rating: 5,
    review: 'I lost my crypto in a phishing attack. This team recovered everything within 24 hours! Absolutely incredible service.'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    amount: '$890,000',
    date: '5 days ago',
    rating: 5,
    review: 'Professional, fast, and trustworthy. They recovered my stolen Bitcoin and guided me through every step. Highly recommend!'
  },
  {
    id: 3,
    name: 'Michael Chen',
    amount: '$156,000',
    date: '1 week ago',
    rating: 5,
    review: 'I was skeptical at first, but they proved me wrong. Recovered my Ethereum in just 18 hours. Amazing team!'
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    amount: '$512,000',
    date: '2 weeks ago',
    rating: 5,
    review: 'The best crypto recovery service out there. They recovered my USDT and even helped me secure my wallet. 5 stars!'
  }
]

// ============================================
// MAIN COMPONENT
// ============================================
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<'home' | 'reviews' | 'contact'>('home')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `mailto:Oladejot431@gmail.com?subject=Crypto Recovery Inquiry from ${formData.name}&body=${formData.message}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ===== NAVIGATION ===== */}
        <nav className="flex justify-between items-center mb-12 px-4 py-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CryptoRecovery
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setCurrentSection('home')} className="hover:text-blue-400 transition">Home</button>
            <button onClick={() => setCurrentSection('reviews')} className="hover:text-blue-400 transition">Reviews</button>
            <button onClick={() => setCurrentSection('contact')} className="hover:text-blue-400 transition">Contact</button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm hover:shadow-lg hover:shadow-blue-500/30 transition">
              Start Recovery
            </button>
          </div>
          
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* ===== MOBILE MENU ===== */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-6">
            <button className="absolute top-6 right-6" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
            <button onClick={() => { setCurrentSection('home'); setMobileMenuOpen(false) }} className="text-xl">Home</button>
            <button onClick={() => { setCurrentSection('reviews'); setMobileMenuOpen(false) }} className="text-xl">Reviews</button>
            <button onClick={() => { setCurrentSection('contact'); setMobileMenuOpen(false) }} className="text-xl">Contact</button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">Start Recovery</button>
          </div>
        )}

        {/* ========================================== */}
        {/* ===== HOME SECTION ===== */}
        {/* ========================================== */}
        {currentSection === 'home' && (
          <div className="flex flex-col items-center text-center py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm mb-6 border border-white/10">
              <span>⭐ Trusted by 200+ clients</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Recover Your
            </h1>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stolen Crypto
            </h2>

            <p className="text-gray-400 max-w-2xl text-lg mb-8">
              Professional blockchain recovery service with 200+ 5-star reviews. 
              We help victims recover their stolen cryptocurrency assets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition">
                Start Recovery Now
              </button>
              <button 
                onClick={() => setCurrentSection('reviews')}
                className="px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                View Reviews
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-2">4.9/5</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span>100% Secure</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div>24/7 Support</div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ===== REVIEWS SECTION ===== */}
        {/* ========================================== */}
        {currentSection === 'reviews' && (
          <div className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
              What Our Clients Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-400 ml-2">4.9/5 from 200+ reviews</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{review.name}</h4>
                          <p className="text-gray-400 text-sm">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">{review.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{review.review}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Recovered:</span>
                    <span className="text-green-400 font-semibold">{review.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ===== CONTACT SECTION ===== */}
        {/* ========================================== */}
        {currentSection === 'contact' && (
          <div className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Get in Touch
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:Oladejot431@gmail.com" className="hover:text-blue-400 transition">
                      Oladejot431@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Telegram</p>
                    <a href="https://t.me/Jason_cyberhelp" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
                      @Jason_cyberhelp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Response Time</p>
                    <p>Within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Security</p>
                    <p>256-bit SSL Encryption</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">200+ verified 5-star reviews</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">Your Message</label>
                    <textarea
                      placeholder="Describe your situation..."
                      rows={5}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <footer className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2024 CryptoRecovery. All rights reserved.</p>
          <p className="mt-1">Recovered over $5M+ in stolen crypto assets</p>
        </footer>

      </div>
    </div>
  )
                      }
