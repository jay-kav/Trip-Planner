import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Select, MenuItem, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';

const defaultTheme = createTheme();

// Material UI Login Form from GitHub: https://github.com/mui/material-ui/blob/v5.15.6/docs/data/material/getting-started/templates/sign-in/SignIn.js
function CreateTrip() {
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');
    const [hotels, setHotels] = useState([]);
    const [submit, setSubmit] = useState(false);

    const getUsers = () => {
      let notOwner = users.filter(user => user.id != localStorage.getItem('sessionID'));
      return notOwner.map(user => (
        <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
      ));
    };  

    useEffect(() => {
      if (users.length == 0) {
          axios.get("api/users/?is_staff=false")
          .then((response) => {
              if (response.data.length) {
                  setUsers(response.data);
              }
          })
          .catch(err => console.log(err))
      }
      if (countries.length == 0) {
        axios.post(`get-countries/`)
        .then((response) => {
          console.log(response);
          setCountries(response.data.countries);
        })
        .catch((err) => console.error("Error:", err));
      }
      if (cities.length == 0 && country != '') {
        axios.post(`get-cities/`, {
          'country': country
        })
        .then((response) => {
          console.log(response);
          setCities(response.data.cities);
        })
        .catch((err) => console.error("Error:", err));
      };
      if (hotels.length == 0 && country != '' && city != '') {
        axios.post(`get-hotels/`, {
          'country': country,
          'city': city
        })
        .then((response) => {
          console.log(response);
          setHotels(response.data.hotels);
        })
        .catch((err) => console.error("Error:", err));
      }
    });

    const getCountries = () => {
      return countries.map(country => (
        <MenuItem key={country} value={country}>{country}</MenuItem>
      ));
    }

    const getCities = () => {
      return cities.map(city => (
          <MenuItem key={city} value={city}>{city}</MenuItem>
      ));
    }

    const getHotels = () => {
      return hotels.map(hotel => (
          <MenuItem key={hotel} value={hotel.id}>{hotel.name}</MenuItem>
      ));
    }
  
    const submitForm = (e) => {
      e.preventDefault();
      setSubmit(true);
      const data = new FormData(e.currentTarget);
      const tripname = data.get('tripname');
      const country = data.get('country');
      const city = data.get('city');
      const hotel = data.get('hotel');
      const startDate = data.get('startdate');
      const endDate = data.get('enddate');
      const members = Array.isArray(data.getAll('members')) ? Array.from(data.getAll('members')) : [];
      const today = new Date();
      let date = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear();
      if (tripname === "") {
        alert("Please enter a trip name");
      } else if (startDate === "") {
        alert("Please enter a start date");
      } else if (endDate === "") {
        alert("Please enter an end date");
      } else if (startDate > endDate) {
        alert("End date must be after start date");
      } else if (startDate < date) {
        alert("Trip start date must be atleast today");
      } else if (country === "") {
        alert("Please select a country");
      } else if (city === "") {
        alert("Please select a city");
      } else if (hotel === "") {
        alert("Please select a hotel");
      } else {
        setSubmit(true);
        axios.post(`create-trip/`, {
          'ownerID': localStorage.getItem('sessionID'),
          'tripname': tripname,
          'country': country,
          'city': city,
          'hotel': hotel,
          'startDate': startDate,
          'endDate': endDate,
          'members': members[0]
        })
        .then((response) => {
          console.log(response);
          window.location.href = "/";
        })
        .catch((err) => {
          setSubmit(false);
          alert('Failed to create trip');
          console.error("Error:", err);
        });
      }
      setSubmit(false);
    };

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
          <br />
          <Typography component="h1" variant="h5">
            New Trip
          </Typography>
          <Box component="form" onSubmit={submitForm} noValidate sx={{ mt: 1 }}>
            <Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="tripname"
                label="Trip Name"
                name="tripname"
                autoComplete="tripname"
                defaultValue=""
                autoFocus
              />
            </Grid>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <DatePicker 
                    margin="normal"
                    required
                    fullWidth
                    id="startdate"
                    label="Start Date"
                    name="startdate"
                    autoComplete="startdate"
                    format="DD/MM/YYYY"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker 
                    margin="normal"
                    required
                    fullWidth
                    id="enddate"
                    label="End Date"
                    name="enddate"
                    autoComplete="enddate"
                    format="DD/MM/YYYY"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1} ml={-4}>
                <Grid item xs={12} sm={6} sx={{display: 'flex', gap: '10px'}}>
                  <FormControlLabel 
                    control={
                      <Select
                        required
                        fullWidth
                        id="country"
                        name="country"
                        onChange={(e) => {
                          setCountry(e.target.value)
                          setCities([]);
                        }}
                        sx={{width: '15vw'}}
                      >
                        <MenuItem value={''}></MenuItem>
                        {getCountries()}
                      </Select>
                    }
                    label="Country"
                    labelPlacement='top'
                  />
                </Grid>
                <Grid item xs={12} sm={6} >
                <FormControlLabel 
                    control={
                      <Select                   
                        required
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                        onChange={
                          (e) => {
                            setCity(e.target.value);
                            setHotels([]);
                          }
                        }
                        sx={{width: '15vw'}}
                        disabled={country === ""}
                      >
                        <MenuItem value={''}></MenuItem>
                        {getCities()}
                      </Select>
                    }
                    label="City"
                    labelPlacement='top'
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={2} ml={-4}>
              <Grid item xs={12} sm={6}>
                  <FormControlLabel 
                    control={
                      <Select                   
                        required
                        fullWidth
                        id="hotel"
                        label="hotel"
                        name="hotel"
                        disabled={city === ""}
                        sx={{width: '15vw'}}
                      >
                        <MenuItem value={''}></MenuItem>
                        {getHotels()}
                      </Select>
                    }
                    label="Hotel"
                    labelPlacement='top'
                  />
                </Grid>
              <Grid item xs={12} sm={6}>
              <FormControlLabel
                    control={
                      <Select
                        fullWidth
                        id="members"
                        name="members"
                        autoComplete="members"
                        multiple
                        defaultValue={''} // Provide the default value
                        value={members} // Provide the array of selected members
                        onChange={(e) => setMembers(e.target.value)} // Update the state with selected members
                        sx={{width: '15vw'}}
                      >
                        <MenuItem value={''}></MenuItem>
                        {getUsers()}
                      </Select>
                    }
                    label="Members"
                    labelPlacement='top'
                  />
              </Grid>
              </Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              >Create Trip</Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CreateTrip