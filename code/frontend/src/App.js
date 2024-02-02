import './App.css';
import isAuthenticated from './components/auth';
import Register from './components/Register';
import Login from './components/Login';
import GetTrips from './components/GetTrips';
import { Routes, Route, Navigate } from "react-router-dom";
import CreateTrip from './components/CreateTrip';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Button } from '@mui/material';

axios.defaults.baseURL = 'http://localhost:8000/';

function App() {
  const logout = () => {
    axios.post('logout/')
    .then((response) => {
      console.log(response);
      localStorage.clear();
      window.location.href = "/login";
    })
    .catch((err) => console.error("Error:", err));
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='app'>
        <Routes>
          <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <Register />}></Route>
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />}></Route>
          <Route path='/createtrip' element={isAuthenticated() ? <CreateTrip /> : <Navigate to="/" />}></Route>
          <Route path="/" element={isAuthenticated() ? <div>
            <Button variant="contained" onClick={(e) => logout(e)}>Logout</Button>
            <GetTrips />
          </div> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>
    </LocalizationProvider>
  );
}

export default App;