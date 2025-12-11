import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faFilter, faCheckCircle, faTimesCircle, faFileInvoiceDollar 
} from "@fortawesome/free-solid-svg-icons";

const ExpenseTypePage = () => {
  const [showModal, setShowModal] = useState(false);

  // Mock Data (ข้อมูลตัวอย่าง: ประเภทการเบิกจ่าย)
  const [data, setData] = useState([
    { id: 1, name: 'เงินสด (Cash)', code: 'EXP-001', createdBy: 'Administrator', date: '17 เม.ย. 2025', status: true },
    { id: 2, name: 'เช็ค (Cheque)', code: 'EXP-002', createdBy: 'Administrator', date: '17 เม.ย. 2025', status: true },
    { id: 3, name: 'โอนเงิน (Bank Transfer)', code: 'EXP-003', createdBy: 'Administrator', date: '17 เม.ย. 2025', status: true },
    { id: 4, name: 'บัตรเครดิต (Credit Card)', code: 'EXP-004', createdBy: 'Manager', date: '18 เม.ย. 2025', status: false },
  ]);

  return (
    <div className="container-fluid p-0">
      
      {/* --- 1. Page Header --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            {/* ✅ สีหัวข้อ #1e293b (น้ำเงินเข้ม) */}
            <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>ประเภทการเบิกจ่าย</h3>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>จัดการข้อมูลการจ่ายเงินและช่องทางการชำระเงิน</span>
        </div>
        
        {/* ✅ ปุ่มสีฟ้า #3b82f6 */}
        <button 
          className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center"
          style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', transition: 'all 0.2s' }}
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> 
          เพิ่มรายการใหม่
        </button>
      </div>

      {/* --- 2. Filter Bar --- */}
      <div className="card border-0 shadow-sm mb-4 rounded-3 bg-white">
        <div className="card-body p-3">
            <div className="row g-3 align-items-center">
                
                {/* Search Box */}
                <div className="col-12 col-md-5">
                    <div className="position-relative">
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="text-muted"
                            style={{ 
                                position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8'
                            }} 
                        />
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light" 
                            style={{ 
                                paddingLeft: '45px', height: '45px', 
                                color: '#1e293b', fontSize: '0.95rem', borderRadius: '8px', fontWeight: '500',
                                backgroundColor: '#f8f9fa'
                            }}
                            placeholder="ค้นหาชื่อประเภทการเบิกจ่าย..." 
                        />
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <select 
                        className="form-select border-0 bg-white text-dark" 
                        style={{ height: '45px', borderRadius: '8px', cursor:'pointer', color: '#1e293b', fontSize: '0.95rem' }}
                    >
                        <option>สถานะทั้งหมด</option>
                        <option>ใช้งาน (Active)</option>
                        <option>ไม่ใช้งาน (Inactive)</option>
                    </select>
                </div>
                <div className="col-6 col-md-2">
                    <select 
                        className="form-select border-0 bg-white text-dark" 
                        style={{ height: '45px', borderRadius: '8px', cursor:'pointer', color: '#1e293b', fontSize: '0.95rem' }}
                    >
                        <option>ล่าสุด</option>
                        <option>เก่าสุด</option>
                    </select>
                </div>

                <div className="col-12 col-md-2">
                    <button 
                        className="btn btn-light w-100 border-0 fw-bold d-flex align-items-center justify-content-center" 
                        style={{ height: '45px', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#475569' }}
                    >
                        <FontAwesomeIcon icon={faFilter} className="me-2" /> ล้างค่า
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- 3. Data Table --- */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle" style={{borderCollapse: 'separate', borderSpacing: '0'}}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th className="py-3 ps-4 border-bottom" style={{ width: '5%' }}>
                    <input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} />
                </th>
                {/* ✅ หัวตารางสีเทาเข้ม #475569 ขนาด 0.85rem */}
                <th className="py-3 border-bottom fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '30%' }}>ชื่อประเภท / รหัส</th>
                <th className="py-3 border-bottom fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '20%' }}>บันทึกโดย</th>
                <th className="py-3 border-bottom fw-bold text-uppercase" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '20%' }}>วันที่บันทึก</th>
                <th className="py-3 border-bottom fw-bold text-uppercase text-center" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '15%' }}>สถานะ</th>
                <th className="py-3 border-bottom fw-bold text-uppercase text-end pe-4" style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: '0.5px', width: '10%' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfc', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td className="py-3 ps-4 border-bottom-0">
                      <input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} />
                  </td>
                  <td className="py-3 border-bottom-0">
                      <div className="d-flex flex-column">
                          {/* ✅ ชื่อรายการสีเข้ม #0f172a ขนาด 0.95rem */}
                          <span className="fw-bold" style={{ color: '#0f172a', fontSize: '0.95rem' }}>{item.name}</span>
                          <span className="small text-muted" style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.code}</span>
                      </div>
                  </td>
                  
                  <td className="py-3 border-bottom-0">
                      <div className="d-flex align-items-center">
                          <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width:'30px', height:'30px', color:'#64748b', fontWeight:'bold', fontSize:'0.75rem'}}>
                              {item.createdBy.charAt(0)}
                          </div>
                          {/* ✅ บันทึกโดยสีเทา #475569 ขนาด 0.9rem */}
                          <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '400' }}>{item.createdBy}</span>
                      </div>
                  </td>

                  {/* ✅ วันที่สีเทา #475569 ขนาด 0.9rem */}
                  <td className="py-3 border-bottom-0" style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '400' }}>{item.date}</td>
                  
                  <td className="py-3 text-center border-bottom-0">
                    {/* ✅ Soft Badge (สีโปร่ง) */}
                    <span 
                        className={`badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center ${item.status ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}
                        style={{ fontSize: '0.75rem' }}
                    >
                      <span className={`me-1 rounded-circle ${item.status ? 'bg-success' : 'bg-secondary'}`} style={{width:'6px', height:'6px'}}></span>
                      {item.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  <td className="py-3 text-end pe-4 border-bottom-0">
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
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                แสดง <span className="fw-bold text-dark">1-4</span> จาก <span className="fw-bold text-dark">20</span> รายการ
            </div>
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled"><a className="page-link border-0 text-secondary" href="#">Previous</a></li>
                    <li className="page-item active"><a className="page-link border-0 rounded-3 shadow-sm bg-primary fw-bold px-3" href="#">1</a></li>
                    <li className="page-item"><a className="page-link border-0 text-secondary px-3" href="#">2</a></li>
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
                <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>เพิ่มประเภทการเบิกจ่าย</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body px-4 py-3">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#64748b' }}>ชื่อประเภท <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-lg bg-light border-0 text-dark" placeholder="เช่น เงินสด, เช็ค..." />
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-bold small" style={{ color: '#64748b' }}>รหัส (Code)</label>
                      <input type="text" className="form-control bg-light border-0 text-dark" placeholder="เช่น EXP-001" />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small" style={{ color: '#64748b' }}>วันที่บันทึก</label>
                      <input type="text" className="form-control bg-light border-0 text-secondary" value={new Date().toLocaleDateString('th-TH')} disabled />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#64748b' }}>รายละเอียดเพิ่มเติม</label>
                    <textarea className="form-control bg-light border-0 text-dark" rows="3" placeholder="ระบุรายละเอียด..."></textarea>
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

export default ExpenseTypePage;