import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  DirectionsCar as RideIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Pending as PendingIcon
} from '@mui/icons-material';

const rides = [
  {
    id: 1,
    date: '2023-06-15',
    pickup: 'Central Park',
    drop: 'Times Square',
    fare: '$15.20',
    status: 'completed',
    driver: 'John D.'
  },
  {
    id: 2,
    date: '2023-06-10',
    pickup: 'Airport',
    drop: 'Downtown Hotel',
    fare: '$28.50',
    status: 'completed',
    driver: 'Sarah M.'
  },
  {
    id: 3,
    date: '2023-06-05',
    pickup: 'Home',
    drop: 'Office',
    fare: '$12.75',
    status: 'cancelled',
    driver: 'Mike T.'
  }
];

export default function RecentRides() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Your Recent Rides</Typography>
      
      <List sx={{ width: '100%' }}>
        {rides.map((ride) => (
          <React.Fragment key={ride.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <RideIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${ride.pickup} → ${ride.drop}`}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      display="block"
                    >
                      {ride.date} • {ride.driver}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={ride.status}
                        size="small"
                        icon={
                          ride.status === 'completed' ? <CompletedIcon /> :
                          ride.status === 'cancelled' ? <CancelledIcon /> :
                          <PendingIcon />
                        }
                        color={
                          ride.status === 'completed' ? 'success' :
                          ride.status === 'cancelled' ? 'error' : 'warning'
                        }
                      />
                      <Typography component="span" sx={{ ml: 2 }}>
                        {ride.fare}
                      </Typography>
                    </Box>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}