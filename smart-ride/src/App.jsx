import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoadScript } from '@react-google-maps/api';
import { Box, CircularProgress } from '@mui/material';
import AuthProvider from './providers/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard"; 
import NotFound from "./pages/NotFound";
import DriverLogin from "./pages/DriverLogin";
import BookRide from "./pages/BookRide";
import FindRide from "./pages/FindRide";
import RideSuccess from "./pages/RideSuccess";
import RideSummary from "./pages/RideSummary";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return currentUser ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
      loadingElement={<div>Loading Maps...</div>}
    >
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/driver-login" element={<DriverLogin />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/book-ride" element={
              <ProtectedRoute>
                <BookRide />
              </ProtectedRoute>
            } />
            <Route path="/find-ride" element={
              <ProtectedRoute>
                <FindRide />
              </ProtectedRoute>
            } />
            <Route path="/ride-summary" element={
              <ProtectedRoute>
                <RideSummary />
              </ProtectedRoute>
            } />
            <Route path="/ride-success" element={
              <ProtectedRoute>
                <RideSuccess />
              </ProtectedRoute>
            } />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </LoadScript>
  );
}

export default App;
