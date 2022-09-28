import React, { useState } from 'react';

import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import Button from '../shared/components/uiElements/Button';
import Card from '../shared/components/uiElements/Card';

import css from './PlaceItem.module.css';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import Modal from '../shared/components/uiElements/Modal';
import Map from '../shared/components/uiElements/Map';

const PlaceItem = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log('usunieto');
  };

  const addToDone = () => {
    console.log('dodane do zrobionych');
  };
  const addToUndone = () => {
    console.log('dodane do listy do zrobienia');
  };

  const clearError = () => {
    setError(null);
  };
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
        footerClass="place-item__modal-actions"
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
            <img src={props.image} alt={props.title} />
          </div>
          <div className={css.itemInfo}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            <div className={css.itemExtra}>
              <p>
                Priorytet: <span className={css.bolded}>{props.priority}</span>
              </p>

              <p>
                Dodaj do:
                <span
                  onClick={addToUndone}
                  className={`${css.bolded} ${css.boldedCheck}`}
                >
                  <i
                    className={`fa fa-list ${css.faList}`}
                    aria-hidden="true"
                  ></i>
                </span>
                <span
                  onClick={addToDone}
                  className={`${css.bolded} ${css.boldedCheck}`}
                >
                  <i
                    className={`fa fa-check ${css.faCheck}`}
                    aria-hidden="true"
                  ></i>
                </span>
              </p>

              <p className={css.boldedCheckStatus}>
                <span>
                  <i
                    className={`fa fa-list ${css.faList}`}
                    aria-hidden="true"
                  ></i>
                </span>

                <span>
                  <i
                    className={`fa fa-check ${css.faCheck}`}
                    aria-hidden="true"
                  ></i>
                </span>
              </p>
            </div>
          </div>

          <div className={css.actions}>
            <Button inverse onClick={openMapHandler}>
              ZOBACZ NA MAPIE
            </Button>
            <Button to={`/miejsca/${props.id}`}>EDYTUJ</Button>

            <Button danger onClick={showDeleteWarningHandler}>
              USUŃ
            </Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
