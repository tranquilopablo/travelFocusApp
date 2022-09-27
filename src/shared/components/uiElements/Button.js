import React from 'react';
import { Link } from 'react-router-dom';

import css from './Button.module.css';

const Button = (props) => {
  if (props.href) {
    return (
      <a
        className={`${css.button} ${props.inverse && css.buttonInverse} ${
          props.danger && css.buttonDanger
        } ${props.small && css.buttonSmall} ${props.big && css.buttonBig}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        className={`${css.button} ${props.inverse && css.buttonInverse} ${
          props.danger && css.buttonDanger
        } ${props.small && css.buttonSmall} ${props.big && css.buttonBig}`}
        to={props.to}
        exact={props.exact}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`${css.button} ${props.inverse && css.buttonInverse} ${
        props.danger && css.buttonDanger
      } ${props.small && css.buttonSmall} ${props.big && css.buttonBig}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
