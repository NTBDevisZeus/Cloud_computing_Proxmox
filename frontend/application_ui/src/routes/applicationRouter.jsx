import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthenticatedRoute from './authenticatedRoute';
import ApplicationLayout from '../components/AppicationLayout';
import VMList from '../pages/VMList';
import RegistVM from '../pages/RegistVM';

const ApplicationRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout bọc ngoài */}
        <Route element={<ApplicationLayout />}>
          {/* Home là trang mặc định */}
          <Route index element={<Home />} />
          {/* Các route public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Các route yêu cầu đăng nhập */}
          <Route
            path="/vms"
            element={
              <AuthenticatedRoute>
                <VMList />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/regist-vm/:templateid"
            element={
              <AuthenticatedRoute>
                <RegistVM />
              </AuthenticatedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default ApplicationRouter;
