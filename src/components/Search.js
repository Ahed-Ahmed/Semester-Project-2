import React, { useState } from 'react';
import { RESTEndpoint } from '../config';

import '../styles/search.css';
import SearchIcon from '@mui/icons-material/Search';

function Search({ setProducts }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
    e.target.value === '' && setProducts([]);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${RESTEndpoint}products?_where[_or][0][title_contains]=${searchTerm}&_where[_or][1][description_contains]=${searchTerm}`
        );
        const json = await res.json();

        setProducts(json);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Fetch Faild...!</p>;
  return (
    <div className='search'>
      <form className='header__search'>
        <input
          id='header__search-input'
          type='text'
          value={searchTerm}
          onChange={handleChange}
          className='header__search-input'
        />
        <button
          type='submit'
          className='header__search-btn'
          onClick={handleSearch}>
          <SearchIcon style={{ fontSize: 30 }} />
        </button>
      </form>
    </div>
  );
}

export default Search;
