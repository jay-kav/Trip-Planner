import React, { useState, useEffect } from 'react';
import GetActivities from './GetActivities';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';
import Container from '@mui/material/Container';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { TimeField } from '@mui/x-date-pickers';
import { Card, CardContent } from '@mui/material';
import { List } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// list of filters (key and value pairs)
const filterList = {
  'Breakfast': 'serves_breakfast',
  'Lunch': 'serves_lunch',
  'Dinner': 'serves_dinner',
  'Vegetarian Food': 'serves_vegetarian_food',
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

// styling for modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  alignItems: 'center',
};

// track number of itinerary requests
let itineraryCount = 0;

function GetItineraries(props) {
    console.log(props);
    let tripOwner = props.tripOwner;
    let trip = props.trip;
    let onAction =  props.onAction;
    const [create, setCreate] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [itineraryID, setItineraryID] = useState("");
    const [activities, setActivities] = useState([]);
    const [currentItineraryIndex, setCurrentItineraryIndex] = useState(0);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    // handle modal open/close logic
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = (event, reason) => {
      if (reason == 'clickaway') {
        return
      }
      setOpen(false);
    }
    
    // Fetch requests
    useEffect(() => {
        if (itineraryCount < 5) { // hard stop to prevent infinite loop, if no itineraries
          axios.get(`api/itineraries/?trip_id=${trip.id}`) // endpoint to get itineraries
          .then((response) => {
            console.log(response);
            setItineraries(response.data);
            itineraryCount += 1;
          })
          .catch(err => console.log(err))
        }
    });

    // Passes reference of current itinerary to parent component
    useEffect(() => {
      if (itineraries.length > 0) {
        onAction(itineraries[currentItineraryIndex].activities);
      }
    })

    /* ---------- Create Itinerary ---------- */
    const submitForm = (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      console.log(data.get('date'));
      let filters = [];
      for (let filter in filterList) {
        if (data.get(filterList[filter]) == 'on') {
          filters.push(filterList[filter]);
        }
      }
      let date = data.get('date')
      let startTime = data.get('starttime')
      let endTime = data.get('endtime')
      let roundTrip = data.get('roundtrip')
      let a = date.split('/');
      let checkdate = new Date(`${a[2]}-${a[1]}-${a[0]}T00:00:00Z`);
      console.log(checkdate);
      if (checkdate > new Date(trip.endDate) || checkdate < new Date(trip.startDate)) {
        alert('You must create an itinerary for a valid date in you trip!');
      } else if (startTime < "08:00") {
        alert('You must select a start time of earliest 08:00');
      } else if (endTime < startTime) {
        alert('You must select an end time later than start time');
      } else if (endTime < "08:00") {
        alert('You must select a end time of latest 23:59');
      } else {
        handleOpen();
        axios.post(`create-itinerary/`, {
          'tripID': trip.id,
          'country': trip.country,
          'city': trip.city,
          'hotel': trip.hotel,
          'date': date,
          'startTime': startTime,
          'endTime': endTime,
          'roundTrip': roundTrip == "on",
          'filters': filters
        })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((err) => {
          alert(err.response.data.reason);
          console.error("Error:", err);
        })
      }
    };

    const createItinerary = () => {
      return (
        <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box id='form' component="form" onSubmit={(e) => submitForm(e)} noValidate>
                  <Grid container spacing={4}>
          <Grid item xs={4}>
            <Grid>
              <DatePicker
                required
                fullWidth
                id="date"
                label="Date"
                name="date"
                autoFocus
                format="DD/MM/YYYY"
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
          <Grid item xs={4}>
            <FormControlLabel
              control={
                  <Checkbox
                      name="serves_breakfast"
                      id="serves_breakfast"
                      defaultChecked
                  />
              }
              label="Breakfast"
            />
            <FormControlLabel
              control={
                  <Checkbox
                      name="serves_lunch"
                      id="serves_lunch"
                      defaultChecked
                  />
              }
              label="Lunch"
            />
            <FormControlLabel
              control={
                  <Checkbox
                      name="serves_dinner"
                      id="serves_dinner"
                      defaultChecked
                  />
              }
              label="Dinner"
            />
            <FormControlLabel
              control={
                  <Checkbox
                      name="serves_vegetarian_food"
                      id="serves_vegetarian_food"
                      defaultChecked
                  />
              }
              label="Vegetarian Food"
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
          </Grid>
          <Grid item xs={4}>
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
          </Grid>
          <Grid item sx={4}>
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
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='contained' type='submit'>Create Itinerary</Button>
                <Button variant='contained' onClick={() => setCreate(false)}>Cancel</Button>
              </div>
            </Box>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableBackdropClick 
          >
            <Box sx={style}>
              <Box>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Creating Itinerary
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Your itinerary is being created. This may take a moment.
              </Typography>
              </Box>
              <Box>
                <img src='https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif?cid=6c09b95265apt1copf20slwdtlb1obqsuu3a8oj926j7dfcg&ep=v1_gifs_search&rid=200w.gif&ct=g' />
              </Box>
            </Box>
          </Modal>
        </Container>
      );
    }

    // Clear activities from current trip
    const clearActivities = (e) => {
      e.preventDefault();
      axios.post(`clear-activities/`, {
          'tripID': trip.id
      })
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((err) => console.error("Error:", err));
    }

    // Delete selected itinerary from trip
    const deleteItinerary = (e, itinerary) => { 
        e.preventDefault();
        setItineraryID(itinerary.id);
        setActivities(itinerary.activities);
        setShowDeleteConfirmation(true);
    }

    // Confirmation to prevent accidental deletion of itinerary
    const confirmDeleteItinerary = () => {
      axios.post(`delete-itinerary/`, {
        'itineraryID': itineraryID,
        'activities': activities,
        'tripID': trip.id
      })
      .then((response) => {
        console.log(response); // Log the entire response
        window.location.reload();
      })
      .catch((err) => console.error("Error:", err));
    }

    // Handles closing of delete confirmation dialog
    const handleDeleteCloseConfirmation = () => {
      setShowDeleteConfirmation(false); // Close confirmation dialog
    };

    const getDate = (date) => {
      let ymd = date.split('-');
      return `${ymd[2]}/${ymd[1]}/${ymd[0]}`;
    }

    // Functions to handle cycling through itineraries
    const goToPreviousItinerary = () => {
      setCurrentItineraryIndex(prevIndex => (prevIndex === 0 ? itineraries.length - 1 : prevIndex - 1));
      onAction(itineraries[currentItineraryIndex].activities);
    };

    const goToNextItinerary = () => {
      setCurrentItineraryIndex(prevIndex => (prevIndex === itineraries.length - 1 ? 0 : prevIndex + 1));
      onAction(itineraries[currentItineraryIndex].activities);
    };

    // maps itineraries to cards
    const getItineraries = () => {
      return itineraries.map((itinerary, index) => (
          <Card key={itinerary.id} style={{display: index === currentItineraryIndex ? 'block' : 'none' }}>
            <Box>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px', textWrap: 'wrap'}}>
                <h5>{getDate(itinerary.date)} - {itinerary.title}</h5>
                {localStorage.getItem('sessionID') == tripOwner.id && <DeleteOutlineIcon titleAccess="Delete Itinerary" onClick={(e) => deleteItinerary(e, itinerary, trip.id)} />}  
              </Box>
            </Box>
            <List sx={{height: '63vh', overflowY: 'scroll'}}>
              <GetActivities ids={itinerary.activities} country={trip.country} city={trip.city} />
            </List>
          </Card>
        ));
    }

    // Render Itineraries
    return (
      <Card sx={{ width: '48vw', height: '90vh', mt: 5, overflowY: 'auto'}}>
          <CardContent>
            <div style={{display: 'flex', margin: '0 15px', justifyContent: 'space-between'}}> 
              {localStorage.getItem('sessionID') == tripOwner.id
              && !create
              && <Button
              type="submit"
              variant="contained"
              sx={{fontSize: '1vw', mt: 3, mb: 2 }}
              onClick={() => setCreate(true)}>Add Itinerary</Button>}
              {localStorage.getItem('sessionID') == tripOwner.id
                && <Button sx={{fontSize: '1vw', mt: 3, mb: 2 }} onClick={(e) => clearActivities(e)} variant="contained">Clear Activities</Button>
              }
            </div>
            {create && createItinerary()}
            <div style={{gap: '5px', alignItems: 'center'}}>
              {itineraries.length > 0 && <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <ArrowBackIosRoundedIcon disa sx={{marginRight: '8px'}} onClick={goToPreviousItinerary}/>
                <div style={{
                display: 'flex',
                whiteSpace: 'nowrap'
              }}>
                  {getItineraries()}
                </div>
                <ArrowForwardIosRoundedIcon sx={{marginLeft: '8px'}} onClick={goToNextItinerary}/>
              </div>}
            </div>
          </CardContent>
          <Dialog
                open={showDeleteConfirmation}
                onClose={handleDeleteCloseConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this itinerary?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCloseConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteItinerary} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default GetItineraries;