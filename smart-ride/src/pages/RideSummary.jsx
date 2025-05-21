// import Pricing from '../components/Pricing'; // Temporarily commented out
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function RideSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const distanceCache = useRef(new Map());

  const { pickup, drop, pickupCoords, dropCoords } = location.state || {};
  const [distance, setDistance] = useState(null);
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [error, setError] = useState("");

  // Memoized fetch function with all dependencies
  const fetchDistanceAndFare = useCallback(async () => {
    const cacheKey = `${pickupCoords.lat},${pickupCoords.lng}-${dropCoords.lat},${dropCoords.lng}`;
    
    if (distanceCache.current.has(cacheKey)) {
      const cached = distanceCache.current.get(cacheKey);
      setDistance(cached.distance);
      setFare(cached.fare);
      setSurgeMultiplier(cached.surgeMultiplier);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. Get distance from Google Maps API
      const directionsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupCoords.lat},${pickupCoords.lng}&destination=${dropCoords.lat},${dropCoords.lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const directionsData = await directionsResponse.json();
      
      if (!directionsData.routes.length) {
        throw new Error("Could not calculate route distance");
      }

      const distanceInKm = Number((directionsData.routes[0].legs[0].distance.value / 1000).toFixed(2));
      
      // 2. Get surge pricing from backend
      const surgeResponse = await fetch(`${API_BASE_URL}/calculate-surge`);
      const { multiplier } = await surgeResponse.json();

      // 3. Calculate fare using backend API
      const fareResponse = await fetch(`${API_BASE_URL}/calculate-fare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          distance: distanceInKm,
          surgeMultiplier: multiplier 
        })
      });
      const { fare } = await fareResponse.json();

      // Cache results
      distanceCache.current.set(cacheKey, {
        distance: distanceInKm,
        fare,
        surgeMultiplier: multiplier,
        timestamp: Date.now()
      });

      setDistance(distanceInKm);
      setFare(fare);
      setSurgeMultiplier(multiplier);
    } catch (err) {
      setError(err.message || "Failed to calculate route details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pickupCoords, dropCoords, API_BASE_URL, GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    if (!pickup || !drop) {
      navigate("/", { replace: true });
    }
  }, [pickup, drop, navigate]);

  useEffect(() => {
    if (pickupCoords && dropCoords) {
      fetchDistanceAndFare();
    }
  }, [pickupCoords, dropCoords, fetchDistanceAndFare]);

  const handleConfirm = useCallback(async () => {
    try {
      setApiLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/book-ride`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          drop,
          pickupCoords,
          dropCoords,
          distance,
          fare,
          surgeMultiplier
        })
      });

      if (!response.ok) throw new Error("Failed to confirm ride");

      const { driver, eta } = await response.json();

      navigate("/success", {
        state: {
          pickup,
          drop,
          distance,
          fare,
          driverName: driver?.name || "Available Driver",
          eta: eta || Math.round(distance * 3)
        }
      });
    } catch (err) {
      setError(err.message || "Failed to confirm ride");
    } finally {
      setApiLoading(false);
    }
  }, [pickup, drop, pickupCoords, dropCoords, distance, fare, surgeMultiplier, navigate, API_BASE_URL]);

  if (!pickup || !drop) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, mt: 6, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>No ride data found!</Alert>
          <Button onClick={() => navigate("/")} variant="contained">
            Go to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Calculating your route...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom color="primary" textAlign="center">
          Ride Summary
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box mt={2}>
          <Typography variant="subtitle1">Pickup:</Typography>
          <Typography variant="body1" gutterBottom>{pickup}</Typography>

          <Typography variant="subtitle1">Drop:</Typography>
          <Typography variant="body1" gutterBottom>{drop}</Typography>

          <Typography variant="subtitle1" mt={2}>Distance:</Typography>
          <Typography variant="body1" gutterBottom>{distance} km</Typography>

          <Typography variant="subtitle1">Surge Multiplier:</Typography>
          <Typography variant="body1" gutterBottom>
            ×{surgeMultiplier.toFixed(2)} {surgeMultiplier > 1 && "(Peak Time)"}
          </Typography>

          <Typography variant="subtitle1" mt={2}>Fare:</Typography>
          <Typography variant="body1" gutterBottom>₹{fare}</Typography>

          {/* Pricing component temporarily commented out
          <Pricing 
            distance={distance} 
            surgeMultiplier={surgeMultiplier}
          />
          */}

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={apiLoading}
              fullWidth
            >
              {apiLoading ? <CircularProgress size={24} /> : "Confirm Ride"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}