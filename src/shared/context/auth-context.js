import { createContext } from 'react';

const INITIAL_STATE = {
  isLoggedIn: false,
  user: JSON.parse(localStorage.getItem('user')) || null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext(INITIAL_STATE);
