'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIModel } from '@/lib/api';
import { 
  Zap, 
  Clock, 
  Cpu, 
  Cloud, 
  CheckCircle,
  Star,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelCardProps {
  model: AIModel;
  isSelected?: boolean;
  onSelect: (model: AIModel) => void;
  className?: string;
}

export function ModelCard({ model, isSelected = false, onSelect, className }: ModelCardProps) {
  const getProviderIcon = () => {
    switch (model.provider) {
      case 'replicate':
        return <Cloud className="w-4 h-4" />;
      case 'huggingface':
        return <Cpu className="w-4 h-4" />;
      case 'local':
        return <Zap className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getProviderColor = () => {
    switch (model.provider) {
      case 'replicate':
        return 'text-blue-400';
      case 'huggingface':
        return 'text-yellow-400';
      case 'local':
        return 'text-green-400';
      default:
        return 'text-gray-400';
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card 
        className={cn(
          'h-full cursor-pointer transition-all duration-300 hover:scale-105',
          isSelected 
            ? 'ring-2 ring-cineo-blue shadow-neon-blue/30' 
            : 'hover:shadow-neon-purple/20',
          !model.available && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => model.available && onSelect(model)}
      >
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
            
            {isSelected && (
              <CheckCircle className="w-5 h-5 text-cineo-blue" />
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <div className={cn('flex items-center space-x-1', getProviderColor())}>
                {getProviderIcon()}
                <span className="text-xs font-medium capitalize">{model.provider}</span>
              </div>
            </div>
            
            <Badge variant="outline" className={cn('text-xs', getCategoryColor())}>
              {model.category}
            </Badge>
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
          <div className="flex items-center justify-between mt-auto">
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
            
            {!model.available && (
              <Badge variant="destructive" className="text-xs">
                Unavailable
              </Badge>
            )}
          </div>
          
          {/* Select Button */}
          <Button
            variant={isSelected ? "neon" : "glass"}
            size="sm"
            className="w-full mt-4"
            disabled={!model.available}
            onClick={(e) => {
              e.stopPropagation();
              model.available && onSelect(model);
            }}
          >
            {isSelected ? 'Selected' : 'Select Model'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}