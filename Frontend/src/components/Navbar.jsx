import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { use } from "react";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const {setShowLogin, user, logout, isOwner, axios, setIsOwner, notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead} = useAppContext();

  const location = useLocation();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const changeRole = async () => {
    try{
      const {data} = await axios.post('/api/owner/change-role')
      console.log(data)
      if(data.success){
        setIsOwner(true)
        toast.success(data.message)
      }
    }
    catch(err){
      console.log(err.message)
      toast.error(err.message)
    }
  }

  return (
    //Navbar Container

    <div
      className={`flex items-center justify-around px-6 md:px-16 lg:px-24 xl:px-30 py-4 text-gray-600 bg-blue-400 border-b border-borderColor sticky top-0 z-20 transition-all  ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      <Link to={"/"}>
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
            to={link.path}
            className="mx-4 text-gray-700 hover:text-blue-600"
          >
            {link.name}
          </Link>
        ))}

        {user && (
          <>
            <Link
              to="/messages"
              onClick={() => {
                setNotifOpen(false);
                markAllNotificationsRead();
              }}
              className="mx-4 relative text-gray-700 hover:text-blue-600 font-medium"
              aria-label="Notifications"
            >
               Chats
               {unreadNotificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
            </Link>

            {/* <div className="relative">
              <button
                onClick={() => setNotifOpen((p) => !p)}
                className="mx-2 relative text-gray-700 hover:text-blue-600"
                aria-label="Notifications"
              >
                🔔
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
                  {notifications?.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => {
                          if (!notification.isRead) markNotificationRead(notification._id);
                          setNotifOpen(false);
                          navigate(`/messages?conversation=${notification.chatId}`);
                        }}
                        className={`p-3 cursor-pointer border-b hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                      >
                        <div className="text-sm font-semibold text-gray-800">
                          {notification.senderId?.name || 'New message'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{notification.text}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div> */}
          </>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto max-sm:mt-4 max-sm:pt-4 max-sm:border-t border-gray-200">
            <button onClick={() =>
              isOwner ?  navigate('/owner/dashboard') : changeRole()} className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 font-medium rounded-lg transition-colors duration-200 w-full sm:w-auto text-center">
              {isOwner ? 'Dashboard' : 'List Cars'}
            </button>
            <button onClick={() =>{ user ? logout() : setShowLogin(true)}} className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto text-center">
              {user ? 'Logout':'Login'}
            </button>
            
             {user?.name && <p><span className='text-xl'>Welcome, </span>
             <span>{user.name}</span>
             </p>}
        </div>

      </div>

        <button className="sm:hidden cursor-pointer" arial-label="Menu" onClick={() => setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>

    </div>
  );
};

export default Navbar;
