import { createContext, useContext, useReducer, useEffect } from 'react';
import listingReducer from '../reducers/ListingsReducer.jsx';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

const ListingsContext = createContext();

const initialState = {
  user: null,
  loading: true,
  listings: [],
  listing: null,
  lastFetchedListings: null,
};

export const ListingsProvider = ({ children }) => {
  const [{ user, loading, listings, listing, lastFetchedListings }, dispatch] =
    useReducer(listingReducer, initialState);

  useEffect(() => {
    console.log('lastFetchedListings updated:', lastFetchedListings);
  }, [lastFetchedListings]);

  const fetchListings = async (categoryName) => {
    try {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('type', '==', categoryName),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      dispatch({
        type: 'SET_LAST_FETCHED_LISTING',
        payload: lastVisible,
      });
      const listings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: 'SET_LISTINGS', payload: listings });
    } catch (error) {
      toast.error('Error: Fetching listings failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const onFetchMoreListings = async (categoryName) => {
    try {
      console.log('lastFetchedListings', lastFetchedListings);
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('type', '==', categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListings),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot?.docs[querySnapshot.docs.length - 1];
      console.log(querySnapshot.docs);
      console.log(lastVisible);

      if (lastVisible === undefined) {
        toast.info('No more listings to fetch');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      dispatch({ type: 'SET_LAST_FETCHED_LISTING', payload: lastVisible });
      const listings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: 'SET_SHOW_MORE_LISTINGS', payload: listings });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Fetching listings failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ListingsContext.Provider
      value={{
        user,
        loading,
        listings,
        listing,
        fetchListings,
        onFetchMoreListings,
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
  return context;
};
