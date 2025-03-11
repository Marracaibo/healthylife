import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  SentimentVeryDissatisfied as SadIcon,
  SentimentDissatisfied as UnhappyIcon,
  SentimentNeutral as NeutralIcon,
  SentimentSatisfied as HappyIcon,
  SentimentVerySatisfied as VeryHappyIcon
} from '@mui/icons-material';

import { DiaryEntry } from '../../types/motivation';

// Emoji per i mood
const moodEmojis = {
  'terrible': <SadIcon color="error" />,
  'bad': <UnhappyIcon color="warning" />,
  'neutral': <NeutralIcon color="action" />,
  'good': <HappyIcon color="success" />,
  'great': <VeryHappyIcon color="success" />
};

const moodLabels = {
  'terrible': 'Terribile',
  'bad': 'Non buono',
  'neutral': 'Nella media',
  'good': 'Buono',
  'great': 'Eccellente'
};

interface DiaryEntryProps {
  entry?: DiaryEntry;
  isNew?: boolean;
  onSave?: (entry: Partial<DiaryEntry>) => void;
  onDelete?: (id: string) => void;
}

const DiaryEntryComponent: React.FC<DiaryEntryProps> = ({ 
  entry, 
  isNew = false, 
  onSave, 
  onDelete 
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(isNew);
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<DiaryEntry['mood']>(entry?.mood || 'neutral');
  const [isPrivate, setIsPrivate] = useState(entry?.isPrivate || false);
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleMoodChange = (event: SelectChangeEvent) => {
    setMood(event.target.value as DiaryEntry['mood']);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const updatedEntry = {
      id: entry?.id,
      title,
      content,
      mood,
      isPrivate,
      tags,
      date: entry?.date || new Date().toISOString()
    };
    
    if (onSave) {
      onSave(updatedEntry);
    }
    
    if (!isNew) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (isNew) {
      // Reimposta i campi ai valori predefiniti
      setTitle('');
      setContent('');
      setMood('neutral');
      setIsPrivate(false);
      setTags([]);
    } else {
      // Reimposta i campi ai valori originali
      setTitle(entry?.title || '');
      setContent(entry?.content || '');
      setMood(entry?.mood || 'neutral');
      setIsPrivate(entry?.isPrivate || false);
      setTags(entry?.tags || []);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (entry?.id && onDelete) {
      onDelete(entry.id);
    }
  };

  // Funzione per formattare la data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  return (
    <Card 
      sx={{ 
        mb: 3,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        {isEditing ? (
          // Modalità di modifica
          <Box>
            <TextField
              fullWidth
              label="Titolo"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              placeholder="Dai un titolo alla tua riflessione"
              required
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel id="mood-select-label">Come ti senti oggi?</InputLabel>
                <Select
                  labelId="mood-select-label"
                  value={mood}
                  label="Come ti senti oggi?"
                  onChange={handleMoodChange}
                  startAdornment={
                    <InputAdornment position="start">
                      {moodEmojis[mood]}
                    </InputAdornment>
                  }
                >
                  <MenuItem value="terrible">Terribile</MenuItem>
                  <MenuItem value="bad">Non buono</MenuItem>
                  <MenuItem value="neutral">Nella media</MenuItem>
                  <MenuItem value="good">Buono</MenuItem>
                  <MenuItem value="great">Eccellente</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="outlined" 
                color={isPrivate ? "primary" : "inherit"}
                startIcon={isPrivate ? <VisibilityOffIcon /> : <VisibilityIcon />}
                onClick={() => setIsPrivate(!isPrivate)}
                size="medium"
              >
                {isPrivate ? 'Privato' : 'Pubblico'}
              </Button>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              label="La tua riflessione"
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              placeholder="Scrivi qui perché desideri cambiare, quali ostacoli hai affrontato e quali obiettivi intendi raggiungere..."
              required
            />
            
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tag
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  size="small"
                  label="Aggiungi tag"
                  variant="outlined"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  Aggiungi
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                sx={{ mr: 1 }}
              >
                Annulla
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                disabled={!title.trim() || !content.trim()}
              >
                Salva
              </Button>
            </Box>
          </Box>
        ) : (
          // Modalità di visualizzazione
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    mr: 2
                  }}
                >
                  {moodEmojis[entry?.mood || 'neutral']}
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom component="div" sx={{ mb: 0 }}>
                    {entry?.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {entry?.date ? formatDate(entry.date) : ''} • 
                    {entry?.isPrivate ? ' Privato' : ' Pubblico'} • 
                    {' Stato d\'animo: '}{moodLabels[entry?.mood || 'neutral']}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {entry?.content}
            </Typography>
            
            {entry?.tags && entry.tags.length > 0 && (
              <Box sx={{ mb: 1 }}>
                {entry.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DiaryEntryComponent;
