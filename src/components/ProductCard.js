import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import formatMoney from '../lib/formatMoney';
import { useCart } from '../lib/cartState';
import { UserStateContext } from './User';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import '../styles/productCard.css';

function ProductCard({ product }) {
  const { user } = useContext(UserStateContext);
  const { id, image, image_url, title, price, featured } = product;
  const localSrc = image?.formats?.small ? image.formats.small.url : image?.url;
  const { setCart } = useCart();
  const handleClick = () => {
    setCart((state) => [
      ...state,
      {
        id,
        title,
        price,
        image_url: image_url,
        image: image?.formats?.thumbnail.url,
        product: `/product/${id}`,
      },
    ]);
  };

  return (
    <div className='productCard'>
      <div className='productCard__wrap'>
        {featured && <span className='productCard__featured'>Featured</span>}
        <Link to={`product/${id}`}>
          <img
            className='productCard__img'
            src={localSrc ? `http://localhost:1337${localSrc}` : image_url}
            alt=''
          />
        </Link>
        <div className='productCard__body'>
          <h3>{title}</h3>
          <h4>{formatMoney(price, 'USD')}</h4>
        </div>
        <button className='productCard__btn' onClick={handleClick}>
          Add To Cart <AddShoppingCartIcon />
        </button>
        {user && (
          <button className='productCard__btn-edit'>
            <Link to={`editproduct/${id}`}>✏️</Link>
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
