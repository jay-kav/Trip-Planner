import './App.css';
import Navbar from './Navbar';
import Register from './components/Register';
import Login from './components/Login';
import ViewTrips from './components/ViewTrips';
import { Routes, Route, useLocation } from "react-router-dom";
import GetSession from './components/GetSession';

function App() {
  return (
    <div className='app'>
      <Navbar pathname={useLocation().pathname} />
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<ViewTrips />}></Route>
      </Routes>
    </div>
  );
}

export default App;