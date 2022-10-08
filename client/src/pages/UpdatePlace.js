import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Button from '../shared/components/uiElements/Button';
import Card from '../shared/components/uiElements/Card';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import ImageUpload from '../shared/components/uiElements/ImageUpload';
import Input from '../shared/components/uiElements/Input';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import RadioInput from '../shared/components/uiElements/RadioInput';
import SelectForm from '../shared/components/uiElements/SelectForm';
import { useFormHook } from '../shared/hooks/useFormHook';
import { useHttpClient } from '../shared/hooks/http-hook';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../shared/util/validators.js';
import { AuthContext } from '../shared/context/auth-context';

import css from './NewPlace.module.css';

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('1');

  const [formState, inputHandler, setFormData] = useFormHook(
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
    true
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
            address: {
              value: responseData.place.description,
              isValid: true,
            },
            image: {
              value: responseData.place.image,
              isValid: true,
            },
          },
          true
        );
        setSelectValue(responseData.place.priority);
        setRadioValue(responseData.place.status);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData, setRadioValue, setSelectValue]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('creator', auth.userId);
      formData.append('priority', selectValue);
      formData.append('status', radioValue);
      formData.append('done', loadedPlace.done);

      if (loadedPlace.image !== formState.inputs.image.value) {
        formData.append('image', formState.inputs.image.value);
      }

      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        formData
      );
      // don't need headers object with application/json when using FormData

      history.push('/' + auth.userId + '/miejsca');
    } catch (err) {}
  };

  const handleGoBack = () => {
    history.push('/' + auth.userId + '/miejsca');
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card style={{ backgroundColor: 'white' }}>
          <h2>Nie można znależć miejsca!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className={css.placeForm} onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Tytuł"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nazwa miejsca."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Opis"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Opis miejsca ( co najmniej 5 znaków)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Input
            id="address"
            element="input"
            label="Adres"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Podaj adres miejsca."
            onInput={inputHandler}
            initialValue={loadedPlace.address}
            initialValid={true}
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
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            errorText=""
            initialValue={`http://localhost:5000/${loadedPlace.image}`}
          />
          <Button type="submit" disabled={!formState.isValid}>
            AKTUALIZUJ MIEJSCE
          </Button>
          <Button onClick={handleGoBack} inverse>
            WRÓĆ
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
