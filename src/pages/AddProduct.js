import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

import Switch from '@mui/material/Switch';
import '../styles/addProduct.css';
import UploadImage from '../components/UploadImage';
import { PRODUCTS_QUERY } from './ProductsPage';
import { HOME_QUERY } from './HomePage';

const ADD_PRODUCT = gql`
  mutation ADD_PRODUCT(
    $title: String!
    $description: String!
    $featured: Boolean!
    $price: Float!
    $image: ID!
    $image_url: String!
  ) {
    createProduct(
      input: {
        data: {
          title: $title
          description: $description
          featured: $featured
          price: $price
          image: $image
          image_url: $image_url
        }
      }
    ) {
      product {
        id
        title
      }
    }
  }
`;

function AddProduct() {
  // states :

  const [confirmUpload, setConfirmUpload] = useState(false);
  const [imageID, setImageID] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [oldimage, setOldimage] = useState();
  const [product, setProduct] = useState({
    title: '',
    featured: false,
    image: '',
    description: '',
    price: undefined,
    image_url: imageURL,
  });
  //effects :
  useEffect(() => {
    imageID && setProduct((state) => ({ ...state, image: imageID }));
    imageURL && setProduct((state) => ({ ...state, image_url: imageURL }));
  }, [imageID, imageURL]);

  // Evenet Handlers :
  const handleInputChange = (e) => {
    let { name, value, type } = e.target;
    e.preventDefault();
    if (type === 'number') {
      value = parseFloat(value);
    }
    setProduct((state) => ({ ...state, [name]: value }));
  };
  const handleMainSubmit = async (e) => {
    e.preventDefault();
    const res = await addProduct().then((res) => {
      setConfirmUpload(false);
      setProduct({});
    });
  };

  // Queries & Mutations hooks
  const [addProduct, { loading, error, data }] = useMutation(ADD_PRODUCT, {
    variables: product,
    refetchQueries: [{ query: PRODUCTS_QUERY }, { query: HOME_QUERY }],
  });

  return (
    <div className='addProduct'>
      <div className='addProduct__wrap'>
        <div className='addProduct__fields'>
          <form
            action='POST'
            className='addProduct__form'
            onSubmit={handleMainSubmit}>
            <h3>Add Product</h3>

            <fieldset aria-busy={loading} disabled={loading}>
              <div className='form__section'>
                <label htmlFor='title'>
                  <h5>Product Name</h5>
                  <input
                    required='true'
                    type='text'
                    name='title'
                    value={product.title}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className='form__section '>
                <label htmlFor='price'>
                  <h5>price</h5>
                  <input
                    required='true'
                    type='number'
                    step='0.01'
                    name='price'
                    min='0'
                    placeholder='$ 1.00'
                    value={product.price}
                    onChange={handleInputChange}
                  />
                </label>
                <label htmlFor='featured' className='featured'>
                  <h5>featured</h5>
                  <Switch
                    name='featured'
                    checked={product.checked}
                    onChange={(e) =>
                      setProduct((state) => ({
                        ...state,
                        featured: e.target.checked,
                      }))
                    }
                  />
                </label>
              </div>
              <div className='form__section'>
                <label htmlFor='description'>
                  <h5>description</h5>
                  <textarea
                    required='true'
                    type='text'
                    name='description'
                    value={product.description}
                    onChange={handleInputChange}></textarea>
                </label>
              </div>
            </fieldset>

            <button
              type='submit'
              className='addProduct__btn'
              disabled={!confirmUpload && !imageURL}>
              {data ? 'Product Added ✅' : 'Add product ➕'}
            </button>
          </form>
          <UploadImage
            setImageID={setImageID}
            setConfirmUpload={setConfirmUpload}
            confirmUpload={confirmUpload}
            setImageURL={setImageURL}
            imageURL={imageURL}
            oldimage={oldimage}
            setOldimage={setOldimage}
          />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
