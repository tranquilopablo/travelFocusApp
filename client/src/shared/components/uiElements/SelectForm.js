import React from 'react';
import css from './SelectForm.module.css';

const SelectForm = (props) => {
  return (
    <div className={css['select-input']}>
      <label className={css['select-input__label']}>{props.label}</label>
      <select
        className={css.select}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectForm;
