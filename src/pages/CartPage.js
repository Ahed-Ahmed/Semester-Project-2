import React from 'react';
import PaymentIcon from '@mui/icons-material/Payment';

import CartItem from '../components/CartItem';
import formatMoney from '../lib/formatMoney';
import { useCart } from '../lib/cartState';

import '../styles/cartPage.css';

function CartPage() {
  const { cart } = useCart();

  return (
    <div className='cart'>
      <header>
        <h2>Shopping Cart </h2>
      </header>
      <div className='cart__layout'>
        <ul className='cart__items'>
          {cart?.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
          {cart.length === 0 && (
            <div className='cart__redirect'>
              <div className='cart__redirect-left'>
                <img
                  src='https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg'
                  alt='redirect'
                />
              </div>
              <div className='cart__redirect-right'>
                <h1>Your Cart is empty</h1>
              </div>
            </div>
          )}
        </ul>
        {cart.length !== 0 && (
          <div className='cart__subtotal'>
            <div>
              <h2>Subtotal ({cart.length} items) </h2>
              <span>
                {formatMoney(
                  cart?.reduce((tally, cartItem) => tally + cartItem.price, 0),
                  'USD'
                )}
              </span>
            </div>
            <p>This Subtotal Doesn't contain shipping fees and Taxes</p>
            <button className='cart__checkout'>
              Checkout Now <PaymentIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
