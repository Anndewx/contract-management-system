import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faFilter, faBuilding, faMapMarkerAlt, 
  faEnvelope, faPhone, faFileAlt, faGlobe, faUser, faSave, faTimes
} from "@fortawesome/free-solid-svg-icons";

const CustomerPage = () => {
  const [showModal, setShowModal] = useState(false);

  // --- State สำหรับเก็บข้อมูลฟอร์ม ---
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    province: '',
    district: '',
    subDistrict: '',
    zipcode: '',
    isActive: true
  });
  const [error, setError] = useState('');

  // Mock Data
  const [data, setData] = useState([
    { 
      id: 1, 
      name: 'บริษัท โทรคมนาคมแห่งชาติ จำกัด (NT)', 
      address: 'สำนักงานใหญ่: 99 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210', 
      email: '1888@ntplc.co.th', 
      phone: '1888', 
      status: true 
    },
    { 
      id: 2, 
      name: 'การไฟฟ้าส่วนภูมิภาค (PEA)', 
      address: '200 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900', 
      email: '1129@pea.co.th', 
      phone: '1129', 
      status: true 
    },
    { 
      id: 3, 
      name: 'บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)', 
      address: '333 ถนนเชิดวุฒากาศ แขวงสีกัน เขตดอนเมือง กรุงเทพฯ 10210', 
      email: 'aot_info@airportthai.co.th', 
      phone: '0-2535-1111', 
      status: true 
    }
  ]);

  const handleOpenModal = () => {
    // รีเซ็ตค่าเมื่อเปิดใหม่
    setFormData({
        name: '', taxId: '', email: '', phone: '', website: '',
        address: '', province: '', district: '', subDistrict: '', zipcode: '',
        isActive: true
    });
    setError('');
    setShowModal(true);
  };

  const toggleStatus = (id) => {
    const newData = data.map(item => {
      if (item.id === id) return { ...item, status: !item.status };
      return item;
    });
    setData(newData);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError('กรุณาระบุชื่อหน่วยงาน/บริษัท');
      return;
    }
    console.log("Saved:", formData);
    alert("บันทึกข้อมูลลูกค้าสำเร็จ (Mock)");
    setShowModal(false);
  };

  return (
    <div className="container-fluid p-0">
      
      {/* --- Page Header --- */}
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div>
                <h4 className="fw-bold mb-1" style={{ color: '#1e293b' }}>ข้อมูลและประวัติลูกค้า Customer Management</h4>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>จัดการรายชื่อลูกค้าและหน่วยงานคู่ค้า</span>
            </div>
            <button 
              className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center"
              style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', minWidth: '160px' }}
              onClick={handleOpenModal}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" /> 
              เพิ่มลูกค้าใหม่
            </button>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th className="py-3 ps-4 text-secondary small text-uppercase" style={{ width: '5%' }}>No.</th>
                <th className="py-3 text-secondary small text-uppercase" style={{ width: '25%' }}>ชื่อหน่วยงาน/บริษัท</th>
                <th className="py-3 text-secondary small text-uppercase" style={{ width: '30%' }}>ที่อยู่</th>
                <th className="py-3 text-secondary small text-uppercase" style={{ width: '15%' }}>อีเมล</th>
                <th className="py-3 text-secondary small text-uppercase" style={{ width: '10%' }}>เบอร์โทรศัพท์</th>
                <th className="py-3 text-secondary small text-uppercase text-center" style={{ width: '15%' }}>ส่วนจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="py-4 ps-4 text-muted small">{index + 1}</td>
                  <td className="py-4">
                      <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{item.name}</div>
                  </td>
                  <td className="py-4">
                      <div className="text-muted small" style={{ lineHeight: '1.5' }}>{item.address}</div>
                  </td>
                  <td className="py-4 text-muted small">{item.email}</td>
                  <td className="py-4 text-muted small">{item.phone}</td>
                  <td className="py-4 text-center">
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <button className="btn btn-sm btn-white border shadow-sm rounded hover-shadow" style={{ width:'32px', height:'32px', color: '#64748b' }}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <div className="form-check form-switch mb-0">
                            <input 
                                className="form-check-input cursor-pointer" 
                                type="checkbox" 
                                role="switch" 
                                checked={item.status}
                                onChange={() => toggleStatus(item.id)}
                                style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                            />
                        </div>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>แสดง 1 ถึง 3 จาก 3 รายการ</div>
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled"><a className="page-link border-0 text-secondary" href="#">Previous</a></li>
                    <li className="page-item active"><a className="page-link border-0 rounded-3 shadow-sm bg-primary fw-bold px-3" href="#">1</a></li>
                    <li className="page-item"><a className="page-link border-0 text-secondary" href="#">Next</a></li>
                </ul>
            </nav>
        </div>
      </div>

      {/* --- Modal Popup (ออกแบบใหม่ตามภาพ) --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(15, 23, 42, 0.6)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1" style={{ overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              
              <div className="modal-body p-0">
                <div className="row g-0" style={{ minHeight: '650px' }}>
                    
                    {/* --- ฝั่งซ้าย: Sidebar (Responsive: บนมือถืออยู่บน, จอใหญ่อยู่ซ้าย) --- */}
                    <div className="col-12 col-lg-3 bg-white border-end p-4 d-flex flex-column align-items-center justify-content-start">
                        {/* Logo บริษัท */}
                        <div className="mb-4 text-center mt-3">
                            <div className="rounded-circle border p-1 d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '120px', height: '120px', border: '3px solid #f472b6' }}>
                                {/* Placeholder Logo */}
                                <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden">
                                    <span className="fw-bold text-primary" style={{fontSize:'2.5rem'}}>LOGO</span>
                                    {/* <img src="..." alt="Logo" className="w-100 h-100 object-fit-cover" /> */}
                                </div>
                            </div>
                            <h6 className="fw-bold text-dark mb-1">ชื่อบริษัท (แสดงตัวอย่าง)</h6>
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>COMPANY NAME CO., LTD.</small>
                        </div>

                        {/* Menu Items */}
                        <div className="w-100">
                            <button className="btn btn-light w-100 text-start mb-2 fw-bold text-primary bg-primary bg-opacity-10 border-0 py-2 px-3 rounded-3">
                                <FontAwesomeIcon icon={faBuilding} className="me-3" width="20" /> ข้อมูลทั่วไป
                            </button>
                            <button className="btn btn-white w-100 text-start mb-2 text-secondary hover-bg-light border-0 py-2 px-3 rounded-3">
                                <FontAwesomeIcon icon={faPhone} className="me-3" width="20" /> ติดต่อ
                            </button>
                            <button className="btn btn-white w-100 text-start mb-2 text-secondary hover-bg-light border-0 py-2 px-3 rounded-3">
                                <FontAwesomeIcon icon={faFileAlt} className="me-3" width="20" /> ใบเสนอราคา
                            </button>
                            <button className="btn btn-white w-100 text-start mb-2 text-secondary hover-bg-light border-0 py-2 px-3 rounded-3">
                                <FontAwesomeIcon icon={faFileAlt} className="me-3" width="20" /> ใบแจ้งหนี้
                            </button>
                            <button className="btn btn-white w-100 text-start mb-2 text-secondary hover-bg-light border-0 py-2 px-3 rounded-3">
                                <FontAwesomeIcon icon={faBuilding} className="me-3" width="20" /> โปรเจกต์
                            </button>
                        </div>
                    </div>

                    {/* --- ฝั่งขวา: Content Form (Responsive: เต็มจอ) --- */}
                    <div className="col-12 col-lg-9 bg-light p-4 p-md-5">
                        <div className="bg-white p-4 rounded-4 shadow-sm h-100 position-relative">
                            <h4 className="fw-bold mb-4" style={{ color: '#1e293b' }}>ข้อมูลทั่วไป</h4>
                            
                            <form>
                                {/* Row 1 */}
                                <div className="row g-3 mb-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">หน่วยงาน/บริษัท <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className={`form-control bg-light border-0 text-dark ${error ? 'is-invalid' : ''}`}
                                            placeholder="ระบุชื่อบริษัท..." 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">หมายเลขผู้เสียภาษี</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light border-0 text-dark" 
                                            placeholder="VAT No." 
                                            value={formData.taxId}
                                            onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="row g-3 mb-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control bg-light border-0 text-dark" 
                                            placeholder="example@domain.com" 
                                            value={formData.email} 
                                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">เบอร์โทรศัพท์</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light border-0 text-dark" 
                                            placeholder="02-xxx-xxxx" 
                                            value={formData.phone} 
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Website */}
                                <div className="mb-3">
                                    <label className="form-label small text-muted">เว็บไซต์</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0 text-dark" 
                                        placeholder="https://www.example.com/" 
                                        value={formData.website}
                                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                                    />
                                </div>

                                {/* Row 4: Address */}
                                <div className="mb-3">
                                    <label className="form-label small text-muted">ที่อยู่</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0 text-dark" 
                                        placeholder="ระบุที่อยู่..." 
                                        value={formData.address} 
                                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                                    />
                                </div>

                                {/* Row 5: Location Details */}
                                <div className="row g-3 mb-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">จังหวัด</label>
                                        <select className="form-select bg-light border-0 text-dark">
                                            <option>กรุงเทพฯ</option>
                                            <option>เชียงใหม่</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">อำเภอ/เขต</label>
                                        <select className="form-select bg-light border-0 text-dark">
                                            <option>หลักสี่</option>
                                            <option>จตุจักร</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">ตำบล/แขวง</label>
                                        <select className="form-select bg-light border-0 text-dark">
                                            <option>ทุ่งสองห้อง</option>
                                            <option>ลาดยาว</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-muted">ไปรษณีย์</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light border-0 text-dark" 
                                            placeholder="10210" 
                                            value={formData.zipcode}
                                            onChange={(e) => setFormData({...formData, zipcode: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-end gap-2 mt-5">
                                    <button 
                                        type="button" 
                                        className="btn btn-white border px-4 text-secondary" 
                                        onClick={() => setShowModal(false)}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary px-4 shadow-sm" 
                                        style={{ backgroundColor: '#93c5fd', borderColor: '#93c5fd', color: '#1e3a8a', fontWeight: 'bold' }} // ปรับสีปุ่มให้คล้ายภาพ
                                        onClick={handleSave}
                                    >
                                        บันทึก
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

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

export default CustomerPage;