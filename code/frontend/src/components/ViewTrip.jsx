import React, { useState, useEffect } from 'react';
import GetItineraries from './GetItineraries';
import GetTripMembers from './GetTripMembers';
import { Box, Button, Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Map from './Map';

const defaultTheme = createTheme();

function ViewTrip(props) {
    let tripID = props.trip;
    const [tripOwner, setTripOwner] = useState(null);
    const [trip, setTrip] = useState(null);
    const [hotel, setHotel] = useState("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
    // handles reference passed from GetItineraries
    const [sharedState, setSharedState] = useState([]);
    const handleFunctionCallFromSiblingOne = (value) => setSharedState(value); 

    // Fetch requests
    useEffect(() => {
        if (trip == null) {
            axios.get(`api/trips/${tripID}/`) // gets selected trip from rest framework
            .then((response) => {
                console.log(response);
                setTrip(response.data);
            })
            .catch(err => console.log(err))
        }
    });

    useEffect(() => {
        if (trip && tripOwner == null) {
            axios.get(`api/users/${trip.owner.split("/").slice(-2).slice(0, -1)}/`) // gets trip owner from rest framework
            .then((response) => {
                console.log(response);
                setTripOwner(response.data);
            })
            .catch(err => console.log(err))
        }
    });

    useEffect(() => {
        if (trip && hotel.length == "") {
            axios.post(`get-hotel/`, {  // gets hotel info  associated with selected trip
                'country': trip.country,
                'city': trip.city,
                'hotel': trip.hotel
            })
            .then((response) => {
                console.log('hotel', response);
                setHotel(response.data);
            })
            .catch(err => console.log(err));
        }
    }, trip);

    /* ----- Trip functions ----- */
    // prevents accidental deletion of trip
    const deleteTrip = (e) => {
        e.preventDefault();
        setShowDeleteConfirmation(true); // Show confirmation dialog
    };

    // deletes trip
    const confirmDeleteTrip = () => {
        // Perform delete operation
        axios.post(`delete-trip/`, { // endpoint to delete selected trip
            'tripID': trip.id
        })
        .then((response) => {
            console.log(response);
            window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    };

    // handles closing of delete trip dialog box
    const handleDeleteCloseConfirmation = () => {
        setShowDeleteConfirmation(false); // Close confirmation dialog
    };

    // prevents accidental leaving of trip
    const leaveTrip = (e) => {
        e.preventDefault();
        setShowLeaveConfirmation(true); // Show confirmation dialog
    }

    // leaves trip
    const confirmLeaveTrip = (e) => {
        if (tripOwner.id == localStorage.getItem('sessionID')) { // checks if user is trip owner or not
            alert("You are the owner of this trip. Please assign someone else as trip owner.");
        } else {
            axios.post(`remove-member/`, { // endpoint to remove user from selected trip
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

    // handles closing of leave trip dialog box
    const handleLeaveCloseConfirmation = () => {
        setShowLeaveConfirmation(false); // Close confirmation dialog
    };

    // formats the provided date
    const getDate = (date) => {
        let ymd = date.split('-');
        return `${ymd[2]}/${ymd[1]}/${ymd[0]}`;
    }

    // returns all the info of a trip on a Card component
    const tripInfo = () => {
        if (trip && tripOwner) {
            return (
                <Card sx={{ width: '21vw', height: '28vh'}}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {trip.tripname}
                    </Typography>
                    <Typography sx={{ mb: 1, fontSize: '1.1vw' }} color="text.secondary">
                    {hotel.name}, {trip.city}, {trip.country}
                    </Typography>
                    <Typography variant="body2" sx={{fontSize: '.9vw' }} >
                      {getDate(trip.startDate)} - {getDate(trip.endDate)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5}}>
                    {localStorage.getItem('sessionID') == tripOwner.id
                        && <Button sx={{fontSize: '.8vw'}} onClick={(e) => {deleteTrip(e);sessionStorage.setItem('selected', null);}} variant="contained" color="error">Delete Trip</Button>}
                        <Button sx={{fontSize: '.8vw'}} onClick={(e) => {leaveTrip(e);sessionStorage.setItem('selected', null);}} variant="contained" color="error">Leave Trip</Button>
                    </Box>
                  </CardContent>
                </Card>
              );
        }
    };

    // displays the trip, its members, it's itineraries and the map
    return (
        <ThemeProvider theme={defaultTheme}>
            {trip && tripOwner && (<Grid>
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
                        {trip && tripOwner && <GetTripMembers trip={trip} tripOwner={tripOwner} />}
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
                            <Map trip={trip} sharedState={sharedState} />
                          </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid>
                    <Box>
                        {trip && tripOwner && <GetItineraries trip={trip} tripOwner={tripOwner} onAction={handleFunctionCallFromSiblingOne} />} {/* handles syncing of itinerary and map */}
                    </Box>
                </Grid>
            </Grid>
            {/* Dialog Boxes */}
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
            </Grid>
            )}
        </ThemeProvider>
    )
}

export default ViewTrip
