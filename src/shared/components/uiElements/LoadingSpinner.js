import React from 'react';

import css from './LoadingSpinner.module.css';

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.overlay && css.overlay}`}>
      <div className={css.dualRing}></div>
    </div>
  );
};

export default LoadingSpinner;
