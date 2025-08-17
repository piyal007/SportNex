import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-emerald-400">SportNex</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your premier sports club destination. Join us for world-class facilities, 
              professional coaching, and an amazing community of sports enthusiasts.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Sports Avenue, Gulshan-2<br />
                  Dhaka 1212, Bangladesh
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+880 1700-123456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@sportnex.com</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors duration-300 cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors duration-300 cursor-pointer"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors duration-300 cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors duration-300 cursor-pointer"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-xs">
              Stay connected for updates, events, and exclusive offers!
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SportNex. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm cursor-pointer">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm cursor-pointer">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
