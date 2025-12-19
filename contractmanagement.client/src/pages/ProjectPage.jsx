import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 1. เพิ่ม useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faCalendarAlt, faChevronDown 
} from "@fortawesome/free-solid-svg-icons";

// ไม่ต้อง import SaveModal แล้ว เพราะไม่ได้ใช้หน้านี้

const API_BASE_URL = "http://localhost:5056/api"; 

const ProjectPage = () => {
  const navigate = useNavigate(); // ✅ 2. สร้าง Hook สำหรับเปลี่ยนหน้า
  const [data, setData] = useState([]);

  // --- Functions ---
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Projects`);
      if (response.ok) {
        const result = await response.json();
        const mappedData = result.map(item => ({
            id: item.id,
            code: item.projectId,   
            name: item.projectName,            
            unit: item.customerName || 'กทม.', 
            createdBy: item.createdBy || 'Admin', 
            date: item.createdDate ? new Date(item.createdDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
            status: item.projectStatus || 'จัดทำโครงการ',
            isActive: true 
        }));
        setData(mappedData);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบโครงการนี้ใช่หรือไม่?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/Projects/${id}`, { method: 'DELETE' });
        if (response.ok) fetchProjects(); 
        else alert("ไม่สามารถลบข้อมูลได้");
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  }

  useEffect(() => {
    fetchProjects();
    // ลบ fetchMasterData ออก เพราะหน้านี้แค่โชว์ลิสต์ ไม่ได้ใช้ Dropdown ประเภทโครงการ
  }, []);

  // ฟังก์ชันแสดงสี Status
  const renderStatusBadge = (status) => {
    let config = { bg: '#e8f0fe', color: '#1a73e8', dot: '#1a73e8' }; 

    if (status === 'ร่าง TOR' || status === 'ร่างTOR') {
      config = { bg: '#fff7ed', color: '#ea580c', dot: '#ea580c' }; 
    } else if (status === 'ยื่นข้อเสนอ') {
      config = { bg: '#f5f3ff', color: '#7c3aed', dot: '#7c3aed' }; 
    } else if (status === 'ดำเนินงาน') {
      config = { bg: '#ecfdf5', color: '#059669', dot: '#059669' }; 
    }

    return (
      <span className="badge rounded-pill fw-medium border-0"
          style={{ 
            backgroundColor: config.bg, 
            color: config.color, 
            fontSize: '0.75rem', 
            padding: '8px 16px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
          <span style={{width:'8px', height:'8px', backgroundColor: config.dot, borderRadius:'50%', display:'inline-block'}}></span>
          {status}
      </span>
    );
  };

  return (
  <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    
    <div className="d-flex justify-content-between align-items-end mb-4">
      <div>
          <h2 className="fw-bold mb-1" style={{ color: '#000000' }}>โครงการ</h2>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>จัดการและติดตามสถานะข้อมูลโครงการทั้งหมดในระบบ</span>
      </div>
      
      {/* ✅ 3. แก้ปุ่ม เพิ่มโครงการ ให้ลิ้งค์ไปหน้าใหม่แทนการเปิด Modal */}
      <button 
        className="btn btn-primary fw-bold shadow-sm px-4 py-2" 
        style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', borderRadius: '8px' }} 
        onClick={() => navigate('/create-project')} 
      >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มโครงการ
      </button>
    </div>

    {/* Filter Bar */}
    <div className="card border-0 shadow-sm mb-4 rounded-3 bg-white">
      <div className="card-body p-3">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <div className="bg-light border rounded px-3 py-2 d-flex align-items-center" style={{ minWidth: '120px', cursor: 'pointer', borderColor: '#e2e8f0' }}>
              <FontAwesomeIcon icon={faCalendarAlt} className="text-muted me-2"/> 
              <span className="fw-bold text-dark me-auto">2568</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-muted ms-2" style={{ fontSize: '0.8rem' }}/> 
          </div>

          <div className="flex-grow-1"></div>

          <div className="position-relative" style={{ width: '300px' }}>
              <FontAwesomeIcon icon={faSearch} className="text-muted position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" className="form-control ps-5 border border-light-subtle bg-light text-dark" placeholder="ค้นหาชื่อหรือรหัสโครงการ..." style={{ borderRadius: '8px', height: '42px', fontSize: '0.9rem' }} />
          </div>
          
          <button className="btn btn-dark px-4 fw-bold shadow-sm" style={{ backgroundColor: '#0f172a', borderRadius: '8px', height: '42px' }}>
              ค้นหา
          </button>
        </div>
      </div>
    </div>

    {/* Table */}
    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th className="py-3 ps-4 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '35%' }}>ชื่อโครงการ</th>
                <th className="py-3 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '15%' }}>หน่วยงาน</th>
                <th className="py-3 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '10%' }}>วันที่สร้าง</th>
                <th className="py-3 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '15%' }}>สร้างโดย</th>
                <th className="py-3 text-center text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '15%' }}>สถานะ</th>
                <th className="py-3 text-center text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '10%' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="py-3 ps-4">
                      <div className="d-flex flex-column">
                          <span className="text-muted small mb-1">{item.code}</span>
                          <span className="fw-bold text-dark">{item.name}</span>
                      </div>
                  </td>
                  <td className="py-3 text-dark small">{item.unit}</td>
                  <td className="py-3 text-dark small">{item.date}</td>
                  <td className="py-3 text-dark small">{item.createdBy}</td>
                  <td className="py-3 text-center">{renderStatusBadge(item.status)}</td>
                  
                  <td className="py-3 text-center">
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-dark hover-shadow"
                          onClick={() => alert('แก้ไข (Mock)')}
                          style={{ width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <FontAwesomeIcon icon={faEdit} size="sm" />
                        </button>
                        <button 
                          className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-danger hover-shadow" 
                          onClick={() => handleDelete(item.id)}
                          style={{ width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-5 text-dark">ไม่พบข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-top d-flex align-items-center bg-white">
            <button className="btn btn-light border me-2" style={{width:'36px', height:'36px'}} disabled>
                <FontAwesomeIcon icon={faChevronDown} rotation={90} className="small text-secondary"/>
            </button>
            <button className="btn btn-dark border fw-bold me-2" style={{width:'36px', height:'36px', backgroundColor:'#000000', borderColor:'#000000'}}>1</button>
            <button className="btn btn-primary ms-auto" style={{width:'36px', height:'36px', backgroundColor: '#3b82f6', borderColor:'#3b82f6'}}>
                <FontAwesomeIcon icon={faChevronDown} rotation={270} className="small text-white"/>
            </button>
        </div>
      </div>

      {/* ✅ 4. ลบ Code Modal และ SaveModal ออกไปทั้งหมดจากตรงนี้ */}

    </div>
  );
};

export default ProjectPage;