import React, { useEffect, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import classNames from 'classnames';

import ProductCard from '../components/ProductCard';
import '../styles/homePage.css';
import { Link } from 'react-router-dom';

// graphQL tags for Queries & Mutations
export const HOME_QUERY = gql`
  query HOME_QUERY {
    home {
      id
      hero_banner {
        id
        url
      }
    }
    products(where: { featured: true }) {
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

function HomePage() {
  const [heroActive, setHeroActive] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHeroActive(true);
    }, 1000);
  }, []);
  // calling the Query with hook
  const { data, loading, error } = useQuery(HOME_QUERY);

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error.message}</p>;

  const heroBanner = data && data.home.hero_banner;

  return (
    <div className='homePage'>
      <div className='heroBanner'>
        <img
          className='heroBanner__img'
          src={`http://localhost:1337${heroBanner?.url}`}
          alt=''
        />
        <div
          className={classNames('heroBanner__inner', {
            active: heroActive,
          })}>
          <h3>Men Collection 2021</h3>
          <h1>New Arrivals for Winter</h1>
          <Link to='/products'>
            <button>Shop Now</button>
          </Link>
        </div>
      </div>
      <div className='homePage__featured'>
        {data.products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
