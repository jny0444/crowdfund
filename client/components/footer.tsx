"use client";

import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-beauty text-3xl">CrowdFund</h3>
            <p className="font-text text-gray-400 max-w-xs">
              Revolutionizing project funding through blockchain technology and smart contracts
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hover:text-purple-500 transition-colors"
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hover:text-purple-500 transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hover:text-purple-500 transition-colors"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hover:text-purple-500 transition-colors"
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-block text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 font-text">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-block text-lg mb-4">Legal</h4>
            <ul className="space-y-2 font-text">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-block text-lg mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4 font-text">Subscribe to our newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 rounded-lg px-4 py-2 font-text focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <motion.button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-text"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 font-text text-sm">
              © 2025 CrowdFund. All rights reserved.
            </p>
            <p className="text-gray-400 font-text text-sm flex items-center gap-2">
              Made with <Heart size={16} className="text-purple-500" /> by the Wonka Brothers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 