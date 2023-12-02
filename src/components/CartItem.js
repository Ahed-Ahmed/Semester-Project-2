import React from 'react';
import { Link } from 'react-router-dom';
import formatMoney from '../lib/formatMoney';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import '../styles/cartItem.css';
import { useCart } from '../lib/cartState';

function CartItem({ id, title, price, image, image_url, product }) {
  const { cart, setCart } = useCart();

  const handleClick = (e) => {
    e.preventDefault();
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
  };
  return (
    <div className='cartItem'>
      <Link to={product}>
        <div className='cartItem__img-wrap'>
          <img
            className='cartItem__img'
            src={image ? `http://localhost:1337${image}` : image_url}
            alt=''
          />
        </div>
      </Link>
      <div className='cartItem__right'>
        <Link to={product}>
          <p className='cartItem__title'>{title}</p>
        </Link>
        <span className='cartItem__price'>{formatMoney(price, 'USD')}</span>
      </div>
      <button className='cartItem__removeItem' onClick={handleClick}>
        <DeleteForeverIcon />
      </button>
    </div>
  );
}

export default CartItem;
