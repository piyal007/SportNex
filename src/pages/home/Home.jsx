import React from 'react'
import useTitle from '@/hooks/useTitle'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react'
import FancyBanner from './components/FancyBanner'
import AboutClub from './components/AboutClub'
import LocationSection from './components/LocationSection'
import PromotionsSection from './components/PromotionsSection'

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
       <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose SportNex?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of sports court booking with our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-border hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors bg-card">
              <div className="bg-emerald-100 dark:bg-emerald-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Book your favorite courts in just a few clicks. Simple, fast, and reliable.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors bg-card">
              <div className="bg-emerald-100 dark:bg-emerald-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow athletes and build lasting friendships through sports.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors bg-card">
              <div className="bg-emerald-100 dark:bg-emerald-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Premium Courts</h3>
              <p className="text-muted-foreground">
                Access to high-quality courts with professional-grade equipment and facilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of athletes who trust SportNex for their court booking needs.
          </p>
          <Button className="bg-white text-emerald-600 hover:bg-gray-50 dark:bg-gray-100 dark:hover:bg-gray-200 px-8 py-3 text-lg font-semibold cursor-pointer">
            Sign Up Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Home
