import './App.css';
import isAuthenticated from './components/auth';
import Navbar from './Navbar';
import Register from './components/Register';
import Login from './components/Login';
import GetTrips from './components/GetTrips';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateTrip from './components/CreateTrip';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/';

function App() {
  return (
    <div className='app'>
      <Navbar pathname={useLocation().pathname} />
      <div style={{margin: '30px'}}>
        <Routes>
          <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <Register />}></Route>
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />}></Route>
          <Route path='/createtrip' element={isAuthenticated() ? <CreateTrip /> : <Navigate to="/" />}></Route>
          <Route path="/" element={isAuthenticated() ? <GetTrips /> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;