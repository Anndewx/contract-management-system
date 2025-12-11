import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faFilter, faCheckCircle, faTimesCircle 
} from "@fortawesome/free-solid-svg-icons";

const ProjectTypePage = () => {
  const [showModal, setShowModal] = useState(false);

  // Mock Data
  const [data, setData] = useState([
    { id: 1, name: 'Software Development', createdBy: 'Administrator', date: '17 เม.ย. 2025', status: true },
    { id: 2, name: 'Hardware Installation', createdBy: 'Administrator', date: '17 เม.ย. 2025', status: true },
    { id: 3, name: 'Service & Maintenance', createdBy: 'Administrator', date: '18 เม.ย. 2025', status: false },
    { id: 4, name: 'IT Consulting', createdBy: 'Manager', date: '19 เม.ย. 2025', status: true },
  ]);

  return (
    <div className="container-fluid p-0">
      
      {/* --- 1. Page Header --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>ประเภทโครงการ</h3>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>จัดการข้อมูลประเภทโครงการทั้งหมดในระบบ</span>
        </div>
        <button 
          className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center"
          style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', transition: 'all 0.2s' }}
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> 
          เพิ่มรายการใหม่
        </button>
      </div>

      {/* --- 2. Filter & Search Card (ส่วนนี้แก้ใหม่!) --- */}
      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body p-3">
            <div className="row g-3 align-items-center">
                
                {/* 🔍 Search Box (เทคนิค World Class: Icon ลอยข้างใน) */}
                <div className="col-12 col-md-4">
                    <div className="position-relative">
                        {/* ไอคอนแว่นขยาย (Absolute Position) */}
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            style={{ 
                                position: 'absolute', 
                                left: '16px', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                color: '#94a3b8',
                                pointerEvents: 'none' // ให้กดทะลุไปที่ input ได้
                            }} 
                        />
                        {/* ช่องกรอกข้อความ (padding-left เยอะๆ เพื่อเว้นที่ให้ไอคอน) */}
                        <input 
                            type="text" 
                            className="form-control" 
                            style={{ 
                                paddingLeft: '45px', // เว้นที่ให้แว่นขยาย
                                height: '45px',      // เพิ่มความสูงให้ดูโปร
                                borderColor: '#e2e8f0',
                                color: '#1e293b',
                                fontSize: '0.95rem',
                                borderRadius: '8px',
                                backgroundColor: '#f8fafc' // พื้นหลังเทาจางๆ
                            }}
                            placeholder="ค้นหาชื่อประเภท..." 
                        />
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <select 
                        className="form-select text-dark" 
                        style={{ height: '45px', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', cursor:'pointer' }}
                    >
                        <option>สถานะทั้งหมด</option>
                        <option>ใช้งาน</option>
                        <option>ไม่ใช้งาน</option>
                    </select>
                </div>
                <div className="col-6 col-md-3">
                    <select 
                        className="form-select text-dark" 
                        style={{ height: '45px', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', cursor:'pointer' }}
                    >
                        <option>วันที่บันทึก (ล่าสุด)</option>
                        <option>วันที่บันทึก (เก่าสุด)</option>
                    </select>
                </div>
                <div className="col-12 col-md-2 text-end">
                    <button 
                        className="btn btn-light w-100 border text-dark fw-bold d-flex align-items-center justify-content-center" 
                        style={{ height: '45px', borderColor: '#e2e8f0', color: '#475569', borderRadius: '8px' }}
                    >
                        <FontAwesomeIcon icon={faFilter} className="me-2" /> ล้างค่า
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- 3. Table Card --- */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ backgroundColor: '#f1f5f9' }}>
              <tr>
                <th className="py-3 ps-4" style={{ width: '5%' }}>
                    <input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} />
                </th>
                <th className="py-3 fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '30%' }}>ชื่อประเภท</th>
                <th className="py-3 fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '20%' }}>บันทึกโดย</th>
                <th className="py-3 fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '20%' }}>วันที่บันทึก</th>
                <th className="py-3 fw-bold text-uppercase text-center" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '15%' }}>สถานะ</th>
                <th className="py-3 fw-bold text-uppercase text-center" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '10%' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td className="py-3 ps-4">
                      <input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} />
                  </td>
                  <td className="py-3">
                      <div className="fw-bold" style={{ color: '#0f172a', fontSize: '0.95rem' }}>{item.name}</div>
                  </td>
                  <td className="py-3" style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.createdBy}</td>
                  <td className="py-3" style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.date}</td>
                  <td className="py-3 text-center">
                    <span 
                        className={`badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center ${item.status ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}
                        style={{ fontSize: '0.75rem' }}
                    >
                      <span className={`me-1 rounded-circle ${item.status ? 'bg-success' : 'bg-secondary'}`} style={{width:'6px', height:'6px'}}></span>
                      {item.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-primary hover-shadow" style={{borderColor: '#e2e8f0', width:'32px', height:'32px'}} title="แก้ไข">
                           <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-danger hover-shadow" style={{borderColor: '#e2e8f0', width:'32px', height:'32px'}} title="ลบ">
                           <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>แสดง 1 ถึง 4 จาก 4 รายการ</div>
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled"><a className="page-link border-0 text-secondary" href="#">Previous</a></li>
                    <li className="page-item active"><a className="page-link border-0 rounded-3 shadow-sm bg-primary fw-bold" href="#">1</a></li>
                    <li className="page-item"><a className="page-link border-0 text-secondary" href="#">2</a></li>
                    <li className="page-item"><a className="page-link border-0 text-secondary" href="#">Next</a></li>
                </ul>
            </nav>
        </div>
      </div>

      {/* --- Modal Popup --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(15, 23, 42, 0.7)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>เพิ่มประเภทโครงการใหม่</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body px-4 py-3">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#64748b' }}>ชื่อประเภท <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-lg bg-light border-0 text-dark" placeholder="เช่น ซ่อมบำรุง, ติดตั้งระบบ..." />
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-bold small" style={{ color: '#64748b' }}>วันที่บันทึก</label>
                      <input type="text" className="form-control bg-light border-0 text-secondary" value={new Date().toLocaleDateString('th-TH')} disabled />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small" style={{ color: '#64748b' }}>บันทึกโดย</label>
                      <input type="text" className="form-control bg-light border-0 text-secondary" value="Admin" disabled />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#64748b' }}>รายละเอียด</label>
                    <textarea className="form-control bg-light border-0 text-dark" rows="3"></textarea>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" defaultChecked />
                    <label className="form-check-label small text-dark" htmlFor="flexSwitchCheckChecked">เปิดใช้งานทันที</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top-0 px-4 pb-4">
                <button type="button" className="btn btn-light text-secondary fw-bold" onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button type="button" className="btn btn-primary px-4 fw-bold shadow-sm">บันทึกข้อมูล</button>
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