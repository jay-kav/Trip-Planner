/* Function to check if the user is logged in */

const isAuthenticated = () => {
    return localStorage.getItem('sessionID') !== null;
};

export default isAuthenticated;
  