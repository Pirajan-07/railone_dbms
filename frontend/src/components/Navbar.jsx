import { Link, useNavigate } from 'react-router-dom';
import { Train } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfoInfo = localStorage.getItem('userInfo');
  const userInfo = userInfoInfo ? JSON.parse(userInfoInfo) : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="bg-[#2563eb] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 no-underline text-white hover:text-gray-200 transition-colors">
            <Train className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight">RailOne</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/trains" className="text-white hover:text-[#dbeafe] transition-colors">Search Trains</Link>
            <Link to="/pnr" className="text-white hover:text-[#dbeafe] transition-colors">PNR Status</Link>
            {userInfo ? (
              <>
                <Link to="/my-bookings" className="text-white hover:text-[#dbeafe] transition-colors">My Bookings</Link>
                <Link to="/profile" className="text-white hover:text-[#dbeafe] transition-colors">Profile</Link>
                {userInfo.isAdmin && (
                  <Link to="/admin" className="text-white hover:text-[#dbeafe] transition-colors font-semibold">Admin</Link>
                )}
                <button 
                  onClick={logoutHandler} 
                  className="bg-white text-[#2563eb] hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-[#dbeafe] transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-[#2563eb] hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
