import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

import { Spinner } from '../components';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';

export const Slider = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
        });
        console.log(listings);
        setListing(listings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (listing && loading) return <Spinner />;

  return !listing ? null : (
    <div className="w-3/4 mx-auto my-4">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
      >
        {listing?.map(({ data, id }) => (
          <SwiperSlide key={id}>
            <div
              onClick={() => navigate(`/category/${data.type}/${id}`)}
              style={{
                background: `url(${data.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className="rounded-xl object-contain w-full h-96 cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
                <h2 className="text-2xl">{data.name}</h2>
                <p>
                  Price:
                  {data?.discountedPrice ?? data?.discountedPrice}
                  {data?.discountedPrice && (
                    <span> (was {data.discountedPrice})</span>
                  )}
                  {data.type === 'rent' ? '/month' : ''}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
