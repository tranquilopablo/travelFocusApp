import React, { useState, useContext } from 'react';

import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import Button from '../shared/components/uiElements/Button';
import Card from '../shared/components/uiElements/Card';

import css from './PlaceItem.module.css';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import Modal from '../shared/components/uiElements/Modal';
import Map from '../shared/components/uiElements/Map';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemDone, setItemDone] = useState(props.done);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}/${auth.userId}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const updateDoneStatus = async (done) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        'PATCH',
        JSON.stringify({
          title: props.title,
          description: props.description,
          address: props.address,
          priority: props.priority,
          status: props.status,
          done: done,
          creator: auth.userId,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );

      if (responseData.place) {
        setItemDone(done);
        props.refreshPlaces();
      }
    } catch (err) {}
  };
  const addToDone = () => {
    updateDoneStatus(!itemDone);
  };
  const addToUndone = () => {
    updateDoneStatus(!itemDone);
  };

  // src={`http://localhost:5000/${props.image}`}

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass={css.modalContent}
        footerClass={css.modalActions}
        footer={<Button onClick={closeMapHandler}>ZAMKNIJ</Button>}
      >
        <div className={css.mapContainer}>
          <Map center={props.coordinates} zoom={8} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Jesteś pewien?"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              WRÓĆ
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              USUŃ
            </Button>
          </React.Fragment>
        }
      >
        <p>Czy chcesz trwale usunąć to miejsce?</p>
      </Modal>
      <li className={css.placeItem}>
        <Card className={css.placeItemContent}>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className={css.itemImage}>
            <img src={`${props.image}`} alt={props.title} />
          </div>
          <div className={css.itemInfo}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            <div className={css.itemExtra}>
              <p>
                Priorytet: <span className={css.bolded}>{props.priority}</span>
              </p>

              {auth.userId === props.creatorId && (
                <p>
                  Dodaj do:
                  {itemDone ? (
                    <span
                      onClick={addToUndone}
                      className={`${css.bolded} ${css.boldedCheck}`}
                    >
                      <i
                        className={`fa fa-list ${css.faList}`}
                        aria-hidden="true"
                      ></i>
                    </span>
                  ) : (
                    <span
                      onClick={addToDone}
                      className={`${css.bolded} ${css.boldedCheck}`}
                    >
                      <i
                        className={`fa fa-check ${css.faCheck}`}
                        aria-hidden="true"
                      ></i>
                    </span>
                  )}
                </p>
              )}

              <p className={css.boldedCheckStatus}>
                {!itemDone ? (
                  <span>
                    <i
                      className={`fa fa-list ${css.faList}`}
                      aria-hidden="true"
                    ></i>
                  </span>
                ) : (
                  <span>
                    <i
                      className={`fa fa-check ${css.faCheck}`}
                      aria-hidden="true"
                    ></i>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className={css.actions}>
            <Button inverse onClick={openMapHandler}>
              ZOBACZ NA MAPIE
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/miejsca/${props.id}`}>EDYTUJ</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                USUŃ
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
