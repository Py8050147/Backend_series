
// import { navigationItem } from '../constant';
import Logout from '../components/Logout';
import  { navigationItem } from '../constant'
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <div className='container py-5 ring-1 ring-gray-400/50 mx-auto max-w-full fixed top-0 z-50 bg-slate-700/20 backdrop-blur-sm shadow-2xl shadow-gray-700'>
      <nav className='px-28 relative flex items-center justify-between'>
        <div className='text-xl font-inter font-weight uppercase -tracking-normal'>logo</div>
        <div>
          <ul className='flex items-center justify-center space-x-10 font-inter'>
            {navigationItem.map((item) => (
              <li
                key={item.id}
                className={`block py-2 px-3 ring-1 ring-gray-300/30 rounded-lg  shadow-xl shadow-black/35 ${item.isActive ? 'text-orange-800' : 'text-gray-300'} cursor-pointer hover:text-orange-800 text-base font-medium capitalize`}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className=''>
          <Link to='register' className='button mr-8 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            Sign-up
          </Link>
          
          <Link to="login" className='button mr-8 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            Sign-in
          </Link>
          <Link to="refresh-Token" className='button mr-8 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            refreshToken
          </Link>
          <Link to="profile" className='button mr-8 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            profile
          </Link>
          <Link to="logout" className='button mr-8 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            <Logout />
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
