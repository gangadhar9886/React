import React, { useCallback, useEffect, useState } from "react";
let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expiresIn) => {
    console.log("expiresIn", expiresIn);
    const currentTime = new Date().getTime();
    const expiresTime = new Date(expiresIn).getTime();
    console.log("expiresTime", expiresTime);
    return expiresTime - currentTime;
  };


const retrieveStoredToken = () => {
  const token = localStorage.getItem("token");
  console.log("retrieveStoredToken::storedToken", token);
  const storedTime = localStorage.getItem("expiresIn");
  console.log("retrieveStoredToken::storedTime", storedTime);
  const expiresIn = calculateRemainingTime(storedTime);
  console.log("In retrieveStoredToken", { token, expiresIn });
  if (expiresIn <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    return null;
  }

  return { token, expiresIn };
};

export const AuthContextProvider = (props) => {
  let initialToken;
  const tokenData = retrieveStoredToken();
  console.log("Retreived Token Data", tokenData);
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const setIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expiresIn) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiresIn);
    console.log("Test", localStorage.getItem("expiresIn"));
    const remainingTime = calculateRemainingTime(expiresIn);
    console.log("Remaining Time", remainingTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log("Expiry Time", tokenData.expiresIn);
      logoutTimer = setTimeout(logoutHandler, tokenData.expiresIn);
    }
  }, [tokenData, logoutHandler]);
  const authContext = {
    token,
    isLoggedIn: setIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
