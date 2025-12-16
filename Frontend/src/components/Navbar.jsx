import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { use } from "react";
import { useState } from "react";

const Navbar = ({setShowLogin}) => {
  const location = useLocation();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);

  return (
    //Navbar Container

    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      <Link>
        <img src={assets.logo} alt="Logo" className="h-8" />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:left-0 max-sm:right-auto" : "max-sm:right-0 max-sm:left-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className="mx-4 text-gray-700 hover:text-blue-600"
          >
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-full hover:bg-gray-100 focus-within:bg-white focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md">
            <input 
              type="text" 
              className="py-1.5 px-1 w-full bg-transparent outline-none placeholder-gray-400 text-gray-700 font-medium focus:placeholder-gray-500" 
              placeholder="Search cars..." 
            />
            <img src={assets.search_icon} alt="search" className="h-5 w-5 cursor-pointer opacity-60 hover:opacity-100" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto max-sm:mt-4 max-sm:pt-4 max-sm:border-t border-gray-200">
            <button onClick={() => navigate('/owner')} className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 font-medium rounded-lg transition-colors duration-200 w-full sm:w-auto text-center">
              Dashboard
            </button>
            <button onClick={() => setShowLogin(true)} className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto text-center">
              Login
            </button>
        </div>

      </div>

        <button className="sm:hidden cursor-pointer" arial-label="Menu" onClick={() => setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>

    </div>
  );
};

export default Navbar;
