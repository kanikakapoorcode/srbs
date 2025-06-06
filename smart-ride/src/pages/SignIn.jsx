import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper,
  useTheme,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SignIn() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Replace with actual authentication logic
      // Mock authentication for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        // Create a user object with basic information
        const user = {
          email,
          displayName: email.split('@')[0], // Simple display name from email
          // Add other user fields as needed
        };
        
        // Use the login function from AuthProvider
        login(user);
        // No need to navigate here, login function will handle it
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.');
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
            {/* Logo */}
            <Box sx={{ mb: 3 }}>
              <img 
                src="/image-removebg-preview.png" 
                alt="Smart Ride Logo"
                style={{ 
                  height: '80px',
                  width: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  objectFit: 'contain'
                }}
              />
            </Box>

            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Sign In to Your Account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
              </Button>
            </form>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Link 
                component="button"
                underline="none"
                onClick={() => navigate('/forgot-password')}
                sx={{ 
                  fontWeight: 500,
                  color: 'text.secondary'
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Don't have an account?
              </Typography>
              <Link 
                component="button"
                underline="none"
                onClick={() => navigate('/signup')}
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                }}
              >
                SIGN UP
              </Link>
            </Box>
          </Paper>
        </motion.div>
      </Box>

      <Footer />
    </Box>
  );
}