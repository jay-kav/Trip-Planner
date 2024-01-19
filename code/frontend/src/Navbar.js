import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Navbar(props) {
  const url = "http://127.0.0.1:8000/";
  
  const logout = (e) => {
    e.preventDefault();
    fetch(`${url}logout/`, {
        method: 'POST',
        headers: { "Content-type": "application/json" }
    })
    .then((response) => {
      console.log(response); // Log the entire response
      return response.json();
    })
    .then((responseData) => {
      console.log(responseData);
      window.location.href = '/login';
    })
    .catch((err) => console.error("Error:", err));
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Trip Planner</Typography>
          {
            props.pathname === "/register" ? <Button color="inherit" href='/login'>Login</Button>
            : props.pathname === "/login" ? <Button color="inherit" href='/register'>Register</Button>
            : <Button color="inherit" onClick={(e) => logout(e)}>Logout</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}