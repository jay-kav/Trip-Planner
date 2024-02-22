import React, { useState, useEffect } from 'react';
import ViewTrip from './ViewTrip';
import axios from 'axios';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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

  useEffect(() => {
    const storedSelected = sessionStorage.getItem('selected');
    if (storedSelected) {
      setSelected(JSON.parse(storedSelected));
    }
  }, []);

  useEffect(() => {
    if (trips.length === 0) {
      axios.get(`api/trips/?members=${localStorage.getItem('sessionID')}`)
      .then((response) => {
          console.log(response);
          setTrips(response.data);
      })
      .catch(err => console.log(err))
    }
  });

  // const getImage = (country, city) => {
  //   axios.post(`get-image/`, { 
  //     'country': country, 
  //     'city': city
  //   })
  //   .then((response) => {
  //     return response.data.image;
  //   })
  //   .catch(err => console.log(err));
  // }

  const getImage = (country, city) => {
    return axios
      .post(`get-image/`, {
        country: country,
        city: city,
      })
      .then((response) => {
        // Extract image data from the JSON document
        
        let imageData = response.data.image;
        console.log(response.data.image)
  
        // Check if image data is available
        if (imageData) {
          // Return the complete base64-encoded image source
          return `data:image/jpeg;base64,${imageData}`;
        } else {
          // Return a default image or handle the case where image data is not available
          return ''; // or some default image
        }
      })
      .catch((err) => {
        console.log(err);
        // Return a default image or handle the error case
        return ''; // or some default image
      });
  };

    const getTrips = () => {
      return trips.map((t) => (
        <Grid item key={t.id} xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia component="img" height="140" src={getImage(t.country, t.city)} alt="trip image" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {t.tripname}
              </Typography>
              <Typography>
                {t.city}, {t.country}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => {
                sessionStorage.setItem('selected', JSON.stringify(t.id));
                setSelected(t.id);
              }}>View</Button>
            </CardActions>
          </Card>
        </Grid>
      ));
    };
    
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