import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useListings } from '../contexts/ListingsContext';
import { ListingItem, Spinner } from '../components';

export const Category = () => {
  const { fetchListings, onFetchMoreListings, loading, listings } =
    useListings();
  const { categoryName } = useParams();

  useEffect(() => {
    fetchListings('type', categoryName, 1, 'timestamp');
  }, [categoryName]);
  if (loading) return <Spinner />;
  if (listings.length <= 0) return <p>No listings found</p>;

  return (
    <div>
      <h2>Category for {categoryName}</h2>
      {listings.length > 0 &&
        listings?.map((listing) => (
          <ListingItem key={listing.id} listing={listing} />
        ))}
      <button
        className="btn btn-primary"
        onClick={() =>
          onFetchMoreListings('type', categoryName, 1, 'timestamp')
        }
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load more'}
      </button>
    </div>
  );
};
