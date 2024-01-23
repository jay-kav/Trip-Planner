import './App.css';
import isAuthenticated from './components/auth';
import Navbar from './Navbar';
import Register from './components/Register';
import Login from './components/Login';
import GetTrips from './components/GetTrips';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateTrip from './components/CreateTrip';

function App() {
  return (
    <div className='app'>
      <Navbar pathname={useLocation().pathname} />
      <Routes>
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <Register />}></Route>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />}></Route>
        <Route path='/newtrip' element={isAuthenticated() ? <CreateTrip /> : <Navigate to="/" />}></Route>
        <Route path="/" element={isAuthenticated() ? <GetTrips /> : <Navigate to="/login" />}></Route>
      </Routes>
    </div>
  );
}

export default App;