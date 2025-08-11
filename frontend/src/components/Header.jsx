import { IoLogoYoutube, IoMdMic } from 'react-icons/io';
import { BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { IoMenu } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function Header({ toggleSidebar, setSearchQuery }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')); // get user from localStorage

  const handleSignInClick = () => {
    navigate('/auth'); // your auth/login page route
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white sticky top-0 shadow z-10">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4 w-60">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-700 hover:text-black"
        >
          <IoMenu />
        </button>

        <div
          onClick={handleLogoClick}
          className="flex items-center gap-1 text-red-600 text-2xl font-bold cursor-pointer"
        >
          <IoLogoYoutube />
          <span className="text-black text-lg">YouTube</span>
        </div>
      </div>

      {/* Center: Search Bar + Mic */}
      <div className="hidden sm:flex flex-1 justify-center max-w-3xl">
        <div className="flex items-center w-full border border-gray-300 rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-1 focus:outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100">
            <BsSearch />
          </button>
        </div>
        <button className="ml-2 p-2 rounded-full hover:bg-gray-100 text-xl">
          <IoMdMic />
        </button>
      </div>

      {/* Right: Options + Sign In / Username */}
      <div className="flex items-center gap-4 text-xl ml-4">
  {user ? (
    <>
      <span className="text-sm font-medium">Welcome, {user.username}</span>
      <button
        onClick={handleLogout}
        className="text-red-600 hover:text-red-800 text-sm font-bold ml-2 border border-red-600 px-2 rounded"
      >
        Logout
      </button>
    </>
  ) : (
          <button
            onClick={handleSignInClick}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50"
          >
            <CgProfile />
            <span className="text-sm font-medium">Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
