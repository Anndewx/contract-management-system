import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBorderAll, faProjectDiagram, faFileContract, faUserTie, 
  faFolder, faCalendarAlt, faUsers, faCog, faSignOutAlt, 
  faBars, faChevronDown, faLayerGroup
} from "@fortawesome/free-solid-svg-icons";

import "bootstrap/dist/js/bootstrap.bundle.min"; 

// --- 1. NavItem Component ---
const NavItem = ({ title, link, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === link;
  
  return (
    <Link 
      to={link} 
      className={`nav-link ${isActive ? "active" : ""}`}
      style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} 
    >
      <span className="nav-icon"><FontAwesomeIcon icon={icon} /></span>
      <span>{title}</span>
    </Link>
  );
};

// --- 2. CollapsableNavItem Component ---
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
        style={{cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden'}}
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
      
      <div 
        className="nav-group-children"
        style={{
            maxHeight: isOpen ? '500px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// --- 3. Main Layout Component ---
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState('Guest');
  const [userRole, setUserRole] = useState('ผู้ใช้งานทั่วไป');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    
    const storedUser = localStorage.getItem('username');
    if (storedUser && storedUser !== 'undefined') {
        setUsername(storedUser);
    } else {
        setUsername('User'); 
    }

    const storedRole = localStorage.getItem('role');
    if (storedRole) {
        setUserRole(storedRole);
    } else {
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

  const isAdmin = userRole === 'ผู้ดูแลระบบ' || userRole === 'Administrator';

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
      
      {/* ----------------- 1. SIDEBAR ----------------- */}
      <aside 
        className="d-flex flex-column border-end shadow-sm"
        style={{
            width: isSidebarOpen ? '260px' : '0px',       
            minWidth: isSidebarOpen ? '260px' : '0px',    
            backgroundColor: '#1e293b',                   
            color: '#fff',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)', 
            overflow: 'hidden',                           
            whiteSpace: 'nowrap',
            zIndex: 1000
        }}
      >
        <div className="sidebar-header d-flex align-items-center px-4 py-4" style={{ height: '80px', minHeight: '80px' }}>
           <FontAwesomeIcon icon={faLayerGroup} className="me-3" style={{color: '#3B82F6', fontSize: '1.8rem'}} /> 
           <span className="brand-text fw-bold fs-4">Innovation</span>
        </div>

        <div className="sidebar-content flex-grow-1 overflow-auto px-2 pb-4 custom-scrollbar">
          <small className="text-uppercase fw-bold text-muted mb-2 d-block px-3 mt-3" style={{fontSize: '0.7rem', letterSpacing: '1px'}}></small>
          
          <NavItem title="Dashboard" link="/dashboard" icon={faBorderAll} />
          <NavItem title="โครงการ" link="/projects" icon={faProjectDiagram} />
          <NavItem title="สัญญาโครงการ" link="/contracts" icon={faFileContract} />
          <NavItem title="ลูกค้า" link="/customers" icon={faUserTie} />
          <NavItem title="ISO Document" link="/iso-document" icon={faFolder} />
          <NavItem title="Calendar" link="/calendar" icon={faCalendarAlt} />
          
          <div className="my-4 border-top border-secondary opacity-25 mx-2"></div>
          
         {isAdmin && (
            <>
              <small className="text-uppercase fw-bold text-muted mb-2 d-block px-3" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Admin Tools</small>
              <NavItem title="Users" link="/users" icon={faUsers} />
              <CollapsableNavItem title="Settings" icon={faCog}>
                  <Link className="nav-link text-white-50" to="/settings/project-type" style={{fontSize:'0.9rem', paddingLeft: '3rem'}}>ประเภทโครงการ</Link>
                  <Link className="nav-link text-white-50" to="/settings/expense-type" style={{fontSize:'0.9rem', paddingLeft: '3rem'}}>ประเภทการเบิกจ่าย</Link>
                  <Link className="nav-link text-white-50" to="/settings/equipment-type" style={{fontSize:'0.9rem', paddingLeft: '3rem'}}>ประเภทอุปกรณ์</Link>
              </CollapsableNavItem>
            </>
          )}
        </div>
      </aside>

      {/* ----------------- 2. MAIN CONTENT ----------------- */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, transition: 'margin-left 0.4s ease' }}>
        
        {/* ✅ Topbar: ใช้ justify-content-between เพื่อดันซ้าย-ขวาออกจากกัน */}
        <header className="topbar d-flex justify-content-between align-items-center bg-white px-4 py-3 border-bottom shadow-sm" style={{ height: '80px', zIndex: 100 }}>
            
            {/* ⬅️ ฝั่งซ้าย: ปุ่มเมนู Hamburger (ลบปฏิทินออกแล้ว) */}
            <div className="d-flex align-items-center gap-3">
                <button 
                    className="btn border-0 d-flex align-items-center justify-content-center" 
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'transparent',  
                        color: '#334155',            
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.color = '#0f172a';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#334155';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <FontAwesomeIcon icon={faBars} style={{ fontSize: '1.25rem' }} />
                </button>
            </div>

            {/* ➡️ ฝั่งขวา: โปรไฟล์ (ลบช่องค้นหาออกแล้ว) */}
            <div className="d-flex align-items-center"> 
                <div className="dropdown">
                    <div className="d-flex align-items-center" role="button" data-bs-toggle="dropdown" style={{cursor: 'pointer'}}>
                        <div className="me-3 text-end d-none d-md-block">
                            <div className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{username}</div>
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
        <div className="page-content p-4 flex-grow-1 overflow-auto bg-light">
            {children}
        </div>

      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <>
            <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}></div>
            <div className="modal fade show" style={{display: 'block', zIndex: 1060}}>
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

      {/* CSS Injection */}
      <style>{`
        .nav-link {
            color: #cbd5e1;
            padding: 12px 20px;
            margin: 4px 12px;
            border-radius: 8px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
        }
        .nav-link:hover {
            color: #fff;
            background-color: rgba(255, 255, 255, 0.1);
        }
        .nav-link.active {
            color: #fff;
            background-color: #3b82f6;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
        }
        .nav-icon {
            width: 24px;
            margin-right: 12px;
            display: inline-block;
            text-align: center;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default Layout;