import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert
} from "@mui/material";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function BookRide() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState("");
  
  const pickupAutocomplete = usePlacesAutocomplete();
  const dropAutocomplete = usePlacesAutocomplete();
  const navigate = useNavigate();

  const handleSelect = async (description, type) => {
    setLoading(true);
    setError("");
    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      if (type === "pickup") {
        setPickup(description);
        setPickupCoords({ lat, lng });
        pickupAutocomplete.clearSuggestions();
      } else {
        setDrop(description);
        setDropCoords({ lat, lng });
        dropAutocomplete.clearSuggestions();
      }
    } catch (err) {
      setError("Failed to get location details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFindRide = async () => {
    if (!pickupCoords || !dropCoords) {
      setError("Please select valid pickup and drop locations.");
      return;
    }
    
    setApiLoading(true);
    setError("");
    
    try {
      // 1. First call to calculate fare
      const fareResponse = await fetch(`${API_BASE_URL}/calculate-fare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupCoords,
          dropCoords
        })
      });

      if (!fareResponse.ok) {
        throw new Error("Failed to calculate fare");
      }

      const fareData = await fareResponse.json();

      // 2. Then book the ride
      const bookResponse = await fetch(`${API_BASE_URL}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickup,
          drop,
          pickupCoords,
          dropCoords,
          fare: fareData.fare
        })
      });

      if (!bookResponse.ok) {
        throw new Error("Failed to book ride");
      }

      const rideData = await bookResponse.json();

      // Navigate to summary with all data
      navigate("/ride-summary", {
        state: {
          pickup,
          drop,
          pickupCoords,
          dropCoords,
          distance: fareData.distance,
          fare: fareData.fare,
          driverName: rideData.driver?.name || "Available Driver",
          eta: rideData.eta || Math.round(fareData.distance * 3) // Default 3 mins per km
        },
      });
    } catch (err) {
      setError(err.message || "Failed to book ride. Please try again.");
      console.error("API Error:", err);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, mt: 6 }}>
          <Typography variant="h5" gutterBottom textAlign="center" color="primary">
            Book Your Smart Ride
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Pickup Location"
            margin="normal"
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              pickupAutocomplete.setValue(e.target.value);
            }}
          />
          {pickupAutocomplete.suggestions.status === "OK" && (
            <List sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider' }}>
              {pickupAutocomplete.suggestions.data.map((suggestion) => (
                <ListItem disablePadding key={suggestion.place_id}>
                  <ListItemButton onClick={() => handleSelect(suggestion.description, "pickup")}>
                    <ListItemText primary={suggestion.description} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          <TextField
            fullWidth
            label="Drop Location"
            margin="normal"
            value={drop}
            onChange={(e) => {
              setDrop(e.target.value);
              dropAutocomplete.setValue(e.target.value);
            }}
          />
          {dropAutocomplete.suggestions.status === "OK" && (
            <List sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider' }}>
              {dropAutocomplete.suggestions.data.map((suggestion) => (
                <ListItem disablePadding key={suggestion.place_id}>
                  <ListItemButton onClick={() => handleSelect(suggestion.description, "drop")}>
                    <ListItemText primary={suggestion.description} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleFindRide}
              disabled={!pickupCoords || !dropCoords || loading || apiLoading}
              startIcon={(loading || apiLoading) ? <CircularProgress size={20} /> : null}
            >
              {(loading || apiLoading) ? 'Processing...' : 'Find Ride'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </LoadScript>
  );
}