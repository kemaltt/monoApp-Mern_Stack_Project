import React from "react";
import HomeIcon from "../Icons/HomeIcon";
import StatistikIcon from "../Icons/StatistikIcon";
import PlusIcon from "../Icons/PlusIcon";
import WalletIcon from "../Icons/WalletIcon";
import ProfilIcon from "../Icons/ProfilIcon";
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <div className="fixed bottom-2.5 left-2.5 right-2.5 lg:bottom-5 lg:left-auto lg:right-5 lg:w-auto z-[999]">
      <nav className="bg-white rounded-full shadow-[0_0_30px_rgba(0,0,0,0.2)] p-2 lg:p-3 flex justify-evenly items-center lg:flex-col lg:gap-4 lg:shadow-[0_0_40px_rgba(0,0,0,0.3)] max-w-mobile mx-auto lg:max-w-none">
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `transition-all duration-500 active:scale-125 ${isActive ? '[&_svg]:fill-darkBlue' : ''}`
          }
        >
          <HomeIcon className="h-12 w-6 lg:h-14 lg:w-7" />
        </NavLink>

        <NavLink 
          to="/statistic" 
          className={({ isActive }) => 
            `transition-all duration-500 active:scale-125 ${isActive ? '[&_svg]:fill-darkBlue' : ''}`
          }
        >
          <StatistikIcon className="h-12 w-6 lg:h-14 lg:w-7" />
        </NavLink>

        <NavLink 
          to="/add" 
          className={({ isActive }) => 
            `transition-all duration-500 active:scale-125 ${isActive ? '[&_svg]:fill-darkBlue' : ''}`
          }
        >
          <div className="bg-darkBlue rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center [&_svg]:fill-white">
            <PlusIcon />
          </div>
        </NavLink>

        <NavLink 
          to="/wallet" 
          className={({ isActive }) => 
            `transition-all duration-500 active:scale-125 ${isActive ? '[&_svg]:fill-darkBlue' : ''}`
          }
        >
          <WalletIcon className="h-12 w-6 lg:h-14 lg:w-7" />
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `transition-all duration-500 active:scale-125 ${isActive ? '[&_svg]:fill-darkBlue' : ''}`
          }
        >
          <ProfilIcon className="h-12 w-6 lg:h-14 lg:w-7" />
        </NavLink>
      </nav>
    </div>
  );
};

export default Nav;
