import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import css from './NavLinks.module.css';

const NavLinks = () => {
  const [user, setUser] = useState(true);

  return (
    <ul className={css.navLinks}>
      <li>
        <NavLink to="/" exact>
          UŻYTKOWNICY
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to={`/:userId/miejsca`}>MOJE MIEJSCA</NavLink>
        </li>
      )}
      {user && (
        <li>
          <NavLink to="/miejsca/nowe">DODAJ MIEJSCE</NavLink>
        </li>
      )}
      {!user && (
        <li>
          <NavLink to="/login">ZALOGUJ</NavLink>
        </li>
      )}
      {user && (
        <li>
          <button onClick={() => setUser(false)}>WYLOGUJ</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
