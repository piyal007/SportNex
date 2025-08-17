import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const FancyBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Banner images data
  const bannerImages = [
    {
      id: 1,
      title: 'Elite Fitness Center',
      subtitle: 'Transform your body, elevate your mind',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: 'Fitness'
    },
    {
      id: 2,
      title: 'World-Class Courts',
      subtitle: 'Professional grade facilities for champions',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: 'Courts'
    },
    {
      id: 3,
      title: 'Exciting Activities',
      subtitle: 'Join tournaments and community events',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: 'Activities'
    }
  ]

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-2xl">
      {/* Image Container */}
      <div className="relative w-full h-full bg-gray-900">
        {bannerImages.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              style={{
                objectFit: 'cover',
                objectPosition: index === 2 ? 'center top' : 'center center',
                minHeight: '100%',
                minWidth: '100%'
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="text-white px-6 md:px-12 lg:px-16 max-w-2xl">
                <div className="mb-2">
                  <span className="inline-block bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {slide.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-6">
                  {slide.subtitle}
                </p>
                <Link
                  to="/courts"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 cursor-pointer"
                >
                  Explore Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide
                ? 'bg-emerald-600 scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-emerald-600 transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / bannerImages.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}

export default FancyBanner