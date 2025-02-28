import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const ListingItem = ({ listing }) => {
  const {
    name,
    imageUrls,
    location,
    regularPrice,
    discountedPrice,
    bathrooms,
    bedrooms,
    geolocation,
    offer,
    type,
  } = listing;

  return (
    <div className="card w-full bg-base-100 shadow-xl p-4">
      <div className="w-1/2 mx-auto">
        <Carousel showThumbs={false} infiniteLoop autoPlay>
          {imageUrls?.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Listing ${index}`}
                className="rounded-xl object-contain w-full"
              />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-gray-600">📍 {location}</p>
        <p className="text-gray-800">
          {offer ? (
            <span className="text-red-500 font-semibold">
              Discounted Price: ${discountedPrice}
            </span>
          ) : (
            <span>Regular Price: ${regularPrice}</span>
          )}
        </p>
        <table className="table-auto w-full text-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2">🛏 Bedrooms</th>
              <th className="px-4 py-2">🛁 Bathrooms</th>
              <th className="px-4 py-2">📐 Area</th>
              <th className="px-4 py-2">🏡 Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-center">{bedrooms || 'X'}</td>
              <td className="px-4 py-2 text-center">{bathrooms || 'X'}</td>
              <td className="px-4 py-2 text-center">{listing.area || 'X'}</td>
              <td className="px-4 py-2 text-center">for {type || 'X'}</td>
            </tr>
          </tbody>
        </table>
        <p className="badge badge-secondary uppercase">{type}</p>
      </div>
    </div>
  );
};
