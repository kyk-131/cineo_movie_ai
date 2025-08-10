'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-gradient">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 pt-16"
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
}