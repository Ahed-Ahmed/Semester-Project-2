import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import '../styles/productsPage.css';
import ProductCard from '../components/ProductCard';
import Search from '../components/Search';

export const PRODUCTS_QUERY = gql`
  query PRODUCTS_QUERY {
    products {
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

function ProductsPage() {
  const [products, setProducts] = useState([]);

  const { data, error, loading } = useQuery(PRODUCTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className='products'>
      <Search setProducts={setProducts} />
      <div className='products__layout'>
        {!products.length &&
          data.products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        {products &&
          products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
      </div>
    </div>
  );
}

export default ProductsPage;
