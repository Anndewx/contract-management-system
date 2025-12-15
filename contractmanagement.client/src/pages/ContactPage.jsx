import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faBuilding, faPhone, faFileAlt, faPaperclip, faTimes 
} from "@fortawesome/free-solid-svg-icons";

const ContactPage = () => {
  const [showModal, setShowModal] = useState(false);

  // --- Mock Data: รายชื่อผู้ติดต่อ ---
  const [contacts, setContacts] = useState([
    { id: 1, firstname: 'Jake', lastname: 'Gilehaal', desc: 'View Channels & Profiles, View Finances Accure Money' },
    { id: 2, firstname: 'Emmy', lastname: 'Rossum', desc: 'View Channels & Profiles' }
  ]);

  // --- Form State ---
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    description: ''
  });

  const handleOpenModal = () => {
    setFormData({ firstname: '', lastname: '', phone: '', email: '', description: '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.firstname || !formData.lastname) {
      alert("กรุณาระบุชื่อและนามสกุล");
      return;
    }
    // จำลองการบันทึก
    const newContact = {
        id: contacts.length + 1,
        firstname: formData.firstname,
        lastname: formData.lastname,
        desc: formData.description || 'No description'
    };
    setContacts([...contacts, newContact]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("ต้องการลบรายชื่อนี้ใช่หรือไม่?")) {
        setContacts(contacts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Layout หลัก: แบ่งซ้าย-ขวา */}
      <div className="row g-4">
        
        {/* --- ฝั่งซ้าย: Profile Card & Menu --- */}
        <div className="col-12 col-lg-3">
            <div className="bg-white p-4 rounded-4 shadow-sm text-center h-100">
                {/* Logo */}
                <div className="rounded-circle border p-1 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '120px', height: '120px', borderColor: '#f472b6' }}>
                    <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center">
                         <span className="fw-bold text-primary fs-2">NT</span>
                         {/* ใส่ <img> ตรงนี้ถ้ามีไฟล์โลโก้ */}
                    </div>
                </div>
                
                <h6 className="fw-bold text-dark mb-1">บริษัท โทรคมนาคมแห่งชาติ จำกัด</h6>
                <small className="text-muted d-block mb-4" style={{ fontSize: '0.75rem' }}>NATIONAL TELECOM PUBLIC COMPANY LIMITED.</small>

                {/* Vertical Menu */}
                <div className="text-start">
                    <button className="btn btn-white w-100 text-start mb-2 text-secondary border-0 py-2 px-3 rounded-3">
                        <FontAwesomeIcon icon={faBuilding} className="me-3" width="20" /> ข้อมูลทั่วไป
                    </button>
                    <button className="btn btn-light w-100 text-start mb-2 fw-bold text-primary bg-primary bg-opacity-10 border-0 py-2 px-3 rounded-3">
                        <FontAwesomeIcon icon={faPhone} className="me-3" width="20" /> ติดต่อ
                    </button>
                    <button className="btn btn-white w-100 text-start mb-2 text-secondary border-0 py-2 px-3 rounded-3">
                        <FontAwesomeIcon icon={faFileAlt} className="me-3" width="20" /> ใบเสนอราคา
                    </button>
                    <button className="btn btn-white w-100 text-start mb-2 text-secondary border-0 py-2 px-3 rounded-3">
                        <FontAwesomeIcon icon={faFileAlt} className="me-3" width="20" /> ใบแจ้งหนี้
                    </button>
                    <button className="btn btn-white w-100 text-start mb-2 text-secondary border-0 py-2 px-3 rounded-3">
                        <FontAwesomeIcon icon={faBuilding} className="me-3" width="20" /> โปรเจกต์
                    </button>
                </div>
            </div>
        </div>

        {/* --- ฝั่งขวา: Contact List --- */}
        <div className="col-12 col-lg-9">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {/* ปุ่มเพิ่มผู้ติดต่อ */}
                    <button className="btn btn-primary px-4 shadow-sm fw-bold" onClick={handleOpenModal}>
                        เพิ่มผู้ติดต่อ <FontAwesomeIcon icon={faPlus} className="ms-2" />
                    </button>
                </div>

                <p className="text-muted small mb-4">You gave access to the following cabinets:</p>

                {/* Table รายชื่อ */}
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr className="text-muted small border-bottom">
                                <th className="pb-3" style={{width: '25%'}}>ชื่อ - สกุล</th>
                                <th className="pb-3" style={{width: '60%'}}>รายละเอียด</th>
                                <th className="pb-3 text-end" style={{width: '15%'}}>ส่วนจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td className="py-4 fw-bold text-dark">
                                        {item.firstname} {item.lastname}
                                    </td>
                                    <td className="py-4 text-secondary small">
                                        {item.desc}
                                    </td>
                                    <td className="py-4 text-end">
                                        <button className="btn btn-link text-secondary p-0 me-3">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="btn btn-link text-secondary p-0" onClick={() => handleDelete(item.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>

      {/* --- Modal: เพิ่มผู้ติดต่อ --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              
              <div className="modal-header border-0 px-4 pt-4">
                <h5 className="modal-title fw-bold">เพิ่มผู้ติดต่อ</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body px-4 pb-4">
                <form>
                    <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted">ชื่อ</label>
                            <input 
                                type="text" 
                                className="form-control bg-light border-0" 
                                placeholder="ระบุชื่อ"
                                value={formData.firstname}
                                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted">สกุล</label>
                            <input 
                                type="text" 
                                className="form-control bg-light border-0" 
                                placeholder="ระบุนามสกุล"
                                value={formData.lastname}
                                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted">เบอร์โทรศัพท์</label>
                            <input 
                                type="text" 
                                className="form-control bg-light border-0" 
                                placeholder="0987654321"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted">อีเมล</label>
                            <input 
                                type="email" 
                                className="form-control bg-light border-0" 
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted">รายละเอียด</label>
                        <textarea 
                            className="form-control bg-light border-0" 
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    {/* Attachments Section */}
                    <div className="mb-3">
                        <h6 className="fw-bold small mb-3">Attachments</h6>
                        <div className="d-flex flex-column gap-2">
                            <a href="#!" className="text-decoration-none small text-primary d-flex align-items-center">
                                <FontAwesomeIcon icon={faPaperclip} className="me-2 text-secondary" /> 
                                Document Links
                            </a>
                            <a href="#!" className="text-decoration-none small text-secondary d-flex align-items-center mt-1">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> 
                                Add Attachment
                            </a>
                        </div>
                    </div>

                    <hr className="my-4 text-muted opacity-25" />

                    <div className="d-flex justify-content-end">
                        <button 
                            type="button" 
                            className="btn btn-light px-4 fw-bold" 
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
        </>
      )}

    </div>
  );
};

export default ContactPage;