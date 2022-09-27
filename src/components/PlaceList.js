import React from 'react';

import css from './PlaceList.module.css';
import Card from '../shared/components/uiElements/Card';
import Button from '../shared/components/uiElements/Button';

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

  return <div>moje miejsca</div>;
};

export default PlaceList;
