import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component'
import './index.css';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 18;
const Access_Key = "fS1-wysyodne-i3JToJZ8GEywxYMWBo94UgbstNFVuI"

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('');
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${Access_Key}`
        );
        setImages([...images, ...data.results]);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg('Error fetching images. Try again later.');
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    setImages([]);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  };

  //console.log('page', page);

  return (
    <div className='container'>
      <h1 className='title'>Image Search</h1>
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control
            type='search'
            placeholder='Type something to search...'
            className='search-input'
            ref={searchInput}
          />
        </Form>
      </div>
      <InfiniteScroll
        dataLength={images}
        next={() => setPage(page + 1)}
        hasMore={true}
        loader={
          loading ? (
            <p className='loading' > Loading...</p>
          ) : (<div></div>)
        }
      >
        <div className='images'>
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.urls.small}
                  alt={image.alt_description}
                  className='image'
                />
              ))}
            </div>
      </InfiniteScroll >
    </div >
  );
};

export default App;

