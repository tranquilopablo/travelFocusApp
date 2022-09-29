import React, { useState, useCallback } from 'react';
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

  const inputHandler = useCallback((id, value, isValid) => {}, []);
  const descriptionHandler = useCallback((id, value, isValid) => {}, []);

  const placeSubmitHandler = (e) => {
    e.preventDefault();
    console.log('Stworzyles nowe miejsce');
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
          onInput={descriptionHandler}
        />
        <Input
          id="address"
          element="input"
          label="Adres"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Podaj adres miejsca."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={false}>
          DODAJ MIEJSCE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
