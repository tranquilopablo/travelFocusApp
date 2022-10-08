import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

import css from './NavLinks.module.css';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className={css.navLinks}>
      <li>
        <NavLink to="/" exact>
          UŻYTKOWNICY
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/miejsca`}>MOJE MIEJSCA</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/miejsca/nowe">DODAJ MIEJSCE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/login">ZALOGUJ</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>WYLOGUJ</button>
        </li>
      )}
      {auth.isLoggedIn && (
        <div className={css.avatar}>
          <Link to={'/ustawienia'}>
            <img
              className={css.image}
              src={`http://localhost:5000/${auth.userPic}`}
              alt=""
            />
          </Link>
        </div>
      )}
    </ul>
  );
};

export default NavLinks;
