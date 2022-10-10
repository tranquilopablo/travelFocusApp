import { createContext } from 'react';

const INITIAL_STATE = {
  isLoggedIn: JSON.parse(localStorage.getItem('userData')) || false,
  userId: null,
  userPic: null,
  token: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext(INITIAL_STATE);

// user: JSON.parse(localStorage.getItem('userData')) || null,
