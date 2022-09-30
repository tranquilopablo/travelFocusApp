import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../shared/util/validators';
import { useFormHook } from '../shared/hooks/useFormHook';
import Button from '../shared/components/uiElements/Button';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import ImageUpload from '../shared/components/uiElements/ImageUpload';
import Input from '../shared/components/uiElements/Input';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import Card from '../shared/components/uiElements/Card';

import css from './Login.module.css';

const Auth = () => {
  const history = useHistory();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formState, inputHandler, setFormData] = useFormHook(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  const authsubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      console.log('Zalogowano!');
    } else {
      console.log('Rejestracja udana!');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={css.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>LOGIN WYMAGANY</h2>
        <hr />
        <form onSubmit={authsubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Nazwa użytkownika"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Podaj nazwę użytkownika."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText=""
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Podaj poprawny adres email"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Hasło"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Podaj hasło zawierające co najmniej 6 znaków."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'ZALOGUJ' : 'REJESTRACJA'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          PRZEJDŻ DO {isLoginMode ? 'REJESTRACJI' : 'LOGOWANIA'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
