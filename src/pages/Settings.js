import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../shared/context/auth-context';
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
import Modal from '../shared/components/uiElements/Modal';

const Settings = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formState, inputHandler] = useFormHook(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
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

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteWarningHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log('usunieto');
  };

  const updateAccountHandler = (e) => {
    e.preventDefault();
    console.log('Zaktualizowano profil!');
    setSuccess(true);

    setTimeout(() => {
      history.push('/');
    }, 3000);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarningHandler}
        header="Jesteś pewien że chcesz usunąć konto?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteWarningHandler}>
              WRÓĆ
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              USUŃ
            </Button>
          </React.Fragment>
        }
      ></Modal>
      <Card className={css.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>EDYTUJ KONTO</h2>
        <hr />
        <form onSubmit={updateAccountHandler}>
          <Input
            element="input"
            id="name"
            type="text"
            label="Nazwa użytkownika"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Podaj nazwę użytkownika."
            onInput={inputHandler}
          />
          <ImageUpload center id="image" onInput={inputHandler} errorText="" />
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
            POTWIERDŹ
          </Button>
        </form>
        <Button inverse onClick={showDeleteWarningHandler}>
          USUŃ
        </Button>
        {success && (
          <span className={css['success-confirmation']}>
            Profil został zaktualizowany
          </span>
        )}
      </Card>
    </React.Fragment>
  );
};

export default Settings;
