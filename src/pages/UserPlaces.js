import React from 'react';

import css from './UserPlaces.module.css';
import PlaceList from '../components/PlaceList';
import PlacesHeader from '../shared/components/uiElements/PlacesHeader';

const loadedPlaces = [
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

const UserPlaces = () => {
  const placeDeleteHandler = (deletedPlaceId) => {
    console.log('usunieto');
  };

  return (
    <React.Fragment>
      <PlacesHeader />
      <PlaceList items={loadedPlaces} onDeletedPlace={placeDeleteHandler} />
    </React.Fragment>
  );
};

export default UserPlaces;
