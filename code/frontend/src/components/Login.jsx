import axios from 'axios';
import React, { useState } from 'react';

function Login() {
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  function handle (e) {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
  }

  function submitForm (e) {
    e.preventDefault();
    if (data.username === "") {
      alert("Please enter a username");
    } else if (data.password === "") {
      alert("Please enter a password");
    } else {
      axios.post(`login/`, {
        "username": data.username,
        "password": data.password
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("sessionID", response.data.uid);
        window.location.href = '/';
      })
      .catch((err) => console.error("Error:", err));
    }
  };

  return (
    <div>
      <form className="form-group" onSubmit={(e) => submitForm(e)}>
        <label htmlFor="username">Username </label>
        <input className="form-control" onChange={(e) => handle(e)} value={data.username} id="username" type='username'></input>
        <br />
        <label htmlFor="password">Password </label>
        <input className="form-control" onChange={(e) => handle(e)} value={data.password} id='password' type='password'></input>
        <br />
        <button className="btn btn-primary" type='submit'>Login</button>
      </form>
    </div>
  );
}

export default Login