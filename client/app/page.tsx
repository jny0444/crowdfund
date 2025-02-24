"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { FastForward, Globe, Shield } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  const scrollToFeatures = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth"
    });
  };

  return (
    <>
      <div className="bg-gradient-to-b from-neutral-100 to-neutral-200">
          <div className="relative flex flex-col items-center justify-center min-h-screen gap-10 overflow-hidden">
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-block text-center px-4"
          >
            The crowdfunding platform <span className="font-beauty font-bold text-[1.1em] text-purple-600 selection:text-white selection:bg-purple-700">o</span>n chain
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 font-text text-center max-w-xl px-4"
          >
            Revolutionizing project funding through blockchain technology and smart contracts
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-row items-center justify-center gap-6 font-text z-10"
          >
            <button 
              onClick={scrollToFeatures}
              className="border-2 border-black px-8 py-3 text-xl rounded-lg hover:rounded-xl hover:shadow-2xl hover:bg-black hover:text-white active:scale-95 duration-200"
            >
              Read More
            </button>
            <Link href={"/projects"} className="bg-purple-600 text-white px-8 py-3 text-xl rounded-lg hover:rounded-xl hover:shadow-2xl hover:bg-purple-700 active:scale-95 duration-200">
              Get Started
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.03 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -bottom-40 text-[24rem] font-beauty select-none"
          >
            CrowdFund
          </motion.div>
        </div>

        <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 duration-300"
            >
              <div className="h-16 w-16 bg-purple-100 rounded-xl mb-6 flex items-center justify-center">
                <Shield className="text-purple-600" size={34}/>
              </div>
              <h3 className="text-2xl font-block mb-4">Secure Blockchain Backing</h3>
              <p className="font-text">Every project is backed by smart contracts, ensuring transparent and secure fund management through cryptocurrency transactions.</p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 duration-300"
            >
              <div className="h-16 w-16 bg-purple-100 rounded-xl mb-6 flex items-center justify-center">
                <Globe className="text-purple-600" size={34}/>
              </div>
              <h3 className="text-2xl font-block mb-4">Global Accessibility</h3>
              <p className="font-text">Access projects and contribute from anywhere in the world using crypto, eliminating traditional banking barriers.</p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 duration-300"
            >
              <div className="h-16 w-16 bg-purple-100 rounded-xl mb-6 flex items-center justify-center">
                <FastForward className="text-purple-600" size={34}/>
              </div>
              <h3 className="text-2xl font-block mb-4">Instant Transactions</h3>
              <p className="font-text">Experience lightning-fast funding with immediate crypto transfers, no more waiting for bank processing times.</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-32 text-center"
          >
            <span className="font-beauty text-purple-600 text-3xl">Benefits</span>
            <h2 className="text-5xl font-block mb-16">Why Choose CrowdFund</h2>
            
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div 
                  className="space-y-6 p-8 bg-purple-50 rounded-2xl"
                >
                  <h3 className="text-3xl font-block text-purple-600">For Creators</h3>
                  <ul className="text-left space-y-4 font-text">
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Reach a global audience of crypto investors
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Lower transaction fees compared to traditional platforms
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Automated fund distribution through smart contracts
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Real-time tracking of contributions
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="space-y-6 p-8 bg-purple-50 rounded-2xl"
                >
                  <h3 className="text-3xl font-block text-purple-600">For Backers</h3>
                  <ul className="text-left space-y-4 font-text">
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Secure investment tracking on the blockchain
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Direct connection with project creators
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Transparent fund allocation
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      Potential for tokenized rewards
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
