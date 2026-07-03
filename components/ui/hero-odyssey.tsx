'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Shield, Menu, X, Mail, MessageCircle, Clock, Award, Send, User } from 'lucide-react'

// ============================================
// ELASTIC HUE SLIDER (from your design prompt)
// ============================================
interface ElasticHueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const ElasticHueSlider: React.FC<ElasticHueSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 360,
  step = 1,
  label = 'Adjust Lightning Hue',
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const progress = ((value - min) / (max - min))
  const thumbPosition = progress * 100

  return (
    <div className="relative w-full max-w-xs flex flex-col items-center">
      {label && <label className="text-gray-300 text-sm mb-1">{label}</label>}
      <div className="relative w-full h-5 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-20"
          style={{ WebkitAppearance: 'none' as any }}
        />
        <div className="absolute left-0 w-full h-1 bg-gray-700 rounded-full z-0"></div>
        <div
          className="absolute left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full z-10"
          style={{ width: `${thumbPosition}%` }}
        ></div>
        <motion.div
          className="absolute top-1/2 transform -translate-y-1/2 z-30"
          style={{ left: `${thumbPosition}%` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: isDragging ? 20 : 30 }}
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-lg shadow-blue-500/50"></div>
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-gray-500 mt-2"
        >
          {value}°
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ============================================
// FEATURE ITEMS (from your design prompt)
// ============================================
interface FeatureItemProps {
  name: string;
  value: string;
  position: string;
  icon?: React.ReactNode;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ name, value, position, icon }) => {
  return (
    <div className={`absolute ${position} z-10 group transition-all duration-300 hover:scale-110`}>
      <div className="flex items-center gap-2 relative">
        <div className="relative">
          <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:animate-pulse"></div>
          <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="text-white relative">
          <div className="font-medium group-hover:text-blue-400 transition-colors duration-300 flex items-center gap-1">
            {icon}
            {name}
          </div>
          <div className="text-white/70 text-sm group-hover:text-white/70 transition-colors duration-300">{value}</div>
          <div className="absolute -inset-2 bg-white/10 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// LIGHTNING COMPONENT WITH SHADERS (from your design prompt)
// ============================================
interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
}

const Lightning: React.FC<LightningProps> = ({
  hue = 230,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const gl = canvas.getContext("webgl")
    if (!gl) {
      console.error("WebGL not supported")
      return
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(program, "aPosition")
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution")
    const iTimeLocation = gl.getUniformLocation(program, "iTime")
    const uHueLocation = gl.getUniformLocation(program, "uHue")
    const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset")
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed")
    const uIntensityLocation = gl.getUniformLocation(program, "uIntensity")
    const uSizeLocation = gl.getUniformLocation(program, "uSize")

    const startTime = performance.now()
    const render = () => {
      resizeCanvas()
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height)
      const currentTime = performance.now()
      gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0)
      gl.uniform1f(uHueLocation, hue)
      gl.uniform1f(uXOffsetLocation, xOffset)
      gl.uniform1f(uSpeedLocation, speed)
      gl.uniform1f(uIntensityLocation, intensity)
      gl.uniform1f(uSizeLocation, size)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [hue, xOffset, speed, intensity, size])

  return <canvas ref={canvasRef} className="w-full h-full relative" />
}

// ============================================
// REVIEWS DATA (5-star reviews)
// ============================================
interface Review {
  id: number;
  name: string;
  amount: string;
  date: string;
  rating: number;
  review: string;
}

const reviews: Review[] = [
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
// MAIN HERO SECTION - ALL FEATURES INCLUDED
// ============================================
export const HeroSection: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lightningHue, setLightningHue] = useState(220)
  const [currentSection, setCurrentSection] = useState<'home' | 'reviews' | 'contact'>('home')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `mailto:Oladejot431@gmail.com?subject=Crypto Recovery Inquiry from ${formData.name}&body=${formData.message}`
  }

  // ==========================================
  // RENDER REVIEWS SECTION
  // ==========================================
  const renderReviews = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto py-12 px-4"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
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
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{review.name}</h4>
                    <p className="text-gray-400 text-sm">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">{review.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-3">{review.review}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Recovered:</span>
              <span className="text-green-400 font-semibold">{review.amount}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  // ==========================================
  // RENDER CONTACT SECTION (with YOUR info)
  // ==========================================
  const renderContact = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto py-12 px-4"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
        Get in Touch
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <a href="mailto:Oladejot431@gmail.com" className="text-white hover:text-blue-400 transition-colors">
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
              <a href="https://t.me/Jason_cyberhelp" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
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
              <p className="text-white">Within 2 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Security</p>
              <p className="text-white">256-bit SSL Encryption</p>
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
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )

  // ==========================================
  // MAIN RETURN
  // ==========================================
  return (
    <div className="relative w-full bg-black text-white overflow-hidden min-h-screen">
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
        {/* ===== NAVIGATION ===== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="px-4 backdrop-blur-3xl bg-black/50 rounded-3xl py-4 flex justify-between items-center mb-8 border border-white/10"
        >
          <div className="flex items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CryptoRecovery
            </div>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <button onClick={() => setCurrentSection('home')} className="px-4 py-2 text-sm hover:text-blue-400 transition-colors">Home</button>
              <button onClick={() => setCurrentSection('reviews')} className="px-4 py-2 text-sm hover:text-blue-400 transition-colors">Reviews</button>
              <button onClick={() => setCurrentSection('contact')} className="px-4 py-2 text-sm hover:text-blue-400 transition-colors">Contact</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-4 py-2 text-sm hover:text-blue-400 transition-colors">Login</button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Start Recovery
            </button>
            <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>

        {/* ===== MOBILE MENU ===== */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-lg">
              <button
                className="absolute top-6 right-6 p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
              <button onClick={() => { setCurrentSection('home'); setMobileMenuOpen(false) }} className="px-6 py-3">Home</button>
              <button onClick={() => { setCurrentSection('reviews'); setMobileMenuOpen(false) }} className="px-6 py-3">Reviews</button>
              <button onClick={() => { setCurrentSection('contact'); setMobileMenuOpen(false) }} className="px-6 py-3">Contact</button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">Start Recovery</button>
            </div>
          </motion.div>
        )}

        {/* ===== HOME SECTION ===== */}
        {currentSection === 'home' && (
          <>
            {/* Feature Items - from your design prompt */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full z-20 relative hidden md:block"
            >
              <motion.div variants={itemVariants}>
                <FeatureItem name="React" value="for base" position="left-0 sm:left-10 top-32" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureItem name="Tailwind" value="for styles" position="left-1/4 top-16" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureItem name="Framer-motion" value="for animations" position="right-1/4 top-16" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureItem name="Shaders" value="for lightning" position="right-0 sm:right-10 top-32" />
              </motion.div>
            </motion.div>

            {/* Main Hero Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-30 flex flex-col items-center text-center max-w-4xl mx-auto mt-8"
            >
              {/* Elastic Hue Slider - from your design prompt */}
              <motion.div variants={itemVariants} className="mb-4">
                <ElasticHueSlider
                  value={lightningHue}
                  onChange={setLightningHue}
                  label="Adjust Lightning Hue"
                />
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm mb-6 border border-white/10"
              >
                <span>⭐ Trusted by 200+ clients</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
              >
                Recover Your
              </motion.h1>

              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                Stolen Crypto
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-gray-400 mb-8 max-w-2xl text-base sm:text-lg"
              >
                Professional blockchain recovery service with 200+ 5-star reviews. 
                We help victims recover their stolen cryptocurrency assets.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md"
              >
                <button className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  Start Recovery Now
                </button>
                <button 
                  onClick={() => setCurrentSection('reviews')}
                  className="w-full px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                >
                  View Reviews
                </button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-400"
              >
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
              </motion.div>
            </motion.div>
          </>
        )}

        {/* ===== REVIEWS SECTION ===== */}
        {currentSection === 'reviews' && renderReviews()}

        {/* ===== CONTACT SECTION ===== */}
        {currentSection === 'contact' && renderContact()}
      </div>

      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-gradient-to-b from-blue-500/20 to-purple-600/10 blur-3xl"></div>
        
        {/* Lightning - only on home section */}
        {currentSection === 'home' && (
          <div className="absolute top-0 w-full left-1/2 transform -translate-x-1/2 h-full">
            <Lightning
              hue={lightningHue}
              xOffset={0}
              speed={1.6}
              intensity={0.6}
              size={2}
            />
          </div>
        )}
        
        <div className="z-10 absolute top-[55%] left-1/2 transform -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] backdrop-blur-3xl rounded-full bg-[radial-gradient(circle_at_25%_90%,#1e386b15%,#000000de70%,#000000ed_100%)]"></div>
      </div>
    </div>
  )
                            }
