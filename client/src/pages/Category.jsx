import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { ListingItem, Spinner } from '../components';

export const Category = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListings, setLastFetchedListings] = useState(null);

  const { categoryName } = useParams();
  useEffect(() => {
    const fetchListings = async () => {
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
        setLastFetchedListings(lastVisible);
        const listings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Error: Fetching listings failed');
        setLoading(false);
      }
    };

    fetchListings();
  }, [categoryName]);

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('type', '==', categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListings),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (lastVisible === undefined) {
        toast.info('No more listings to fetch');
        setLoading(false);
        return;
      }
      setLastFetchedListings(lastVisible);
      const listings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(lastVisible);
      setListings((pre) => [...pre, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Error: Fetching listings failed');
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (listings.length <= 0) return <p>No listings found</p>;

  return (
    <div>
      <h2>Category for {categoryName}</h2>
      {listings?.map((listing) => (
        <ListingItem key={listing.id} listing={listing} />
      ))}
      <button
        className="btn btn-primary"
        onClick={onFetchMoreListings}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load more'}
      </button>
    </div>
  );
};
