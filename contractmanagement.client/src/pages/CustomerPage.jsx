import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faBuilding, faPhone, 
  faFileAlt, faTimes, faPaperclip, faSearch, faProjectDiagram, faFileInvoice
} from "@fortawesome/free-solid-svg-icons";

// Custom CSS styles
const customStyles = `
  /* Hover Effects */
  .hover-shadow:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }

  /* Close Button Custom */
  .btn-close-custom {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f3f4f6;
    color: #000000; /* Black Icon */
    transition: all 0.2s;
    border: none;
  }
  .btn-close-custom:hover {
    background-color: #e5e7eb;
    color: #000000;
  }

  /* Modal Overlay Blur */
  .contact-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(8px);
    z-index: 1050;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Utilities */
  .cursor-pointer { cursor: pointer; }
  .text-black-force { color: #000000 !important; }
`;

const CustomerPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); 
  const [showContactModal, setShowContactModal] = useState(false); 

  // Form State
  const [formData, setFormData] = useState({
    name: '', taxId: '', email: '', phone: '', website: '',
    address: '', province: '', district: '', subDistrict: '', zipcode: ''
  });

  // Mock Data: Customers
  const [data, setData] = useState([
    { id: 1, name: 'บริษัท โทรคมนาคมแห่งชาติ จำกัด (NT)', address: '99 ถนนแจ้งวัฒนะ...', email: '1888@ntplc.co.th', phone: '1888', status: true },
    { id: 2, name: 'การไฟฟ้าส่วนภูมิภาค (PEA)', address: '200 ถนนงามวงศ์วาน...', email: '1129@pea.co.th', phone: '1129', status: true },
    { id: 3, name: 'บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)', address: '333 ถนนเชิดวุฒากาศ...', email: 'aot_info@airportthai.co.th', phone: '0-2535-1111', status: true }
  ]);

  // Mock Data: Contacts
  const [contacts, setContacts] = useState([
    { id: 1, firstName: 'Jake', lastName: 'Gyllenhaal', desc: 'View Channels & Profiles, View Finances' },
    { id: 2, firstName: 'Emmy', lastName: 'Rossum', desc: 'View Channels & Profiles' }
  ]);

  // Mock Data: Quotations (ใบเสนอราคา)
  const [quotations, setQuotations] = useState([
    { id: 'INNO-00001', desc: 'xxxx' },
    { id: 'INNO-00002', desc: 'xxxx' }
  ]);

  // Mock Data: Invoices (ใบแจ้งหนี้)
  const [invoices, setInvoices] = useState([
    { id: 'INNO-00001', desc: 'xxxx' },
    { id: 'INNO-00002', desc: 'xxxx' }
  ]);

  // Mock Data: Projects (โปรเจกต์)
  const [projects, setProjects] = useState([
    { id: 1, name: 'โครงการที่ 1', status: 'ปิดโครงการ' },
    { id: 2, name: 'โครงการที่ 2', status: 'ปิดโครงการ' },
    { id: 3, name: 'โครงการที่ 3', status: 'ดำเนินการ' }
  ]);


  const handleOpenModal = () => {
    setFormData({ name: '', taxId: '', email: '', phone: '', website: '', address: '', province: '', district: '', subDistrict: '', zipcode: '' });
    setActiveTab('general');
    setShowContactModal(false);
    setShowModal(true);
  };

  const handleSave = () => {
    alert("บันทึกข้อมูลสำเร็จ (Mock Save)");
    setShowModal(false);
  };

  // ✅ เปลี่ยนจาก toggleStatus เป็น handleDelete
  const handleDelete = (id) => {
    if(window.confirm("คุณต้องการลบข้อมูลลูกค้ารายนี้ใช่หรือไม่?")) {
        setData(data.filter(item => item.id !== id));
    }
  };

  // Helper function for Sidebar Button
  const SidebarButton = ({ tabName, label, icon }) => (
    <button 
        onClick={() => setActiveTab(tabName)}
        className={`btn w-100 text-start py-2 px-3 rounded-3 fw-bold border-0 d-flex align-items-center mb-1 ${
            activeTab === tabName ? 'bg-light text-black' : 'bg-white text-black hover-shadow'
        }`}
    >
        <FontAwesomeIcon icon={icon} className="me-3" width="16" /> {label}
    </button>
  );

  return (
    <div className="container-fluid p-0" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
      <style>{customStyles}</style>
      
      {/* --- Header Section --- */}
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4 border border-light">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div>
                <h4 className="fw-bold mb-1 text-black">ข้อมูลและประวัติลูกค้า Customer Management</h4>
                <span className="text-black" style={{ fontSize: '0.9rem' }}>จัดการรายชื่อลูกค้าและหน่วยงานคู่ค้า</span>
            </div>
            <button 
            className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center" 
            style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }} /* <-- ใส่สีฟ้าตรงนี้ */
            onClick={handleOpenModal}
>
        <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มลูกค้าใหม่
        </button>
        </div>
      </div>

      {/* --- Main Table --- */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th className="py-3 ps-4 text-black fw-bold" style={{fontSize:'0.85rem'}}>NO.</th>
                <th className="py-3 text-black fw-bold" style={{fontSize:'0.85rem'}}>ชื่อหน่วยงาน/บริษัท</th>
                <th className="py-3 text-black fw-bold" style={{fontSize:'0.85rem'}}>ที่อยู่</th>
                <th className="py-3 text-black fw-bold" style={{fontSize:'0.85rem'}}>อีเมล</th>
                <th className="py-3 text-black fw-bold" style={{fontSize:'0.85rem'}}>เบอร์โทรศัพท์</th>
                <th className="py-3 text-center text-black fw-bold" style={{fontSize:'0.85rem', width: '150px'}}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                  <td className="py-4 ps-4 small text-black">{index + 1}</td>
                  <td className="py-4 fw-bold text-black">{item.name}</td>
                  <td className="py-4 small text-black text-truncate" style={{maxWidth: '200px'}}>{item.address}</td>
                  <td className="py-4 small text-black">{item.email}</td>
                  <td className="py-4 small text-black">{item.phone}</td>
                  
                  {/* ✅ ส่วนจัดการ: แก้ไขเป็นปุ่ม Edit คู่กับ Delete */}
                  <td className="py-4 text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {/* ปุ่มแก้ไข */}
                        <button className="btn btn-white border shadow-sm rounded hover-shadow d-flex align-items-center justify-content-center" style={{width:'36px', height:'36px'}}>
                            <FontAwesomeIcon icon={faEdit} className="text-black" style={{fontSize: '14px'}}/>
                        </button>
                        
                        {/* ปุ่มลบ (เปลี่ยนจากสวิตช์เขียว) */}
                        <button 
                            className="btn btn-white border shadow-sm rounded hover-shadow d-flex align-items-center justify-content-center" 
                            style={{width:'36px', height:'36px'}}
                            onClick={() => handleDelete(item.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-danger" style={{fontSize: '14px'}}/>
                        </button>
                      </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <div className="text-black small">แสดง 1 ถึง 3 จาก 3 รายการ</div>
            <nav>
                <ul className="pagination pagination-sm mb-0 gap-1">
                    <li className="page-item active">
                        <button className="page-link border-0 rounded-3 shadow-sm px-3 bg-black text-white fw-bold">1</button>
                    </li>
                    <li className="page-item"><button className="page-link border-0 text-black bg-transparent rounded-3 hover-shadow px-3">2</button></li>
                </ul>
            </nav>
        </div>
      </div>

      {/* --- Main Modal (Customer Detail) --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-xl" style={{maxWidth: '1140px'}}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden" style={{ minHeight: '750px' }}>
              
              <div className="modal-body p-0">
                <div className="row g-0 h-100">
                    
                    {/* Left Sidebar Menu */}
                    <div className="col-12 col-lg-3 border-end p-4 d-flex flex-column bg-white align-items-center">
                        <div className="mb-5 text-center mt-4">
                            <div className="rounded-circle p-1 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '110px', height: '110px', border: '3px solid #000' }}>
                                <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden">
                                    <span className="fw-bold fs-4 text-black">LOGO</span> 
                                </div>
                            </div>
                            <h6 className="fw-bold mb-1 text-black px-2">บริษัท โทรคมนาคมแห่งชาติ จำกัด</h6>
                            <small className="text-black" style={{ fontSize: '0.7rem' }}>NATIONAL TELECOM PUBLIC COMPANY LIMITED.</small>
                        </div>

                        <div className="w-100 d-flex flex-column gap-2 px-2">
                            <SidebarButton tabName="general" label="ข้อมูลทั่วไป" icon={faBuilding} />
                            <SidebarButton tabName="contact" label="ติดต่อ" icon={faPhone} />
                            <SidebarButton tabName="quotation" label="ใบเสนอราคา" icon={faFileAlt} />
                            <SidebarButton tabName="invoice" label="ใบแจ้งหนี้" icon={faFileInvoice} />
                            <SidebarButton tabName="project" label="โปรเจกต์" icon={faProjectDiagram} />
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="col-12 col-lg-9 bg-light position-relative p-0">
                        
                        {/* Close Button (Black) */}
                        <button 
                            className="btn-close-custom position-absolute top-0 end-0 m-3 shadow-sm"
                            onClick={() => setShowModal(false)}
                            style={{ zIndex: 100 }}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <div className="h-100 p-4 p-md-5 overflow-auto">
                            
                            {/* === Tab 1: General Info === */}
                            {activeTab === 'general' && (
                                <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100 animate__animated animate__fadeIn">
                                    <h4 className="fw-bold mb-4 text-black">ข้อมูลทั่วไป</h4>
                                    <form className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-black ps-1">หน่วยงาน/บริษัท</label>
                                            <input type="text" className="form-control bg-light border-0 p-3 fw-bold text-black rounded-3" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-black ps-1">หมายเลขผู้เสียภาษี</label>
                                            <input type="text" className="form-control bg-light border-0 p-3 fw-bold text-black rounded-3" value={formData.taxId} onChange={(e)=>setFormData({...formData, taxId: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-black ps-1">Email</label>
                                            <input type="email" className="form-control bg-light border-0 p-3 fw-bold text-black rounded-3" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-black ps-1">เบอร์โทรศัพท์</label>
                                            <input type="text" className="form-control bg-light border-0 p-3 fw-bold text-black rounded-3" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-black ps-1">ที่อยู่</label>
                                            <textarea className="form-control bg-light border-0 p-3 fw-bold text-black rounded-3" rows="2" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})}></textarea>
                                        </div>
                                        
                                        <div className="col-12 text-end mt-5">
                                            <button type="button" className="btn btn-light text-black fw-bold me-2 px-4 py-2 rounded-3" onClick={() => setShowModal(false)}>ยกเลิก</button>
                                            <button type="button" className="btn btn-dark px-5 py-2 fw-bold rounded-3" onClick={handleSave}>บันทึก</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* === Tab 2: Contact Info === */}
                            {activeTab === 'contact' && (
                                <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100 d-flex flex-column animate__animated animate__fadeIn">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold m-0 text-black">รายชื่อผู้ติดต่อ</h4>
                                        <button className="btn btn-primary border-0 px-3 py-2 fw-bold shadow-sm rounded-3" style={{backgroundColor: '#0ea5e9'}} onClick={() => setShowContactModal(true)}>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มผู้ติดต่อ
                                        </button>
                                    </div>
                                    <p className="text-black fw-bold mb-3 small">You gave access to the following cabinets:</p>
                                    <div className="table-responsive flex-grow-1">
                                        <table className="table align-middle">
                                            <thead>
                                                <tr className="border-bottom border-2">
                                                    <th className="py-3 ps-0 border-0 fw-bold text-black">ชื่อ - สกุล</th>
                                                    <th className="py-3 border-0 fw-bold text-black">รายละเอียด</th>
                                                    <th className="py-3 text-end border-0 fw-bold text-black pe-3">ส่วนจัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.map((c, index) => (
                                                    <tr key={c.id} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'}}>
                                                        <td className="py-3 ps-0 fw-bold text-black">{c.firstName} {c.lastName}</td>
                                                        <td className="py-3 small" style={{ color: '#000000' }}>{c.desc}</td>
                                                        <td className="py-3 text-end pe-2">
                                                            <button className="btn btn-link p-1 me-2 hover-shadow" style={{ color: '#000000' }}><FontAwesomeIcon icon={faEdit} /></button>
                                                            <button className="btn btn-link p-1 hover-shadow" style={{ color: '#000000' }}><FontAwesomeIcon icon={faTrash} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                             {/* === Tab 3: Quotation (ใบเสนอราคา) === */}
                             {activeTab === 'quotation' && (
                                <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100 d-flex flex-column animate__animated animate__fadeIn">
                                    <div className="mb-4">
                                        <button className="btn btn-primary border-0 px-3 py-2 fw-bold shadow-sm rounded-3 mb-3" style={{backgroundColor: '#0ea5e9'}}>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มใบเสนอราคา
                                        </button>
                                        <p className="text-black small mb-3">You gave access to the following cabinets:</p>
                                        <div className="d-flex gap-2">
                                            <div style={{width: '200px'}}>
                                                <label className="small text-black fw-bold mb-1 ps-1">ปี</label>
                                                <select className="form-select border text-black bg-light rounded-3 shadow-sm">
                                                    <option>2568</option>
                                                </select>
                                            </div>
                                            <div className="flex-grow-1">
                                                <label className="small text-black fw-bold mb-1 ps-1">&nbsp;</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0"><FontAwesomeIcon icon={faSearch} className="text-black-50"/></span>
                                                    <input type="text" className="form-control bg-light border-start-0 text-black" placeholder="Search or type a command (Ctrl + G)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive flex-grow-1">
                                        <table className="table align-middle">
                                            <thead>
                                                <tr className="border-bottom border-2">
                                                    <th className="py-3 ps-0 border-0 fw-bold text-black">เลขที่ใบเสนอราคา</th>
                                                    <th className="py-3 border-0 fw-bold text-black">รายละเอียด</th>
                                                    <th className="py-3 text-end border-0 fw-bold text-black pe-3">ส่วนจัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {quotations.map((q, index) => (
                                                    <tr key={index} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'}}>
                                                        <td className="py-3 ps-0 text-black">{q.id}</td>
                                                        <td className="py-3 small text-black">{q.desc}</td>
                                                        <td className="py-3 text-end pe-2">
                                                            <button className="btn btn-link p-1 me-2 hover-shadow" style={{ color: '#000000' }}><FontAwesomeIcon icon={faEdit} /></button>
                                                            <button className="btn btn-link p-1 hover-shadow" style={{ color: '#000000' }}><FontAwesomeIcon icon={faTrash} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* === Tab 4: Invoice (ใบแจ้งหนี้) === */}
                            {activeTab === 'invoice' && (
                                <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100 d-flex flex-column animate__animated animate__fadeIn">
                                    <div className="mb-4">
                                        <button className="btn btn-primary border-0 px-3 py-2 fw-bold shadow-sm rounded-3 mb-3" style={{backgroundColor: '#0ea5e9'}}>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มใบแจ้งหนี้
                                        </button>
                                        <p className="text-black fw-bold mb-2">ใส่คำอธิบาย...</p>
                                        <div style={{width: '200px'}}>
                                            <label className="small text-black fw-bold mb-1 ps-1">ปี</label>
                                            <select className="form-select border text-black bg-light rounded-3 shadow-sm">
                                                <option>2568</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="table-responsive flex-grow-1">
                                        <table className="table align-middle">
                                            <thead>
                                                <tr className="border-bottom border-2">
                                                    <th className="py-3 ps-0 border-0 fw-bold text-black">เลขที่ใบแจ้งหนี้</th>
                                                    <th className="py-3 border-0 fw-bold text-black">รายละเอียด</th>
                                                    <th className="py-3 text-end border-0 fw-bold text-black pe-3">ส่วนจัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoices.map((inv, index) => (
                                                    <tr key={index} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'}}>
                                                        <td className="py-3 ps-0 text-black">{inv.id}</td>
                                                        <td className="py-3 small text-black">{inv.desc}</td>
                                                        <td className="py-3 text-end pe-2">
                                                            <button className="btn btn-link p-1 me-2 hover-shadow" style={{ color: '#000000' }}><FontAwesomeIcon icon={faEdit} /></button>
                                                            <button className="btn btn-link p-1 hover-shadow" style={{ color: '#000000' }}><FontAwesomeIcon icon={faTrash} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* === Tab 5: Project (โปรเจกต์) === */}
                            {activeTab === 'project' && (
                                <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100 d-flex flex-column animate__animated animate__fadeIn">
                                    <div className="mb-4">
                                        <p className="text-black fw-bold mb-2">ใส่คำอธิบาย...</p>
                                        <div style={{width: '200px'}}>
                                            <label className="small text-black fw-bold mb-1 ps-1">ปี</label>
                                            <select className="form-select border text-black bg-light rounded-3 shadow-sm">
                                                <option>2568</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="table-responsive flex-grow-1">
                                        <table className="table align-middle">
                                            <thead>
                                                <tr className="border-bottom border-2">
                                                    <th className="py-3 ps-0 border-0 fw-bold text-black text-center" style={{width: '80px'}}>No.</th>
                                                    <th className="py-3 border-0 fw-bold text-black">ชื่อโครงการ</th>
                                                    <th className="py-3 text-end border-0 fw-bold text-black pe-3">สถานะ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projects.map((proj, index) => (
                                                    <tr key={index} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'}}>
                                                        <td className="py-3 ps-0 text-center text-black">{proj.id}</td>
                                                        <td className="py-3 text-black">{proj.name}</td>
                                                        <td className="py-3 text-end pe-2">
                                                            <div className="d-flex align-items-center justify-content-end gap-3">
                                                                <span className="small text-black">{proj.status}</span>
                                                                <button className="btn btn-link p-0 hover-shadow" style={{ color: '#000000' }}><FontAwesomeIcon icon={faEdit} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* --- Nested Modal: Add Contact (Overlay) --- */}
                        {showContactModal && (
                            <div className="contact-modal-overlay animate__animated animate__fadeIn">
                                <div className="bg-white shadow-lg rounded-4 overflow-hidden animate__animated animate__zoomIn" 
                                     style={{ width: '90%', maxWidth: '600px', maxHeight: '90%', border: '1px solid #e2e8f0' }}>
                                    
                                    {/* Modal Header */}
                                    <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                                        <h5 className="fw-bold m-0 text-black">เพิ่มผู้ติดต่อ</h5>
                                        <button className="btn btn-light rounded-circle btn-sm" onClick={() => setShowContactModal(false)}>
                                            <FontAwesomeIcon icon={faTimes} className="text-black" />
                                        </button>
                                    </div>
                                    
                                    {/* Modal Body */}
                                    <div className="p-4 overflow-auto" style={{maxHeight: '60vh'}}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-black ps-1">ชื่อ</label>
                                                <input type="text" className="form-control bg-light border-0 p-3 rounded-3 text-black" placeholder="ระบุชื่อจริง" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-black ps-1">สกุล</label>
                                                <input type="text" className="form-control bg-light border-0 p-3 rounded-3 text-black" placeholder="ระบุนามสกุล" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-black ps-1">เบอร์โทรศัพท์</label>
                                                <input type="text" className="form-control bg-light border-0 p-3 rounded-3 text-black" placeholder="0xx-xxxxxxx" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-black ps-1">อีเมล</label>
                                                <input type="text" className="form-control bg-light border-0 p-3 rounded-3 text-black" placeholder="name@email.com" />
                                            </div>
                                            <div className="col-12 mt-3">
                                                <label className="form-label small fw-bold text-black mb-2">Attachments</label>
                                                <div className="d-flex flex-column gap-2 ps-1">
                                                    {/* Force links to be black */}
                                                    <div className="d-flex align-items-center small fw-bold mb-1" style={{ color: '#000000', cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faPaperclip} className="me-2"/> Document Links
                                                    </div>
                                                    <div className="d-flex align-items-center small fw-bold" style={{ color: '#000000', cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faPlus} className="me-2"/> Add Attachment
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-3 text-end bg-light border-top">
                                        <button className="btn btn-light px-3 py-2 fw-bold text-black rounded-3 border" onClick={() => setShowContactModal(false)}>บันทึก</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
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