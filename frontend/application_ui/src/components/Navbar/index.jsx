import './styles.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, userName, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        MyCloud
      </div>
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <FaUserCircle className="user-icon" />
              <span className="user-name">{userName}</span>
            </div>
            <div className="nav-buttons">
              <button onClick={() => navigate('/create-vm')}>Tạo máy ảo</button>
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
