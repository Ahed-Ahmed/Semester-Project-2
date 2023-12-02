import React, { useRef, useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { UserStateContext } from '../components/User';

import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import '../styles/signin.css';
import bg from '../assets/bg.jpg';

const LOGIN = gql`
  mutation LOGIN($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        role {
          name
        }
        username
        email
      }
    }
  }
`;

function SigninPage() {
  // login inputs :
  const emailRef = useRef();
  const passwordRef = useRef();

  const history = useHistory();

  // context
  const { setIsAuth, setToken } = useContext(UserStateContext);

  const [loginError, setLoginError] = useState(null);

  const [login, { loading, error, data }] = useMutation(LOGIN);
  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({
      variables: {
        identifier: emailRef.current.value,
        password: passwordRef.current.value,
      },
    })
      .then((res) => {
        localStorage.setItem('token', res?.data.login.jwt);
        setIsAuth(true);
        setToken(res.data.login.jwt);
        history.push('/');
      })
      .catch((err) => setLoginError(err));
  };
  return (
    <div className='signin'>
      <img src={bg} alt='signin background' />
      <div className='signin__wrap'>
        <form method='POST' className='signin__form' onSubmit={handleSubmit}>
          <h1 className='form__header'>Sign In</h1>
          {loginError && (
            <p>Authentication Faild ! please check your Email or Password</p>
          )}
          <fieldset>
            <label htmlFor='email'>
              Email
              <div className='form__input'>
                <MailOutlineOutlinedIcon />
                <input
                  type='email'
                  name='email'
                  placeholder='email'
                  autoComplete='email'
                  ref={emailRef}
                />
              </div>
            </label>

            <label htmlFor='password'>
              Password
              <div className='form__input'>
                <LockOutlinedIcon />
                <input
                  type='password'
                  name='password'
                  placeholder='At least 8 characters'
                  ref={passwordRef}
                />
              </div>
            </label>
            <button type={'submit'}>Sign in</button>
          </fieldset>
          <p>Only Users with Admin Role can Sign in Here</p>
        </form>
      </div>
    </div>
  );
}

export default SigninPage;
