import './styles.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useContext } from 'react';
import UserContext from '../../context/user';

const Navbar = () => {
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext)
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
  }
  
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        MyCloud
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <div className="user-info">
              <FaUserCircle className="user-icon" />
              <span className="user-name">{user['username']}</span>
              <span className='ms-2'>{user['wallet']}</span>
            </div>
            <div className="nav-buttons">
              <Link to={'/vms'} >Danh sách máy ảo</Link>
            </div>
            <div className="nav-buttons">
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          </>
        ) : (
          <div className="nav-buttons">
            <button onClick={() => navigate('/login')}>Đăng nhập</button>
            <button onClick={() => navigate('/register')}>Đăng ký</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
