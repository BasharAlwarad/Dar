import React, { createContext, useReducer, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListingsContext = createContext();

const initialState = {
  listings: [],
  lastFetchedListing: null,
  loading: false,
  listing: null,
};

const listingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LISTINGS':
      return { ...state, listings: action.payload };
    case 'SET_LAST_FETCHED_LISTING':
      return { ...state, lastFetchedListing: action.payload };
    case 'SET_SHOW_MORE_LISTINGS':
      return { ...state, listings: [...state.listings, ...action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_LISTING':
      return { ...state, listing: action.payload };
    default:
      return state;
  }
};

export const ListingsProvider = ({ children }) => {
  const navigate = useNavigate();
  const [{ listings, lastFetchedListing, loading, listing }, dispatch] =
    useReducer(listingsReducer, initialState);

  const fetchListings = async (category, categoryName, limiting, order) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/listing?category=${category}&categoryName=${categoryName}&limit=${limiting}&order=${order}`
      );
      const listings = data.listings;
      const lastVisible = data.lastVisible;

      dispatch({
        type: 'SET_LAST_FETCHED_LISTING',
        payload: lastVisible,
      });
      dispatch({ type: 'SET_LISTINGS', payload: listings });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Fetching listings failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const onFetchMoreListings = async (
    category,
    categoryName,
    limiting,
    order
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/listing/more?category=${category}&categoryName=${categoryName}&limit=${limiting}&order=${order}&lastVisibleId=${lastFetchedListing.id}`
      );
      const listings = data.listings;
      const lastVisible = data.lastVisible;

      dispatch({
        type: 'SET_LAST_FETCHED_LISTING',
        payload: lastVisible,
      });
      dispatch({ type: 'SET_SHOW_MORE_LISTINGS', payload: listings });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Fetching more listings failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchListing = async (listingId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/listing/${listingId}`
      );
      dispatch({ type: 'SET_LISTING', payload: data.listing });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Fetching listing failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUserListings = async (userId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/listing/user/${userId}`
      );
      dispatch({ type: 'SET_LISTINGS', payload: data.listings });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Fetching user listings failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createListing = async (data, user, geolocationEnabled = true) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('user', JSON.stringify(user));
      // formData.append('geolocationEnabled', JSON.stringify(geolocationEnabled));

      data.imageUrls.forEach((image, index) => {
        formData.append('imageUrls', image); // Use 'imageUrls' as the field name
      });

      const response = await axios.post(
        'http://localhost:8080/api/v1/listing',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data.message);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Creating listing failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateListing = async (
    data,
    user,
    listingId,
    geolocationEnabled = true
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.put(
        `http://localhost:8080/api/v1/listing/${listingId}`,
        { data, user, geolocationEnabled }
      );
      toast.success(response.data.message);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Updating listing failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteListing = async (listingId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.delete(
        `http://localhost:8080/api/v1/listing/${listingId}`
      );
      toast.success(response.data.message);
      dispatch({ type: 'SET_LOADING', payload: false });
      navigate(-1);
    } catch (error) {
      toast.error('Error: Deleting listing failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        lastFetchedListing,
        loading,
        listing,
        fetchListings,
        onFetchMoreListings,
        fetchListing,
        fetchUserListings,
        createListing,
        updateListing,
        deleteListing,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  const {
    listings,
    lastFetchedListing,
    loading,
    listing,
    fetchListings,
    onFetchMoreListings,
    fetchListing,
    fetchUserListings,
    createListing,
    updateListing,
    deleteListing,
  } = context;
  return {
    listings,
    lastFetchedListing,
    loading,
    listing,
    fetchListings,
    onFetchMoreListings,
    fetchListing,
    fetchUserListings,
    createListing,
    updateListing,
    deleteListing,
  };
};
