import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecentRides from '../components/RecentRides';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch user data from your backend
        // For now, we'll use mock data based on the current user
        const mockUserData = {
          name: currentUser?.displayName || 'User',
          email: currentUser?.email || 'user@example.com',
          phone: currentUser?.phoneNumber || '+91 9876543210',
          totalRides: 12,
          memberSince: 'May 2024'
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUserData(mockUserData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleBookRide = () => {
    navigate('/book-ride');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 8, textAlign: 'center', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Dashboard
        </Typography>

        <Grid container spacing={4}>
          {/* User Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5">{userData?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{userData?.email}</Typography>
                <Typography variant="body2" color="text.secondary">{userData?.phone}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="body1">
                  <strong>Total Rides:</strong> {userData?.totalRides}
                </Typography>
                <Typography variant="body1">
                  <strong>Member Since:</strong> {userData?.memberSince}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      transition: 'transform 0.2s', 
                      '&:hover': { 
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      },
                      cursor: 'pointer'
                    }}
                    onClick={handleBookRide}
                  >
                    <CardContent sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      p: 3 
                    }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mb: 2 }}>
                        <DirectionsCarIcon fontSize="large" />
                      </Avatar>
                      <Typography variant="h6" gutterBottom align="center">
                        Book a Ride
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Enter pickup and drop-off locations to book a new ride
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      transition: 'transform 0.2s', 
                      '&:hover': { 
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      },
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate('/find-ride')}
                  >
                    <CardContent sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      p: 3 
                    }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60, mb: 2 }}>
                        <SearchIcon fontSize="large" />
                      </Avatar>
                      <Typography variant="h6" gutterBottom align="center">
                        Find Nearby Rides
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Find available rides near your location
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* Recent Rides Section */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Rides
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => {}} // You can add a view all page later
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <RecentRides />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
