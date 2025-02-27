import { useEffect } from 'react';
import { FaMoon, FaSun, FaRobot } from 'react-icons/fa';
import { IoMdNuclear } from 'react-icons/io';
import { GiCircuitry } from 'react-icons/gi';

export const Themes = () => {
  const themes = [
    { name: 'myDarkTheme', Icon: FaMoon, color: 'text-black' },
    { name: 'light', Icon: FaSun, color: 'text-pink-500' },
    { name: 'cyberpunk', Icon: FaRobot, color: 'text-yellow-500' },
    { name: 'luxury', Icon: IoMdNuclear, color: 'text-green-500' },
    { name: 'synthwave', Icon: GiCircuitry, color: 'text-blue-500' },
  ];

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const changeTheme = (name) => {
    localStorage.setItem('theme', name);
    document.documentElement.setAttribute('data-theme', name);
  };

  return (
    <div className="drawer drawer-end w-[10%] justify-end ">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">
          <FaMoon
            className="text-black
              "
          />
        </label>
      </div>
      <div className="drawer-side z-10 mt-[10%]">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-40 p-4">
          {themes.map(({ name, Icon, color }) => (
            <li key={name} onClick={() => changeTheme(name)}>
              <Icon className={`pr-2 text-5xl ${color}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
{
  /* <summary className="btn radio-lg radio-primary">
  <FaMoon
  className="text-black
  "
  />
  </summary> */
}
{
  /* <ul className="w-[5rem] mt-1 menu dropdown-content bg-base-100 rounded-box z-[1] shadow">
    {themes.map(({ name, Icon, color }) => (
      <li key={name} onClick={() => changeTheme(name)}>
      <Icon className={`pr-2 text-5xl ${color}`} />
      </li>
    ))}
    </ul> */
}

{
  /* <details className="dropdown w-[2rem] ml-2">
      </details> */
}
