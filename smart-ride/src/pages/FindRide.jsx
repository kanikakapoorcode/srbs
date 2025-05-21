import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  useMediaQuery,
  Divider,
  Chip
} from '@mui/material';
import {
  MyLocation as PickupIcon,
  LocationOn as DropIcon,
  SwapVert as SwapIcon,
  DirectionsCar as RideIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function FindRide() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [rideType, setRideType] = useState('standard');
  const [schedule, setSchedule] = useState(false);
  const [dateTime, setDateTime] = useState('');

  const rideTypes = [
    { id: 'standard', label: 'Standard', price: '₹12/km' },
    { id: 'premium', label: 'Premium', price: '₹18/km' },
    { id: 'xl', label: 'XL', price: '₹24/km' }
  ];

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const handleFindRide = () => {
    if (!pickup || !drop) return;
    
    navigate('/ride-summary', {
      state: {
        pickup,
        drop,
        rideType,
        schedule,
        dateTime,
        user: currentUser
      }
    });
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, maxWidth: 600, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Find Your Ride
        </Typography>

        {/* Pickup Location */}
        <TextField
          fullWidth
          label="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PickupIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Swap Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <IconButton onClick={handleSwap} size="small">
            <SwapIcon />
          </IconButton>
        </Box>

        {/* Drop Location */}
        <TextField
          fullWidth
          label="Drop Location"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DropIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Ride Type Selection */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Ride Type
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {rideTypes.map((type) => (
              <Chip
                key={type.id}
                label={`${type.label} (${type.price})`}
                onClick={() => setRideType(type.id)}
                color={rideType === type.id ? 'primary' : 'default'}
                variant={rideType === type.id ? 'filled' : 'outlined'}
                icon={<RideIcon />}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>

        {/* Schedule Ride */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <Button
            startIcon={<ScheduleIcon />}
            variant={schedule ? 'contained' : 'outlined'}
            onClick={() => setSchedule(!schedule)}
            sx={{ mr: 2 }}
          >
            {schedule ? 'Scheduled' : 'Schedule Ride'}
          </Button>
          
          {schedule && (
            <TextField
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              sx={{ mt: 2 }}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Find Ride Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleFindRide}
          disabled={!pickup || !drop}
          startIcon={<RideIcon />}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Find Ride
        </Button>

        {/* User Info (mobile only) */}
        {isMobile && currentUser && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {currentUser.name}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}