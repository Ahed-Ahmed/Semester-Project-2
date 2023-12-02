import { gql, useQuery } from '@apollo/client';
import React from 'react';
import formatMoney from '../lib/formatMoney';
import { useCart } from '../lib/cartState';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import '../styles/product.css';

const PRODUCT_QUERY = gql`
  query PRODUCT_QUERY($id: ID!) {
    product(id: $id) {
      id
      title
      price
      description
      featured
      image_url
      image {
        formats
        alternativeText
        url
      }
    }
  }
`;
function SingleProductPage(props) {
  const { setCart } = useCart();
  const id = props.match.params.id;
  const { data, loading, error } = useQuery(PRODUCT_QUERY, {
    variables: { id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  const { image, title, price, description, featured, image_url } =
    data?.product;
  const localSrc = image?.formats?.large
    ? image?.formats?.large.url
    : image?.url;

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
    <div className='product'>
      <div className='product__layout'>
        <div className='product__left'>
          <img
            src={localSrc ? `http://localhost:1337${localSrc}` : image_url}
            alt=''
            className='product__img'
          />
        </div>
        <div className='product__right'>
          <h3 className='product__title'>{title}</h3>
          <h4 className='product__price'>{formatMoney(price, 'USD')}</h4>

          <button className='productCard__btn' onClick={handleClick}>
            Add To Cart <AddShoppingCartIcon />
          </button>
        </div>
        <div className='product__desc'>
          <h4>Product Description</h4>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default SingleProductPage;
