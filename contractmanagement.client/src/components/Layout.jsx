import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faProjectDiagram, faFileContract, faUserTie, 
  faFolder, faCalendarAlt, faUsers, faCog, faSignOutAlt, 
  faBars, faChevronDown, faUserCircle, faRocket
} from "@fortawesome/free-solid-svg-icons";

// Import แค่ Bootstrap JS พอ (CSS เราเขียนเองแล้ว)
import "bootstrap/dist/js/bootstrap.bundle.min"; 

const NavItem = ({ title, link, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === link;
  
  return (
    <Link to={link} className={`nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon"><FontAwesomeIcon icon={icon} /></span>
      <span>{title}</span>
    </Link>
  );
};

const CollapsableNavItem = ({ title, icon, children }) => {
  const location = useLocation();
  const isChildActive = React.Children.toArray(children).some(child => 
    child.props && child.props.to === location.pathname
  );
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => { if (isChildActive) setIsOpen(true); }, [location.pathname]);

  return (
    <div className="nav-group">
      <div 
        className={`nav-link ${isChildActive ? 'active' : ''} justify-content-between`} 
        onClick={() => setIsOpen(!isOpen)}
        style={{cursor: 'pointer'}}
      >
        <div className="d-flex align-items-center">
          <span className="nav-icon"><FontAwesomeIcon icon={icon} /></span>
          <span>{title}</span>
        </div>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '0.8em', transition: '0.3s' }} 
        />
      </div>
      
      {/* ส่วนเมนูย่อย */}
      {isOpen && (
        <div className="nav-group-children">
          {children}
        </div>
      )}
    </div>
  );
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username, setUsername] = useState('User');
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    setUsername(localStorage.getItem('username') || 'Admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="app-container">
      
      {/* 1. SIDEBAR (เมนูซ้าย) */}
      {/* ลบ class bootstrap ที่ซ่อนเมนูออก เพื่อให้ CSS .sidebar ทำงานเต็มที่ */}
      <aside className={`sidebar ${isSidebarOpen ? 'show' : ''} d-none d-lg-flex`}>
        <div className="sidebar-header">
           <FontAwesomeIcon icon={faRocket} className="me-3" style={{color: '#3B82F6', fontSize: '1.8rem'}} /> 
           <span className="brand-text">Innovation</span>
        </div>

        <div className="sidebar-content">
          <small className="text-uppercase fw-bold text-muted mb-2 d-block px-3" style={{fontSize: '0.7rem', letterSpacing: '1px'}}></small>
          
          <NavItem title="Dashboard" link="/dashboard" icon={faTachometerAlt} />
          <NavItem title="โครงการ" link="/projects" icon={faProjectDiagram} />
          <NavItem title="สัญญาโครงการ" link="/contracts" icon={faFileContract} />
          <NavItem title="ลูกค้า" link="/customers" icon={faUserTie} />
          <NavItem title="ISO Document" link="/iso-document" icon={faFolder} />
          <NavItem title="Calendar" link="/calendar" icon={faCalendarAlt} />
          
          <div className="my-4 border-top border-secondary opacity-25 mx-2"></div>
          
          <small className="text-uppercase fw-bold text-muted mb-2 d-block px-3" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Admin Tools</small>
          <NavItem title="Users" link="/users" icon={faUsers} />

          <CollapsableNavItem title="Settings" icon={faCog}>
              <Link className="nav-link" to="/settings/project-type" style={{fontSize:'0.9rem', paddingLeft: '1rem'}}>ประเภทโครงการ</Link>
              <Link className="nav-link" to="/settings/expense-type" style={{fontSize:'0.9rem', paddingLeft: '1rem'}}>ประเภทการเบิกจ่าย</Link>
              <Link className="nav-link" to="/settings/equipment-type" style={{fontSize:'0.9rem', paddingLeft: '1rem'}}>ประเภทอุปกรณ์</Link>
          </CollapsableNavItem>
        </div>
      </aside>

      {/* 2. MAIN WRAPPER (ขวา) */}
      <div className="main-wrapper">
        
        {/* Topbar */}
        <header className="topbar">
            {/* ปุ่มเปิดเมนู (Mobile Only) */}
            <button className="btn d-lg-none me-auto" onClick={() => setSidebarOpen(!isSidebarOpen)}>
               <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Profile */}
            <div className="dropdown">
              <div className="d-flex align-items-center" role="button" data-bs-toggle="dropdown" style={{cursor: 'pointer'}}>
                 <div className="me-3 text-end d-none d-md-block">
                    <div className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{username}</div>
                    <div className="text-muted" style={{fontSize: '0.75rem'}}>Administrator</div>
                 </div>
                 <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px'}}>
                    <FontAwesomeIcon icon={faUserCircle} className="text-secondary" size="lg" />
                 </div>
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" style={{minWidth: '200px'}}>
                <li><button className="dropdown-item rounded text-danger" onClick={() => setShowLogoutModal(true)}>
                   <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
                </button></li>
              </ul>
            </div>
        </header>

        {/* Content Area */}
        <div className="page-content">
            {children}
        </div>

      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <>
            <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}></div>
            <div className="modal fade show" style={{display: 'block'}}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header border-0 pb-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold">Confirm Logout</h5>
                            <button className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
                        </div>
                        <div className="modal-body px-4 text-muted">
                            Are you sure you want to end your current session?
                        </div>
                        <div className="modal-footer border-0 px-4 pb-4">
                            <button className="btn btn-light px-4 rounded-3" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="btn btn-danger px-4 rounded-3" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default Layout;