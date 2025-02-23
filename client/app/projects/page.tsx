"use client";

import { motion, stagger, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { PlusCircle, FolderOpen, Wallet, CircleDollarSign, Search, Loader2, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  images: string[];
}

type FilterType = "all" | "active" | "completed" | "trending";

export default function Projects() {
  const [inputQuery, setInputQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [campaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: "Decentralized Education Platform",
      description: "Building a blockchain-based learning management system with advanced features for student engagement and progress tracking. Implementing smart contracts for credential verification and automated assessments.",
      currentAmount: 0,
      targetAmount: 5,
      images: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"]
    },
    {
      id: 2,
      title: "Green Energy NFT Marketplace",
      description: "Connecting renewable energy producers with investors through a decentralized marketplace. Enable trading of energy certificates and carbon credits through NFTs.",
      currentAmount: 0.5,
      targetAmount: 2,
      images: ["/placeholder2.jpg", "/placeholder3.jpg"]
    },
    {
      id: 3,
      title: "DeFi Lending Protocol",
      description: "Next-generation decentralized lending platform with advanced risk management and dynamic interest rates. Supporting multiple chains and assets.",
      currentAmount: 4,
      targetAmount: 5,
      images: ["/placeholder3.jpg", "/placeholder1.jpg", "/placeholder2.jpg"]
    }
  ]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const handleSearch = async () => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSearchQuery(inputQuery);
    setIsSearching(false);
  };

  const handleClear = () => {
    setInputQuery("");
    setSearchQuery("");
    setActiveFilter("all");
    setShowFilters(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const buttonItem = {
    hidden: { opacity: 0, x: 20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20
      }
    }
  };

  const searchContainer = {
    hidden: { opacity: 0, width: "0rem" },
    show: { 
      opacity: 1,
      width: "20rem",
      transition: {
        duration: 0.75,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const filterButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: 1.0
      }
    }
  };

  const clearButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        delay: 0.1
      }
    }
  };

  const filterDropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const ImageCarousel = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const x = useMotionValue(0);
    const dragEndHandler = (event: any, info: any) => {
      const threshold = 50;
      if (Math.abs(info.offset.x) > threshold) {
        if (info.offset.x > 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else if (info.offset.x < 0 && currentIndex < images.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
      x.set(0);
    };

    return (
      <div className="relative w-full h-64 bg-neutral-700 rounded-xl overflow-hidden group">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={dragEndHandler}
          animate={{ x: 0 }}
          style={{ x }}
          className="absolute inset-0"
        >
          <motion.img
            src={images[currentIndex]}
            alt="Campaign"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {images.length > 1 && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
            
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                className={`p-2 rounded-full bg-black/50 text-white ${
                  currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={20} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => currentIndex < images.length - 1 && setCurrentIndex(currentIndex + 1)}
                className={`p-2 rounded-full bg-black/50 text-white ${
                  currentIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <motion.div
              variants={searchContainer}
              initial="hidden"
              animate="show"
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search campaigns..."
                className="w-full px-4 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none font-text focus:text-white placeholder:text-black focus:placeholder:text-white transition-colors bg-black/10 focus:bg-black/50"
              />
              <motion.button 
                variants={filterButtonVariants}
                initial="hidden"
                animate="show"
                onClick={handleSearch}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-700 text-white p-3.5 rounded-lg duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}
              </motion.button>
            </motion.div>

            <motion.div 
              ref={filterRef}
              variants={filterButtonVariants}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3.5 rounded-lg duration-200 ${showFilters ? "bg-purple-700 text-white" : "bg-black/10 hover:bg-black/20"}`}
              >
                <SlidersHorizontal size={20} />
              </motion.button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    variants={filterDropdownVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] z-10"
                  >
                    {["all", "active", "completed", "trending"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setActiveFilter(filter as FilterType);
                          setShowFilters(false);
                        }}
                        className={`w-full px-4 py-2 text-left font-text capitalize hover:bg-purple-50 ${
                          activeFilter === filter ? "text-purple-600" : "text-gray-700"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {(searchQuery || activeFilter !== "all") && (
              <motion.button
                variants={clearButtonVariants}
                initial="hidden"
                animate="show"
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="bg-black/10 hover:bg-black/20 p-3.5 rounded-lg duration-200"
              >
                <X size={20} />
              </motion.button>
            )}
          </div>

          <motion.div 
            variants={buttonContainer}
            initial="hidden"
            animate="show"
            className="flex gap-4"
          >
            <motion.button
              variants={buttonItem}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg border-2 border-black text-black font-text hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Start a Campaign
            </motion.button>
            <motion.button
              variants={buttonItem}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg border-2 border-black text-black font-text hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              <FolderOpen size={20} />
              Your Campaigns
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {campaigns
            .filter(campaign => 
              (searchQuery === "" || 
              campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              campaign.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
              (activeFilter === "all" || 
               (activeFilter === "completed" && campaign.currentAmount >= campaign.targetAmount) ||
               (activeFilter === "active" && campaign.currentAmount < campaign.targetAmount) ||
               (activeFilter === "trending" && (campaign.currentAmount / campaign.targetAmount) > 0.5))
            )
            .map((campaign) => (
            <motion.div
              key={campaign.id}
              variants={item}
              className="bg-neutral-800 rounded-xl overflow-hidden"
            >
              <ImageCarousel images={campaign.images} />
              
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 bg-neutral-700 rounded-full flex-shrink-0 flex items-center justify-center">
                    <CircleDollarSign size={32} className="text-purple-500" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-white font-block text-2xl mb-2">{campaign.title}</h3>
                        <p className="text-neutral-400 font-text text-lg">{campaign.description}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg font-text hover:bg-purple-700 transition-colors flex items-center gap-2 text-lg"
                      >
                        <CircleDollarSign size={24} />
                        Fund
                      </motion.button>
                    </div>
                    
                    <div className="mt-6">
                      <div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(campaign.currentAmount / campaign.targetAmount) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-purple-600"
                        />
                      </div>
                      
                      <p className="text-white font-text mt-3 text-lg">
                        {campaign.currentAmount} of {campaign.targetAmount} eth
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}