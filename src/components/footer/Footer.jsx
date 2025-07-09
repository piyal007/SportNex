import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-md shadow-sm border-t border-border/50 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-emerald-600">SportNex</h3>
            <p className="text-sm text-muted-foreground mt-1">© {new Date().getFullYear()} All rights reserved</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
