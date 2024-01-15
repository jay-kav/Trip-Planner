import React, { useState } from 'react';

function Register() {
  const url = "http://127.0.0.1:8000/api/"
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  function handle (e) {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log(newData);
  }

  function submitForm (e) {
    e.preventDefault();
    fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            'email': data.email,
            'password': data.password
        })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.reload();
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
        <button type='submit'>Register</button>
      </form>
    </div>
  );
}

export default Register