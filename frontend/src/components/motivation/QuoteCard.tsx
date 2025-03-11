import React from 'react';
import { 
  Card, 
  CardContent, 
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
  FormatQuote as FormatQuoteIcon
} from '@mui/icons-material';

import { Quote } from '../../types/motivation';

interface QuoteCardProps {
  quote: Quote;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onLike, onShare }) => {
  const theme = useTheme();

  const handleLike = () => {
    if (onLike) {
      onLike(quote.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(quote.id);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.2 }}>
          <FormatQuoteIcon sx={{ fontSize: 60, transform: 'rotate(180deg)' }} />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={quote.category.charAt(0).toUpperCase() + quote.category.slice(1)} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          {quote.isFeatured && (
            <Chip 
              label="In evidenza" 
              size="small" 
              color="secondary" 
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom 
          sx={{ 
            fontStyle: 'italic',
            fontWeight: 500,
            flex: 1
          }}
        >
          "{quote.text}"
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            — {quote.author}
          </Typography>
          
          <Box>
            <IconButton 
              size="small" 
              onClick={handleLike}
              color="primary"
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ mr: 1 }}>
              {quote.likes}
            </Typography>
            
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

export default QuoteCard;
