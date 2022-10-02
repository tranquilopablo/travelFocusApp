import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../shared/components/uiElements/Button';
import Card from '../shared/components/uiElements/Card';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import ImageUpload from '../shared/components/uiElements/ImageUpload';
import Input from '../shared/components/uiElements/Input';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import RadioInput from '../shared/components/uiElements/RadioInput';
import SelectForm from '../shared/components/uiElements/SelectForm';
import { useFormHook } from '../shared/hooks/useFormHook';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../shared/util/validators.js';

import css from './NewPlace.module.css';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/EmpireStateNewYokCity.jpg/1920px-EmpireStateNewYokCity.jpg?1654820333654',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u1',
    priority: '5',
    status: '1',
    done: false,
  },
  {
    id: 'p2',
    title: 'Emp. State Building',
    description: 'One of the most famous sky scrapers in the world!',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg?1654818945759',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u2',
    priority: '4',
    status: '0',
    done: true,
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectValue, setSelectValue] = useState('1');
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
  const loadedPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  useEffect(() => {
    if (loadedPlace) {
      setSelectValue(loadedPlace.priority);
      setRadioValue(loadedPlace.status);

      setFormData(
        {
          title: {
            value: loadedPlace.title,
            isValid: true,
          },
          description: {
            value: loadedPlace.description,
            isValid: true,
          },
          address: {
            value: loadedPlace.description,
            isValid: true,
          },
          image: {
            value: loadedPlace.image,
            isValid: true,
          },
        },
        true
      );
    }

    setIsLoading(false);
  }, [setFormData, loadedPlace, setRadioValue, setSelectValue]);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState);
  };

  const clearError = () => {
    setError(null);
  };

  const handleGoBack = () => {
    console.log('Wrociles do poprzedniej strony');
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
            initialValue={loadedPlace.image}
          />
          <Button type="submit" disabled={!formState.isValid}>
            AKTUALIZUJ MIEJSCE
          </Button>
          <Button
            customstylebtn
            onClick={handleGoBack}
            inverse
            className="btn-goback"
          >
            WRÓĆ
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
