import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import logo from '../assets/beyou2.png';
import dash from '../assets/dash.png';

import { useCart } from '../lib/cartState';
import { UserStateContext } from './User';
import MediaMenu from './MediaMenu';

import useMediaQuery from '@mui/material/useMediaQuery';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../styles/header.css';

function Header() {
  const mediaHeader = useMediaQuery('(max-width:1050px)');
  const { cart } = useCart();
  const { user, setIsAuth } = useContext(UserStateContext);
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    let target = e.target;
    if (target.tagName === 'IMG') {
      target = target.parentNode.parentNode.nextSibling.firstChild;
    }
    target.parentNode.classList.add('active');
    let siblings = [];
    if (!target.parentNode.parentNode) {
      return siblings;
    }
    let sibling = target.parentNode.parentNode.firstChild;

    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== target.parentNode) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    siblings.map(
      (sibling) =>
        sibling.classList.contains('active') &&
        sibling.classList.remove('active')
    );
  };

  const handleSignout = (e) => {
    e.preventDefault();
    setIsAuth(false);
    localStorage.setItem('token', '');
    history.push('/signin');
  };
  if (mediaHeader) return <MediaMenu user={user} setIsAuth={setIsAuth} />;
  return (
    <div className='header'>
      <ul className='header__nav'>
        <li onClick={handleClick}>
          <Link to='/' className='header__logo'>
            <img src={logo} alt='logo' />
          </Link>
        </li>
        <li onClick={handleClick} className='header__nav-link active'>
          <Link to='/'>Home</Link>
        </li>
        <li className='header__nav-link' onClick={handleClick}>
          <Link to='/products'>Products</Link>
        </li>
        {!user && (
          <li className='header__nav-link' onClick={handleClick}>
            <Link to='/signin'>Sign in</Link>
          </li>
        )}
        <li className='header__nav-link cart-icon' onClick={handleClick}>
          <Link to='/cart'>
            cart
            <span>
              <ShoppingCartIcon />
              <p>{cart ? cart.length : 0}</p>
            </span>
          </Link>
        </li>
        {user && (
          <>
            <li
              className='header__nav-link dashboard-nav'
              onClick={handleClick}>
              <Link to='/dashboard'>
                <img src={dash} width='30px' alt='dashboard icon' />
                Admin
              </Link>
            </li>
            <li className='header__nav-link '>
              <button onClick={handleSignout} className='nav-signout'>
                Sign out
              </button>
            </li>
            <li className='header__nav-link' onClick={handleClick}>
              <Link to='/addproduct'>Add New Product</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Header;
