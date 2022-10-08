import React, { useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import MainNavigation from './shared/components/navigation/MainNavigation';
import Users from './pages/Users';
import Login from './pages/Login';
import Settings from './pages/Settings';
import UserPlaces from './pages/UserPlaces';
import NewPlace from './pages/NewPlace';
import UpdatePlace from './pages/UpdatePlace';
import { AuthContext } from './shared/context/auth-context';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);
  const [userPic, setUserPic] = useState(false);

  const login = useCallback((userData) => {

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: userData.userId,
        image: userData.image,
      })
    );

    setIsLoggedIn(true);
    setUserId(userData.userId);
    setUserPic(userData.image);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData')) || false;
    if (storedData) {
      setIsLoggedIn(true);
      setUserId(storedData.userId);
      setUserPic(storedData.image);
    }
  }, []);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/ustawienia">
          <Settings />
        </Route>
        <Route path="/:userId/miejsca" exact>
          <UserPlaces />
        </Route>
        <Route path="/miejsca/nowe" exact>
          <NewPlace />
        </Route>
        <Route path="/miejsca/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect exact from="/some-route/reload" to={`/${userId}/miejsca`} />
        <Redirect exact from="/settings-route/reload" to={`/ustawienia`} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/miejsca" exact>
          <UserPlaces />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        userPic: userPic,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
