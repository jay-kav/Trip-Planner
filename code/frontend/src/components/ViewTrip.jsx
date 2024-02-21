import React, { useState, useEffect } from 'react';
import GetItineraries from './GetItineraries';
import GetTripMembers from './GetTripMembers';
import { Box, Button, Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const defaultTheme = createTheme();

function ViewTrip(props) {
    let trip = props.trip;
    const [tripOwner, setTripOwner] = useState("");
    const [hotel, setHotel] = useState("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

    // Fetch requests
    useEffect(() => {
        if (tripOwner.length === 0) {
            axios.get(`api/users/${trip.owner.split("/").slice(-2).slice(0, -1)}/`)
            .then((response) => {
                console.log(response);
                setTripOwner(response.data);
            })
            .catch(err => console.log(err))
        }
        if (hotel.length == "") {
            axios.post(`get-hotel/`, {
                'country': trip.country,
                'city': trip.city,
                'hotel': trip.hotel
            })
            .then((response) => {
                console.log('hotel', response);
                setHotel(response.data.hotel);
            })
            .catch(err => console.log(err));
        }
    });

    // Trip functions
    const deleteTrip = (e) => {
        e.preventDefault();
        setShowDeleteConfirmation(true); // Show confirmation dialog
    };

    const confirmDeleteTrip = () => {
        // Perform delete operation
        axios.post(`delete-trip/`, {
            'tripID': trip.id
        })
        .then((response) => {
            console.log(response);
            window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    };

    const handleDeleteCloseConfirmation = () => {
        setShowDeleteConfirmation(false); // Close confirmation dialog
    };

    const leaveTrip = (e) => {
        e.preventDefault();
        setShowLeaveConfirmation(true); // Show confirmation dialog
    }

    const confirmLeaveTrip = (e) => {
        if (tripOwner.id == localStorage.getItem('sessionID')) {
            alert("You are the owner of this trip. Please assign someone else as trip owner.");
        } else {
            axios.post(`remove-member/`, {
                'memberID': localStorage.getItem('sessionID'),
                'tripID': trip.id
            })
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => console.error("Error:", err));
        }
    }

    const handleLeaveCloseConfirmation = () => {
        setShowLeaveConfirmation(false); // Close confirmation dialog
    };

    const getDate = (date) => {
        let ymd = date.split('-');
        return `${ymd[2]}/${ymd[1]}/${ymd[0]}`;
    }

    const tripInfo = () => {
      return (
        <Card sx={{ width: '21vw', height: '28vh'}}>
          <CardContent>
            <Typography variant="h5" component="div">
              {trip.tripname}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {hotel}, {trip.city}, {trip.country}
            </Typography>
            <Typography variant="body2">
              {getDate(trip.startDate)} - {getDate(trip.endDate)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5}}>
            {localStorage.getItem('sessionID') == tripOwner.id
                && <Button sx={{fontSize: '.8vw'}} onClick={deleteTrip} variant="contained" color="error">Delete Trip</Button>}
                <Button sx={{fontSize: '.8vw'}} onClick={leaveTrip} variant="contained" color="error">Leave Trip</Button>
            </Box>
          </CardContent>
        </Card>
      );
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid sx={{display: 'flex'}}>
                <CssBaseline />
                <Grid>
                    <Box sx={{
                      mx: 4,
                      mt: 5,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3
                    }}>
                        {tripInfo()}
                        <GetTripMembers trip={trip} tripOwner={tripOwner} />
                    </Box>
                    <Box sx={{
                      mx: 4,
                      mt: 3.3,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3
                    }}>
                        <Card sx={{ width: '44vw', height: '58vh'}}>
                          <CardContent>
                          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4763.269431318977!2d-6.228799500000018!3d53.349794800000026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670ef1b67ab3fb%3A0x897f83f77219806b!2sHost%20Point%20Campus!5e0!3m2!1sen!2sie!4v1708471672887!5m2!1sen!2sie" style={{width: '41vw', height: '52vh'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                          </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid>
                    <Box>
                        <GetItineraries trip={trip} tripOwner={tripOwner} />
                    </Box>
                </Grid>
            </Grid>
            <Dialog
                open={showDeleteConfirmation}
                onClose={handleDeleteCloseConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this trip?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCloseConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteTrip} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showLeaveConfirmation}
                onClose={handleLeaveCloseConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to leave this trip?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLeaveCloseConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmLeaveTrip} color="primary" autoFocus>
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}

export default ViewTrip
