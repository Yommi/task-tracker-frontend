import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NavBar = ({ page, setPage, token }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tokenForCheck = localStorage.getItem('token');

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setPage('dashboard');
    } else if (location.pathname === '/task-list') {
      setPage('task-list');
    } else if (location.pathname === '/') {
      setPage('');
    }
  }, [location]);

  return (
    <div className="flex justify-between border-2 border-gray-300">
      <div className="flex py-5 px-14 justify-between gap-4">
        <header
          style={{ color: page !== 'dashboard' ? '' : '#7c3aed' }}
          className="mr-10 font-bold"
        >
          <Link to={tokenForCheck ? '/dashboard' : '/'}>Dashboard</Link>
        </header>
        <header
          style={{ color: page !== 'task-list' ? '' : '#7c3aed' }}
          className="font-bold"
        >
          <Link to={tokenForCheck ? '/task-list' : '/'}>Task List</Link>
        </header>
      </div>
      <div className="my-auto">
        {page !== '' ? (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="mr-4 py-2 px-4 rounded bg-[#5a52c3] text-white"
          >
            Sign Out
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default NavBar;
