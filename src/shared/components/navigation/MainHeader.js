import React from 'react';
import css from './MainHeader.module.css';

const MainHeader = (props) => {
  return <header className={css.mainHeader}>{props.children}</header>;
};

export default MainHeader;
