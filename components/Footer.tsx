"use client"

import React from 'react'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Complaint Management System
            </h3>
            <p className="text-slate-300 mb-4 max-w-md">
              We're committed to providing excellent customer service and resolving your concerns promptly. 
              Your feedback helps us improve our services.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Built with care for our customers</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/submit" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Submit Complaint
                </a>
              </li>
              <li>
                <a href="/login" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Register
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-sm">support@cms.com</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm">123 Business St, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              © {currentYear} Complaint Management System. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer