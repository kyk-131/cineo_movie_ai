'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AIModel, apiService } from '@/lib/api';
import { 
  Image as ImageIcon, 
  Video,
  Search,
  Filter,
  Grid3X3,
  List,
  Zap,
  Clock,
  Cpu,
  Cloud,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock comprehensive model data
const mockAllModels: AIModel[] = [
  // Image Models - Premium
  {
    id: 'cineo-vision-pro',
    name: 'Cineo Vision Pro',
    description: 'Premium high-resolution image generation with SDXL. Perfect for professional artwork and detailed scenes.',
    provider: 'replicate',
    credits_per_generation: 5,
    type: 'image',
    category: 'premium',
    features: ['High resolution', 'Premium quality', 'Professional grade', '1024x1024', 'SDXL'],
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
    features: ['Photorealistic', 'Portrait optimized', 'High detail', 'Realistic skin', 'Studio lighting'],
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
    features: ['3D rendering', 'Octane render', 'Professional quality', 'Depth mapping', 'Ray tracing'],
    available: true
  },
  {
    id: 'cineo-retrovibe',
    name: 'Cineo RetroVibe',
    description: 'Vintage and retro aesthetic images with 80s and nostalgic vibes.',
    provider: 'replicate',
    credits_per_generation: 3,
    type: 'image',
    category: 'artistic',
    features: ['Retro style', 'Vintage aesthetic', '80s vibe', 'Film grain', 'Nostalgic colors'],
    available: true
  },

  // Image Models - HuggingFace
  {
    id: 'cineo-conceptart',
    name: 'Cineo ConceptArt',
    description: 'Digital concept art and illustrations perfect for game design and creative projects.',
    provider: 'huggingface',
    credits_per_generation: 3,
    type: 'image',
    category: 'artistic',
    features: ['Concept art', 'Digital painting', 'Creative design', 'Game assets', 'Character design'],
    available: true
  },
  {
    id: 'cineo-portraitmaster',
    name: 'Cineo PortraitMaster',
    description: 'Professional portrait generation with studio lighting and composition.',
    provider: 'huggingface',
    credits_per_generation: 4,
    type: 'image',
    category: 'portrait',
    features: ['Professional portraits', 'Studio lighting', 'High quality', 'Face details', 'Expression control'],
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
    features: ['Anime style', 'Manga artwork', 'Japanese aesthetics', 'Character art', 'Cel shading'],
    available: true
  },
  {
    id: 'cineo-illustrationx',
    name: 'Cineo IllustrationX',
    description: 'Stylized illustrations with unique artistic flair and creative interpretation.',
    provider: 'huggingface',
    credits_per_generation: 3,
    type: 'image',
    category: 'illustration',
    features: ['Artistic style', 'Unique illustrations', 'Creative design', 'Vector style', 'Bold colors'],
    available: true
  },
  {
    id: 'cineo-photofix',
    name: 'Cineo PhotoFix',
    description: 'Image enhancement and improvement with AI-powered corrections.',
    provider: 'huggingface',
    credits_per_generation: 4,
    type: 'image',
    category: 'enhancement',
    features: ['Image enhancement', 'Quality improvement', 'AI corrections', 'Upscaling', 'Denoising'],
    available: false
  },
  {
    id: 'cineo-stylefusion',
    name: 'Cineo StyleFusion',
    description: 'Artistic style transfer and creative interpretations with multiple aesthetics.',
    provider: 'huggingface',
    credits_per_generation: 3,
    type: 'image',
    category: 'artistic',
    features: ['Style transfer', 'Creative interpretation', 'Multiple aesthetics', 'Art fusion', 'Custom styles'],
    available: true
  },
  {
    id: 'cineo-naturelens',
    name: 'Cineo NatureLens',
    description: 'Nature photography and landscape generation with realistic environmental details.',
    provider: 'huggingface',
    credits_per_generation: 3,
    type: 'image',
    category: 'nature',
    features: ['Nature photography', 'Landscape generation', 'Environmental details', 'Wildlife', 'Seasons'],
    available: true
  },

  // Local Image Models
  {
    id: 'cineo-localvision',
    name: 'Cineo LocalVision',
    description: 'High-quality local generation with GPU acceleration. Instant results at the lowest cost.',
    provider: 'local',
    credits_per_generation: 1,
    type: 'image',
    category: 'local',
    features: ['Instant generation', 'GPU accelerated', 'Lowest cost', 'No internet required', 'Privacy focused'],
    available: true
  },
  {
    id: 'cineo-quickdraw',
    name: 'Cineo QuickDraw',
    description: 'Fast local image generation perfect for quick iterations and testing.',
    provider: 'local',
    credits_per_generation: 1,
    type: 'image',
    category: 'local',
    features: ['Fast generation', 'Quick iterations', 'Local processing', 'Draft quality', 'Experimentation'],
    available: true
  },

  // Video Models
  {
    id: 'cineo-motion',
    name: 'Cineo Motion',
    description: 'Premium video generation with smooth motion and high-quality temporal consistency.',
    provider: 'replicate',
    credits_per_generation: 25,
    type: 'video',
    category: 'premium',
    features: ['Smooth motion', 'High quality', 'Temporal consistency', '4K output', 'Professional grade'],
    available: true
  },
  {
    id: 'cineo-quicktake',
    name: 'Cineo QuickTake',
    description: 'Fast video generation for quick clips and creative experiments.',
    provider: 'replicate',
    credits_per_generation: 20,
    type: 'video',
    category: 'fast',
    features: ['Fast generation', 'Quick clips', 'Creative experiments', 'HD output', 'Short videos'],
    available: true
  },
  {
    id: 'cineo-frameflow',
    name: 'Cineo FrameFlow',
    description: 'Text-to-video generation with natural frame transitions and movement.',
    provider: 'huggingface',
    credits_per_generation: 15,
    type: 'video',
    category: 'natural',
    features: ['Natural transitions', 'Frame flow', 'Smooth movement', 'Text to video', 'Cinematic'],
    available: true
  },
  {
    id: 'cineo-localvision-motion',
    name: 'Cineo LocalVision Motion',
    description: 'Local video generation using frame sequences. Basic motion at low cost.',
    provider: 'local',
    credits_per_generation: 5,
    type: 'video',
    category: 'local',
    features: ['Local processing', 'Frame sequences', 'Low cost', 'Basic motion', 'Privacy focused'],
    available: false
  },
];

interface ModelTableRowProps {
  model: AIModel;
  className?: string;
}

function ModelTableRow({ model, className }: ModelTableRowProps) {
  const getProviderIcon = () => {
    switch (model.provider) {
      case 'replicate':
        return <Cloud className="w-4 h-4 text-blue-400" />;
      case 'huggingface':
        return <Cpu className="w-4 h-4 text-yellow-400" />;
      case 'local':
        return <Zap className="w-4 h-4 text-green-400" />;
      default:
        return <Cpu className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = () => {
    switch (model.category) {
      case 'premium':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'realistic':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'artistic':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'local':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'anime':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <tr className={cn('border-b border-white/10 hover:bg-white/5 transition-colors', className)}>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          {model.type === 'image' ? (
            <ImageIcon className="w-5 h-5 text-cineo-blue" />
          ) : (
            <Video className="w-5 h-5 text-cineo-purple" />
          )}
          <div>
            <div className="font-medium">{model.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">{model.description}</div>
          </div>
        </div>
      </td>
      
      <td className="p-4">
        <Badge variant="outline" className={cn('text-xs capitalize', getCategoryColor())}>
          {model.category}
        </Badge>
      </td>
      
      <td className="p-4">
        <div className="flex items-center space-x-2">
          {getProviderIcon()}
          <span className="text-sm capitalize">{model.provider}</span>
        </div>
      </td>
      
      <td className="p-4">
        <div className="flex items-center space-x-1">
          <Zap className="w-4 h-4 text-cineo-blue" />
          <span className="font-medium">{model.credits_per_generation}</span>
        </div>
      </td>
      
      <td className="p-4">
        <div className="flex items-center space-x-2">
          {model.available ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Available</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Coming Soon</span>
            </>
          )}
        </div>
      </td>
      
      <td className="p-4">
        <Button 
          variant="outline" 
          size="sm"
          disabled={!model.available}
          className="flex items-center space-x-1"
        >
          <span>Try Now</span>
          <ArrowUpRight className="w-3 h-3" />
        </Button>
      </td>
    </tr>
  );
}

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'replicate' | 'huggingface' | 'local'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredModels = mockAllModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || model.type === selectedType;
    const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
    
    return matchesSearch && matchesType && matchesProvider;
  });

  const stats = {
    total: mockAllModels.length,
    available: mockAllModels.filter(m => m.available).length,
    image: mockAllModels.filter(m => m.type === 'image').length,
    video: mockAllModels.filter(m => m.type === 'video').length,
  };

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
            AI Models
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive suite of AI models for image and video generation
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cineo-blue">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Models</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.available}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cineo-purple">{stats.image}</div>
              <div className="text-sm text-muted-foreground">Image Models</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cineo-blue">{stats.video}</div>
              <div className="text-sm text-muted-foreground">Video Models</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-cineo-blue" />
                <span>Filter & Search</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search models by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter Tabs */}
              <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Models</TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Images</span>
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>Videos</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Provider Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Provider:</span>
                {['all', 'replicate', 'huggingface', 'local'].map((provider) => (
                  <Button
                    key={provider}
                    variant={selectedProvider === provider ? "neon" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedProvider(provider as any)}
                    className="capitalize"
                  >
                    {provider === 'all' ? 'All Providers' : provider}
                  </Button>
                ))}
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredModels.length} of {mockAllModels.length} models
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'table' ? 'neon' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'neon' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Models Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {viewMode === 'table' ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 font-medium">Model</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Provider</th>
                        <th className="text-left p-4 font-medium">Credits</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredModels.map((model, index) => (
                        <motion.tr
                          key={model.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          asChild
                        >
                          <ModelTableRow model={model} />
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {model.type === 'image' ? (
                            <ImageIcon className="w-5 h-5 text-cineo-blue" />
                          ) : (
                            <Video className="w-5 h-5 text-cineo-purple" />
                          )}
                          <CardTitle className="text-lg leading-tight">{model.name}</CardTitle>
                        </div>
                        
                        {model.available ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-relaxed mb-4 min-h-[3rem]">
                        {model.description}
                      </CardDescription>
                      
                      {/* Features */}
                      {model.features && model.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {model.features.slice(0, 3).map((feature, index) => (
                              <Badge 
                                key={index}
                                variant="secondary" 
                                className="text-xs bg-white/5 border-white/10"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Credit Cost */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4 text-cineo-blue" />
                          <span className="text-sm font-medium">
                            {model.credits_per_generation} credits
                          </span>
                        </div>
                        
                        {model.provider === 'local' && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">Instant</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Try Button */}
                      <Button
                        variant={model.available ? "neon" : "outline"}
                        size="sm"
                        className="w-full"
                        disabled={!model.available}
                      >
                        {model.available ? 'Try Now' : 'Coming Soon'}
                        {model.available && <ArrowUpRight className="w-3 h-3 ml-2" />}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {filteredModels.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No models found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedProvider('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}