import React, { useState, useCallback, useReducer } from 'react';
import Button from '../shared/components/uiElements/Button';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import Input from '../shared/components/uiElements/Input';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../shared/util/validators.js';

import css from './NewPlace.module.css';

const NewPlace = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        let formIsValid = true;
        for (const inputId in state.inputs) {
          if (!state.inputs[inputId]) {
            continue;
          }
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: {
              value: action.value,
              isValid: action.isValid,
            },
          },
          isValid: formIsValid,
        };

      default:
        return state;
    }
  };

  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    isValid: false,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  const placeSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs); // send to the backend
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className={css.placeForm} onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Nazwa"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Podaj nazwę miejsca."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Opis"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Podaj opis miejsca ( co najmniej 5 znaków)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Adres"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Podaj adres miejsca."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          DODAJ MIEJSCE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
