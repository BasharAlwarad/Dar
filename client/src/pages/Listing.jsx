import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import { Spinner } from '../components';
import { shareIcon } from '../assets';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export const Listing = () => {
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const { listingId } = useParams();
  const { currentUser } = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = doc(db, 'listings', listingId);
        const listingSnapshot = await getDoc(listingRef);
        const listingData = listingSnapshot?.data();
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

  const handleDeleteListing = async () => {
    try {
      if (!window.confirm('Are you sure you want to delete this listing?')) {
        return;
      }
      console.log(listingId);
      await deleteDoc(doc(db, 'listings', listingId));
      toast.success('Listing deleted successfully');
      new Promise((resolve) => setTimeout(resolve, 2000));
      navigate(-1);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
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
      <div className="w-2/4 mx-auto">
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          modules={[Navigation, Pagination]}
        >
          {listing?.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${listing.imageUrls[index]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="rounded-xl object-contain w-full h-96"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
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
        {currentUser?.uid === listing?.user ? (
          <div className="flex justify-between w-1/4">
            <button className="btn btn-primary">
              <Link to={`/edit-listing/${listingId}`}>Edit Listing</Link>
            </button>
            <button className="btn btn-primary" onClick={handleDeleteListing}>
              Delete Listing
            </button>
          </div>
        ) : (
          <button className="btn btn-primary">
            <Link to={`/contact/${listing.user}?listingId=${listingId}`}>
              Contact Owner
            </Link>
          </button>
        )}
      </div>
      {listing?.geolocation && (
        <MapContainer
          className="w-full h-96"
          center={[
            listing?.geolocation?.lat || 0,
            listing?.geolocation?.lng || 0,
          ]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
          OpenStreetMap</a> contributors'
          />

          <Marker
            position={[
              listing?.geolocation?.lat || 0,
              listing?.geolocation?.lng || 0,
            ]}
          >
            <Popup>{listing?.name}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};
