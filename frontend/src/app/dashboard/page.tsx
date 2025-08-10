'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { GenerationCard } from '@/components/dashboard/generation-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DashboardData } from '@/lib/api';
import { 
  Zap, 
  Image, 
  Video, 
  TrendingUp, 
  Plus, 
  CreditCard,
  Sparkles,
  ArrowRight,
  Gift
} from 'lucide-react';

// Mock data for development
const mockDashboardData: DashboardData = {
  user: {
    id: '1',
    email: 'user@example.com',
    credits: 1250,
    plan: 'Pro Plan',
    created_at: '2024-01-01T00:00:00Z',
  },
  recent_generations: [
    {
      id: '1',
      prompt: 'A futuristic cityscape with neon lights and flying cars, cyberpunk style',
      model_id: 'cineo-vision-pro',
      result_url: 'https://picsum.photos/512/512?random=1',
      type: 'image',
      created_at: '2024-01-20T14:30:00Z',
      credits_used: 5,
    },
    {
      id: '2',
      prompt: 'Majestic dragon flying over ancient mountains at sunset',
      model_id: 'cineo-conceptart',
      result_url: 'https://picsum.photos/512/512?random=2',
      type: 'image',
      created_at: '2024-01-20T12:15:00Z',
      credits_used: 3,
    },
    {
      id: '3',
      prompt: 'Ocean waves crashing against rocks in slow motion',
      model_id: 'cineo-motion',
      result_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      type: 'video',
      created_at: '2024-01-19T16:45:00Z',
      credits_used: 25,
    },
    {
      id: '4',
      prompt: 'Portrait of a wise old wizard with glowing staff',
      model_id: 'cineo-portraitmaster',
      result_url: 'https://picsum.photos/512/512?random=4',
      type: 'image',
      created_at: '2024-01-19T09:20:00Z',
      credits_used: 4,
    },
  ],
  usage_stats: {
    total_generations: 127,
    credits_used_this_month: 340,
    images_generated: 89,
    videos_generated: 38,
  },
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!dashboardData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </MainLayout>
    );
  }

  const creditProgress = (dashboardData.usage_stats.credits_used_this_month / 500) * 100;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Welcome back!
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to create something amazing?
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/image-generation">
                <Button variant="neon" className="glow-effect">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Image
                </Button>
              </Link>
              
              <Link href="/video-generation">
                <Button variant="glass">
                  <Video className="w-4 h-4 mr-2" />
                  Create Video
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Available Credits"
            value={dashboardData.user.credits}
            subtitle={`${dashboardData.user.plan} • Renews monthly`}
            icon={Zap}
            trend={{
              value: 12,
              label: 'vs last month',
              isPositive: true,
            }}
          />
          
          <StatCard
            title="Images Generated"
            value={dashboardData.usage_stats.images_generated}
            subtitle="This month"
            icon={Image}
            trend={{
              value: 8,
              label: 'vs last month',
              isPositive: true,
            }}
          />
          
          <StatCard
            title="Videos Created"
            value={dashboardData.usage_stats.videos_generated}
            subtitle="This month"
            icon={Video}
            trend={{
              value: 15,
              label: 'vs last month',
              isPositive: true,
            }}
          />
          
          <StatCard
            title="Total Generations"
            value={dashboardData.usage_stats.total_generations}
            subtitle="All time"
            icon={TrendingUp}
          />
        </motion.div>

        {/* Credits Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glow-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-cineo-blue" />
                    <span>Credit Usage</span>
                  </CardTitle>
                  <CardDescription>
                    {dashboardData.usage_stats.credits_used_this_month} of 500 credits used this month
                  </CardDescription>
                </div>
                
                <Button variant="outline" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={creditProgress} className="h-2" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {500 - dashboardData.usage_stats.credits_used_this_month} credits remaining
                  </span>
                  <span>
                    Resets in 12 days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Generations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Recent Generations
            </h2>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardData.recent_generations.map((generation, index) => (
              <motion.div
                key={generation.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GenerationCard generation={generation} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Get Started Card */}
          <Card className="hover:shadow-neon-blue/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cineo-blue" />
                <span>New to Cineo AI?</span>
              </CardTitle>
              <CardDescription>
                Check out our most popular models and start creating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/models">
                  <Button variant="glass" className="w-full justify-start">
                                       <Image className="w-4 h-4 mr-2" />
                     Explore AI Models
                  </Button>
                </Link>
                
                <Link href="/image-generation">
                  <Button variant="ghost" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Try Image Generation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Promo Card */}
          <Card className="bg-cineo-gradient/5 border-cineo-gradient/20 hover:shadow-neon-purple/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-cineo-purple" />
                <span>Special Offer</span>
              </CardTitle>
              <CardDescription>
                Get 50% more credits with annual Pro subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Limited time offer - Save big on yearly plans
                </div>
                
                <Button variant="neon" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}