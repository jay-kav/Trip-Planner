import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

// Material UI Login Form from GitHub: https://github.com/mui/material-ui/blob/v5.15.6/docs/data/material/getting-started/templates/sign-in/SignIn.js
function CreateTrip() {
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);

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
    });
    
    const getDate = (date) => {
      let num = date.split("-");
      return parseInt(num[2]) + parseInt(num[1]) * 30 + parseInt(num[0]) * 365;
    }
  
    const submitForm = (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const tripname = data.get('tripname');
      const country = data.get('country');
      const city = data.get('city');
      const startDate = data.get('startdate');
      const endDate = data.get('enddate');
      const members = Array.isArray(data.getAll('members')) ? Array.from(data.getAll('members')) : [];
      if (tripname === "") {
        alert("Please enter a trip name");
      } else if (country === "") {
        alert("Please select a country");
      } else if (city === "") {
        alert("Please select a city");
      } else if (startDate === "") {
        alert("Please enter a start date");
      } else if (endDate === "") {
        alert("Please enter an end date");
      } else if (getDate(startDate) > getDate(endDate)) {
        alert("End date must be after start date");
      } else {
        console.log({
          'ownerID': localStorage.getItem('sessionID'),
          'tripname': tripname,
          'country': country,
          'city': city,
          'startDate': startDate,
          'endDate': endDate,
          'members': members[0]
        });
        axios.post(`create-trip/`, {
          'ownerID': localStorage.getItem('sessionID'),
          'tripname': tripname,
          'country': country,
          'city': city,
          'startDate': startDate,
          'endDate': endDate,
          'members': members[0]
        })
        .then((response) => {
          console.log(response);
          window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
      }
    };

  return (
    <div>
      <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => window.location.href = "/"}>Home</Button>
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
              <Select
                required
                fullWidth
                id="country"
                label="Country"
                name="country"
                autoComplete="country"
                defaultValue=""
                autoFocus
              >
                <MenuItem value={''}></MenuItem>
                <MenuItem value={'Belgium'}>Belgium</MenuItem>
                <MenuItem value={'New York'}>New York</MenuItem>
              </Select>
              <br />
              <br />
              <Select
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="city"
                defaultValue=""
                autoFocus
              >
                <MenuItem value={''}></MenuItem>
                <MenuItem value={'Brussels'}>Brussels</MenuItem>
                <MenuItem value={'Antwerp'}>Antwerp</MenuItem>
              </Select>
              <br />
              <br />
              <DatePicker 
                margin="normal"
                required
                fullWidth
                id="startdate"
                label="Start Date"
                name="startdate"
                autoComplete="startdate"
                autoFocus
              />
              <br />
              <br />
              <DatePicker 
                margin="normal"
                required
                fullWidth
                id="enddate"
                label="End Date"
                name="enddate"
                autoComplete="enddate"
                autoFocus
              />
              <br />
              <br />
              <Select
                required
                fullWidth
                id="members"
                label="Members"
                name="members"
                autoComplete="members"
                autoFocus
                multiple
                defaultValue={''} // Provide the default value
                value={members} // Provide the array of selected members
                onChange={(e) => setMembers(e.target.value)} // Update the state with selected members
              >
                <MenuItem value={''}></MenuItem>
                {getUsers()}
              </Select>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Trip
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default CreateTrip