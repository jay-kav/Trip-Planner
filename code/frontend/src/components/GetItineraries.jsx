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

const filterList = {
  'Breakfast': 'breakfast',
  'Lunch': 'lunch',
  'Dinner': 'dinner',
  'Walking': 'park',
  'History': 'museum',
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
      console.log({
        'tripID': trip.id,
        'country': trip.country,
        'city': trip.city,
        'date': data.get('date'),
        'startTime': data.get('startTime'),
        'endTime': data.get('endTime'),
      })
      axios.post(`create-itinerary/`, {
        'tripID': trip.id,
        'country': trip.country,
        'city': trip.city,
        'date': data.get('date'),
        'startTime': data.get('starttime'),
        'endTime': data.get('endtime'),
      })
      .then((response) => {
        console.log(response);
        window.location.reload();
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
                <Grid item xs={12}>
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TimeField
                      name="starttime"
                      required
                      fullWidth
                      id="starttime"
                      label="Start Time"
                      format="HH:mm"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimeField 
                      required
                      fullWidth
                      id="endtime"
                      label="End Time"
                      name="endtime"
                      format="HH:mm"
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

      /*  return (
          <div style={{minHeight: '20rem', borderLeft: 'solid 1px grey', paddingLeft: '30px'}}>
              <form className="form-group" onSubmit={(e) => submitForm(e)} style={{width: '14rem'}}>
                  <div style={{display: 'flex', gap: '30px'}}>
                    <div>
                      <label htmlFor="date">Date </label>
                      <input className="form-control" onChange={(e) => handle(e)} value={data.date} id="date" type='date'></input>
                      <br />
                      <label htmlFor="startTime">Start Time </label>
                      <input className="form-control" onChange={(e) => handle(e)} value={data.startTime} id="startTime" type='time'></input>
                      <br />
                      <label htmlFor="endTime">End Time </label>
                      <input className="form-control" onChange={(e) => handle(e)} value={data.endTime} id="endTime" type='time'></input>
                    </div>
                    <div style={{paddingLeft: '20px', display: 'grid', gridTemplateColumns: 'auto', justifyContent: 'space-between'}}>
                      <label style={{marginRight: '5px'}} for="breakfast">Breakfast</label>
                      <input onChange={(e) => handle(e)} value={data.breakfast} className="form-check-input" id='breakfast' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="lunch">Lunch</label>
                      <input onChange={(e) => handle(e)} value={data.lunch} className="form-check-input" id='lunch' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="dinner">Dinner</label>
                      <input onChange={(e) => handle(e)} value={data.dinner} className="form-check-input" id='dinner' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="park">Parks</label>
                      <input onChange={(e) => handle(e)} value={data.park} className="form-check-input" id='park' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="museum">Museum</label>
                      <input onChange={(e) => handle(e)} value={data.museum} className="form-check-input" id='museum' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="shopping">Shopping</label>
                      <input onChange={(e) => handle(e)} value={data.shopping} className="form-check-input" id='shopping' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="zoo">Zoo</label>
                      <input onChange={(e) => handle(e)} value={data.zoo} className="form-check-input" id='zoo' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="aquarium">Aquarium</label>
                      <input onChange={(e) => handle(e)} value={data.aquarium} className="form-check-input" id='aquarium' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="amusement_park">Amusement Park</label>
                      <input onChange={(e) => handle(e)} value={data.amusement_park} className="form-check-input" id='amusement_park' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="bowling">Bowling</label>
                      <input onChange={(e) => handle(e)} value={data.bowling} className="form-check-input" id='bowling' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="tourism">Tourism</label>
                      <input onChange={(e) => handle(e)} value={data.tourism} className="form-check-input" id='tourism' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="nightlife">Nightlife</label>
                      <input onChange={(e) => handle(e)} value={data.nightlife} className="form-check-input" id='nightlife' type='checkbox' />
                    </div>
                  </div>
                  <br />
                  <div style={{display: 'flex', gap: '5px'}}>
                    <button className="btn btn-primary" type='submit'>Create Itinerary</button>
                    <button className='btn btn-secondary' onClick={() => setCreate(!create)} >Cancel</button>
                  </div>
              </form>
          </div>
      )*/};

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
          <Card key={itinerary.id} style={{ with: '80vw', display: index === currentItineraryIndex ? 'block' : 'none' }}>
            <Box>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px' }}>
                <h5>{getDate(itinerary.date)}</h5>
                {localStorage.getItem('sessionID') == tripOwner.id && <DeleteOutlineIcon titleAccess="Delete Itinerary" onClick={(e) => deleteItinerary(e, itinerary, trip.id)} />}  
              </Box>
            </Box>
            <List sx={{height: '50vh', overflowY: 'scroll'}}>
              <GetActivities ids={itinerary.activities} />
            </List>
          </Card>
        ));
    }

    // Render Itineraries
    return (
      <Card sx={{ width: '46vw', height: '78vh', mt: 3, overflowY: 'auto'}}>
          <CardContent>
            <div style={{display: 'flex', gap: '45%', margin: '0 15px'}}>
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
              <div style={{
                display: 'flex'
              }}>
                {itineraries.length > 0 && currentItineraryIndex != 0 && <ArrowBackIosRoundedIcon sx={{marginRight: '8px'}} onClick={goToPreviousItinerary} />}
                <div style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                width: '39vw'
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