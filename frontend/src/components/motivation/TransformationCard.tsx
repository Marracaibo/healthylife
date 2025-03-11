import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Avatar, 
  Chip,
  Grid,
  Divider,
  Button,
  TextField,
  useTheme,
  Collapse
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Comment as CommentIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon
} from '@mui/icons-material';

import { Transformation, TransformationComment } from '../../types/motivation';

interface TransformationCardProps {
  transformation: Transformation;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  onAddComment?: (id: string, comment: string) => void;
}

const TransformationCard: React.FC<TransformationCardProps> = ({ 
  transformation, 
  onLike, 
  onShare,
  onAddComment
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    if (onLike) {
      onLike(transformation.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(transformation.id);
    }
  };

  const handleSubmitComment = () => {
    if (onAddComment && comment.trim()) {
      onAddComment(transformation.id, comment);
      setComment('');
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Box sx={{ position: 'relative' }}>
              <Box 
                component="img"
                sx={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover'
                }}
                src={transformation.beforeImageUrl}
                alt="Prima"
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                PRIMA
              </Box>
              {transformation.weightBefore && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    px: 1,
                    py: 0.2,
                    borderRadius: 4,
                    fontSize: '0.75rem'
                  }}
                >
                  {transformation.weightBefore} kg
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ position: 'relative' }}>
              <Box 
                component="img"
                sx={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover'
                }}
                src={transformation.afterImageUrl}
                alt="Dopo"
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                DOPO
              </Box>
              {transformation.weightAfter && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    px: 1,
                    py: 0.2,
                    borderRadius: 4,
                    fontSize: '0.75rem'
                  }}
                >
                  {transformation.weightAfter} kg
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        
        {transformation.isVerified && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: theme.palette.success.main,
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 4,
              fontSize: '0.7rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1
            }}
          >
            <CheckIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.8rem' }} />
            VERIFICATO
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={transformation.userAvatarUrl} 
            alt={transformation.userName}
            sx={{ mr: 1.5 }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {transformation.userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {transformation.duration} • {transformation.datePosted}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={transformation.mainFocus.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            size="small" 
            color="primary" 
            sx={{ mr: 1, mb: 1 }}
          />
          <Typography variant="h6" gutterBottom>
            {transformation.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {expanded 
              ? transformation.story 
              : (transformation.story.length > 150 
                  ? `${transformation.story.substring(0, 150)}...` 
                  : transformation.story)}
          </Typography>
          {transformation.story.length > 150 && (
            <Button 
              size="small" 
              onClick={() => setExpanded(!expanded)}
              endIcon={<ExpandMoreIcon sx={{ 
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s' 
              }} />}
            >
              {expanded ? 'Mostra meno' : 'Leggi di più'}
            </Button>
          )}
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="medium">
            Sfide superate:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {transformation.challenges.map((challenge, index) => (
              <Chip 
                key={index}
                label={challenge}
                size="small"
                variant="outlined"
                sx={{ mb: 0.5 }}
              />
            ))}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={handleLike}
              color="primary"
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {transformation.likes}
            </Typography>
            
            <IconButton 
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">
              {transformation.comments.length}
            </Typography>
          </Box>
          
          <IconButton 
            size="small" 
            onClick={handleShare}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Commenti ({transformation.comments.length})
            </Typography>
            
            {transformation.comments.map((comment) => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Avatar 
                    src={comment.userAvatarUrl} 
                    alt={comment.userName}
                    sx={{ width: 32, height: 32, mr: 1.5 }}
                  />
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: theme.palette.grey[100], 
                      borderRadius: 2,
                      flex: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontSize="0.875rem">
                        {comment.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.datePosted}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            
            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Aggiungi un commento..."
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button 
                variant="contained" 
                disableElevation
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
              >
                Invia
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TransformationCard;
