import React, { useState, useCallback, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import MainNavigation from './shared/components/navigation/MainNavigation';
import Users from './pages/Users';
import { AuthContext } from './shared/context/auth-context';
import LoadingSpinner from './shared/components/uiElements/LoadingSpinner';

const NewPlace = React.lazy(() => import('./pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./pages/UpdatePlace'));
const Login = React.lazy(() => import('./pages/Login'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [userPic, setUserPic] = useState(false);

  const login = useCallback((userData) => {
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: userData.userId,
        image: userData.image,
        token: userData.token,
      })
    );

    setToken(userData.token);
    setUserId(userData.userId);
    setUserPic(userData.image);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userData');
    setToken(null);
    setUserId(null);
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData')) || false;

    if (storedData && storedData.token) {
      setToken(storedData.token);
      setUserId(storedData.userId);
      setUserPic(storedData.image);
    }
  }, [token]);

  let routes;
  if (token) {
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
        isLoggedIn: !!token,
        userId: userId,
        userPic: userPic,
        token,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
