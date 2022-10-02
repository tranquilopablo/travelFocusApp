import React from 'react';
import css from './RadioInput.module.css';

const RadioInput = (props) => {
  return (
    <div className={css['radio-input']}>
      <h4>{props.label}</h4>
      {props.options.map((option) => (
        <div key={option.value}>
          <input
            type="radio"
            id={`radio-${option.value}-${props.label}`}
            name={props.label}
            value={option.value}
            onChange={(e) => props.onChange(e.target.value)}
            checked={props.value === option.value}
          />
          <label htmlFor={`radio-${option.value}-${props.label}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
