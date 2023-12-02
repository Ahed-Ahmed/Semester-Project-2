import React, { useState, createContext, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

export const UserStateContext = createContext();

const CURRENT_USER = gql`
  query CURRENT_USER {
    me {
      username
      email
      id
      role {
        name
      }
    }
  }
`;

const UserStateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState('');
  const [currentUser, { data }] = useLazyQuery(CURRENT_USER);
  useEffect(() => {
    const jwt = localStorage.getItem('token');
    jwt && setIsAuth(true) && setToken(jwt);
  }, []);

  useEffect(() => {
    if (!isAuth) {
      setUser(null);
    } else {
      currentUser();
      data?.me && setUser(data.me);
    }
  }, [isAuth, currentUser, data]);
  return (
    <UserStateContext.Provider
      value={{ user, setUser, isAuth, setIsAuth, token, setToken }}>
      {children}
    </UserStateContext.Provider>
  );
};

export default UserStateProvider;
