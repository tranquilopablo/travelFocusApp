import React from 'react';
import UserItem from './UserItem';
import Card from '../shared/components/uiElements/Card';

import css from './UsersList.module.css';

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className={css.center}>
        <Card className={css.noUsers}>
          <h2>Nie znaleziono użytkowników.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className={css.usersList}>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
