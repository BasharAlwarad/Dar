import { NavLink } from 'react-router-dom';
// import { useAuthContext } from '../contexts/userContext';
import { Themes } from './Themes';
import { localOfferIcon } from '../assets/index.js';

export const Nav = () => {
  //   const { user } = useAuthContext();

  const activeLink = ({ isActive }) =>
    isActive ? 'btn btn-ghost text-primary font-bold' : 'btn btn-ghost';
  return (
    <nav className="px-4 navbar bg-base-100">
      <div className="navbar-start">
        <NavLink to="/" className={activeLink}>
          Dar
          <img src={localOfferIcon} alt="localOfferIcon" />
        </NavLink>
      </div>
      <div className="hidden navbar-center lg:flex">
        <ul className="px-1 menu menu-horizontal">
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/offer">Offer</NavLink>
          </li>
          <li>
            <NavLink to="/explore">Explore</NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <NavLink to="/signin">
          {/* {user ? 'Logout' : 'Login'} */}
          Login
        </NavLink>
        <Themes />
      </div>
    </nav>
  );
};
