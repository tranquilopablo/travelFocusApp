import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import PlacesHeader from '../shared/components/uiElements/PlacesHeader';
import LoadingSpinner from '../shared/components/uiElements/LoadingSpinner';
import ErrorModal from '../shared/components/uiElements/ErrorModal';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const auth = useContext(AuthContext);
  const [allPlaces, setAllPlaces] = useState();
  const history = useHistory();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );

        if (responseData.places.length >= 2) {
          responseData.places.sort((a, b) =>
            a.priority > b.priority ? -1 : 1
          );
        }

        setAllPlaces(responseData.places);

        // condition of rendering places that belong to user or not, public places or private ones
        let fetchedPlaces;
        if (auth.userId === userId) {
          fetchedPlaces = responseData.places;
        } else {
          fetchedPlaces = responseData.places.filter(
            (place) => parseInt(place.status) === 1
          );
        }

        setLoadedPlaces(fetchedPlaces);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, auth.userId, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  const onDoneHandle = () => {
    let fetchedPlaces;
    if (auth.userId === userId) {
      fetchedPlaces = allPlaces;
    } else {
      fetchedPlaces = allPlaces.filter((place) => parseInt(place.status) === 1);
    }
    setLoadedPlaces(fetchedPlaces.filter((place) => place.done));
  };

  const onUndoneHandle = () => {
    let fetchedPlaces;
    if (auth.userId === userId) {
      fetchedPlaces = allPlaces;
    } else {
      fetchedPlaces = allPlaces.filter((place) => parseInt(place.status) === 1);
    }
    setLoadedPlaces(fetchedPlaces.filter((place) => !place.done));
  };

  const refreshPlaces = () => {
    // setTimeout(() => {
    //   history.push(`/some-route/reload`);
    // }, 300);
    history.push(`/some-route/reload`);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <div>
          <PlacesHeader
            onDoneHandle={onDoneHandle}
            onUndoneHandle={onUndoneHandle}
          />
          <PlaceList
            userId={userId}
            items={loadedPlaces}
            onDeletedPlace={placeDeleteHandler}
            refreshPlaces={refreshPlaces}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
