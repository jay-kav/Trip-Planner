import './App.css';
import isAuthenticated from './components/auth';
import Register from './components/Register';
import Login from './components/Login';
import GetTrips from './components/GetTrips';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateTrip from './components/CreateTrip';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Navbar from './components/Navbar';

axios.defaults.baseURL = 'http://localhost:8000/';

function App() {
  const location = useLocation();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {location.pathname != '/register' && location.pathname != '/login' && <Navbar />}
      {/* Routes for the app */}
      <Routes>
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <Register />}></Route>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />}></Route>
        <Route path='/createtrip' element={isAuthenticated() ? <CreateTrip /> : <Navigate to="/" />}></Route>
        <Route path="/" element={isAuthenticated() ? <GetTrips /> : <Navigate to="/login" />}></Route>
      </Routes>
    </LocalizationProvider>
  );
}

export default App;