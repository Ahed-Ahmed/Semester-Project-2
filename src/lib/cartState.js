import React, { useState, createContext, useEffect, useContext } from 'react';

export const LocalStateContext = createContext({});

const CartStateProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const currentStorage = JSON.parse(localStorage.getItem('cart'));
    currentStorage
      ? setCart(currentStorage)
      : localStorage.setItem('cart', JSON.stringify([]));
  }, [setCart]);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <LocalStateContext.Provider value={{ cart, setCart }}>
      {children}
    </LocalStateContext.Provider>
  );
};
//  a custom hook to access cart local state
function useCart() {
  // we use a consumer here to access the local state
  const all = useContext(LocalStateContext);
  return all;
}
export { CartStateProvider, useCart };
