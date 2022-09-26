import React from 'react';
import css from './Users.module.css';
import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Pawel Zguda',
      image:
        'https://images.pexels.com/photos/4095246/pexels-photo-4095246.jpeg',
      places: 7,
    },
    {
      id: 'u2',
      name: 'Marek Cichoń',
      image:
        'https://images.pexels.com/photos/4095246/pexels-photo-4095246.jpeg',
      places: 14,
    },
    {
      id: 'u3',
      name: 'Piotr Wilczak',
      image:
        'https://images.pexels.com/photos/4095246/pexels-photo-4095246.jpeg',
      places: 44,
    },
    {
      id: 'u4',
      name: 'Karol Okrasa',
      image:
        'https://images.pexels.com/photos/4095246/pexels-photo-4095246.jpeg',
      places: 3,
    },
  ];

  return (
    <React.Fragment>
      <UsersList items={USERS} />
    </React.Fragment>
  );
};

export default Users;
