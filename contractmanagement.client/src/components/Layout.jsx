import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBorderAll, faProjectDiagram, faFileContract, faUserTie, 
  faFolder, faCalendarAlt, faUsers, faCog, faSignOutAlt, 
  faBars, faChevronDown, faLayerGroup,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // --- ส่วนจัดการข้อมูล User ---
  const [username, setUsername] = useState('Guest');
  const [userRole, setUserRole] = useState('ผู้ใช้งานทั่วไป'); // ตั้ง Default เป็นภาษาไทย

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    
    // 1. ดึงชื่อ
    const storedUser = localStorage.getItem('username');
    if (storedUser && storedUser !== 'undefined') {
        setUsername(storedUser);
    } else {
        setUsername('User'); 
    }

    // 2. ดึง Role
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
        setUserRole(storedRole);
    } else {
        // Fallback: ถ้าไม่มี Role ให้เช็คจากชื่อ (กำหนดให้เป็นภาษาไทย)
        if (storedUser && storedUser.toLowerCase().includes('admin')) {
            setUserRole('ผู้ดูแลระบบ');
        } else {
            setUserRole('ผู้ใช้งานทั่วไป');
        }
    }

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role'); 
    navigate('/');
  };

  // ฟังก์ชันเช็คว่าเป็น Admin หรือไม่ (รองรับทั้งไทยและอังกฤษ กันเหนียว)
  const isAdmin = userRole === 'ผู้ดูแลระบบ' || userRole === 'Administrator';

  return (
    <div className="app-container">
      
      {/* 1. SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'show' : ''} d-none d-lg-flex`}>
        <div className="sidebar-header">
           <FontAwesomeIcon icon={faLayerGroup} className="me-3" style={{color: '#3B82F6', fontSize: '1.8rem'}} /> 
           <span className="brand-text">Innovation</span>
        </div>

        <div className="sidebar-content">
          <small className="text-uppercase fw-bold text-muted mb-2 d-block px-3" style={{fontSize: '0.7rem', letterSpacing: '1px'}}></small>
          
          <NavItem title="Dashboard" link="/dashboard" icon={faBorderAll} />
          <NavItem title="โครงการ" link="/projects" icon={faProjectDiagram} />
          <NavItem title="สัญญาโครงการ" link="/contracts" icon={faFileContract} />
          <NavItem title="ลูกค้า" link="/customers" icon={faUserTie} />
          <NavItem title="ISO Document" link="/iso-document" icon={faFolder} />
          <NavItem title="Calendar" link="/calendar" icon={faCalendarAlt} />
          
          <div className="my-4 border-top border-secondary opacity-25 mx-2"></div>
          
         {/* แก้ไขเงื่อนไขตรงนี้ให้เช็คจากฟังก์ชัน isAdmin */}
         {isAdmin && (
            <>
              <small className="text-uppercase fw-bold text-muted mb-2 d-block px-3" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Admin Tools</small>
              
              <NavItem title="Users" link="/users" icon={faUsers} />

              <CollapsableNavItem title="Settings" icon={faCog}>
                  <Link className="nav-link" to="/settings/project-type" style={{fontSize:'0.9rem', paddingLeft: '1rem'}}>ประเภทโครงการ</Link>
                  <Link className="nav-link" to="/settings/expense-type" style={{fontSize:'0.9rem', paddingLeft: '1rem'}}>ประเภทการเบิกจ่าย</Link>
                  <Link className="nav-link" to="/settings/equipment-type" style={{fontSize:'0.9rem', paddingLeft: '1rem'}}>ประเภทอุปกรณ์</Link>
              </CollapsableNavItem>
            </>
          )}
        </div>
      </aside>

      {/* 2. MAIN WRAPPER */}
      <div className="main-wrapper">
        
        {/* Topbar */}
        <header className="topbar d-flex justify-content-between align-items-center bg-white px-4 py-3 border-bottom" style={{ height: '80px' }}>
            
            <div className="d-flex align-items-center gap-3">
                <button className="btn d-lg-none" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                    <FontAwesomeIcon icon={faBars} />
                </button>

                <div className="d-flex align-items-center bg-white border rounded px-3 py-2" style={{ gap: '10px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#6b7280' }} />
                    <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>2568</span>
                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px', color: '#9ca3af' }} />
                </div>
            </div>

            <div className="d-flex align-items-center gap-4">
                <div className="d-none d-md-flex align-items-center px-3 py-2 rounded bg-light" style={{ width: '300px' }}>
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#9ca3af', marginRight: '10px' }} />
                    <input 
                        type="text" 
                        placeholder="ค้นหา..." 
                        className="bg-transparent border-0 w-100 text-dark"
                        style={{ outline: 'none', fontSize: '14px' }}
                    />
                </div>

                <div className="dropdown">
                    <div className="d-flex align-items-center" role="button" data-bs-toggle="dropdown" style={{cursor: 'pointer'}}>
                        <div className="me-3 text-end d-none d-md-block">
                            <div className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{username}</div>
                            {/* ตรงนี้จะแสดงภาษาไทยตามที่บันทึกไว้ใน Login.jsx เลย */}
                            <div className="text-muted" style={{fontSize: '0.75rem'}}>{userRole}</div>
                        </div>
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px', border: '1px solid #e5e7eb'}}>
                            <span className="text-primary fw-bold text-uppercase">{username.charAt(0)}</span>
                        </div>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" style={{minWidth: '200px'}}>
                        <li><button className="dropdown-item rounded text-danger" onClick={() => setShowLogoutModal(true)}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
                        </button></li>
                    </ul>
                </div>
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
                            <h5 className="modal-title fw-bold">ยืนยันการออกจากระบบ</h5>
                            <button className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
                        </div>
                        <div className="modal-body px-4 text-muted">
                            คุณต้องการออกจากระบบใช่หรือไม่?
                        </div>
                        <div className="modal-footer border-0 px-4 pb-4">
                            <button className="btn btn-light px-4 rounded-3" onClick={() => setShowLogoutModal(false)}>ยกเลิก</button>
                            <button className="btn btn-danger px-4 rounded-3" onClick={handleLogout}>ออกจากระบบ</button>
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