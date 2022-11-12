import { createContext } from 'react';

const INITIAL_STATE = {
  isLoggedIn: false,
  userId: null,
  userPic: null,
  token: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext(INITIAL_STATE);

