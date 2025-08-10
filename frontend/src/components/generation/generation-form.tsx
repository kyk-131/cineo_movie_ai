'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AIModel, GenerationRequest } from '@/lib/api';
import { Sparkles, Wand2, Settings, Zap } from 'lucide-react';

interface GenerationFormProps {
  selectedModel: AIModel | null;
  onGenerate: (request: GenerationRequest) => Promise<void>;
  isGenerating: boolean;
  userCredits: number;
}

export function GenerationForm({ 
  selectedModel, 
  onGenerate, 
  isGenerating, 
  userCredits 
}: GenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('1024x1024');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [seed, setSeed] = useState('');
  const [steps, setSteps] = useState([30]);
  const [guidanceScale, setGuidanceScale] = useState([7.5]);
  const [numFrames, setNumFrames] = useState([24]);
  const [fps, setFps] = useState([8]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedModel || !prompt.trim()) return;

    const request: GenerationRequest = {
      prompt: prompt.trim(),
      model_id: selectedModel.id,
      resolution,
      aspect_ratio: aspectRatio,
      seed: seed ? parseInt(seed) : undefined,
      steps: steps[0],
      guidance_scale: guidanceScale[0],
      ...(selectedModel.type === 'video' && {
        num_frames: numFrames[0],
        fps: fps[0]
      })
    };

    await onGenerate(request);
  };

  const getResolutionOptions = () => {
    if (selectedModel?.type === 'video') {
      return [
        { value: '1024x576', label: '1024×576 (16:9)' },
        { value: '768x768', label: '768×768 (1:1)' },
        { value: '576x1024', label: '576×1024 (9:16)' },
      ];
    }
    
    return [
      { value: '512x512', label: '512×512 (1:1)' },
      { value: '768x768', label: '768×768 (1:1)' },
      { value: '1024x1024', label: '1024×1024 (1:1)' },
      { value: '1024x576', label: '1024×576 (16:9)' },
      { value: '576x1024', label: '576×1024 (9:16)' },
    ];
  };

  const canGenerate = selectedModel && prompt.trim() && userCredits >= (selectedModel.credits_per_generation || 0);

  return (
    <Card className="glow-effect">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Wand2 className="w-6 h-6 text-cineo-blue" />
          <CardTitle>
            {selectedModel?.type === 'video' ? 'Video Generation' : 'Image Generation'}
          </CardTitle>
        </div>
        <CardDescription>
          {selectedModel 
            ? `Configure your generation with ${selectedModel.name}`
            : 'Select a model to start generating'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Prompt *
            </Label>
            <Textarea
              id="prompt"
              placeholder={
                selectedModel?.type === 'video' 
                  ? "Describe the video you want to create... (e.g., 'A serene ocean wave crashing on a beach at sunset')"
                  : "Describe the image you want to create... (e.g., 'A futuristic cityscape with neon lights and flying cars')"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={!selectedModel}
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{prompt.length}/2000 characters</span>
              {selectedModel && (
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-cineo-blue" />
                  <span>Cost: {selectedModel.credits_per_generation} credits</span>
                </span>
              )}
            </div>
          </div>

          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resolution */}
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select 
                value={resolution} 
                onValueChange={setResolution}
                disabled={!selectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  {getResolutionOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select 
                value={aspectRatio} 
                onValueChange={setAspectRatio}
                disabled={!selectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                  <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                  <SelectItem value="4:3">Standard (4:3)</SelectItem>
                  <SelectItem value="3:2">Photo (3:2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 text-sm font-medium">
              <Settings className="w-4 h-4" />
              <span>Advanced Settings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seed */}
              <div className="space-y-2">
                <Label htmlFor="seed">Seed (optional)</Label>
                <Input
                  id="seed"
                  type="number"
                  placeholder="Random seed for reproducibility"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  disabled={!selectedModel}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <Label>Steps: {steps[0]}</Label>
                <Slider
                  value={steps}
                  onValueChange={setSteps}
                  max={100}
                  min={10}
                  step={5}
                  disabled={!selectedModel}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Faster</span>
                  <span>Higher Quality</span>
                </div>
              </div>

              {/* Guidance Scale */}
              <div className="space-y-2">
                <Label>Guidance Scale: {guidanceScale[0]}</Label>
                <Slider
                  value={guidanceScale}
                  onValueChange={setGuidanceScale}
                  max={20}
                  min={1}
                  step={0.5}
                  disabled={!selectedModel}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Creative</span>
                  <span>Precise</span>
                </div>
              </div>

              {/* Video-specific settings */}
              {selectedModel?.type === 'video' && (
                <>
                  <div className="space-y-2">
                    <Label>Frames: {numFrames[0]}</Label>
                    <Slider
                      value={numFrames}
                      onValueChange={setNumFrames}
                      max={48}
                      min={8}
                      step={4}
                      disabled={!selectedModel}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>FPS: {fps[0]}</Label>
                    <Slider
                      value={fps}
                      onValueChange={setFps}
                      max={30}
                      min={4}
                      step={2}
                      disabled={!selectedModel}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Generate Button */}
          <div className="space-y-3">
            {userCredits < (selectedModel?.credits_per_generation || 0) && selectedModel && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">
                  Insufficient credits. You need {selectedModel.credits_per_generation} credits but only have {userCredits}.
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="neon"
              size="lg"
              className="w-full glow-effect"
              disabled={!canGenerate || isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>
                    Generate {selectedModel?.type === 'video' ? 'Video' : 'Image'}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}