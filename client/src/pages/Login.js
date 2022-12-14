import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../shared/util/validators';
import { useFormHook } from '../shared/hooks/useFormHook';
import { useHttpClient } from '../shared/hooks/http-hook';
import Button from '../shared/components/uiElements/Button';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import ImageUpload from '../shared/components/uiElements/ImageUpload';
import Input from '../shared/components/uiElements/Input';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import Card from '../shared/components/uiElements/Card';
import css from './Login.module.css';

const Login = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
      // isLoginMode still has old value, I change it at the end of the function
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
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData);
        history.push(`/`);
      } catch (e) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          formData
        );
        auth.login(responseData);
      } catch (err) {}
    }
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
              label="Nazwa u??ytkownika"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Podaj nazw?? u??ytkownika."
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
            label="Has??o"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Podaj has??o zawieraj??ce co najmniej 6 znak??w."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'ZALOGUJ' : 'REJESTRACJA'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          PRZEJD?? DO {isLoginMode ? 'REJESTRACJI' : 'LOGOWANIA'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Login;
