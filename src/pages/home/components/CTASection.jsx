import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const CTASection = () => {
  return (
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
  )
}

export default CTASection