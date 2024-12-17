import { createContext, useContext, useState } from 'react';

const UiContext = createContext();

export const MODALS = {
  REQUIRE_LOGIN: 'requireLogin',
  CONNECT_ACCOUNT: 'connectAccount',
};

const initialState = {
  modals: {
    [MODALS.REQUIRE_LOGIN]: false,
    [MODALS.CONNECT_ACCOUNT]: false,
  },
  modalData: null,
};

export const UiProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const modals = state?.modals;
  const modalData = state?.modalData;

  const showModal = (modal, data) => {
    console.log('showModal', modal, data);
    setState({
      ...state,
      modals: { ...modals, [modal]: true },
      modalData: data,
    });
  };

  const hideModal = (modal) => {
    setState({ ...state, modals: { ...modals, [modal]: false } });
  };

  return (
    <UiContext.Provider value={{ showModal, hideModal, modals, modalData }}>
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  return useContext(UiContext);
};
