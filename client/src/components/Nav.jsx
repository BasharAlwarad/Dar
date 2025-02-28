import { NavLink } from 'react-router-dom';
// import { useAuthContext } from '../contexts/userContext';
import { Themes } from './Themes';
import { exploreIcon, localOfferIcon, personIcon } from '../assets/index.js';

export const Nav = () => {
  //   const { user } = useAuthContext();

  const navClass = (isActive) =>
    `btn flex flex-col items-center justify-center gap-1 p-2 rounded-md ${
      isActive ? 'btn-primary' : 'btn-ghost'
    }`;

  return (
    <nav className="px-4 navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <NavLink to="/" className={({ isActive }) => navClass(isActive)}>
          <p className="text-sm">Dar Explore</p>
          <img src={exploreIcon} alt="exploreIcon" className="w-6 h-6" />
        </NavLink>
      </div>
      <div className="hidden navbar-center lg:flex">
        <ul className="px-1 menu menu-horizontal space-x-6">
          <li>
            <NavLink
              to="/offers"
              className={({ isActive }) => navClass(isActive)}
            >
              <p className="text-sm">Offers</p>
              <img src={localOfferIcon} alt="Offers" className="w-6 h-6" />
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end  flex items-center justify-end gap-4 ">
        <NavLink to="/profile" className={({ isActive }) => navClass(isActive)}>
          <p className="text-sm">Profile</p>
          <img src={personIcon} alt="personIcon" className="w-6 h-6" />
        </NavLink>
        <Themes />
      </div>
    </nav>
  );
};
