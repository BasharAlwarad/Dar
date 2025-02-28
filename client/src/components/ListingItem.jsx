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
      <div className="w-1/4 mx-auto">
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
        <p className="text-gray-600">📍 {location}</p>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold">{name}</h3>
        <table className="table-auto w-full text-gray-700">
          <thead>
            <tr>
              {offer ? (
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
              {offer ? (
                <td className="px-4 py-2 text-center">
                  <span className="text-red-500 font-semibold">
                    $ {discountedPrice || 'X'}
                  </span>
                </td>
              ) : (
                <td className="px-4 py-2 text-center">
                  $ {regularPrice || 'X'}
                </td>
              )}
              <td className="px-4 py-2 text-center"> {bedrooms || 'X'}</td>
              <td className="px-4 py-2 text-center">{bathrooms || 'X'}</td>
              <td className="px-4 py-2 text-center">
                <p className="badge badge-secondary uppercase">{type}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
