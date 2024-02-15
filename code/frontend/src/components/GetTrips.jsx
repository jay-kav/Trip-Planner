import React, { useState, useEffect } from 'react';
import ViewTrip from './ViewTrip';
import axios from 'axios';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

function GetTrips() {
    const [trips, setTrips] = useState([]);
    const [selected, setSelected] = useState(null);

    const getTrips = () => {
      // <CardMedia component="div" sx={{pt: '56.25%'}} image="https://source.unsplash.com/random?wallpapers"/>
      return trips.map((trip) => (
        <Grid item key={trip.id} xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {trip.tripname}
              </Typography>
              <Typography>
                {trip.city}, {trip.country}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setSelected(trip)}>View</Button>
            </CardActions>
          </Card>
        </Grid>
      ));
    };  

    useEffect(() => {
        axios.get(`api/trips/?members=${localStorage.getItem('sessionID')}`)
        .then((response) => {
            console.log(response);
            setTrips(response.data);
        })
        .catch(err => console.log(err))
    }, []);

    if (selected) {
        return (
            <ViewTrip trip={selected} />
        )
    }
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Journo
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                A collection of trips you are a member of.
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="contained" href='/createtrip'>New Trip +</Button>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ display: 'flex', flexDirection: 'row' }} maxWidth="md">
            <Grid container spacing={4}>
              {getTrips()}
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
    );
  }  

export default GetTrips