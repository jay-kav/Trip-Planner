import './App.css';
import Navbar from './Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Users from './components/Users';
import CreateTrip from './components/CreateTrip';
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  return (
    <div className='app'>
      <Navbar pathname={useLocation().pathname} />
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<CreateTrip />}></Route>
      </Routes>
    </div>
  );
}

export default App;


<div className="App">
      <Navbar />
      <Users />
      <Register />
    </div>