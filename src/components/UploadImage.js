import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { gql, useMutation } from '@apollo/client';

import { useMediaQuery } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UserStateContext } from './User';

const DELETE_OLD_IMG = gql`
  mutation DELETE_OLD_IMG($id: ID!) {
    deleteFile(input: { where: { id: $id } }) {
      file {
        id
      }
    }
  }
`;

function UploadImage({
  setConfirmUpload,
  confirmUpload,
  imageURL,
  setImageURL,
  setImageID,
  oldimage,
  setOldimage,
}) {
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();
  const [oldImageID, setOldImageID] = useState('');
  const [deleteOldImg] = useMutation(DELETE_OLD_IMG);
  const media1 = useMediaQuery('(max-width: 750px)');
  const { token } = useContext(UserStateContext);
  // Effects :
  useEffect(() => {
    if (confirmUpload) {
      deleteOldImg({ variables: { id: oldImageID } });
    }
  }, [confirmUpload]);

  /* useEffect(() => {
    oldimage && setPreview(oldimage);
  }, [oldimage]); */

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, oldimage]);

  // Event handlers

  const handleSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(undefined);
      return;
    }
    if (oldimage) {
      setOldImageID(oldimage.id);
    }

    oldimage && setPreview(undefined) && setOldimage(undefined);
    setFile(e.target.files[0]);
  };
  const upload = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('files', file);

    axios
      .post('http://localhost:1337/upload/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setConfirmUpload(true);
        setImageID(response.data[0].id.toString());
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <form action='POST' className='addProduct__form' onSubmit={upload}>
      <div className='form__image'>
        {file && <img src={preview} alt='preview' />}
        {imageURL && <img src={imageURL} alt='preview' />}
        {oldimage && !file && (
          <img src={`http://localhost:1337${oldimage.url}`} alt='preview' />
        )}

        <label htmlFor='file' disabled={imageURL}>
          {media1 ? (
            <CloudUploadIcon />
          ) : oldimage ? (
            'Change image'
          ) : (
            'Add Image'
          )}
        </label>
        <input
          type='file'
          id='file'
          className='addProduct__img'
          onChange={handleSelectFile}
        />
      </div>
      <div className='form__url'>
        <label htmlFor='url'>Enter Image Url</label>
        <input
          id='url'
          type='text'
          className='addProduct__url'
          placeholder='https://'
          value={imageURL}
          onChange={(e) => {
            setImageURL(e.target.value);
            setFile(undefined);
            setOldimage(undefined);
          }}
        />
      </div>
      {!imageURL && (
        <button
          type='submit'
          className='addProduct__btn'
          disabled={confirmUpload}>
          {confirmUpload ? 'Uploaded ✅' : 'upload'}
        </button>
      )}
    </form>
  );
}

export default UploadImage;
