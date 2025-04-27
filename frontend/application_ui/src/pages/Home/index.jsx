import './styles.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTemplates } from '../../apis/callers';
import Navbar from '../../components/Navbar';

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    const loadTemplates = async () => {
      if (!accessToken) return;
      try {
        const res = await fetchTemplates();
        if (res.message === 'success') {
          setTemplates(res.templates);
          setUserName(
            res.user_name ||
            localStorage.getItem('userName') ||
            sessionStorage.getItem('userName') ||
            ''
          );
        } else {
          setError('Không thể lấy danh sách template');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải templates');
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, [accessToken]);


  const handleCreateVM = (template) => {
    navigate(`/regist-vm/${template['vmid']}`, {state: template});
  };

  const openTemplateDetail = (template) => {
    setSelectedTemplate(template);
    document.body.style.overflow = 'hidden';
  };

  const closeTemplateDetail = () => {
    setSelectedTemplate(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="home-container">

      <main>
        <h1>Danh Sách Templates</h1>

        {loading ? (
          <div className="loader"></div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : templates.length === 0 ? (
          <p>Không có template nào.</p>
        ) : (
          <div className="templates-grid">
            {templates.map((template) => (
              <div
                key={template.vmid}
                className="template-card"
                onClick={() => openTemplateDetail(template)}
              >
                <h2>{template.name}</h2>
                <p>OS: {template.os_type || 'Unknown'}</p>
                <p>CPU: {template.cpu} vCPU</p>
                <p>RAM: {template.memory_mb} MB</p>
                <p>Disk: {template.disk_size_gb} GB</p>
                <p className="view-details">Xem chi tiết</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal chi tiết template */}
      {selectedTemplate && (
        <div className="modal-overlay" onClick={closeTemplateDetail}>
          <div className="modal-content bg-white" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedTemplate.name}</h2>
            <table className="template-table">
              <tbody>
                <tr>
                  <td>CPU:</td>
                  <td>{selectedTemplate.cpu} vCPU</td>
                </tr>
                <tr>
                  <td>RAM:</td>
                  <td>{selectedTemplate.memory_mb} MB</td>
                </tr>
                <tr>
                  <td>Disk:</td>
                  <td>{selectedTemplate.disk_size_gb} GB</td>
                </tr>
                <tr>
                  <td>OS:</td>
                  <td>{selectedTemplate.os_type}</td>
                </tr>
                <tr>
                  <td>Node:</td>
                  <td>{selectedTemplate.node}</td>
                </tr>
              </tbody>
            </table>
            <button
              className="create-vm-button"
              onClick={() => handleCreateVM(selectedTemplate)}
            >
              Tạo Máy Ảo
            </button>
            <button className="close-button" onClick={closeTemplateDetail}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
