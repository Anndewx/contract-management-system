import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faFilter, faCalendarAlt, faBuilding, faLayerGroup 
} from "@fortawesome/free-solid-svg-icons";

// เพิ่มใหม่: Import Modal ยืนยันเข้ามา
import SaveModal from './SaveModal';

const ProjectPage = () => {
  const [showModal, setShowModal] = useState(false); // Modal กรอกฟอร์มเดิม
  
  // เพิ่มใหม่: State สำหรับเปิด/ปิด Modal ยืนยัน
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mock Data: ข้อมูลโครงการ
  const [data, setData] = useState([
    { id: 1, code: '2024-063', name: 'โครงการปรับปรุงระบบเข้าออกและบันทึกเวลาปฏิบัติงาน', unit: 'กทม.', createdBy: 'nuttapong.p', date: '10 พ.ย. 2568', status: 'In Progress', statusLabel: 'จัดทำโครงการ' },
    { id: 2, code: '2024-062', name: 'โครงการจ้างบำรุงรักษาและปรับปรุงระบบซอฟต์แวร์', unit: 'ส.กทม.', createdBy: 'nuttapong.p', date: '20 ต.ค. 2568', status: 'Draft', statusLabel: 'ร่าง TOR' },
    { id: 3, code: '2024-061', name: 'โครงการจ้างดำเนินการบำรุงรักษาระบบพัสดุและครุภัณฑ์', unit: 'ศสป.', createdBy: 'nuttapong.p', date: '20 ต.ค. 2568', status: 'Submitted', statusLabel: 'ยื่นซองเสนอ' },
    { id: 4, code: '2024-060', name: 'โครงการจัดจ้างบริการดูแลและบำรุงรักษาระบบสารบรรณ', unit: 'อพวช.', createdBy: 'nuttapong.p', date: '20 ต.ค. 2568', status: 'Pending', statusLabel: 'ดำเนินงาน' },
    { id: 5, code: '2024-059', name: 'โครงการเช่าบริการวงจรสื่อสารข้อมูลความเร็วสูง', unit: 'กปน.', createdBy: 'admin', date: '15 ต.ค. 2568', status: 'In Progress', statusLabel: 'จัดทำโครงการ' },
  ]);

  // Helper เลือกสี Badge ตามสถานะ
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-primary bg-opacity-10 text-primary';
      case 'Draft': return 'bg-secondary bg-opacity-10 text-secondary';
      case 'Submitted': return 'bg-info bg-opacity-10 text-info';
      case 'Pending': return 'bg-warning bg-opacity-10 text-dark';
      default: return 'bg-light text-secondary';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-primary';
      case 'Draft': return 'bg-secondary';
      case 'Submitted': return 'bg-info';
      case 'Pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  // เพิ่มใหม่: ฟังก์ชันเมื่อกดปุ่ม "บันทึกข้อมูล" ในฟอร์ม
  const handleInitialSave = () => {
    // ตรงนี้อาจจะใส่ Logic เช็ค Validate Form ก่อนก็ได้
    setShowConfirmModal(true); // เปิด Modal ยืนยัน
  };

  // เพิ่มใหม่: ฟังก์ชันเมื่อกด "ยืนยัน" จริงๆ ใน Modal ยืนยัน
  const handleFinalConfirm = () => {
    console.log("บันทึกข้อมูลเรียบร้อย!");
    // ใส่ Logic ยิง API ตรงนี้
    
    // ปิดทั้ง 2 Modal
    setShowConfirmModal(false);
    setShowModal(false);
  };

  return (
    <div className="container-fluid p-0">
      
      {/* --- 1. Page Header (เหมือนเดิม) --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>โครงการทั้งหมด</h3>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>รายการโครงการและสถานะการดำเนินงานประจำปี</span>
        </div>
        
        <button 
          className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center"
          style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', transition: 'all 0.2s' }}
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> 
          เพิ่มโครงการ
        </button>
      </div>

      {/* --- 2. Filter Bar (เหมือนเดิม) --- */}
      <div className="card border-0 shadow-sm mb-4 rounded-3 bg-white">
        <div className="card-body p-3">
            <div className="row g-3 align-items-center">
                <div className="col-6 col-md-2">
                    <div className="position-relative">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-muted small" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#94a3b8' }} />
                        <select className="form-select border-0 bg-light ps-5" style={{ height: '45px', borderRadius: '8px', color: '#1e293b', fontSize: '0.95rem', cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                            <option>2568</option>
                            <option>2567</option>
                        </select>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="position-relative">
                         <FontAwesomeIcon icon={faBuilding} className="text-muted small" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" className="form-control border-0 bg-light" style={{ paddingLeft: '40px', height: '45px', color: '#1e293b', fontSize: '0.95rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }} placeholder="ค้นหาหน่วยงาน..." />
                    </div>
                </div>
                <div className="col-12 col-md-5">
                    <div className="position-relative">
                        <FontAwesomeIcon icon={faSearch} className="text-muted" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                        <input type="text" className="form-control border-0 bg-light" style={{ paddingLeft: '45px', height: '45px', color: '#1e293b', fontSize: '0.95rem', borderRadius: '8px', fontWeight: '500', backgroundColor: '#f8f9fa' }} placeholder="ค้นหาชื่อโครงการ / รหัสโครงการ..." />
                    </div>
                </div>
                <div className="col-12 col-md-2">
                    <button className="btn btn-primary w-100 border-0 fw-bold d-flex align-items-center justify-content-center shadow-sm" style={{ height: '45px', borderRadius: '8px', backgroundColor: '#3b82f6' }}>
                        <FontAwesomeIcon icon={faSearch} className="me-2" /> ค้นหา
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- 3. Data Table (เหมือนเดิม) --- */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle" style={{borderCollapse: 'separate', borderSpacing: '0'}}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th className="py-3 ps-4 border-bottom" style={{ width: '5%' }}><input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} /></th>
                <th className="py-3 border-bottom fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '35%' }}>ชื่อโครงการ / รหัส</th>
                <th className="py-3 border-bottom fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '10%' }}>หน่วยงาน</th>
                <th className="py-3 border-bottom fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '15%' }}>วันที่สร้าง</th>
                <th className="py-3 border-bottom fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '15%' }}>สร้างโดย</th>
                <th className="py-3 border-bottom fw-bold text-uppercase text-center" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '10%' }}>สถานะ</th>
                <th className="py-3 border-bottom fw-bold text-uppercase text-end pe-4" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '10%' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfc', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td className="py-3 ps-4 border-bottom-0"><input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} /></td>
                  <td className="py-3 border-bottom-0">
                      <div className="d-flex flex-column">
                          <span className="fw-bold text-primary mb-1" style={{ fontSize: '0.85rem' }}>{item.code}</span>
                          <span className="fw-bold" style={{ color: '#0f172a', fontSize: '0.95rem' }}>{item.name}</span>
                      </div>
                  </td>
                  <td className="py-3 border-bottom-0"><span className="badge bg-white text-dark border fw-normal shadow-sm" style={{ fontSize: '0.85rem', color: '#475569' }}>{item.unit}</span></td>
                  <td className="py-3 border-bottom-0" style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '400' }}>{item.date}</td>
                  <td className="py-3 border-bottom-0">
                      <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{width:'28px', height:'28px', fontWeight:'bold', fontSize:'0.7rem'}}>{item.createdBy.charAt(0).toUpperCase()}</div>
                          <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '400' }}>{item.createdBy}</span>
                      </div>
                  </td>
                  <td className="py-3 text-center border-bottom-0">
                    <span className={`badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center ${getStatusBadge(item.status)}`} style={{ fontSize: '0.75rem' }}>
                      <span className={`me-1 rounded-circle ${getStatusDot(item.status)}`} style={{width:'6px', height:'6px'}}></span>
                      {item.statusLabel}
                    </span>
                  </td>
                  <td className="py-3 text-end pe-4 border-bottom-0">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-primary hover-shadow" style={{borderColor: '#e2e8f0', width:'32px', height:'32px'}} title="แก้ไข"><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="btn btn-sm btn-white border shadow-sm mx-1 rounded text-danger hover-shadow" style={{borderColor: '#e2e8f0', width:'32px', height:'32px'}} title="ลบ"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (เหมือนเดิม) */}
        <div className="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>แสดง <span className="fw-bold text-dark">1-5</span> จาก <span className="fw-bold text-dark">50</span> รายการ</div>
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled"><a className="page-link border-0 text-secondary" href="#">Previous</a></li>
                    <li className="page-item active"><a className="page-link border-0 rounded-3 shadow-sm bg-primary fw-bold px-3" href="#">1</a></li>
                    <li className="page-item"><a className="page-link border-0 text-secondary px-3" href="#">2</a></li>
                    <li className="page-item"><a className="page-link border-0 text-secondary px-3" href="#">3</a></li>
                    <li className="page-item"><a className="page-link border-0 text-secondary" href="#">Next</a></li>
                </ul>
            </nav>
        </div>
      </div>

      {/* --- Modal Popup (สำหรับเพิ่มโครงการ) --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(15, 23, 42, 0.7)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>เพิ่มโครงการใหม่</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body px-4 py-3">
                <form>
                  {/* ... เนื้อหาฟอร์มเดิมคงไว้ทั้งหมด ... */}
                  <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label fw-bold small" style={{ color: '#64748b' }}>ปีงบประมาณ</label>
                        <select className="form-select bg-light border-0 text-dark">
                            <option>2568</option>
                            <option>2567</option>
                        </select>
                      </div>
                      <div className="col-md-9">
                        <label className="form-label fw-bold small" style={{ color: '#64748b' }}>ชื่อโครงการ <span className="text-danger">*</span></label>
                        <input type="text" className="form-control bg-light border-0 text-dark" placeholder="ระบุชื่อโครงการ..." />
                      </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small" style={{ color: '#64748b' }}>รหัสโครงการ</label>
                      <input type="text" className="form-control bg-light border-0 text-dark" placeholder="เช่น 2024-063" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small" style={{ color: '#64748b' }}>หน่วยงานเจ้าของเรื่อง</label>
                      <input type="text" className="form-control bg-light border-0 text-dark" placeholder="ระบุหน่วยงาน..." />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#64748b' }}>รายละเอียดสังเขป</label>
                    <textarea className="form-control bg-light border-0 text-dark" rows="3" placeholder="รายละเอียดโครงการ..."></textarea>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                         <label className="form-label fw-bold small" style={{ color: '#64748b' }}>สถานะเริ่มต้น</label>
                         <select className="form-select bg-light border-0 text-dark">
                            <option>จัดทำโครงการ</option>
                            <option>ร่าง TOR</option>
                            <option>ยื่นซองเสนอ</option>
                        </select>
                    </div>
                    <div className="col-6">
                         <label className="form-label fw-bold small" style={{ color: '#64748b' }}>วันที่สร้าง</label>
                         <input type="text" className="form-control bg-light border-0 text-secondary" value={new Date().toLocaleDateString('th-TH')} disabled />
                    </div>
                  </div>

                </form>
              </div>
              <div className="modal-footer border-top-0 px-4 pb-4">
                <button type="button" className="btn btn-light text-secondary fw-bold" onClick={() => setShowModal(false)}>ยกเลิก</button>
                {/* แก้ไข: เปลี่ยน onClick ให้ไปเรียก handleInitialSave */}
                <button type="button" className="btn btn-primary px-4 fw-bold shadow-sm" onClick={handleInitialSave}>บันทึกข้อมูล</button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* --- เพิ่มใหม่: เรียกใช้ SaveModal ตรงนี้ --- */}
      <SaveModal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalConfirm}
      />

    </div>
  );
};

export default ProjectPage;