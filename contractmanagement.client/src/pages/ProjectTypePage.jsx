import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faFilter
} from "@fortawesome/free-solid-svg-icons";

// ⚠️ ตรวจสอบ Port ให้ตรงกับ Backend ของคุณ (เช่น 5037 หรือ 5056)
const API_BASE_URL = "http://localhost:5056/api";

const ProjectTypePage = () => {
  const [showModal, setShowModal] = useState(false);

  // --- State เก็บข้อมูลฟอร์ม ---
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  
  // State ข้อมูลจริงจาก DB
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 1. Fetch Data จาก API ---
  const fetchProjectTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ProjectType`);
      if (response.ok) {
        const result = await response.json();
        const mappedData = result.map(item => ({
            id: item.id || item.Id, 
            name: item.name,
            description: item.description,
            createdBy: item.createdBy || 'Admin',
            date: item.createdDate ? new Date(item.createdDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
            isActive: item.isActive
        }));
        setData(mappedData);
      } else {
        console.error("Failed to fetch project types");
      }
    } catch (err) {
      console.error("Error connecting to API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  // --- 2. เปิด Modal ---
  const handleOpenModal = () => {
    setFormData({ name: '', description: '', isActive: true });
    setError('');
    setShowModal(true);
  };

  // --- 3. บันทึกข้อมูล (POST) ---
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('กรุณาระบุชื่อประเภท');
      return; 
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        createdBy: "Admin" 
      };

      const response = await fetch(`${API_BASE_URL}/ProjectType`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchProjectTypes(); 
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("ไม่สามารถเชื่อมต่อ Server ได้");
    }
  };

  // --- 4. ลบข้อมูล (DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) return;

    // Optimistic Update: ลบออกจากหน้าจอก่อนทันที
    const previousData = [...data];
    setData(prev => prev.filter(item => item.id !== id));

    try {
      const response = await fetch(`${API_BASE_URL}/ProjectType/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log(`Deleted ID ${id} successfully`);
      } else if (response.status === 404) {
        console.warn(`ID ${id} was already deleted on server.`);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ ระบบจะคืนค่าข้อมูลเดิม");
      setData(previousData);
    }
  }

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 className="fw-bold mb-1" style={{ color: '#000000' }}>ประเภทโครงการ</h3>
            <span style={{ color: '#333333', fontSize: '0.9rem' }}>จัดการข้อมูลประเภทโครงการทั้งหมดในระบบ</span>
        </div>
        {/* 🔵 ปรับปุ่มเป็นสีฟ้า (เหมือน ExpenseTypePage) */}
        <button 
          className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center"
          style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', transition: 'all 0.2s' }}
          onClick={handleOpenModal}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> 
          <span className="d-none d-sm-inline">เพิ่มรายการใหม่</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm mb-4 rounded-3 bg-white">
        <div className="card-body p-3">
            <div className="row g-3 align-items-center">
                <div className="col-12 col-md-4">
                    <div className="position-relative">
                        <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#000000', pointerEvents: 'none' }} />
                        <input type="text" className="form-control" style={{ paddingLeft: '45px', height: '45px', borderColor: '#e2e8f0', color: '#000000', fontSize: '0.95rem', borderRadius: '8px', backgroundColor: '#f8fafc' }} placeholder="ค้นหาชื่อประเภท..." />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <select className="form-select text-dark" style={{ height: '45px', borderColor: '#e2e8f0', color: '#000000', borderRadius: '8px', cursor:'pointer' }}>
                        <option>สถานะทั้งหมด</option>
                        <option>ใช้งาน</option>
                        <option>ไม่ใช้งาน</option>
                    </select>
                </div>
                <div className="col-12 col-md-3">
                    <select className="form-select text-dark" style={{ height: '45px', borderColor: '#e2e8f0', color: '#000000', borderRadius: '8px', cursor:'pointer' }}>
                        <option>วันที่บันทึก (ล่าสุด)</option>
                        <option>วันที่บันทึก (เก่าสุด)</option>
                    </select>
                </div>
                <div className="col-12 col-md-2 text-end">
                    <button className="btn btn-light w-100 border text-dark fw-bold d-flex align-items-center justify-content-center" style={{ height: '45px', borderColor: '#e2e8f0', color: '#000000', borderRadius: '8px' }}>
                        <FontAwesomeIcon icon={faFilter} className="me-2" /> ล้างค่า
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ backgroundColor: '#f1f5f9' }}>
              <tr>
                <th className="py-3 ps-4" style={{ width: '5%' }}><input type="checkbox" className="form-check-input cursor-pointer" /></th>
                <th className="py-3 fw-bold text-uppercase" style={{ minWidth: '200px', color: '#000000', fontSize: '0.85rem' }}>ชื่อประเภท</th>
                <th className="py-3 fw-bold text-uppercase" style={{ minWidth: '150px', color: '#000000', fontSize: '0.85rem' }}>บันทึกโดย</th>
                <th className="py-3 fw-bold text-uppercase" style={{ minWidth: '120px', color: '#000000', fontSize: '0.85rem' }}>วันที่บันทึก</th>
                <th className="py-3 fw-bold text-uppercase text-center" style={{ minWidth: '100px', color: '#000000', fontSize: '0.85rem' }}>สถานะ</th>
                <th className="py-3 fw-bold text-uppercase text-center" style={{ minWidth: '100px', color: '#000000', fontSize: '0.85rem' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="6" className="text-center py-5">กำลังโหลดข้อมูล...</td></tr>
              ) : data.length === 0 ? (
                 <tr><td colSpan="6" className="text-center py-5">ไม่พบข้อมูล</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    <td className="py-3 ps-4"><input type="checkbox" className="form-check-input cursor-pointer" /></td>
                    
                    <td className="py-3">
                        <div className="fw-bold" style={{ color: '#000000', fontSize: '0.95rem' }}>{item.name}</div>
                    </td>

                    {/* 👤 เหลือเฉพาะชื่อผู้บันทึก */}
                    <td className="py-3">
                    <div className="d-flex align-items-center">
                    <span style={{ color: '#000000', fontSize: '0.9rem' }}>{item.createdBy}</span>
                    </div>
                  </td>

                    <td className="py-3" style={{ color: '#000000', fontSize: '0.9rem' }}>{item.date}</td>
                    
                    <td className="py-3 text-center">
                      {item.isActive ? (
                        <span className="badge rounded-pill fw-medium border-0" style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.75rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{width:'8px', height:'8px', backgroundColor:'#047857', borderRadius:'50%', display:'inline-block'}}></span>
                            เปิดใช้งาน
                        </span>
                      ) : (
                        <span className="badge rounded-pill fw-medium border-0" style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{width:'8px', height:'8px', backgroundColor:'#991b1b', borderRadius:'50%', display:'inline-block'}}></span>
                            ปิดใช้งาน
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-center">
                        <div className="btn-group">
                          <button className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-dark hover-shadow"><FontAwesomeIcon icon={faEdit} /></button>
                          <button 
                            className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-danger hover-shadow" 
                            onClick={() => handleDelete(item.id)}
                          >
                              <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="card-footer bg-white py-3 border-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div style={{ color: '#000000', fontSize: '0.85rem' }}>แสดง {data.length > 0 ? 1 : 0} ถึง {data.length} จาก {data.length} รายการ</div>
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled">
                        <a className="page-link border-0" href="#" style={{ color: '#000000' }}>Previous</a>
                    </li>
                    <li className="page-item active">
                        <a className="page-link border-0 rounded-3 shadow-sm px-3 fw-bold" href="#" style={{ backgroundColor: '#000000', color: '#fff' }}>1</a>
                    </li>
                    <li className="page-item disabled">
                        <a className="page-link border-0" href="#" style={{ color: '#000000' }}>Next</a>
                    </li>
                </ul>
            </nav>
        </div>
      </div>

      {/* --- Modal Popup --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{maxWidth: '700px'}}>
            <div className="modal-content border-0 shadow-lg rounded-4">
              
              {/* Header */}
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-5">
                <h4 className="modal-title fw-bold" style={{ color: '#000000' }}>เพิ่มประเภทโครงการ</h4>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              {/* Body */}
              <div className="modal-body px-5 py-4">
                <form>
                  {/* ชื่อประเภท */}
                  <div className="mb-4">
                    <label className="form-label fw-bold small" style={{ color: '#000000' }}>ชื่อประเภท</label>
                    <input 
                        type="text" 
                        className={`form-control form-control-lg fs-6 text-dark ${error ? 'is-invalid' : ''}`}
                        placeholder="Software" 
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if(error) setError('');
                        }}
                        style={{ borderRadius: '8px', padding: '12px 15px', borderColor: '#e2e8f0' }}
                    />
                    {error && <div className="text-danger small mt-1">{error}</div>}
                  </div>
                  
                  {/* แถวคู่ */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small" style={{ color: '#000000' }}>วันที่บันทึก</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={new Date().toLocaleDateString('en-GB')} 
                        disabled 
                        style={{ borderRadius: '8px', backgroundColor: '#f8fafc', color: '#000000', borderColor: '#e2e8f0' }} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small" style={{ color: '#000000' }}>บันทึกโดย</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value="Admin" 
                        disabled 
                        style={{ borderRadius: '8px', backgroundColor: '#f8fafc', color: '#000000', borderColor: '#e2e8f0' }} 
                      />
                    </div>
                  </div>
                  
                  {/* รายละเอียด */}
                  <div className="mb-4">
                    <label className="form-label fw-bold small" style={{ color: '#000000' }}>รายละเอียด</label>
                    <textarea 
                        className="form-control text-dark" 
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ borderRadius: '8px', borderColor: '#e2e8f0' }}
                    ></textarea>
                  </div>
                  
                  {/* Checkbox */}
                  <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="activeCheck" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        style={{ cursor: 'pointer', borderColor: '#000000' }}
                    />
                    <label className="form-check-label small fw-bold" htmlFor="activeCheck" style={{ cursor: 'pointer', color: '#000000' }}>
                        เปิดใช้งาน
                    </label>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="modal-footer border-top-0 px-5 pb-4 pt-0">
                 <div className="w-100 d-flex justify-content-end">
                    <button 
                        type="button" 
                        className="btn btn-dark fw-bold px-4 rounded-3" 
                        style={{ backgroundColor: '#000000', borderColor: '#000000', padding: '10px 24px' }}
                        onClick={handleSave}
                    >
                        บันทึก
                    </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
        </>
      )}

    </div>
  );
};

export default ProjectTypePage;