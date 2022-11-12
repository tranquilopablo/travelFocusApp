import React, { useState, useContext, useEffect } from 'react';
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
import { useHttpClient } from '../shared/hooks/http-hook';

const Settings = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
        );
        setLoadedUser(responseData);
        setFormData(
          {
            email: {
              value: responseData.email,
              isValid: true,
            },
            name: {
              value: responseData.name,
              isValid: true,
            },
            password: {
              value: responseData.description,
              isValid: true,
            },
            image: {
              value: responseData.image,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, auth.userId, setFormData]);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteWarningHandler = () => {
    setShowConfirmModal(false);
  };

  const updateAccountHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', formState.inputs.email.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('password', formState.inputs.password.value);
      if (loadedUser.image !== formState.inputs.image.value) {
        formData.append('image', formState.inputs.image.value);
      }
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
        'PATCH',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      responseData.token = auth.token;
      auth.login(responseData);
      history.push('/settings-route/reload');
    } catch (err) {}
  };

  const confirmDeleteHandler = async (e) => {
    e.preventDefault();
    setShowConfirmModal(false);
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      auth.logout();
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarningHandler}
        header="Jesteś pewien że chcesz usunąć konto?"
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
      {!isLoading && loadedUser && (
        <Card className={css.authentication}>
          {isLoading && (
            <div className="center">
              <LoadingSpinner />
            </div>
          )}
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
              initialValue={loadedUser.name}
              initialValid={true}
            />
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText=""
              initialValue={`${loadedUser.image}`}
              initialValid={true}
            />
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Podaj poprawny adres email"
              onInput={inputHandler}
              initialValue={loadedUser.email}
              initialValid={true}
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
        </Card>
      )}
    </React.Fragment>
  );
};

export default Settings;
