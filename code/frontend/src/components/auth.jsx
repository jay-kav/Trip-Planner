const isAuthenticated = () => {
    return localStorage.getItem('sessionID') !== null;
};

export default isAuthenticated;
  