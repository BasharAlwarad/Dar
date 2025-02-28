import React from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

export const Explore = () => {
  return (
    <div>
      <header>
        <h1 className="text-4xl m-4 text-center p-4">Explore Categories</h1>
      </header>
      <main className="flex w-full ">
        {/* slider */}
        <div className="card rounded-box grid h-20 flex-grow place-items-center">
          <Link to="/category/rent">
            <img
              src={rentCategoryImage}
              width={200}
              alt="rent Category Image"
            />
            <p className="text-center shadow-gray-400 shadow-sm">
              Places for rent
            </p>
          </Link>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="card rounded-box grid h-20 flex-grow place-items-center">
          <Link to="/category/sale">
            <img
              src={sellCategoryImage}
              width={200}
              alt="sell Category Image"
            />
            <p className="text-center shadow-gray-400 shadow-sm">
              Places for sale
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};
