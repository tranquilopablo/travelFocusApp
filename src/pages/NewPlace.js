import React, { useState } from 'react';
import Button from '../shared/components/uiElements/Button';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import Input from '../shared/components/uiElements/Input';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';

import css from './NewPlace.module.css';

const NewPlace = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          validators={[]}
          errorText="Podaj nazwę miejsca."
        />
        <Button type="submit" disabled={false}>
          DODAJ MIEJSCE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
