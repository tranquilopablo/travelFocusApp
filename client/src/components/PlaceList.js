import React from 'react';

import css from './PlaceList.module.css';
import Card from '../shared/components/uiElements/Card';
import Button from '../shared/components/uiElements/Button';
import PlaceItem from './PlaceItem';

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className={`${css.placeList} center`}>
        <Card>
          <h2 style={{ padding: '1rem' }}>
            Nie znaleziono miejsca, chcesz dodać?
          </h2>
          <Button to="/miejsca/nowe">Dodaj miejsce</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className={css.placeList}>
    {props.items.map((place) => (
        <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            priority={place.priority}
            status={place.status}
            done={place.done}
            onDelete={props.onDeletedPlace}


        />
    ))}
</ul>
  )
};

export default PlaceList;
