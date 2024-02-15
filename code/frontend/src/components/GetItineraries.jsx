import React, { useState, useEffect } from 'react';
import GetActivities from './GetActivities';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { TimeField } from '@mui/x-date-pickers';
import { Card, CardContent } from '@mui/material';
import { List } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const filterList = {
  'Breakfast': 'breakfast',
  'Lunch': 'lunch',
  'Dinner': 'dinner',
  'Parks': 'park',
  'Museum': 'museum',
  'Shopping': 'shopping_mall',
  'Zoo': 'zoo',
  'Aquarium': 'aquarium',
  'Amusement Park': 'amusement_park',
  'Bowling': 'bowling_alley',
  'Tourism': 'tourist_attraction',
  'Nightlife': 'night_club', 
};

const defaultTheme = createTheme();

let itineraryCount = 0;

function GetItineraries(props) {
    console.log(props);
    let tripOwner = props.tripOwner;
    let trip = props.trip;

    const [create, setCreate] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [currentItineraryIndex, setCurrentItineraryIndex] = useState(0);
    
    // Fetch requests
    useEffect(() => {
        if (itineraryCount < 5) {
          axios.get(`api/itineraries/?trip_id=${trip.id}`)
          .then((response) => {
            console.log(response);
            setItineraries(response.data);
            itineraryCount += 1;
          })
          .catch(err => console.log(err))
        }
    });

    /* ---------- Itinerary Functions ---------- */
    const submitForm = (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      let filters = [];
      for (let filter in filterList) {
        if (data.get(filterList[filter]) == 'on') {
          filters.push(filterList[filter]);
        }
      }
      axios.post(`create-itinerary/`, {
        'tripID': trip.id,
        'country': trip.country,
        'city': trip.city,
        'hotel': trip.hotel,
        'date': data.get('date'),
        'startTime': data.get('starttime'),
        'endTime': data.get('endtime'),
        'roundTrip': data.get('roundtrip') == 'on',
        'filters': filters
      })
      .then((response) => {
        console.log(response);
        //window.location.href = "/";
      })
      .catch((err) => console.error("Error:", err));
    };
  
    const createItinerary = () => {
      return (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                New Itinerary
              </Typography>
              <Box component="form" noValidate onSubmit={submitForm} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Grid>
                      <DatePicker
                        required
                        fullWidth
                        id="date"
                        label="Date"
                        name="date"
                        autoFocus
                      />
                    </Grid>
                    <br />
                    <Grid>
                      <TimeField
                        name="starttime"
                        required
                        fullWidth
                        id="starttime"
                        label="Start Time"
                        format="HH:mm"
                      />
                    </Grid>
                    <br />
                    <Grid>
                      <TimeField 
                        required
                        fullWidth
                        id="endtime"
                        label="End Time"
                        name="endtime"
                        format="HH:mm"
                      />
                    </Grid>
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="roundtrip"
                              id="roundtrip"
                          />
                      }
                      label="Round Trip"
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="breakfast"
                              id="breakfast"
                              defaultChecked
                          />
                      }
                      label="Breakfast"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="lunch"
                              id="lunch"
                              defaultChecked
                          />
                      }
                      label="Lunch"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="dinner"
                              id="dinner"
                              checked
                          />
                      }
                      label="Dinner"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="park"
                              id="park"
                              defaultChecked
                          />
                      }
                      label="Parks"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="museum"
                              id="museum"
                              defaultChecked
                          />
                      }
                      label="Museum"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="shopping_mall"
                              id="shopping_mall"
                              defaultChecked
                          />
                      }
                      label="Shopping"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="zoo"
                              id="zoo"
                              defaultChecked
                          />
                      }
                      label="Zoo"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="amusement_park"
                              id="amusement_park"
                              defaultChecked
                          />
                      }
                      label="Amusement Park"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="aquarium"
                              id="aquarium"
                              defaultChecked
                          />
                      }
                      label="Aquarium"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="bowling_alley"
                              id="bowling_alley"
                              defaultChecked
                          />
                      }
                      label="Bowling"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="tourist_attraction"
                              id="tourist_attraction"
                              defaultChecked
                          />
                      }
                      label="Tourist Attractions"
                    />
                    <FormControlLabel
                      control={
                          <Checkbox
                              name="night_club"
                              id="night_club"
                              defaultChecked
                          />
                      }
                      label="Nightlife"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Create Itinerary
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      onClick={() => setCreate(!create)}
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
    }

    // Delete Itinerary
    const deleteItinerary = (e, itinerary, tripID) => { 
        e.preventDefault();
        axios.post(`delete-itinerary/`, {
            'itineraryID': itinerary.id,
            'activities': itinerary.activities,
            'tripID': tripID
        })
        .then((response) => {
          console.log(response); // Log the entire response
          window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const getDate = (date) => {
      let ymd = date.split('-');
      return `${ymd[1]}/${ymd[2]}/${ymd[0]}`;
    }

    // Functions to handle cycling through itineraries
    const goToPreviousItinerary = () => {
      setCurrentItineraryIndex(prevIndex => (prevIndex === 0 ? itineraries.length - 1 : prevIndex - 1));
    };

    const goToNextItinerary = () => {
      setCurrentItineraryIndex(prevIndex => (prevIndex === itineraries.length - 1 ? 0 : prevIndex + 1));
    };

    const getItineraries = () => {
      return itineraries.map((itinerary, index) => (
          <Card key={itinerary.id} style={{display: index === currentItineraryIndex ? 'block' : 'none' }}>
            <Box>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px' }}>
                <h5>{getDate(itinerary.date)}</h5>
                {localStorage.getItem('sessionID') == tripOwner.id && <DeleteOutlineIcon titleAccess="Delete Itinerary" onClick={(e) => deleteItinerary(e, itinerary, trip.id)} />}  
              </Box>
            </Box>
            <List sx={{height: '62vh', overflowY: 'scroll'}}>
              <GetActivities ids={itinerary.activities} country={trip.country} city={trip.city} />
            </List>
          </Card>
        ));
    }

    // Render Itineraries
    return (
      <Card sx={{ width: '55vw', height: '90vh', mt: 5, overflowY: 'auto'}}>
          <CardContent>
            <div style={{display: 'flex', margin: '0 15px'}}> 
              {localStorage.getItem('sessionID') == tripOwner.id
              && !create
              && <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => setCreate(!create)}>Add Itinerary</Button>}
            </div>
            <div style={{gap: '5px', alignItems: 'center'}}>
              {create && createItinerary()}
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {itineraries.length > 0 && currentItineraryIndex != 0 && <ArrowBackIosRoundedIcon sx={{marginRight: '8px'}} onClick={goToPreviousItinerary} />}
                <div style={{
                display: 'flex',
                whiteSpace: 'nowrap'
              }}>
                  {getItineraries()}
                </div>
                {itineraries.length > 0 && currentItineraryIndex != itineraries.length - 1 && <ArrowForwardIosRoundedIcon sx={{marginLeft: '8px'}} onClick={goToNextItinerary} />}
              </div>
            </div>
          </CardContent>
        </Card>
    )
}

export default GetItineraries