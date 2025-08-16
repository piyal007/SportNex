import React from 'react'
import useTitle from '@/hooks/useTitle'
import FancyBanner from './components/FancyBanner'
import AboutClub from './components/AboutClub'
import LocationSection from './components/LocationSection'
import PromotionsSection from './components/PromotionsSection'
import FeaturesSection from './components/FeaturesSection'
import CTASection from './components/CTASection'
import TestimonialsSection from './components/TestimonialsSection'

const Home = () => {
  useTitle('Home')

  return (
    <div className="min-h-screen">
      {/* Fancy Banner Section */}
      <section className="py-2 md:py-4">
        <div className="container mx-auto px-4">
          <FancyBanner />
        </div>
      </section>

      {/* About Club Section */}
      <AboutClub />

      {/* Location Section */}
      <LocationSection />

      {/* Promotions Section */}
      <PromotionsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default Home
