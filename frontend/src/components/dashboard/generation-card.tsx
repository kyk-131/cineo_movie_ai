'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Generation } from '@/lib/api';
import { 
  Download, 
  Image as ImageIcon, 
  Video,
  Zap,
  Calendar,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationCardProps {
  generation: Generation;
  onView?: (generation: Generation) => void;
  onDownload?: (generation: Generation) => void;
}

export function GenerationCard({ generation, onView, onDownload }: GenerationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(generation);
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = generation.result_url;
      link.download = `cineo-${generation.type}-${generation.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group relative overflow-hidden hover:shadow-neon-purple/20 transition-all duration-300">
        {/* Media Container */}
        <div className="relative aspect-square bg-black/50 overflow-hidden">
          {generation.type === 'image' ? (
            <Image
              src={generation.result_url}
              alt={generation.prompt}
              fill
              className={cn(
                'object-cover transition-all duration-300',
                imageLoaded ? 'opacity-100' : 'opacity-0',
                isHovered && 'scale-110'
              )}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                src={generation.result_url}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            </div>
          )}

          {/* Loading State */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-cineo-blue border-t-transparent animate-spin" />
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
              {generation.type === 'image' ? (
                <ImageIcon className="w-3 h-3 text-cineo-blue" />
              ) : (
                <Video className="w-3 h-3 text-cineo-purple" />
              )}
              <span className="text-xs font-medium text-white capitalize">
                {generation.type}
              </span>
            </div>
          </div>

          {/* Action Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
          >
            <div className="flex items-center space-x-2">
              <Button
                variant="glass"
                size="sm"
                onClick={() => onView?.(generation)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="glass"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Prompt */}
            <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
              {generation.prompt}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(generation.created_at)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-cineo-blue" />
                  <span>{generation.credits_used} credits</span>
                </div>
              </div>

              <div className="text-xs font-medium px-2 py-1 rounded bg-cineo-gradient/10 text-cineo-blue">
                {generation.model_id.replace(/^cineo-/, '').replace(/-/g, ' ')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}