import React, { useState, useCallback, useContext } from 'react';
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
  const auth = useContext(AuthContext);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        user: auth.user,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem('userData');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: auth.isLoggedIn,
        user: auth.user,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Route path="/" exact>
              <Users />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/ustawienia">
              <Settings />
            </Route>
            <Route path="/:userId/miejsca">
              <UserPlaces />
            </Route>
            <Route path="/miejsca/nowe">
              <NewPlace />
            </Route>
            <Route path="/miejsca/:placeId">
              <UpdatePlace />
            </Route>
            <Redirect to="/login" />
          </Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
