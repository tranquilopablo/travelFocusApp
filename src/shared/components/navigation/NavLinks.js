import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

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
      {user && (
        <div className={css.avatar}>
          <Link to={'/ustawienia'}>
            <img
              className={css.image}
              src={
                'https://images.pexels.com/photos/4095246/pexels-photo-4095246.jpeg'
              }
              alt=""
            />
          </Link>
        </div>
      )}
    </ul>
  );
};

export default NavLinks;
