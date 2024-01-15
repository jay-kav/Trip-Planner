import React, { useState } from 'react';

function Login() {
  const url = "http://127.0.0.1:8000/api/"
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  function handle (e) {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
  }

  function submitForm (e) {
    console.log(url + "user?email='" + data.email + "'&password'" + data.password + "'}");
    e.preventDefault();
    fetch(url + "user?email='" + data.email + "'&password'" + data.password + "'}", {
        headers: { "Content-type": "application/json" }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch(err => console.log(err))
  };

  return (
    <div>
      <form onSubmit={(e) => submitForm(e)}>
        <label>Email </label>
        <input onChange={(e) => handle(e)} value={data.email} id="email" type='email'></input>
        <br />
        <label>Password </label>
        <input onChange={(e) => handle(e)} value={data.password} id='password' type='password'></input>
        <br />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default Login