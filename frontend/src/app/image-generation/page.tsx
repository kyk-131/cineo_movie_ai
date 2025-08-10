'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { ModelCard } from '@/components/generation/model-card';
import { GenerationForm } from '@/components/generation/generation-form';
import { GenerationCard } from '@/components/dashboard/generation-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIModel, GenerationRequest, Generation, apiService } from '@/lib/api';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Filter, 
  Grid3X3,
  List,
  RefreshCw,
  Zap
} from 'lucide-react';

// Mock models for development
const mockImageModels: AIModel[] = [
  {
    id: 'cineo-vision-pro',
    name: 'Cineo Vision Pro',
    description: 'Premium high-resolution image generation with SDXL. Perfect for professional artwork and detailed scenes.',
    provider: 'replicate',
    credits_per_generation: 5,
    type: 'image',
    category: 'premium',
    features: ['High resolution', 'Premium quality', 'Professional grade'],
    available: true
  },
  {
    id: 'cineo-localvision',
    name: 'Cineo LocalVision',
    description: 'High-quality local generation with GPU acceleration. Instant results at the lowest cost.',
    provider: 'local',
    credits_per_generation: 1,
    type: 'image',
    category: 'local',
    features: ['Instant generation', 'GPU accelerated', 'Lowest cost'],
    available: true
  },
  {
    id: 'cineo-ultrareal',
    name: 'Cineo UltraReal',
    description: 'Photorealistic image generation for lifelike portraits and scenes.',
    provider: 'replicate',
    credits_per_generation: 4,
    type: 'image',
    category: 'realistic',
    features: ['Photorealistic', 'Portrait optimized', 'High detail'],
    available: true
  },
  {
    id: 'cineo-conceptart',
    name: 'Cineo ConceptArt',
    description: 'Digital concept art and illustrations perfect for game design and creative projects.',
    provider: 'huggingface',
    credits_per_generation: 3,
    type: 'image',
    category: 'artistic',
    features: ['Concept art', 'Digital painting', 'Creative design'],
    available: true
  },
  {
    id: 'cineo-animecraft',
    name: 'Cineo AnimeCraft',
    description: 'Anime and manga style illustrations with authentic Japanese art aesthetics.',
    provider: 'huggingface',
    credits_per_generation: 3,
    type: 'image',
    category: 'anime',
    features: ['Anime style', 'Manga artwork', 'Japanese aesthetics'],
    available: true
  },
  {
    id: 'cineo-3dform',
    name: 'Cineo 3DForm',
    description: '3D rendered style images with depth and professional rendering quality.',
    provider: 'replicate',
    credits_per_generation: 4,
    type: 'image',
    category: '3d',
    features: ['3D rendering', 'Octane render', 'Professional quality'],
    available: true
  },
];

const mockGenerations: Generation[] = [
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
];

export default function ImageGenerationPage() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userCredits, setUserCredits] = useState(1250);
  const [generations, setGenerations] = useState<Generation[]>(mockGenerations);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
  };

  const handleGenerate = async (request: GenerationRequest) => {
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful generation
      const newGeneration: Generation = {
        id: Math.random().toString(),
        prompt: request.prompt,
        model_id: request.model_id,
        result_url: `https://picsum.photos/512/512?random=${Math.random()}`,
        type: 'image',
        created_at: new Date().toISOString(),
        credits_used: selectedModel?.credits_per_generation || 1,
      };
      
      setGenerations(prev => [newGeneration, ...prev]);
      setUserCredits(prev => prev - (selectedModel?.credits_per_generation || 1));
      
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredModels = filterCategory === 'all' 
    ? mockImageModels 
    : mockImageModels.filter(model => model.category === filterCategory);

  const categories = ['all', 'premium', 'local', 'realistic', 'artistic', 'anime', '3d'];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            AI Image Generation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with our advanced AI models
          </p>
          
          {/* Credits Display */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="glass-card px-4 py-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cineo-blue" />
                <span className="text-sm font-medium">{userCredits} credits</span>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="generate" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </TabsTrigger>
          </TabsList>

          {/* Generation Tab */}
          <TabsContent value="generate" className="space-y-8">
            {/* Model Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-cineo-blue" />
                        <span>Choose AI Model</span>
                      </CardTitle>
                      <CardDescription>
                        Select the perfect model for your creative vision
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={filterCategory === category ? "neon" : "ghost"}
                        size="sm"
                        onClick={() => setFilterCategory(category)}
                        className="capitalize"
                      >
                        {category === 'all' ? 'All Models' : category}
                      </Button>
                    ))}
                  </div>

                  {/* Model Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModels.map((model, index) => (
                      <motion.div
                        key={model.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ModelCard
                          model={model}
                          isSelected={selectedModel?.id === model.id}
                          onSelect={handleModelSelect}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generation Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GenerationForm
                selectedModel={selectedModel}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                userCredits={userCredits}
              />
            </motion.div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Generations</h2>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'neon' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'neon' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {generations.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No generations yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start creating amazing images with our AI models
                    </p>
                    <Button 
                      variant="neon"
                      onClick={() => {
                        const tabs = document.querySelector('[data-state="active"]');
                        if (tabs) {
                          (tabs.previousElementSibling as HTMLElement)?.click();
                        }
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Your First Image
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {generations.map((generation, index) => (
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
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}