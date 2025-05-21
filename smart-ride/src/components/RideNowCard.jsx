import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  MyLocation as PickupIcon,
  LocationOn as DropIcon,
  SwapVert as SwapIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function RideNowCard({ user }) {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [rideType, setRideType] = useState('standard');

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const handleBookRide = () => {
    navigate('/book', {
      state: {
        pickup,
        drop,
        user
      }
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Where would you like to go?</Typography>
      
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

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <IconButton onClick={handleSwap}>
          <SwapIcon />
        </IconButton>
      </Box>

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

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        {['standard', 'premium', 'xl'].map((type) => (
          <Button
            key={type}
            variant={rideType === type ? 'contained' : 'outlined'}
            onClick={() => setRideType(type)}
            sx={{ textTransform: 'capitalize' }}
          >
            {type}
          </Button>
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 3 }}
        onClick={handleBookRide}
        disabled={!pickup || !drop}
      >
        Book Ride Now
      </Button>
    </Paper>
  );
}