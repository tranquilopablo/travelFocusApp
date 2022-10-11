import React from 'react';
import { Link } from 'react-router-dom';

import css from './UserItem.module.css';
import Card from '../shared/components/uiElements/Card';

{/* <img src={`http://localhost:5000/${props.image}`} alt={props.name} /> */}
const UserItem = (props) => {
  return (
    <li className={css.userItem}>
      <Card className={css.userItemCard}>
        <Link to={`${props.id}/miejsca`}>
          <div className={css.userImage}>
            <img src={`${props.image}`} alt={props.name} />
          </div>
          <div className={css.info}>
            <h2>{props.name}</h2>
            <h3>{`Liczba miejsc:  ${props.placeCount} `}</h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
