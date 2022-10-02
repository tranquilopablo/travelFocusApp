import React from 'react';
import css from './PlacesHeader.module.css';

const PlacesHeader = (props) => {
  return (
    <div className={css.header}>
      <div onClick={props.onDoneHandle} className={css.circleBox}>
        <div className={css.singleCircle}>
          <i className={`fa fa-check ${css.icon} `} aria-hidden="true"></i>
        </div>
        <p className={css.headerTitle}>Zrealizowano</p>
      </div>
      <div onClick={props.onUndoneHandle} className={css.circleBox}>
        <div className={css.singleCircle}>
          <i className={`fa fa-list ${css.icon} `} aria-hidden="true"></i>
        </div>
        <p className={css.headerTitle}>Do spełnienia</p>
      </div>
    </div>
  );
};

export default PlacesHeader;
