import React, { useState, useEffect } from 'react';
import GetItineraries from './GetItineraries';
import GetTripMembers from './GetTripMembers';
import { Box, Grid } from '@mui/material';
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

    const tripInfo = () => {
      return (
        <Card sx={{ width: '36vw', height: '24vh' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {trip.tripname}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {trip.city}, {trip.country}
            </Typography>
            <Typography variant="body2">
              {trip.startDate} - {trip.endDate}
            </Typography>
          </CardContent>
        </Card>
      );
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh', display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center'}}>
                <CssBaseline />
                <Grid>
                    <Box sx={{
                      mx: 4,
                      my: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                        {tripInfo()}
                        <br />
                        <GetTripMembers trip={trip} tripOwner={tripOwner} />
                    </Box>
                </Grid>
                <Grid>
                    <Box>
                        <GetItineraries trip={trip} tripOwner={tripOwner} />
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )

    return (
        <div>
            <button className='btn btn-primary' onClick={() => window.location.reload()}>Home</button>
            <div style={{display: 'grid', gridTemplateColumns: '50% 50%'}}>
                <div key={trip.id}>
                    <h4 style={{textAlign: 'center'}}>{trip.tripname}</h4>
                    <br />
                    {tripInfo()}
                    <br />
                    <GetTripMembers trip={trip} tripOwner={tripOwner} />
                    <br />
                    <div style={{display: 'flex', gap: '20px'}}>
                        <button className='btn btn-danger' onClick={(e) => leaveTrip(e)}>Leave Trip</button>
                        {localStorage.getItem('sessionID') == tripOwner.id && <button className='btn btn-danger' onClick={(e) => deleteTrip(e)}>Delete Trip</button>}
                    </div>
                </div>
                <div>
                    <GetItineraries trip={trip} tripOwner={tripOwner} />
                </div>
            </div>
        </div>
    )
}

export default ViewTrip
