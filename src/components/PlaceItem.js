import React, { useState, useContext } from 'react';

import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import Button from '../shared/components/uiElements/Button';
import Card from '../shared/components/uiElements/Card';

import css from './PlaceItem.module.css';
import ErrorModal from '../shared/components/uiElements/ErrorModal';

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
            <Button to={`/places/${props.id}`}>EDYTUJ</Button>

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
