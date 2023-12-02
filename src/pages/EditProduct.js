import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Switch from '@mui/material/Switch';

import UploadImage from '../components/UploadImage';
import { PRODUCTS_QUERY } from './ProductsPage';
import { HOME_QUERY } from './HomePage';

import '../styles/addProduct.css';

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
        id
        formats
        alternativeText
        url
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UPDATE_PRODUCT(
    $id: ID!
    $title: String!
    $description: String!
    $featured: Boolean!
    $price: Float!
    $image: ID!
    $image_url: String
  ) {
    updateProduct(
      input: {
        where: { id: $id }
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
      }
    }
  }
`;

function EditProduct(props) {
  const id = props.match.params.id;
  // states :
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [imageID, setImageID] = useState('');
  const [oldimage, setOldimage] = useState();

  const [imageURL, setImageURL] = useState('');
  const [product, setProduct] = useState({});
  // Queries & Mutations hooks
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(PRODUCT_QUERY, { variables: { id } });

  const [updateProduct, { loading, error, data }] = useMutation(
    UPDATE_PRODUCT,
    {
      variables: product,
      refetchQueries: [
        { query: PRODUCTS_QUERY },
        { query: HOME_QUERY },
        { query: PRODUCT_QUERY },
      ],
    }
  );

  //effects :

  useEffect(() => {
    if (queryData) {
      const product = queryData.product;
      setProduct({
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image ? product.image.id : '',
        image_url: product.image_url ? product.image_url : '',
        featured: product.featured,
      });
      product.image_url && setImageURL(product.image_url);
      product.image && setOldimage(product.image);
    }
  }, [queryData]);

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
    const res = await updateProduct().then((res) => {
      setConfirmUpload(false);
    });
  };

  if (queryLoading) return <p>Loading...</p>;

  if (queryError) return <p>{queryError && queryError.message}</p>;

  return (
    <div className='addProduct'>
      <div className='addProduct__wrap'>
        <div className='addProduct__fields'>
          <form
            action='POST'
            className='addProduct__form'
            onSubmit={handleMainSubmit}>
            <h3>Edit Product</h3>

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
                    checked={product.featured}
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
              disabled={(!confirmUpload && !imageURL && !oldimage) || loading}>
              {data ? 'Product Updated ✅' : 'Update product'}
            </button>
          </form>
          <UploadImage
            setImageID={setImageID}
            imageID={imageID}
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

export default EditProduct;
