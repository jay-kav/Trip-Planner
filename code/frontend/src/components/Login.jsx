import axios from 'axios';
import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

// Material UI Login Form from GitHub: https://github.com/mui/material-ui/blob/v5.15.6/docs/data/material/getting-started/templates/sign-in/SignIn.js
function Login() {

  const submitForm = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    if (username == "") {
      alert("Please enter a username");
    } else if (password == "") {
      alert("Please enter a password");
    } else {
      axios.post(`login/`, {
        "username": username,
        "password": password
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("sessionID", response.data.uid);
        localStorage.setItem('selectTrip', 0);
        window.location.href = '/';
      })
      .catch((err) => {
        alert("Invalid username or password");
        console.error("Error:", err)
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <br />
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" onSubmit={submitForm} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container>
                <Grid item >
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Register"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login