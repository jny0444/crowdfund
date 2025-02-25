"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Github, Wallet } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Navbar = () => {
  const { scrollY } = useScroll();
  const router = useRouter();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(0, 0, 0, 0.75)"]
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(10px)"]
  );
  
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0, 0, 0, 0)", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"]
  );
  
  const textColor = useTransform(
    scrollY,
    [0, 100],
    ["#000", "#fff"]
  );
  
  const marginTop = useTransform(
    scrollY,
    [0, 100],
    ["0.5rem", "0rem"]
  );
  
  const paddingSides = useTransform(
    scrollY,
    [0, 100],
    ["4rem", "1rem"]
  );
  
  const padding = useTransform(
    scrollY,
    [0, 100],
    ["1.5rem", "1rem"]
  );
  
  const textShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 2px 4px rgba(0,0,0,0.1)", "none"]
  );

  const { address, connectWallet, disconnect, isConnected } = useWallet();

  const formatAddress = (addr: string | undefined): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleWalletClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connectWallet();
    }
  };

  return (
    <motion.nav
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        boxShadow,
        marginTop,
        padding,
      }}
      className="fixed w-full z-50"
    >
      <motion.div 
        className="mx-auto flex items-center justify-between"
        style={{
          paddingLeft: paddingSides,
          paddingRight: paddingSides,
        }}
      >
        <motion.p 
          className="font-beauty text-4xl"
          style={{
            color: textColor,
            textShadow,
          }}
        >
          <Link href={"/"}>CrowdFund</Link>
        </motion.p>
        <div className="flex items-center gap-4">
          <motion.a
            href="https://github.com/yourusername/crowdfund"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-100"
            style={{ 
              color: textColor,
              borderColor: textColor 
            }}
          >
            <Github size={20} />
            <span className="font-text">GitHub</span>
          </motion.a>
          <motion.button 
            onClick={handleWalletClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-text active:scale-100"
          >
            <Wallet size={20} />
            <span>
              {isConnected ? formatAddress(address) : "Connect"}
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar; 