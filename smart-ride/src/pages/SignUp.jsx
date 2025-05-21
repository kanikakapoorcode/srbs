import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [apiError, setApiError] = useState('');

  const countryCodes = Object.entries(countries).map(([, country]) => ({
    code: `+${country.phone}`,
    name: country.name
  })).sort((a, b) => a.name.localeCompare(b.name));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setApiError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }

      setShowOTP(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          password: formData.password,
          otp
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const { token } = await response.json();
      
      // For demonstration purposes, create a user object
      // In a real app, you might want to fetch user details from a /me endpoint
      const user = {
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        token: token
      };
      
      // Use the login function from AuthProvider to set user and redirect
      login(user);
      
      // The login function will handle redirection to dashboard
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setOtp('');
      setError('');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />

      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        pt: { xs: '56px', sm: '64px' }
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              maxWidth: 400,
              p: 4,
              borderRadius: 4,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <img 
                src="/image-removebg-preview.png" 
                alt="Smart Ride Logo"
                style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
              />
            </Box>

            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              {showOTP ? 'Verify OTP' : 'Create Your Account'}
            </Typography>

            {(error || apiError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error || apiError}
              </Alert>
            )}

            {!showOTP ? (
              <form onSubmit={handleSubmit}>
                <TextField 
                  fullWidth 
                  label="Full Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  sx={{ mb: 2 }} 
                />
                
                <TextField 
                  fullWidth 
                  label="Email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  sx={{ mb: 2 }} 
                />

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <FormControl sx={{ width: '40%' }}>
                    <InputLabel>Code</InputLabel>
                    <Select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      label="Code"
                      required
                    >
                      {countryCodes.map((country, index) => (
                        <MenuItem key={index} value={country.code}>
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ width: '60%' }}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Box>

                <TextField 
                  fullWidth 
                  label="Password" 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  sx={{ mb: 2 }} 
                />
                
                <TextField 
                  fullWidth 
                  label="Confirm Password" 
                  name="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                  sx={{ mb: 3 }} 
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #3a7bd5 30%, #00d2ff 90%)',
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN UP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={verifyOTP}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  We've sent a 6-digit OTP to your phone/email ending with {formData.phone?.slice(-3)}
                </Typography>

                <TextField
                  fullWidth
                  label="Enter OTP"
                  variant="outlined"
                  margin="normal"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                    setApiError('');
                  }}
                  inputProps={{ maxLength: 6 }}
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #3a7bd5 30%, #00d2ff 90%)',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'VERIFY OTP'}
                </Button>

                <Box sx={{ mt: 2 }}>
                  <Link
                    component="button"
                    underline="none"
                    onClick={resendOTP}
                    disabled={loading}
                    sx={{
                      fontWeight: 500,
                      color: 'text.secondary'
                    }}
                  >
                    Resend OTP
                  </Link>
                </Box>
              </form>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">
              Already have an account?{' '}
              <Link href="/signin" underline="hover">
                Sign In
              </Link>
            </Typography>
          </Paper>
        </motion.div>
      </Box>

      <Footer />
    </Box>
  );
}