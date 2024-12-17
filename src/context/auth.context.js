import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isConnected: false,
  accounts: [],
  activeAccount: null,
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const setUser = (user) => {
    setState({ ...state, user, isConnected: user.isConnected });
  };
  const user = state?.user;
  const isConnected = state?.isConnected;

  return (
    <AuthContext.Provider value={{ setUser, user, isConnected }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
