import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Link } from 'react-router-dom';
import { useMutation, useQuery, gql } from '@apollo/client';
import formatMoney from '../lib/formatMoney';
import { useMediaQuery } from '@mui/material';

const UPDATE_FEATURED = gql`
  mutation UPDATE_FEATURED($id: ID!, $featured: Boolean!) {
    updateProduct(
      input: { where: { id: $id }, data: { featured: $featured } }
    ) {
      product {
        featured
        id
      }
    }
  }
`;
const DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(input: { where: { id: $id } }) {
      product {
        title
      }
    }
  }
`;
const QUERY_ALL = gql`
  query QUERY_ALL {
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

function Dashboard() {
  const [preview, setPreview] = useState({ name: 'all' });
  const [products, setProducts] = useState([]);
  const mediaDash = useMediaQuery('(max-width:460px)');
  const mediaDash3 = useMediaQuery('(max-width:300px)');

  // Query & Mutation
  const [deleteProduct, { loading: deleteLoading }] = useMutation(
    DELETE_PRODUCT,
    {
      refetchQueries: [{ query: QUERY_ALL }],
    }
  );
  const [updateFeatured, { loading: updateFeatLoading }] = useMutation(
    UPDATE_FEATURED,
    {
      refetchQueries: [{ query: QUERY_ALL }],
    }
  );

  const { data, error, loading } = useQuery(QUERY_ALL);

  const handleFeaturedUpdate = async (e, id) => {
    updateFeatured({
      variables: {
        id,
        featured: e.target.checked,
      },
    });
  };
  useEffect(() => {
    preview.name === 'all' && !loading && setProducts(data.products);
    preview.name === 'featured' &&
      !loading &&
      setProducts(data.products.filter((product) => product.featured));
    preview.name === 'notFeatured' &&
      !loading &&
      setProducts(data.products.filter((product) => !product.featured));
  }, [preview, data]);

  return (
    <div className='dashboard'>
      <div className='dashboard__wrap'>
        <div className='dashboard__filter'>
          <button className='dashboard__btn'>
            <Link to='/addproduct'>Add Product</Link>
          </button>
          <form
            onSubmit={(e) => {
              e.prevenetDefault();
            }}>
            <label htmlFor='all'>
              <input
                type='radio'
                value='all'
                checked={preview.name === 'all'}
                onChange={(e) =>
                  setPreview((state) => ({ ...state, name: e.target.value }))
                }
              />
              All
            </label>
            <label htmlFor='featured'>
              <input
                type='radio'
                value='featured'
                checked={preview.name === 'featured'}
                onChange={(e) =>
                  setPreview((state) => ({ ...state, name: e.target.value }))
                }
              />
              Featured
            </label>
            <label htmlFor='notFeatured'>
              <input
                type='radio'
                value='notFeatured'
                checked={preview.name === 'notFeatured'}
                onChange={(e) =>
                  setPreview((state) => ({ ...state, name: e.target.value }))
                }
              />
              Not Featured
            </label>
            <span>
              {products.length} - Product{products.length > 1 ? 's' : ''} In
              Result
            </span>
          </form>
        </div>
        {loading && <h3>Loading...</h3>}
        {error && <h3>{error.message}</h3>}
        <table>
          <thead>
            <tr>
              {!mediaDash && <th>ID</th>}
              <th>Name</th>
              {!mediaDash3 && <th>Price</th>}
              <th>{mediaDash ? 'Feat.' : 'Featured'}</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item) => (
              <tr key={item.id}>
                {!mediaDash && <td>{item.id}</td>}
                <td>
                  <Link to={`/product/${item.id}`}>{item.title}</Link>
                </td>
                {!mediaDash3 && (
                  <td>
                    <strong>{formatMoney(item.price, 'USD')}</strong>
                  </td>
                )}
                <td>
                  <input
                    disabled={updateFeatLoading}
                    type='checkbox'
                    checked={item.featured}
                    onChange={(e) => handleFeaturedUpdate(e, item.id)}
                  />
                </td>
                <td>
                  <Link to={`editproduct/${item.id}`}>✏️</Link>
                </td>
                <td>
                  <button
                    disabled={deleteLoading}
                    className='cartItem__removeItem'
                    onClick={(e) => {
                      e.preventDefault();
                      deleteProduct({ variables: { id: item.id } });
                    }}>
                    <DeleteForeverIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
