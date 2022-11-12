import React, { useContext } from 'react';
import css from './PlaceList.module.css';
import Card from '../shared/components/uiElements/Card';
import Button from '../shared/components/uiElements/Button';
import PlaceItem from './PlaceItem';
import { AuthContext } from '../shared/context/auth-context';

const PlaceList = (props) => {
  const auth = useContext(AuthContext);
  if (props.items.length === 0 && auth.userId !== props.userId) {
    return (
      <div className={`${css.placeList} center`}>
        <Card style={{ padding: '1rem' }}>
          <h2>Użytkownik nie posiada publicznie udostępnionych miejsc</h2>
          <Button to="/">WRÓĆ</Button>
        </Card>
      </div>
    );
  }
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
            refreshPlaces={props.refreshPlaces}
        />
    ))}
</ul>
  )
};

export default PlaceList;
