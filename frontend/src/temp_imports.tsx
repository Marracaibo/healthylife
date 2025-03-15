import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  Button, 
  IconButton,
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Card, 
  CardContent, 
  CardActions,
  Modal, 
  Alert, 
  Backdrop, 
  CircularProgress,
  Chip,
  LinearProgress,
  Fade,
  Collapse,
  Tabs,
  Tab
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  FitnessCenter, 
  CalendarToday, 
  CheckCircle, 
  CheckCircleOutline as CheckCircleOutlineIcon,
  Info, 
  ArrowBack, 
  ArrowForward, 
  ExpandMore, 
  ExpandLess, 
  Lock, 
  LockOpen,
  Speed,
  InfoOutlined,
  Check,
  PlayCircleOutline,
  FitnessCenterOutlined,
  TimerOutlined,
  CountertopsOutlined,
  PlayArrow,
  Timeline,
  RestaurantMenu,
  BedOutlined,
  RadioButtonUnchecked,
  Dashboard,
  CalendarMonth,
  TrendingUp,
  Repeat as RepeatIcon,
  FitnessCenter as FitnessCenterIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import Timeline as MuiTimeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
