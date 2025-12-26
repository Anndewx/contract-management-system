import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faPhone, faFileAlt, faFileInvoice, faProjectDiagram, 
  faArrowLeft, faPlus, faSearch, faEdit, faTrash, faTimes, faPaperclip,
  faBriefcase, faChevronRight, faCheckCircle, faChevronDown,
  faFilePdf, faFileWord, faFileExcel, faFileImage 
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5056/api";

const EditCustomerPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('general');
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '', taxId: '', email: '', phone: '', website: '', 
    address: '', province: '', district: '', subDistrict: '', zipcode: ''
  });

  // --- Contact State ---
  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null); 

  // --- Contact Modal State ---
  const [contactForm, setContactForm] = useState({
      firstName: '', lastName: '', phone: '', email: '', details: ''
  });
  const [contactAttachments, setContactAttachments] = useState([]);
  const contactFileInputRef = useRef(null);

  // --- 1. Fetch Data ---
  useEffect(() => {
      const fetchData = async () => {
          try {
              // ดึงข้อมูลลูกค้า
              const res = await fetch(`${API_BASE_URL}/Customers/${id}`);
              if (!res.ok) throw new Error("Customer not found");
              const data = await res.json();

              setFormData({
                  name: data.name || data.Name || '',
                  taxId: data.taxId || data.TaxId || '',
                  email: data.email || data.Email || '',
                  phone: data.phone || data.Phone || '',
                  website: data.website || data.Website || '',
                  address: data.address || data.Address || '',
                  province: data.province || 'กรุงเทพมหานคร',
                  district: data.district || 'หลักสี่',
                  subDistrict: data.subDistrict || 'ทุ่งสองห้อง',
                  zipcode: data.zipcode || data.Zipcode || ''
              });

              // ดึงข้อมูลผู้ติดต่อ
              if (data.contacts && Array.isArray(data.contacts)) {
                  setContacts(data.contacts);
              } else {
                  const resContacts = await fetch(`${API_BASE_URL}/Contact`);
                  if (resContacts.ok) {
                      const allContacts = await resContacts.json();
                      const myContacts = allContacts.filter(c => c.customerId == id || c.CustomerId == id);
                      setContacts(myContacts.map(c => ({
                          id: c.id || c.Id,
                          firstName: c.firstName || c.FirstName,
                          lastName: c.lastName || c.LastName,
                          phone: c.phone || c.Phone,
                          email: c.email || c.Email,
                          details: c.details || c.Details,
                          attachments: []
                      })));
                  }
              }
          } catch (error) {
              console.error("Error:", error);
              Swal.fire('Error', 'ไม่พบข้อมูลลูกค้า', 'error').then(() => navigate('/customers'));
          } finally {
              setLoading(false);
          }
      };

      if (id) fetchData();
  }, [id, navigate]);

  // --- Functions ---
  const handleNumericInput = (e, setFunction, state) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) { 
        setFunction({ ...state, [name]: value });
    }
  };

  // ✅ ฟังก์ชันบันทึก (แก้ไขให้ส่ง key ตัวใหญ่ตรงกับ C# Model)
  const handleSave = async () => {
    if (!formData.name) {
        Swal.fire('แจ้งเตือน', 'กรุณาระบุชื่อบริษัท/หน่วยงาน', 'warning');
        return;
    }

    const contactsPayload = contacts.map(c => ({
        // ถ้า ID สั้น (<10) คือของเดิม ให้ส่ง ID ไป update
        // ถ้า ID ยาว (Timestamp) คือของใหม่ ให้ส่ง 0 ไป insert
        Id: (String(c.id).length < 10) ? c.id : 0, 
        FirstName: c.firstName,
        LastName: c.lastName,
        Phone: c.phone,
        Email: c.email,
        Details: c.details,
        CustomerId: parseInt(id)
    }));

    // สร้าง Payload ใหม่ โดยใช้ Key ตัวพิมพ์ใหญ่ (PascalCase) ให้ตรงกับ Backend ชัวร์ๆ
    const payload = { 
        Id: parseInt(id),
        Name: formData.name,
        TaxId: formData.taxId,
        Email: formData.email,
        Phone: formData.phone,
        Website: formData.website,
        Address: formData.address,
        Province: formData.province,
        District: formData.district,
        SubDistrict: formData.subDistrict,
        Zipcode: formData.zipcode,
        Contacts: contactsPayload 
    };

    try {
        const response = await fetch(`${API_BASE_URL}/Customers/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Swal.fire({ icon: 'success', title: 'บันทึกการแก้ไขสำเร็จ', showConfirmButton: false, timer: 1500 });
            navigate('/customers'); 
        } else {
            const err = await response.text();
            console.error("Server Error:", err);
            Swal.fire('Error', 'บันทึกไม่สำเร็จ กรุณาตรวจสอบข้อมูล', 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'ไม่สามารถเชื่อมต่อ Server ได้', 'error');
    }
  };

  const handleDeleteCustomer = async () => {
      const result = await Swal.fire({
          title: 'ลบบัญชีลูกค้านี้?',
          text: "ข้อมูลทั้งหมดจะหายไปและกู้คืนไม่ได้",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'ยืนยันการลบ'
      });

      if (result.isConfirmed) {
          try {
              const res = await fetch(`${API_BASE_URL}/Customers/${id}`, { method: 'DELETE' });
              if (res.ok) {
                  Swal.fire('Deleted!', 'ลบข้อมูลเรียบร้อย', 'success');
                  navigate('/customers');
              } else {
                  Swal.fire('Error', 'ลบข้อมูลไม่สำเร็จ', 'error');
              }
          } catch(err) {
              Swal.fire('Error', 'Connection Error', 'error');
          }
      }
  }

  // --- Contact Logic ---

  const handleEditContactClick = (contact) => {
      setContactForm({
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          phone: contact.phone || '',
          email: contact.email || '',
          details: contact.details || ''
      });
      setContactAttachments(contact.attachments || []);
      setEditingContactId(contact.id); 
      setShowContactModal(true); 
  };

  const handleSaveContactToList = () => {
    if (!contactForm.firstName) return Swal.fire('แจ้งเตือน', 'ระบุชื่อผู้ติดต่อ', 'warning');
    
    if (editingContactId) {
        setContacts(prev => prev.map(c => 
            c.id === editingContactId 
            ? { ...c, ...contactForm, attachments: contactAttachments } 
            : c
        ));
    } else {
        const newContact = { ...contactForm, id: Date.now(), attachments: contactAttachments };
        setContacts(prev => [...prev, newContact]);
    }
    
    handleCloseModal();
  };

  const handleCloseModal = () => {
      setShowContactModal(false);
      setContactAttachments([]);
      setContactForm({ firstName: '', lastName: '', phone: '', email: '', details: '' });
      setEditingContactId(null); 
  };

  // --- Helpers ---
  const handleContactFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) setContactAttachments(prev => [...prev, ...files]);
    e.target.value = null; 
  };
  const removeContactAttachment = (index) => setContactAttachments(prev => prev.filter((_, i) => i !== index));
  const handleContactChange = (e) => setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleContactNumericChange = (e) => {
      const { value } = e.target;
      if (value === '' || /^\d+$/.test(value)) setContactForm(prev => ({ ...prev, [e.target.name]: value }));
  };
  const getFileIcon = (fileName) => {
      const ext = fileName?.split('.').pop().toLowerCase() || '';
      if (['jpg', 'jpeg', 'png'].includes(ext)) return { icon: faFileImage, color: '#f59e0b', bg: '#fffbeb' };
      if (['pdf'].includes(ext)) return { icon: faFilePdf, color: '#ef4444', bg: '#fef2f2' };
      return { icon: faFileAlt, color: '#6b7280', bg: '#f3f4f6' };
  };

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

  // --- Styles ---
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

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <style>{premiumStyles}</style>
      
      {/* Header */}
      <div className="d-flex align-items-start mb-4 ps-1">
        <button className="btn btn-link text-dark me-3 p-0 mt-1 opacity-75 hover-opacity-100" onClick={() => navigate('/customers')}>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <div>
            <h3 className="fw-bold mb-1 text-black" style={{ letterSpacing: '-0.5px' }}>รายละเอียดลูกค้า</h3>
            <span className="text-muted small">จัดการข้อมูลและประวัติของลูกค้า</span>
        </div>
      </div>

      <div className="row g-4">
        {/* --- Left Sidebar --- */}
        <div className="col-12 col-lg-3">
            <div className="card-premium h-100 d-flex flex-column">
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
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-normal">
                            CUSTOMER ID: {id}
                        </span>
                    </div>
                    
                    <div className="w-100 d-flex flex-column gap-1 px-1 flex-grow-1">
                        <SidebarButton tabName="general" label="ข้อมูลทั่วไป" icon={faBriefcase} />
                        <SidebarButton tabName="contact" label="ผู้ติดต่อ" icon={faPhone} />
                        <SidebarButton tabName="quotation" label="ใบเสนอราคา" icon={faFileAlt} />
                        <SidebarButton tabName="invoice" label="ใบแจ้งหนี้" icon={faFileInvoice} />
                        <SidebarButton tabName="project" label="โปรเจกต์" icon={faProjectDiagram} />
                    </div>
                </div>
                
                <div className="p-4 border-top">
                    <button 
                        className="btn btn-outline-danger w-100 fw-bold border-0 bg-danger-subtle text-danger"
                        onClick={handleDeleteCustomer}
                    >
                        <FontAwesomeIcon icon={faTrash} className="me-2"/> ลบบัญชีลูกค้านี้
                    </button>
                </div>
            </div>
        </div>

        {/* --- Right Content --- */}
        <div className="col-12 col-lg-9">
            <div className="card-premium h-100 d-flex flex-column" style={{ minHeight: '650px' }}>
                <div className="card-body p-4 p-md-5 flex-grow-1">
                    
                    {loading ? (
                        <div className="text-center py-5 text-muted">กำลังโหลดข้อมูล...</div>
                    ) : (
                        <>
                            {/* 1. General Info */}
                            {activeTab === 'general' && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                        <h4 className="fw-bold text-dark m-0">ข้อมูลทั่วไป</h4>
                                    </div>
                                    <form className="row g-4">
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">หน่วยงาน/บริษัท</label><input type="text" className="form-control form-control-premium" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} /></div>
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">หมายเลขผู้เสียภาษี</label><input type="text" className="form-control form-control-premium" name="taxId" value={formData.taxId} onChange={(e) => handleNumericInput(e, setFormData, formData)} maxLength={13} /></div>
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">อีเมลติดต่อ</label><input type="email" className="form-control form-control-premium" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} /></div>
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">เบอร์โทรศัพท์</label><input type="text" className="form-control form-control-premium" name="phone" value={formData.phone} onChange={(e) => handleNumericInput(e, setFormData, formData)} maxLength={10} /></div>
                                        <div className="col-md-12"><label className="form-label fw-bold small text-dark ps-1">เว็บไซต์</label><input type="text" className="form-control form-control-premium" value={formData.website} onChange={(e)=>setFormData({...formData, website: e.target.value})} /></div>
                                        <div className="col-12"><label className="form-label fw-bold small text-dark ps-1">ที่อยู่</label><textarea className="form-control form-control-premium" rows="2" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} style={{ resize: 'none' }}></textarea></div>
                                        
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">จังหวัด</label><select className="form-select form-select-premium" value={formData.province} onChange={(e)=>setFormData({...formData, province: e.target.value})}><option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option></select></div>
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">อำเภอ/เขต</label><select className="form-select form-select-premium" value={formData.district} onChange={(e)=>setFormData({...formData, district: e.target.value})}><option value="หลักสี่">หลักสี่</option></select></div>
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">ตำบล/แขวง</label><select className="form-select form-select-premium" value={formData.subDistrict} onChange={(e)=>setFormData({...formData, subDistrict: e.target.value})}><option value="ทุ่งสองห้อง">ทุ่งสองห้อง</option></select></div>
                                        <div className="col-md-6"><label className="form-label fw-bold small text-dark ps-1">รหัสไปรษณีย์</label><input type="text" className="form-control form-control-premium" name="zipcode" value={formData.zipcode} onChange={(e) => handleNumericInput(e, setFormData, formData)} maxLength={5} /></div>
                                    </form>
                                </div>
                            )}

                            {/* 2. Contacts */}
                            {activeTab === 'contact' && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                        <h4 className="fw-bold m-0 text-dark">รายชื่อผู้ติดต่อ</h4>
                                        <button className="btn btn-premium-primary text-white btn-sm" onClick={() => { setEditingContactId(null); setShowContactModal(true); }}>
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
                                                    <tr><td colSpan="3" className="text-center py-4 text-muted">ยังไม่มีข้อมูลผู้ติดต่อ</td></tr>
                                                ) : (
                                                    contacts.map((c, idx) => (
                                                        <tr key={c.id || idx}>
                                                            <td className="py-3 ps-3 fw-bold text-dark">{c.firstName} {c.lastName}</td>
                                                            <td className="py-3 small text-muted">{c.email} | {c.phone} <br/> {c.details}
                                                                {c.attachments && c.attachments.length > 0 && <span className="badge bg-light text-dark border ms-2"><FontAwesomeIcon icon={faPaperclip}/> {c.attachments.length}</span>}
                                                            </td>
                                                            <td className="py-3 text-end pe-3">
                                                                {/* ✅ ปุ่มแก้ไข */}
                                                                <button className="btn btn-light btn-sm rounded-circle me-2 shadow-sm" onClick={() => handleEditContactClick(c)}>
                                                                    <FontAwesomeIcon icon={faEdit} className="text-primary"/>
                                                                </button>
                                                                <button className="btn btn-light btn-sm rounded-circle shadow-sm text-danger" onClick={() => setContacts(contacts.filter(item => item !== c))}><FontAwesomeIcon icon={faTrash}/></button>
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
                                <div className="text-center py-5 text-muted">
                                    <FontAwesomeIcon icon={faProjectDiagram} size="3x" className="mb-3 text-secondary opacity-50"/>
                                    <p>ประวัติ {activeTab} (Mock Data)</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Buttons */}
                {activeTab === 'general' && (
                    <div className="card-footer bg-white border-top p-4 d-flex justify-content-end align-items-center gap-3" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
                        <button className="btn btn-light border fw-bold px-4 py-2 rounded-3 text-dark hover-shadow" onClick={() => navigate('/customers')}>ย้อนกลับ</button>
                        <button className="btn btn-premium-primary text-white px-4 py-2" onClick={handleSave}>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2"/> บันทึกการแก้ไข
                        </button>
                    </div>
                )}

                {/* Modal เพิ่ม/แก้ไข */}
                {showContactModal && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', zIndex: 10, borderRadius: '20px' }}>
                        <div className="bg-white shadow-lg rounded-4 p-0 border d-flex flex-column" style={{ width: '800px', maxHeight: '95vh', borderColor: '#e2e8f0' }}>
                            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                                <h5 className="fw-bold m-0 text-dark">
                                    {editingContactId ? 'แก้ไขผู้ติดต่อ' : 'เพิ่มผู้ติดต่อ'}
                                </h5>
                                <button className="btn btn-light rounded-circle btn-sm shadow-sm" onClick={handleCloseModal}><FontAwesomeIcon icon={faTimes} /></button>
                            </div>
                            <div className="p-4 overflow-y-auto custom-scrollbar">
                                <div className="row g-4">
                                    <div className="col-md-6 border-end pe-4">
                                        <div className="row g-3">
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">ชื่อ</label><input className="form-control form-control-premium" name="firstName" value={contactForm.firstName} onChange={handleContactChange} /></div>
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">นามสกุล</label><input className="form-control form-control-premium" name="lastName" value={contactForm.lastName} onChange={handleContactChange} /></div>
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">เบอร์โทรศัพท์ (ตัวเลข)</label><input className="form-control form-control-premium" name="phone" value={contactForm.phone} onChange={handleContactNumericChange} maxLength={10} /></div>
                                            <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">อีเมล</label><input className="form-control form-control-premium" name="email" value={contactForm.email} onChange={handleContactChange} /></div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 ps-4">
                                         <div className="col-12"><label className="form-label small fw-bold text-dark ps-1">รายละเอียด</label><textarea className="form-control form-control-premium" rows="4" name="details" value={contactForm.details} onChange={handleContactChange}></textarea></div>
                                         <div className="col-12 mt-3">
                                            <input type="file" multiple ref={contactFileInputRef} style={{ display: 'none' }} onChange={handleContactFileChange} />
                                            <button type="button" className="btn btn-outline-secondary w-100 rounded-pill fw-bold text-dark border-secondary-subtle px-3 py-2 d-inline-flex align-items-center justify-content-center shadow-sm bg-white hover-bg-light" style={{ fontSize: '0.9rem', borderStyle: 'dashed' }} onClick={() => contactFileInputRef.current.click()}><FontAwesomeIcon icon={faPlus} className="me-2"/> Add Attachment</button>
                                            <div className="mt-2">
                                                {contactAttachments.map((file, index) => (
                                                    <div key={index} className="small text-muted">{file.name}</div>
                                                ))}
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-top bg-light rounded-bottom-4 text-end">
                                <button className="btn btn-light border fw-bold px-4 me-2 text-dark" onClick={handleCloseModal}>ยกเลิก</button>
                                <button className="btn btn-premium-primary text-white px-5" onClick={handleSaveContactToList}>บันทึก</button>
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

export default EditCustomerPage;