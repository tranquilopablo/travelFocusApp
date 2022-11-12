import React from 'react';
import ReactDOM from 'react-dom';
import css from './Backdropp.module.css';

const Backdrop = (props) => {
  return ReactDOM.createPortal(
    <div className={css.backdrop} onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
