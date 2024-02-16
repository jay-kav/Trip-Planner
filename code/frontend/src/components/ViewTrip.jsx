import React, { useState, useEffect } from 'react';
import GetItineraries from './GetItineraries';
import GetTripMembers from './GetTripMembers';
import { Box, Button, Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

const defaultTheme = createTheme();

function ViewTrip(props) {
    let trip = props.trip;
    const [tripOwner, setTripOwner] = useState("");

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
    });

    // Trip functions
    const deleteTrip = (e) => {
        e.preventDefault();
        axios.post(`delete-trip/`, {
            'tripID': trip.id
        })
        .then((response) => {
          console.log(response);
          window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    }

    const leaveTrip = (e, tripID) => {
        e.preventDefault();
        if (tripOwner.id == localStorage.getItem('sessionID')) {
            alert("You are the owner of this trip. Please assign someone else as trip owner.");
        } else {
            axios.post(`remove-member/`, {
                'memberID': tripOwner.id,
                'tripID': tripID
            })
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => console.error("Error:", err));
        }
    }

    const clearActivities = (e) => {
        e.preventDefault();
        axios.post(`clear-activities/`, {
            'tripID': trip.id
        })
        .then((response) => {
          console.log(response);
          window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    }

    const getDate = (date) => {
        let ymd = date.split('-');
        return `${ymd[1]}/${ymd[2]}/${ymd[0]}`;
    }

    const tripInfo = () => {
      return (
        <Card sx={{ width: '36vw', height: '24vh' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {trip.tripname}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {trip.hotel}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {trip.city}, {trip.country}
            </Typography>
            <Typography variant="body2">
              {getDate(trip.startDate)} - {getDate(trip.endDate)}
            </Typography>
            {localStorage.getItem('sessionID') == tripOwner.id
            && <Button sx={{fontSize: '.9vw', marginLeft: '22vw', height: '5vh'}} onClick={(e) => clearActivities(e)} variant="contained" color="error">Clear Activities</Button>
            }
          </CardContent>
        </Card>
      );
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container spacing={2} component="main" sx={{
                    height: '88vh',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                <CssBaseline />
                <Grid item xs={5}>
                    <Box sx={{
                      mx: 4,
                      mt: 5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                        {tripInfo()}
                        <br />
                        <GetTripMembers trip={trip} tripOwner={tripOwner} />
                        <br />
                        <Box sx={{ display: 'flex', gap: '16vw' }}>
                        {localStorage.getItem('sessionID') == tripOwner.id
                            && <Button onClick={deleteTrip} variant="contained" color="error">Delete Trip</Button>}
                            <Button onClick={leaveTrip} variant="contained" color="error">Leave Trip</Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={7}>
                    <Box>
                        <GetItineraries trip={trip} tripOwner={tripOwner} />
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default ViewTrip
