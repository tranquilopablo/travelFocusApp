import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../shared/components/uiElements/Button';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import ImageUpload from '../shared/components/uiElements/ImageUpload';
import Input from '../shared/components/uiElements/Input';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import RadioInput from '../shared/components/uiElements/RadioInput';
import SelectForm from '../shared/components/uiElements/SelectForm';
import { useFormHook } from '../shared/hooks/useFormHook';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../shared/util/validators.js';

import css from './NewPlace.module.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectValue, setSelectValue] = useState('1');
  const [radioValue, setRadioValue] = useState('1');

  const history = useHistory();

  const [formState, inputHandler] = useFormHook(
    {
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);
      formData.append('priority', selectValue);
      formData.append('status', radioValue);

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/places',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      history.push('/');
    } catch (err) {}
  };

  const handleGoBack = () => {
    history.push('/');
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
        <SelectForm
          label="Ważność projektu w skali od 1-5"
          value={selectValue}
          options={[
            { value: 1, label: 1 },
            { value: 2, label: 2 },
            { value: 3, label: 3 },
            { value: 4, label: 4 },
            { value: 5, label: 5 },
          ]}
          onChange={(v) => setSelectValue(v)}
        />
        <RadioInput
          label="Status:"
          onChange={(v) => setRadioValue(v)}
          value={radioValue}
          options={[
            { value: '1', label: 'Publiczny' },
            { value: '0', label: 'Prywatny' },
          ]}
        />
        <ImageUpload center id="image" onInput={inputHandler} errorText="" />
        <Button type="submit" disabled={!formState.isValid}>
          DODAJ MIEJSCE
        </Button>
        <Button onClick={handleGoBack} inverse>
          WRÓĆ
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
