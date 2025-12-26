import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faPhone, faFileAlt, faFileInvoice, faProjectDiagram, 
  faArrowLeft, faPlus, faSearch, faEdit, faTrash, faTimes, faPaperclip,
  faBriefcase, faChevronRight, faCheckCircle, faChevronDown,
  faFilePdf, faFileWord, faFileExcel, faFileImage 
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5056/api";

const CreateCustomerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showContactModal, setShowContactModal] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '', taxId: '', email: '', phone: '', website: '', 
    address: '', province: 'กรุงเทพมหานคร', district: 'หลักสี่', subDistrict: 'ทุ่งสองห้อง', zipcode: ''
  });

  // --- Contact State ---
  const [contacts, setContacts] = useState([]);

  // --- Contact Modal State ---
  const [contactForm, setContactForm] = useState({
      firstName: '', lastName: '', phone: '', email: '', details: ''
  });
  const [contactAttachments, setContactAttachments] = useState([]);
  const contactFileInputRef = useRef(null);

  // --- Mock Data ---
  const [quotations] = useState([{ id: 'INNO-00001', desc: 'xxxx' }]);
  const [invoices] = useState([{ id: 'INNO-00001', desc: 'xxxx' }]);
  const [projects] = useState([{ id: 1, name: 'โครงการที่ 1', status: 'ปิดโครงการ' }]);

  // --- Functions ---

  // 1. ✅ ฟังก์ชันล็อคตัวเลข (ใช้กับ TaxID, Phone, Zipcode)
  const handleNumericInput = (e, setFunction, state) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) { // รับเฉพาะตัวเลข 0-9
        setFunction({ ...state, [name]: value });
    }
  };

  // 2. ✅ เพิ่มผู้ติดต่อลง List (หน้าเว็บ)
  const handleAddContactToList = () => {
    if (!contactForm.firstName) {
        Swal.fire('แจ้งเตือน', 'กรุณาระบุชื่อผู้ติดต่อ', 'warning');
        return;
    }
    const newContact = {
        ...contactForm,
        id: Date.now(), 
        attachments: contactAttachments 
    };
    setContacts([...contacts, newContact]);
    handleCloseModal();
    
    // Toast แจ้งเตือนมุมขวาบน
    const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    Toast.fire({ icon: 'success', title: 'เพิ่มรายชื่อแล้ว (อย่าลืมกดบันทึกที่หน้าข้อมูลทั่วไป)' });
  };

  // 3. ✅ บันทึกข้อมูลลงฐานข้อมูล (ส่งไปเฉพาะ Data ที่ DB รับได้)
  const handleSave = async () => {
    if (!formData.name) {
        Swal.fire('แจ้งเตือน', 'กรุณาระบุชื่อบริษัท/หน่วยงาน', 'warning');
        setActiveTab('general');
        return;
    }

    const contactsPayload = contacts.map(c => ({
        FirstName: c.firstName,
        LastName: c.lastName,
        Phone: c.phone,
        Email: c.email,
        Details: c.details
        // ไม่ส่ง attachments ไป DB เพราะ Backend ยังไม่มีที่เก็บ แต่ในหน้าเว็บแสดงได้ปกติ
    }));

    const payload = {
        ...formData,       
        Contacts: contactsPayload 
    };

    try {
        const response = await fetch(`${API_BASE_URL}/Customers`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success', title: 'บันทึกข้อมูลสำเร็จ',
                showConfirmButton: false, timer: 1500
            });
            navigate('/customers'); 
        } else {
            const errorData = await response.json().catch(() => ({}));
            Swal.fire('Error', 'เกิดข้อผิดพลาด: ' + (errorData.title || 'Unknown'), 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'ไม่สามารถเชื่อมต่อ Server ได้', 'error');
    }
  };

  // --- Helpers (Attachment Logic) ---
  const handleContactFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        setContactAttachments(prev => [...prev, ...files]);
    }
    e.target.value = null; 
  };

  const removeContactAttachment = (index) => {
      setContactAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleContactChange = (e) => {
      const { name, value } = e.target;
      setContactForm(prev => ({ ...prev, [name]: value }));
  };

  // Helper สำหรับ Modal Phone Input (ล็อคตัวเลขใน Modal)
  const handleContactNumericChange = (e) => {
      const { name, value } = e.target;
      if (value === '' || /^\d+$/.test(value)) {
          setContactForm(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleCloseModal = () => {
      setShowContactModal(false);
      setContactAttachments([]);
      setContactForm({ firstName: '', lastName: '', phone: '', email: '', details: '' });
  };

  const getFileIcon = (fileName) => {
      const ext = fileName.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) return { icon: faFileImage, color: '#f59e0b', bg: '#fffbeb' };
      if (['pdf'].includes(ext)) return { icon: faFilePdf, color: '#ef4444', bg: '#fef2f2' };
      if (['xls', 'xlsx'].includes(ext)) return { icon: faFileExcel, color: '#10b981', bg: '#ecfdf5' };
      if (['doc', 'docx'].includes(ext)) return { icon: faFileWord, color: '#3b82f6', bg: '#eff6ff' };
      return { icon: faFileAlt, color: '#6b7280', bg: '#f3f4f6' };
  };

  const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
  };

  // --- Styles (Original Design) ---
  const premiumStyles = `
    .form-control-premium, .form-select-premium {
        background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;
        padding: 12px 16px; font-size: 0.95rem; color: #000000; transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .form-control-premium:focus, .form-select-premium:focus {
        border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); outline: none;
    }
    .card-premium {
        border: none; border-radius: 20px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
        background: white; overflow: hidden;
    }
    .btn-premium-primary {
        background-color: #3b82f6; border: none; border-radius: 10px; padding: 10px 24px;
        font-weight: 600; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4); transition: all 0.2s ease;
    }
    .btn-premium-primary:hover { background-color: #2563eb; transform: translateY(-1px); }
    .sidebar-item {
        border-radius: 12px; padding: 14px 20px; font-weight: 600; color: #000000;
        transition: all 0.2s ease; display: flex; align-items: center; width: 100%;
        border: none; background: transparent; text-align: left; position: relative;
    }
    .sidebar-item:hover { background-color: #f1f5f9; }
    .sidebar-item.active { background-color: #eff6ff; }
    .sidebar-item.active::before {
        content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
        height: 70%; width: 5px; background-color: #3b82f6; border-radius: 0 4px 4px 0;
    }
    .logo-container {
        width: 100px; height: 100px; border-radius: 50%; background: white;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px #f1f5f9;
        display: flex; align-items: center; justify-content: center;
    }
  `;

  const SidebarButton = ({ tabName, label, icon }) => (
    <button 
        onClick={() => { setActiveTab(tabName); setShowContactModal(false); }}
        className={`sidebar-item mb-1 ${activeTab === tabName ? 'active' : ''}`}
    >
        <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }} className="me-3">
            <FontAwesomeIcon icon={icon} className="text-dark" width="20" />
        </div>
        <span className="text-dark">{label}</span>
        {activeTab === tabName && <FontAwesomeIcon icon={faChevronRight} className="ms-auto small text-dark opacity-50" />}
    </button>
  );

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <style>{premiumStyles}</style>
      
      {/* Header */}
      <div className="d-flex align-items-start mb-4 ps-1">
        <button className="btn btn-link text-dark me-3 p-0 mt-1 opacity-75 hover-opacity-100" onClick={() => navigate('/customers')}>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <div>
            <h3 className="fw-bold mb-1 text-black" style={{ letterSpacing: '-0.5px' }}>เพิ่มข้อมูลลูกค้า</h3>
            <span className="text-muted small">สร้างฐานข้อมูลลูกค้าและผู้ติดต่อใหม่สำหรับองค์กร</span>
        </div>
      </div>

      <div className="row g-4">
        {/* --- Left Sidebar --- */}
        <div className="col-12 col-lg-3">
            <div className="card-premium h-100">
                <div className="card-body p-4 d-flex flex-column align-items-center">
                    <div className="mb-5 mt-4 text-center">
                        <div className="logo-container mx-auto mb-3">
                            {formData.name ? (
                                <span className="fw-bold fs-1 text-dark">{formData.name.charAt(0)}</span>
                            ) : (
                                <FontAwesomeIcon icon={faBriefcase} className="text-dark" size="2x" />
                            )}
                        </div>
                        <h6 className="fw-bold text-dark mb-1 px-2">{formData.name || 'ชื่อบริษัท/หน่วยงาน'}</h6>
                        <span className="badge bg-light text-dark border rounded-pill px-3 py-1 fw-normal">NEW CUSTOMER</span>
                    </div>
                    <div className="w-100 d-flex flex-column gap-1 px-1">
                        <SidebarButton tabName="general" label="ข้อมูลทั่วไป" icon={faBriefcase} />
                        <SidebarButton tabName="contact" label="ผู้ติดต่อ" icon={faPhone} />
                        <SidebarButton tabName="quotation" label="ใบเสนอราคา" icon={faFileAlt} />
                        <SidebarButton tabName="invoice" label="ใบแจ้งหนี้" icon={faFileInvoice} />
                        <SidebarButton tabName="project" label="โปรเจกต์" icon={faProjectDiagram} />
                    </div>
                </div>
            </div>
        </div>

        {/* --- Right Content --- */}
        <div className="col-12 col-lg-9">
            <div className="card-premium h-100 d-flex flex-column" style={{ minHeight: '650px' }}>
                <div className="card-body p-4 p-md-5 flex-grow-1">
                    
                    {/* 1. General Info */}
                    {activeTab === 'general' && (
                        <div className="animate__animated animate__fadeIn">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h4 className="fw-bold text-dark m-0">ข้อมูลทั่วไป</h4>
                            </div>
                            <form className="row g-4">
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">หน่วยงาน/บริษัท <span className="text-danger">*</span></label><input type="text" className="form-control form-control-premium" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} /></div>
                                {/* ✅ ล็อคตัวเลข TaxID */}
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">หมายเลขผู้เสียภาษี (ตัวเลข)</label><input type="text" className="form-control form-control-premium" name="taxId" value={formData.taxId} onChange={(e) => handleNumericInput(e, setFormData, formData)} maxLength={13} /></div>
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">อีเมลติดต่อ</label><input type="email" className="form-control form-control-premium" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} /></div>
                                {/* ✅ ล็อคตัวเลข เบอร์โทร */}
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">เบอร์โทรศัพท์ (ตัวเลข)</label><input type="text" className="form-control form-control-premium" name="phone" value={formData.phone} onChange={(e) => handleNumericInput(e, setFormData, formData)} maxLength={10} /></div>
                                <div className="col-md-12"><label className="form-label fw-bold small text-dark ps-1">เว็บไซต์</label><input type="text" className="form-control form-control-premium" value={formData.website} onChange={(e)=>setFormData({...formData, website: e.target.value})} /></div>
                                <div className="col-12"><label className="form-label fw-bold small text-dark ps-1">ที่อยู่</label><textarea className="form-control form-control-premium" rows="2" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} style={{ resize: 'none' }}></textarea></div>
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">จังหวัด</label><select className="form-select form-select-premium" value={formData.province} onChange={(e)=>setFormData({...formData, province: e.target.value})}><option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option></select></div>
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">อำเภอ/เขต</label><select className="form-select form-select-premium" value={formData.district} onChange={(e)=>setFormData({...formData, district: e.target.value})}><option value="หลักสี่">หลักสี่</option></select></div>
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">ตำบล/แขวง</label><select className="form-select form-select-premium" value={formData.subDistrict} onChange={(e)=>setFormData({...formData, subDistrict: e.target.value})}><option value="ทุ่งสองห้อง">ทุ่งสองห้อง</option></select></div>
                                {/* ✅ ล็อคตัวเลข Zipcode */}
                                <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">รหัสไปรษณีย์ (ตัวเลข)</label><input type="text" className="form-control form-control-premium" name="zipcode" value={formData.zipcode} onChange={(e) => handleNumericInput(e, setFormData, formData)} maxLength={5} /></div>
                            </form>
                        </div>
                    )}

                    {/* 2. Contacts */}
                    {activeTab === 'contact' && (
                        <div className="animate__animated animate__fadeIn">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h4 className="fw-bold m-0 text-dark">รายชื่อผู้ติดต่อ</h4>
                                <button className="btn btn-premium-primary text-white btn-sm" onClick={() => setShowContactModal(true)}>
                                    <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มผู้ติดต่อ
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table align-middle table-hover">
                                    <thead className="bg-light">
                                        <tr><th className="py-3 ps-3 border-0 rounded-start text-dark small fw-bold">ชื่อ - สกุล</th><th className="py-3 border-0 text-dark small fw-bold">รายละเอียด</th><th className="py-3 text-end pe-3 border-0 rounded-end text-dark small fw-bold">จัดการ</th></tr>
                                    </thead>
                                    <tbody>
                                        {contacts.length === 0 ? (
                                            <tr><td colSpan="3" className="text-center py-4 text-muted">ยังไม่มีข้อมูลผู้ติดต่อ กดปุ่มเพิ่มเพื่อสร้างรายการ</td></tr>
                                        ) : (
                                            contacts.map((c) => (
                                                <tr key={c.id}>
                                                    <td className="py-3 ps-3 fw-bold text-dark">{c.firstName} {c.lastName}</td>
                                                    <td className="py-3 small text-muted">{c.email} | {c.phone} <br/> {c.details}
                                                        {c.attachments.length > 0 && <span className="badge bg-light text-dark border ms-2"><FontAwesomeIcon icon={faPaperclip}/> {c.attachments.length}</span>}
                                                    </td>
                                                    <td className="py-3 text-end pe-3">
                                                        <button className="btn btn-light btn-sm rounded-circle me-2 shadow-sm"><FontAwesomeIcon icon={faEdit}/></button>
                                                        <button className="btn btn-light btn-sm rounded-circle shadow-sm text-danger" onClick={() => setContacts(contacts.filter(item => item.id !== c.id))}><FontAwesomeIcon icon={faTrash}/></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Other Tabs */}
                    {['quotation', 'invoice', 'project'].includes(activeTab) && (
                        <div className="text-center py-5 text-muted">ส่วนนี้จะเปิดใช้งานหลังจากบันทึกข้อมูลลูกค้าแล้ว</div>
                    )}
                </div>

                {/* ✅ Global Footer Buttons (เฉพาะหน้า General) */}
                {activeTab === 'general' && (
                    <div className="card-footer bg-white border-top p-4 d-flex justify-content-end align-items-center gap-3" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
                        {/* 🛑 ใช้ Style เดิมของคุณ: text-dark (สีดำ/เทา) ไม่ใช่ text-secondary */}
                        <button className="btn btn-light border fw-bold px-4 py-2 rounded-3 text-dark hover-shadow" onClick={() => navigate('/customers')}>ยกเลิก</button>
                        <button className="btn btn-premium-primary text-white px-4 py-2" onClick={handleSave}>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2"/> บันทึกข้อมูลทั้งหมด
                        </button>
                    </div>
                )}

                {/* --- Modal Add Contact (ดีไซน์เดิม 2 Columns) --- */}
                {showContactModal && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', zIndex: 10, borderRadius: '20px' }}>
                        <div className="bg-white shadow-lg rounded-4 p-0 border d-flex flex-column" style={{ width: '800px', maxHeight: '95vh', borderColor: '#e2e8f0' }}>
                            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                                <h5 className="fw-bold m-0 text-dark">เพิ่มผู้ติดต่อ</h5>
                                {/* 🛑 ใช้ Style เดิม: btn-light shadow-sm (สีเทา) ไม่ใช่ text-primary */}
                                <button className="btn btn-light rounded-circle btn-sm shadow-sm" onClick={handleCloseModal}><FontAwesomeIcon icon={faTimes} /></button>
                            </div>
                            <div className="p-4 overflow-y-auto custom-scrollbar">
                                <div className="row g-4">
                                    <div className="col-md-6 border-end pe-4">
                                        <div className="row g-3">
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">ชื่อ</label><input className="form-control form-control-premium" name="firstName" value={contactForm.firstName} onChange={handleContactChange} /></div>
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">นามสกุล</label><input className="form-control form-control-premium" name="lastName" value={contactForm.lastName} onChange={handleContactChange} /></div>
                                            {/* ✅ ล็อคตัวเลขใน Modal */}
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">เบอร์โทรศัพท์ (ตัวเลข)</label><input className="form-control form-control-premium" name="phone" value={contactForm.phone} onChange={handleContactNumericChange} maxLength={10} /></div>
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">อีเมล</label><input className="form-control form-control-premium" name="email" value={contactForm.email} onChange={handleContactChange} /></div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 ps-4">
                                        <div className="row g-3">
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">รายละเอียดเพิ่มเติม</label><textarea className="form-control form-control-premium" rows="4" style={{resize: 'none'}} name="details" value={contactForm.details} onChange={handleContactChange}></textarea></div>
                                            
                                            {/* ✅ ส่วนแนบไฟล์ (UI ตามภาพ) */}
                                            <div className="col-12 mt-2">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <label className="form-label small fw-bold text-dark ps-1 mb-0">Attachments</label>
                                                    {contactAttachments.length > 0 && <span className="badge bg-warning text-dark rounded-pill">{contactAttachments.length} files</span>}
                                                </div>

                                                <input type="file" multiple ref={contactFileInputRef} style={{ display: 'none' }} onChange={handleContactFileChange} />

                                                {/* File List */}
                                                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                    {contactAttachments.map((file, index) => {
                                                        const fileType = getFileIcon(file.name);
                                                        return (
                                                            <div key={index} className="d-flex align-items-center p-2 bg-white border rounded shadow-sm position-relative">
                                                                <div className="rounded p-2 d-flex align-items-center justify-content-center me-3" style={{backgroundColor: fileType.bg, width:'35px', height:'35px'}}>
                                                                    <FontAwesomeIcon icon={fileType.icon} style={{color: fileType.color}} />
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                                                                    <div className="fw-bold text-dark text-truncate small">{file.name}</div>
                                                                    <div className="d-flex align-items-center text-muted" style={{fontSize: '0.7rem'}}>
                                                                        <span>{formatFileSize(file.size)}</span>
                                                                        <span className="mx-2">•</span>
                                                                        <span className="text-success fw-bold d-flex align-items-center"><FontAwesomeIcon icon={faCheckCircle} className="me-1"/> Ready</span>
                                                                    </div>
                                                                </div>
                                                                <button type="button" className="btn btn-link text-danger p-1 ms-2" onClick={() => removeContactAttachment(index)}>
                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                </button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                {/* ปุ่ม Add File (แบบเส้นประตามเดิม) */}
                                                <button type="button" className="btn btn-outline-secondary w-100 rounded-pill fw-bold text-dark border-secondary-subtle px-3 py-2 d-inline-flex align-items-center justify-content-center shadow-sm bg-white hover-bg-light" style={{ fontSize: '0.9rem', borderStyle: 'dashed' }} onClick={() => contactFileInputRef.current.click()}><FontAwesomeIcon icon={faPlus} className="me-2"/> Add Attachment</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-top bg-light rounded-bottom-4 text-end">
                                {/* 🛑 ใช้ Style เดิม: btn-light text-dark (สีดำ/เทา) */}
                                <button className="btn btn-light border fw-bold px-4 me-2 text-dark" onClick={handleCloseModal}>ยกเลิก</button>
                                <button className="btn btn-premium-primary text-white px-5" onClick={handleAddContactToList}>บันทึก</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerPage;