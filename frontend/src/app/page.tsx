'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { 
  Zap, 
  Image, 
  Video, 
  Sparkles, 
  Clock, 
  Shield, 
  Cpu, 
  ArrowRight,
  Play
} from 'lucide-react';

const features = [
  {
    icon: Image,
    title: 'Advanced Image Generation',
    description: 'Create stunning images with 12+ premium AI models including Stable Diffusion, DALL-E style, and custom artistic models.',
  },
  {
    icon: Video,
    title: 'Cinematic Video Creation',
    description: 'Generate high-quality videos with motion, camera movements, and temporal consistency using cutting-edge video models.',
  },
  {
    icon: Cpu,
    title: 'Multi-Provider Integration',
    description: 'Access models from Replicate, HuggingFace, and local GPU-accelerated Stable Diffusion for maximum flexibility.',
  },
  {
    icon: Clock,
    title: 'Lightning Fast Generation',
    description: 'Optimized inference pipelines deliver results in seconds, not minutes. Local models for instant generation.',
  },
  {
    icon: Shield,
    title: 'Credit-Based System',
    description: 'Transparent pricing with credits. No hidden fees. Pay only for what you generate with flexible plans.',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Professional-grade outputs suitable for commercial use. High-resolution images and videos with stunning detail.',
  },
];

const models = [
  { name: 'Cineo Vision Pro', type: 'Image', provider: 'Replicate', credits: 5 },
  { name: 'Cineo Motion', type: 'Video', provider: 'Replicate', credits: 25 },
  { name: 'Cineo ConceptArt', type: 'Image', provider: 'HuggingFace', credits: 3 },
  { name: 'Cineo LocalVision', type: 'Image', provider: 'Local', credits: 1 },
];

export default function HomePage() {
  return (
    <MainLayout>
      <div className="relative">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                <span className="gradient-text">Next-Generation AI</span>
                <br />
                <span className="text-foreground">Image & Video Creation</span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-muted-foreground leading-8">
                Transform your ideas into stunning visuals with our cutting-edge AI models. 
                Create professional images and cinematic videos in seconds with Cineo AI.
              </p>
              
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/dashboard">
                  <Button variant="neon" size="lg" className="text-lg px-8 py-4 glow-effect">
                    Start Creating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <Button variant="glass" size="lg" className="text-lg px-8 py-4">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20">
              <div className="w-96 h-96 bg-cineo-gradient rounded-full" />
            </div>
            <div className="absolute right-1/4 top-1/4 blur-3xl opacity-10">
              <div className="w-64 h-64 bg-cineo-purple rounded-full" />
            </div>
            <div className="absolute left-1/4 bottom-1/4 blur-3xl opacity-10">
              <div className="w-64 h-64 bg-cineo-blue rounded-full" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Powerful Features for Creators
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to bring your creative vision to life with AI
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-neon-blue/20 transition-all duration-300 hover:scale-105">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-cineo-gradient/20 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-cineo-blue" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Models Showcase */}
        <section className="py-24 sm:py-32 px-6 lg:px-8 bg-black/20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Premium AI Models
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Access the best AI models from multiple providers
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {models.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-neon-purple/20 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>
                        {model.type} • {model.provider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center space-x-1 text-cineo-blue">
                        <Zap className="w-4 h-4" />
                        <span className="font-semibold">{model.credits} credits</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/models">
                <Button variant="glass" size="lg">
                  View All Models
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32 px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                Join thousands of creators using Cineo AI to bring their ideas to life
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button variant="neon" size="lg" className="glow-effect w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <Link href="/models">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Models
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
