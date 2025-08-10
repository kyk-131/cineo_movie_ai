'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Zap, Image, Video, Database, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Zap },
  { name: 'Image Generation', href: '/image-generation', icon: Image },
  { name: 'Video Generation', href: '/video-generation', icon: Video },
  { name: 'Model Info', href: '/models', icon: Database },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cineo-gradient flex items-center justify-center">
                <span className="text-sm font-bold text-cineo-black">C</span>
              </div>
              <span className="text-xl font-space-grotesk font-bold gradient-text">
                Cineo AI
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "neon" : "glass"}
                    size="sm"
                    className={cn(
                      "text-sm font-medium transition-all duration-300",
                      isActive && "shadow-neon-blue"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 glass-card px-3 py-1">
              <Zap className="w-4 h-4 text-cineo-blue" />
              <span className="text-sm font-medium">1,250 credits</span>
            </div>
            
            <Button variant="glass" size="icon">
              <User className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "neon" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "shadow-neon-blue"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}