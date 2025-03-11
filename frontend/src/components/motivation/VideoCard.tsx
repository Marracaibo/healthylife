import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  IconButton, 
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

import { MotivationalVideo } from '../../types/motivation';

interface VideoCardProps {
  video: MotivationalVideo;
  onPlay?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay, onLike, onShare }) => {
  const theme = useTheme();

  const handlePlay = () => {
    if (onPlay) {
      onPlay(video.id);
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(video.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(video.id);
    }
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={video.thumbnailUrl}
          alt={video.title}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
            opacity: 0,
            transition: 'opacity 0.3s',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <IconButton 
            onClick={handlePlay}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.8)', 
              '&:hover': { 
                bgcolor: 'white' 
              }
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </IconButton>
        </Box>
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 8, 
            right: 8, 
            bgcolor: 'rgba(0,0,0,0.7)', 
            px: 1, 
            py: 0.5, 
            borderRadius: 1
          }}
        >
          <Typography variant="caption" sx={{ color: 'white' }}>
            {formatDuration(video.duration)}
          </Typography>
        </Box>
        {video.isFeatured && (
          <Chip 
            label="In evidenza" 
            size="small" 
            color="secondary" 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              left: 8 
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" component="div" gutterBottom fontWeight="medium">
          {video.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {video.description.length > 100 
            ? `${video.description.substring(0, 100)}...` 
            : video.description}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
              {video.views}
            </Typography>
            
            <FavoriteIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {video.likes}
            </Typography>
          </Box>
          
          <Box>
            <IconButton 
              size="small" 
              onClick={handleLike}
              color="primary"
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={handleShare}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
