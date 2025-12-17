import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faPaperclip, faCalendarAlt, faChevronDown, faEllipsisH, faUser, faTimes
} from "@fortawesome/free-solid-svg-icons";

import SaveModal from './SaveModal';

// ⚠️ ตรวจสอบ Port Backend
const API_BASE_URL = "http://localhost:5056/api"; 

// Mock Data พนักงาน
const MOCK_EMPLOYEES = [
    { id: 1, name: 'วิชิต ทาก้อน', role: 'Project Manager' },
    { id: 2, name: 'ชมพูนุช จะตะกานนท์', role: 'Co-ordinator' },
    { id: 3, name: 'ณัฐพล ใจดี', role: 'Developer' },
    { id: 4, name: 'สมชาย ขายเก่ง', role: 'Sales' }
];

const ProjectPage = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [data, setData] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal State
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const [formData, setFormData] = useState({
    contractNumber: '',
    title: '',
    projectTypeId: '',
    deviceTypeId: '',
    procurementMethod: 'คัดเลือก',
    evaluationMethod: 'ราคาต่ำสุด',
    agency: 'สำนักงานกองทุนหมู่บ้านและชุมชนเมืองแห่งชาติ (สทบ.)',
    fiscalYear: '2568',
    status: 'จัดทำโครงการ',
    amount: '',
    company: 'Inno',
    description: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- Functions ---
  const fetchMasterData = async () => {
    try {
      const resProject = await fetch(`${API_BASE_URL}/ProjectType`);
      if(resProject.ok) setProjectTypes(await resProject.json());

      const resDevice = await fetch(`${API_BASE_URL}/DeviceType`);
      if(resDevice.ok) setDeviceTypes(await resDevice.json());
    } catch (err) {
      console.error("Error fetching master data:", err);
    }
  };

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
    setActiveMenuId(null);
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
    fetchMasterData();
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Team Logic
  const handleAddMember = () => {
    if (!selectedMemberId) return;
    if (teamMembers.some(m => m.id === parseInt(selectedMemberId))) {
        alert("รายชื่อนี้ถูกเลือกไปแล้ว");
        return;
    }
    const member = MOCK_EMPLOYEES.find(m => m.id === parseInt(selectedMemberId));
    if (member) {
        setTeamMembers([...teamMembers, member]);
        setSelectedMemberId(''); 
    }
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handleOpenModal = () => {
    setFormData({
        contractNumber: '', title: '', projectTypeId: '', deviceTypeId: '', 
        procurementMethod: 'คัดเลือก', evaluationMethod: 'ราคาต่ำสุด', 
        agency: 'สำนักงานกองทุนหมู่บ้านและชุมชนเมืองแห่งชาติ (สทบ.)',
        fiscalYear: '2568', status: 'จัดทำโครงการ', amount: '', 
        company: 'Inno', description: ''
    });
    setTeamMembers([]); 
    setShowModal(true);
  }

  const handleInitialSave = () => {
    if(!formData.title || !formData.contractNumber) {
        alert("กรุณากรอกชื่อโครงการและเลขที่โครงการ");
        return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = async () => {
    try {
        const payload = {
            projectId: formData.contractNumber,
            projectName: formData.title,
            projectType: formData.projectTypeId.toString(),
            customerName: formData.agency,
            procurementMethod: formData.procurementMethod,
            evaluationMethod: formData.evaluationMethod,
            fiscalYear: parseInt(formData.fiscalYear) || 2568,
            projectStatus: formData.status,
            projectValue: parseFloat(formData.amount) || 0,
            companyName: formData.company,
            projectDetail: formData.description,
            createdBy: "Admin"
        };

        const response = await fetch(`${API_BASE_URL}/Projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            setShowConfirmModal(false);
            setShowModal(false);
            fetchProjects(); 
        } else {
            const err = await response.json();
            alert(`❌ Error: ${JSON.stringify(err)}`);
            setShowConfirmModal(false);
        }
    } catch (error) {
        console.error("API Error:", error);
        alert("❌ Server Error");
        setShowConfirmModal(false);
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const renderStatusBadge = (status) => (
    <span className="badge rounded-pill fw-medium border-0"
        style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', fontSize: '0.75rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <span style={{width:'8px', height:'8px', backgroundColor:'#1a73e8', borderRadius:'50%', display:'inline-block'}}></span>
        {status}
    </span>
  );

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Title */}
      <h2 className="fw-bold mb-4" style={{ color: '#000000' }}>โครงการ</h2>

      {/* Filter Bar */}
      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
        <div className="bg-white border rounded shadow-sm d-flex align-items-center px-3 py-2" style={{ minWidth: '140px', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faCalendarAlt} className="text-dark me-2"/> 
            <span className="fw-bold text-dark me-auto">2568</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-dark small"/> 
        </div>
        <div className="bg-white border rounded shadow-sm d-flex align-items-center px-3 py-2" style={{ minWidth: '140px', cursor: 'pointer' }}>
            <span className="text-dark me-auto">Filter by</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-dark small"/>
        </div>
        <div className="flex-grow-1 d-none d-lg-block"></div>
        <div className="position-relative" style={{ width: '250px' }}>
            <FontAwesomeIcon icon={faSearch} className="text-dark position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" className="form-control ps-5 border-0 bg-white shadow-sm text-dark" placeholder="ค้นหาหน่วยงาน..." style={{ borderRadius: '6px', height: '42px' }} />
        </div>
        <div className="position-relative" style={{ width: '250px' }}>
            <FontAwesomeIcon icon={faSearch} className="text-dark position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" className="form-control ps-5 border-0 bg-white shadow-sm text-dark" placeholder="ค้นหาชื่อโครงการ..." style={{ borderRadius: '6px', height: '42px' }} />
        </div>
        <button className="btn btn-primary px-4 fw-bold shadow-sm" style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', height: '42px' }}>
            ค้นหา <FontAwesomeIcon icon={faChevronDown} className="ms-2 small" rotation={270} />
        </button>
      </div>

      {/* Sub-Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0" style={{ color: '#6c757d' }}>2568 &gt;&gt; ทั้งหมด</h5>
        <button className="btn btn-primary fw-bold shadow-sm px-3" style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }} onClick={handleOpenModal}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มโครงการ
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th className="py-3 ps-4 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '40%' }}>ชื่อโครงการ</th>
                <th className="py-3 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '15%' }}>หน่วยงาน</th>
                <th className="py-3 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '10%' }}>วันที่สร้าง</th>
                <th className="py-3 text-start text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '15%' }}>สร้างโดย</th>
                <th className="py-3 text-center text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '10%' }}>สถานะ</th>
                <th className="py-3 text-center text-dark small text-uppercase fw-bold border-bottom-0" style={{ width: '10%' }}>ส่วนจัดการ</th>
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
                  <td className="py-3 text-center position-relative">
                      <button className="btn btn-link text-dark p-0" onClick={(e) => toggleMenu(e, item.id)} style={{ fontSize: '1.2rem' }}>
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </button>
                      {activeMenuId === item.id && (
                        <div className="position-absolute bg-white shadow rounded border py-1" style={{ right: '40px', top: '10px', zIndex: 100, minWidth: '140px' }}>
                            <button className="dropdown-item small py-2 text-start text-dark" onClick={() => alert('แก้ไข (Mock)')}>
                                <FontAwesomeIcon icon={faEdit} className="me-2 text-dark"/> แก้ไข
                            </button>
                            <div className="dropdown-divider my-0"></div>
                            <button className="dropdown-item small py-2 text-start text-danger" onClick={() => handleDelete(item.id)}>
                                <FontAwesomeIcon icon={faTrash} className="me-2"/> ลบ
                            </button>
                        </div>
                      )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-5 text-dark">ไม่พบข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination - Restored to the original design */}
        <div className="px-4 py-3 border-top d-flex align-items-center bg-white">
            <button className="btn btn-light border me-2" style={{width:'36px', height:'36px'}} disabled>
                <FontAwesomeIcon icon={faChevronDown} rotation={90} className="small text-secondary"/>
            </button>
            <button className="btn btn-dark border fw-bold me-2" style={{width:'36px', height:'36px', backgroundColor:'#000000', borderColor:'#000000'}}>1</button>
            <span className="text-dark mx-2">2</span>
            <span className="text-dark mx-2">3</span>
            <span className="text-dark mx-2">...</span>
            <span className="text-dark mx-2">10</span>
            <button className="btn btn-primary ms-auto" style={{width:'36px', height:'36px', backgroundColor: '#3b82f6', borderColor:'#3b82f6'}}>
                <FontAwesomeIcon icon={faChevronDown} rotation={270} className="small text-white"/>
            </button>
        </div>
      </div>

      {/* --- Modal Popup (New Layout, No Blue Text) --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow-lg rounded-3">
              
              {/* Header */}
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-5">
                <h3 className="modal-title fw-bold" style={{ color: '#000000' }}>สร้างโครงการ</h3>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              {/* Body */}
              <div className="modal-body px-5 py-4">
                <form className="row g-3">
                    
                    {/* ชื่อโครงการ */}
                    <div className="col-12">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>ชื่อโครงการ *</label>
                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="ระบุชื่อโครงการ..." style={{height: '45px'}} />
                    </div>

                    {/* แถว 1: เลขที่โครงการ | ประเภทโครงการ */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>เลขที่โครงการ *</label>
                        <input type="text" className="form-control" name="contractNumber" value={formData.contractNumber} onChange={handleChange} placeholder="เช่น 2024-063" style={{height: '45px'}} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>ประเภทโครงการ *</label>
                        <select className="form-select" name="projectTypeId" value={formData.projectTypeId} onChange={handleChange} style={{height: '45px'}}>
                            <option value="">เลือกประเภท...</option>
                            {projectTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select>
                    </div>

                    {/* แถว 2: วิธีการจัดหา | วิธีการพิจารณา */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>วิธีการจัดหา *</label>
                        <select className="form-select" name="procurementMethod" value={formData.procurementMethod} onChange={handleChange} style={{height: '45px'}}>
                            <option value="คัดเลือก">คัดเลือก</option>
                            <option value="เฉพาะเจาะจง">เฉพาะเจาะจง</option>
                            <option value="ประกวดราคา">ประกวดราคา</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>วิธีการพิจารณา *</label>
                        <select className="form-select" name="evaluationMethod" value={formData.evaluationMethod} onChange={handleChange} style={{height: '45px'}}>
                            <option value="ราคาต่ำสุด">ราคาต่ำสุด</option>
                            <option value="เกณฑ์คุณภาพ">เกณฑ์คุณภาพ</option>
                        </select>
                    </div>

                    {/* ชื่อหน่วยงาน */}
                    <div className="col-12">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>ชื่อหน่วยงาน</label>
                        <input type="text" className="form-control" name="agency" value={formData.agency} onChange={handleChange} style={{height: '45px'}} />
                    </div>

                    {/* แถว 3: ปีงบประมาณ | สถานะ */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>ปีงบประมาณ *</label>
                        <select className="form-select" name="fiscalYear" value={formData.fiscalYear} onChange={handleChange} style={{height: '45px'}}>
                            <option value="2568">2568</option>
                            <option value="2567">2567</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>สถานะ *</label>
                        <select className="form-select" name="status" value={formData.status} onChange={handleChange} style={{height: '45px'}}>
                            <option value="จัดทำโครงการ">จัดทำโครงการ</option>
                            <option value="ร่างTOR">ร่าง TOR</option>
                            <option value="ยื่นข้อเสนอ">ยื่นข้อเสนอ</option>
                            <option value="ยื่นข้อเสนอ">ดำเนินงาน</option>
                        </select>
                    </div>

                    {/* แถว 4: มูลค่าโครงการ | บริษัท */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>มูลค่าโครงการ (รวม Vat) *</label>
                        <input type="number" className="form-control" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" style={{height: '45px'}} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>บริษัท *</label>
                        <input type="text" className="form-control text-muted" value="Inno" disabled style={{height: '45px', backgroundColor: '#f8f9fa'}} />
                    </div>

                    {/* แถวล่าง: รายละเอียด (ซ้าย) | ผู้รับผิดชอบ (ขวา) */}
                    <div className="col-md-7 mt-4">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>รายละเอียด</label>
                        <textarea className="form-control" rows="6" name="description" placeholder="เตรียมเอกสารยื่นงาน..." value={formData.description} onChange={handleChange} style={{resize: 'none'}}></textarea>
                        <div className="text-end text-muted small mt-1">0/300</div>
                    </div>

                    <div className="col-md-5 mt-4">
                        <label className="form-label fw-bold small" style={{ color: '#000000' }}>ผู้รับผิดชอบ</label>
                        
                        {/* Dropdown + Button */}
                        <div className="input-group mb-3">
                            <select className="form-select" value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} style={{height: '45px'}}>
                                <option value="">เลือกรายชื่อ...</option>
                                {MOCK_EMPLOYEES.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                                ))}
                            </select>
                            <button className="btn btn-outline-secondary" type="button" onClick={handleAddMember} style={{width: '50px'}}>
                                <FontAwesomeIcon icon={faPlus}/>
                            </button>
                        </div>

                        {/* List of Team Members */}
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {teamMembers.map((member) => (
                                <div key={member.id} className="d-flex align-items-center justify-content-between p-2 mb-2 border rounded bg-white shadow-sm">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-dark rounded-circle me-3 d-flex align-items-center justify-content-center text-white small" style={{width:40, height:40}}>
                                            <FontAwesomeIcon icon={faUser}/>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{member.name}</div>
                                            <div className="text-muted" style={{fontSize: '0.75rem'}}>{member.role}</div>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-link text-secondary p-0 me-2" onClick={() => handleRemoveMember(member.id)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            ))}
                            {teamMembers.length === 0 && <div className="text-center text-muted small mt-3">ยังไม่มีผู้รับผิดชอบ</div>}
                        </div>
                    </div>

                </form>
              </div>

              {/* Footer */}
              <div className="modal-footer border-top-0 px-5 pb-4 pt-0">
                 <div className="w-100 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light border fw-bold px-4" onClick={() => setShowModal(false)}>ยกเลิก</button>
                    <button type="button" className="btn btn-dark fw-bold px-4" style={{ backgroundColor: '#000000' }} onClick={handleInitialSave}>บันทึกข้อมูล</button>
                 </div>
              </div>

            </div>
          </div>
        </div>
        </>
      )}

      <SaveModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleFinalConfirm} />
    </div>
  );
};

export default ProjectPage;