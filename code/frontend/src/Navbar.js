import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Navbar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Trip Planner</Typography>
          {
            props.pathname === "/register" ? <Button color="inherit" href='/login'>Login</Button>
            : props.pathname === "/login" ? <Button color="inherit" href='/register'>Register</Button>
            : <Button color="inherit" href='/login'>Logout</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}