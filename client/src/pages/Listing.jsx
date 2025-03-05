import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import { Spinner } from '../components';
import { shareIcon } from '../assets';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const Listing = () => {
  //   const [
  //     {
  //       name,
  //       imageUrls,
  //       location,
  //       regularPrice,
  //       discountedPrice,
  //       bathrooms,
  //       bedrooms,
  //       geolocation,
  //       offer,
  //       type,
  //     },
  //     setListing,
  //   ] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const { listingId } = useParams();
  const { currentUser } = getAuth();
  const navigate = useNavigate();

  console.log(currentUser);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = doc(db, 'listings', listingId);
        const listingSnapshot = await getDoc(listingRef);
        const listingData = listingSnapshot?.data();
        console.log(listingData);
        setListing(listingData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };

  if (loading) return <Spinner />;
  if (!listing?.name) return <p>No listing found</p>;
  return (
    <div className="card relative w-full bg-base-100 shadow-xl p-4">
      <div
        className={`absolute top-1 right-3 p-2 btn btn-${
          shareLinkCopied ? 'success' : 'white'
        }`}
      >
        <button onClick={handleShare}>
          <img src={shareIcon} alt="Share" className="w-6 h-6" />
          {shareLinkCopied ? 'Link Copied' : 'Share Link'}
        </button>
      </div>
      <div className="w-1/4 mx-auto">
        <Carousel showThumbs={false} infiniteLoop autoPlay>
          {listing?.imageUrls?.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Listing ${index}`}
                className="rounded-xl object-contain w-full"
              />
            </div>
          ))}
        </Carousel>
        <p className="text-gray-600">📍 {listing?.location}</p>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold">{listing?.name}</h3>
        <table className="table-auto w-full text-gray-700">
          <thead>
            <tr>
              {listing?.offer ? (
                <th className="px-4 py-2">Discounted Price</th>
              ) : (
                <th className="px-4 py-2">Regular Price</th>
              )}
              <th className="px-4 py-2">🛏 Bedrooms</th>
              <th className="px-4 py-2">🛁 Bathrooms</th>
              <th className="px-4 py-2">🏡 Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {listing?.offer ? (
                <td className="px-4 py-2 text-center">
                  <span className="text-red-500 font-semibold">
                    ${' '}
                    {listing?.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'X'}
                  </span>
                </td>
              ) : (
                <td className="px-4 py-2 text-center">
                  ${' '}
                  {listing?.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'X'}
                </td>
              )}
              <td className="px-4 py-2 text-center">
                {' '}
                {listing?.bedrooms || 'X'}
              </td>
              <td className="px-4 py-2 text-center">
                {listing?.bathrooms || 'X'}
              </td>
              <td className="px-4 py-2 text-center">
                <p className="badge badge-secondary uppercase">
                  {listing?.type}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        {currentUser?.uid !== listing?.user ? (
          <button className="btn btn-primary">
            <Link to={`/contact/${listing.user}?listingId=${listingId}`}>
              Contact Owner
            </Link>
          </button>
        ) : (
          <button className="btn btn-primary">
            <Link to={`/edit-listing/${listing.id}`}>Edit Listing</Link>
          </button>
        )}
      </div>
    </div>
  );
};
