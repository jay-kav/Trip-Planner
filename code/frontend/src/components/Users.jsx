import React, { useState, useEffect } from 'react'
import url from './url';

function Users() {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    return users.map(user => (
      <div key={user.id}>
          <h3>ID: {user.id} - {user.username}</h3>
          <p>{user.email}</p>
      </div>
    ));
  };  

  useEffect(() => {
    if (users.length === 0) {
        fetch(url + "api/users/")
        .then((response) => response.json())
        .then((data) => {
            setUsers(data);
        })
        .catch(err => console.log(err))
    }
  });

  return (
    <div>
        {getUsers()}
    </div>
  )
}

export default Users