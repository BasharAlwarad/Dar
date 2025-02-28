import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { ListingItem, Spinner } from '../components';

export const Category = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('type', '==', categoryName),
          //   where('category', '==', categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
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

  if (loading) return <Spinner />;
  if (listings.length <= 0) return <p>No listings found</p>;

  return (
    <div>
      <h2>Category for {categoryName}</h2>
      {listings?.map((listing) => (
        <ListingItem key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
