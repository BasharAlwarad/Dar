import { useEffect } from 'react';
import { useListings } from '../contexts/ListingsContext';
import { ListingItem, Spinner } from '../components';

export const Offers = () => {
  const { fetchListings, onFetchMoreListings, listings, loading } =
    useListings();

  useEffect(() => {
    fetchListings('offer', true, 1, 'timestamp');
  }, []);

  if (loading) <Spinner />;

  if (listings.length <= 0) return <p>No listings found</p>;

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      <>
        <main>
          <ul className="categoryListings">
            {listings?.map((listing) => (
              <ListingItem listing={listing} id={listing.id} key={listing.id} />
            ))}
          </ul>
        </main>
        <br />
        <br />
        <button
          className="btn btn-primary"
          onClick={() => onFetchMoreListings('offer', true, 1, 'timestamp')}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      </>
    </div>
  );
};
