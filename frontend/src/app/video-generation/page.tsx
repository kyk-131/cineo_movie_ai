'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { ModelCard } from '@/components/generation/model-card';
import { GenerationForm } from '@/components/generation/generation-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AIModel, GenerationRequest, Generation, apiService } from '@/lib/api';
import { 
  Video, 
  Sparkles, 
  Filter, 
  Grid3X3,
  List,
  RefreshCw,
  Zap,
  Upload,
  Play,
  Pause,
  Volume2,
  Download,
  Eye
} from 'lucide-react';

// Mock video models for development
const mockVideoModels: AIModel[] = [
  {
    id: 'cineo-motion',
    name: 'Cineo Motion',
    description: 'Premium video generation with smooth motion and high-quality temporal consistency.',
    provider: 'replicate',
    credits_per_generation: 25,
    type: 'video',
    category: 'premium',
    features: ['Smooth motion', 'High quality', 'Temporal consistency'],
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
    features: ['Fast generation', 'Quick clips', 'Creative experiments'],
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
    features: ['Natural transitions', 'Frame flow', 'Smooth movement'],
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
    features: ['Local processing', 'Frame sequences', 'Low cost'],
    available: true
  },
];

const mockVideoGenerations: Generation[] = [
  {
    id: '1',
    prompt: 'A serene ocean wave crashing on a beach at sunset with golden light',
    model_id: 'cineo-motion',
    result_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
    type: 'video',
    created_at: '2024-01-20T14:30:00Z',
    credits_used: 25,
  },
  {
    id: '2',
    prompt: 'A time-lapse of clouds moving across a mountain landscape',
    model_id: 'cineo-frameflow',
    result_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4',
    type: 'video',
    created_at: '2024-01-20T12:15:00Z',
    credits_used: 15,
  },
];

interface VideoPlayerProps {
  generation: Generation;
  className?: string;
}

function VideoPlayer({ generation, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black/20 rounded-t-2xl overflow-hidden group">
          {/* Video placeholder - in production this would be a real video element */}
          <div className="w-full h-full bg-gradient-to-br from-cineo-blue/20 to-cineo-purple/20 flex items-center justify-center">
            <Video className="w-16 h-16 text-white/50" />
          </div>
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:text-cineo-blue"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-cineo-blue"
                onClick={() => setIsMuted(!isMuted)}
              >
                <Volume2 className={`w-5 h-5 ${isMuted ? 'opacity-50' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Generation Info Badge */}
          <div className="absolute top-4 left-4">
            <div className="glass-card px-3 py-1">
              <span className="text-xs font-medium text-cineo-purple">Video</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium mb-2 line-clamp-2">{generation.prompt}</h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>{generation.model_id}</span>
            <span>{generation.credits_used} credits</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VideoGenerationPage() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userCredits, setUserCredits] = useState(1250);
  const [generations, setGenerations] = useState<Generation[]>(mockVideoGenerations);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
  };

  const handleGenerate = async (request: GenerationRequest) => {
    setIsGenerating(true);
    
    try {
      // Simulate longer API call for video generation
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Mock successful generation
      const newGeneration: Generation = {
        id: Math.random().toString(),
        prompt: request.prompt,
        model_id: request.model_id,
        result_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        type: 'video',
        created_at: new Date().toISOString(),
        credits_used: selectedModel?.credits_per_generation || 5,
      };
      
      setGenerations(prev => [newGeneration, ...prev]);
      setUserCredits(prev => prev - (selectedModel?.credits_per_generation || 5));
      
    } catch (error) {
      console.error('Video generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
    }
  };

  const filteredModels = filterCategory === 'all' 
    ? mockVideoModels 
    : mockVideoModels.filter(model => model.category === filterCategory);

  const categories = ['all', 'premium', 'fast', 'natural', 'local'];

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
            AI Video Generation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bring your stories to life with cinematic AI-generated videos
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
              <Video className="w-4 h-4" />
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
                        <Filter className="w-5 h-5 text-cineo-purple" />
                        <span>Choose Video Model</span>
                      </CardTitle>
                      <CardDescription>
                        Select the perfect model for your video creation
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Reference Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-cineo-blue" />
                    <span>Reference Image (Optional)</span>
                  </CardTitle>
                  <CardDescription>
                    Upload a reference image to guide the video generation
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Upload Image</Label>
                      <Input
                        id="reference"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={!selectedModel}
                      />
                      <p className="text-xs text-muted-foreground">
                        Supported formats: JPG, PNG, WEBP (max 10MB)
                      </p>
                    </div>
                    
                    {referenceImage && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">
                            {referenceImage.name}
                          </span>
                        </div>
                      </div>
                    )}
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
                <h2 className="text-2xl font-bold text-foreground">Your Videos</h2>
                
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
                    <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start creating amazing videos with our AI models
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
                      Generate Your First Video
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }>
                  {generations.map((generation, index) => (
                    <motion.div
                      key={generation.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <VideoPlayer generation={generation} />
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