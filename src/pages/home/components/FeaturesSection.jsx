import React from 'react'
import { Calendar, Users, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

const FeaturesSection = () => {
  return (
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
            <div className="mt-4">
              <Link to="/courts" className="text-emerald-600 hover:underline font-medium">Browse Courts →</Link>
            </div>
          </div>
          
          <div className="text-center p-6 rounded-lg border border-border hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors bg-card">
            <div className="bg-emerald-100 dark:bg-emerald-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Community</h3>
            <p className="text-muted-foreground">
              Connect with fellow athletes and build lasting friendships through sports.
            </p>
            <div className="mt-4">
              <Link to="/register" className="text-emerald-600 hover:underline font-medium">Join Now →</Link>
            </div>
          </div>
          
          <div className="text-center p-6 rounded-lg border border-border hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors bg-card">
            <div className="bg-emerald-100 dark:bg-emerald-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Premium Courts</h3>
            <p className="text-muted-foreground">
              Access to high-quality courts with professional-grade equipment and facilities.
            </p>
            <div className="mt-4">
              <Link to="/pricing" className="text-emerald-600 hover:underline font-medium">See Pricing →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection