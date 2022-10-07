import { createContext } from 'react';

const INITIAL_STATE = {
  isLoggedIn: false,
  user: JSON.parse(localStorage.getItem('userData')) || null,
  // userId: null,
  // userPic: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext(INITIAL_STATE);

// JSON.parse(localStorage.getItem('userData')) ||
