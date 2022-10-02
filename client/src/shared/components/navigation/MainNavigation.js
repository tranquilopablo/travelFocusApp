import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import css from './MainNavigation.module.css';
import Backdrop from '../uiElements/Backdrop';
import NavLinks from './NavLinks';
import SideDrawer from '../uiElements/SideDrawer';
import MainHeader from './MainHeader';

const MainNavigation = () => {
  const [sideMenuIsOpen, setSideMenuIsOpen] = useState(false);

  const openSideMenu = () => {
    setSideMenuIsOpen(true);
  };
  const closeSideMenu = () => {
    setSideMenuIsOpen(false);
  };

  return (
    <React.Fragment>
      {sideMenuIsOpen && <Backdrop onClick={closeSideMenu} />}
      <SideDrawer show={sideMenuIsOpen} onClick={closeSideMenu}>
        <nav className={css.sideMenuNav}>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className={css.menuBtn} onClick={openSideMenu}>
          <i
            className={`fa fa-bars ${css.sideMenuIcon}`}
            aria-hidden="true"
          ></i>
        </button>
        <h1 className={css.title}>
          <Link to="/">travelFocusApp</Link>
        </h1>
        <nav className={css.headerNav}>
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
