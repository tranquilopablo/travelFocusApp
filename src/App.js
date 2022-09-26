import React from 'react';
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

function App() {
  return (
    <>
      <Router>
        <MainNavigation />
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
      </Router>
    </>
  );
}

export default App;
