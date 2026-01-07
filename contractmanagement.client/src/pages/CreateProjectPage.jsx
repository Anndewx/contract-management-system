import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSave, faUser, faTrash, faArrowLeft, faPaperclip, faPlus, faExclamationCircle, faTimes,
    faFilePdf, faFileWord, faFileExcel, faFileImage, faFileAlt, faCheckCircle 
} from "@fortawesome/free-solid-svg-icons";
import SaveModal from "./SaveModal"; 
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5056/api";

const MOCK_EMPLOYEES = [
    { id: 1, name: 'พี่นัทตี้', role: 'Lead', image: '/img/team/PNut.jpg' },
    { id: 2, name: 'พี่เขียว', role: 'Lead', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: 'พี่อาร์ม', role: 'Senior', image: '/img/team/PArm.jpg' },
    { id: 4, name: 'พี่มด', role: 'Doctor', image: '/img/team/PMod.jpg' }
];

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [projectTypes, setProjectTypes] = useState([]);
  
  // State สำหรับเก็บข้อมูลจากฐานข้อมูล
  const [customers, setCustomers] = useState([]); // รายชื่อบริษัท (เช่น Inno)
  const [allContacts, setAllContacts] = useState([]); // รายชื่อผู้ติดต่อ (เช่น David)

  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  // Attachment State
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    contractNumber: '', 
    title: '',          
    projectTypeId: '',
    deviceTypeId: '',
    procurementMethod: 'คัดเลือก',
    evaluationMethod: 'ราคาต่ำสุด',
    
    customerId: '',     // เก็บ ID ของบริษัทแม่ (เพื่อทำ FK)
    agency: '',         // เก็บชื่อหน่วยงาน/ผู้ติดต่อที่จะโชว์
    
    fiscalYear: '2568',
    status: 'จัดทำโครงการ',
    amount: '',
    company: '',        // บริษัทผู้รับผิดชอบ
    description: '',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // 1. ดึงประเภทโครงการ
        const resProject = await fetch(`${API_BASE_URL}/ProjectType`);
        if(resProject.ok) setProjectTypes(await resProject.json());

        // 2. ดึงข้อมูลลูกค้าและผู้ติดต่อ
        const resCustomer = await fetch(`${API_BASE_URL}/Customers`);
        if(resCustomer.ok) {
            const customerData = await resCustomer.json();
            setCustomers(customerData);

            // แยกรายชื่อผู้ติดต่อออกมาจากลูกค้าแต่ละรายรวมเป็น List เดียว
            const contactsList = customerData.flatMap(c => 
                (c.contacts || []).map(contact => ({
                    ...contact,
                    parentCompanyId: c.id,
                    parentCompanyName: c.name
                }))
            );
            setAllContacts(contactsList);
        }

      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    };
    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ เมื่อเลือก "ชื่อหน่วยงาน" (เลือกผู้ติดต่อ เช่น David)
  const handleAgencyChange = (e) => {
      const contactId = parseInt(e.target.value);
      const selectedContact = allContacts.find(c => c.id === contactId);
      
      if (selectedContact) {
          setFormData(prev => ({
              ...prev,
              agency: `${selectedContact.firstName} ${selectedContact.lastName}`, // เก็บชื่อคน
              customerId: selectedContact.parentCompanyId // เก็บ ID บริษัทแม่ (Inno) เพื่อลิงก์ข้อมูล
          }));
      }
  };

  // ✅ เมื่อเลือก "บริษัท" (เลือกบริษัท เช่น Inno)
  const handleCompanyChange = (e) => {
      const companyName = e.target.value;
      setFormData(prev => ({ ...prev, company: companyName }));
  };

  // --- Team Logic ---
  const handleAddMember = () => {
    if (!selectedMemberId) return;
    if (teamMembers.some(m => m.id === parseInt(selectedMemberId))) {
        Swal.fire({ icon: 'warning', title: 'รายชื่อนี้ถูกเลือกไปแล้ว', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
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

  // --- Attachment Logic ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        setAttachments(prev => [...prev, ...files]);
    }
    e.target.value = null; 
  };

  const handleRemoveAttachment = (indexToRemove) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { icon: faFilePdf, color: '#ef4444', bg: '#fef2f2' }; 
    if (['doc', 'docx'].includes(ext)) return { icon: faFileWord, color: '#3b82f6', bg: '#eff6ff' }; 
    if (['xls', 'xlsx'].includes(ext)) return { icon: faFileExcel, color: '#10b981', bg: '#ecfdf5' }; 
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return { icon: faFileImage, color: '#f59e0b', bg: '#fffbeb' }; 
    return { icon: faFileAlt, color: '#6b7280', bg: '#f3f4f6' }; 
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- Save Logic ---
  const validateForm = () => {
    if (!formData.title.trim() || !formData.contractNumber.trim() || !formData.projectTypeId || !formData.amount || !formData.company || !formData.agency) {
        return false;
    }
    return true;
  };

  const handleInitialSave = () => {
    setIsSubmitted(true);
    if (validateForm()) {
        setShowConfirmModal(true);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Swal.fire({ icon: 'error', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย *', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }
  };

  const handleFinalConfirm = async () => {
    try {
        const payload = {
            projectId: formData.contractNumber,
            projectName: formData.title,
            projectType: formData.projectTypeId.toString(),
            
            customerId: parseInt(formData.customerId), // ส่ง ID ของบริษัทแม่
            customerName: formData.agency,             // ส่งชื่อผู้ติดต่อ (เช่น David) ไปเก็บในฟิลด์ CustomerName
            
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
            await Swal.fire({ icon: 'success', title: 'บันทึกเรียบร้อย', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            navigate('/projects'); 
        } else {
            Swal.fire('Error', 'บันทึกไม่สำเร็จ', 'error');
            setShowConfirmModal(false);
        }
    } catch (error) {
        Swal.fire('Error', 'Connection Error', 'error');
        setShowConfirmModal(false);
    }
  };

  const isInvalid = (fieldValue) => isSubmitted && !fieldValue;
  
  // --- Clean & Readable Styles ---
  const cleanStyles = `
    .form-control-clean, .form-select-clean {
        background-color: #ffffff; 
        border: 1px solid #e2e8f0; 
        border-radius: 8px;
        padding: 12px 16px; 
        font-size: 1rem; 
        color: #334155; 
        transition: all 0.2s ease;
        height: 48px; /* เพิ่มความสูงให้อ่านง่าย */
    }
    .form-control-clean:focus, .form-select-clean:focus {
        border-color: #3b82f6; 
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
        outline: none;
    }
    .form-label-clean {
        font-weight: 600; 
        color: #475569; 
        font-size: 0.95rem; 
        margin-bottom: 8px;
        display: block;
    }
    textarea.form-control-clean {
        height: auto;
        line-height: 1.6;
    }
    
    /* --- Button Styles --- */
    .btn-clean-primary {
        background-color: #3b82f6; 
        border: none; 
        border-radius: 8px; 
        padding: 10px 32px;
        font-weight: 600; 
        color: white;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4); 
        transition: all 0.2s ease;
    }
    .btn-clean-primary:hover { 
        background-color: #2563eb; 
        color: white;
        transform: translateY(-1px); 
        box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.5);
    }
    .btn-clean-cancel {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px 24px;
        font-weight: 600; 
        color: #475569;
        transition: all 0.2s ease;
    }
    .btn-clean-cancel:hover {
        background-color: #f8fafc;
        color: #1e293b;
        border-color: #cbd5e1;
        transform: translateY(-1px);
    }
  `;

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <style>{cleanStyles}</style>
      
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link text-dark me-3 p-0" onClick={() => navigate('/projects')}>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <div><h3 className="fw-bold mb-1 text-dark">สร้างโครงการ</h3></div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
        <form className="row g-4">
            
            <div className="col-12">
                <label className="form-label-clean">ชื่อโครงการ <span className="text-danger">*</span></label>
                <input type="text" className={`form-control form-control-clean ${isInvalid(formData.title) ? 'is-invalid' : ''}`} name="title" value={formData.title} onChange={handleChange} placeholder="ระบุชื่อโครงการ..." />
            </div>

            <div className="col-md-6">
                <label className="form-label-clean">เลขที่โครงการ <span className="text-danger">*</span></label>
                <input type="text" className={`form-control form-control-clean ${isInvalid(formData.contractNumber) ? 'is-invalid' : ''}`} name="contractNumber" value={formData.contractNumber} onChange={handleChange} placeholder="เช่น 2024-063" />
            </div>
            <div className="col-md-6">
                <label className="form-label-clean">ประเภทโครงการ <span className="text-danger">*</span></label>
                <select className={`form-select form-select-clean ${isInvalid(formData.projectTypeId) ? 'is-invalid' : ''}`} name="projectTypeId" value={formData.projectTypeId} onChange={handleChange}>
                    <option value="">เลือกประเภท...</option>
                    {projectTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
            </div>

            <div className="col-md-6">
                <label className="form-label-clean">วิธีการจัดหา <span className="text-danger">*</span></label>
                <select className="form-select form-select-clean" name="procurementMethod" value={formData.procurementMethod} onChange={handleChange}>
                    <option value="คัดเลือก">คัดเลือก</option>
                    <option value="เฉพาะเจาะจง">เฉพาะเจาะจง</option>
                    <option value="ประกวดราคา">ประกวดราคา</option>
                </select>
            </div>
            <div className="col-md-6">
                <label className="form-label-clean">วิธีการพิจารณา <span className="text-danger">*</span></label>
                <select className="form-select form-select-clean" name="evaluationMethod" value={formData.evaluationMethod} onChange={handleChange}>
                    <option value="ราคาต่ำสุด">ราคาต่ำสุด</option>
                    <option value="เกณฑ์คุณภาพ">เกณฑ์คุณภาพ</option>
                </select>
            </div>

            {/* ✅ 1. ช่องชื่อหน่วยงาน: เลือกผู้ติดต่อ (David) */}
            <div className="col-12">
                <label className="form-label-clean">ลูกค้า (ผู้ติดต่อ) <span className="text-danger">*</span></label>
                <select 
                    className={`form-select form-select-clean ${isInvalid(formData.agency) ? 'is-invalid' : ''}`} 
                    onChange={handleAgencyChange}
                    defaultValue=""
                    style={{cursor: 'pointer'}}
                >
                    <option value="" disabled>เลือกผู้ติดต่อ...</option>
                    {allContacts.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.firstName} {c.lastName} (บริษัท: {c.parentCompanyName})
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-6">
                <label className="form-label-clean">ปีงบประมาณ <span className="text-danger">*</span></label>
                <select className="form-select form-select-clean" name="fiscalYear" value={formData.fiscalYear} onChange={handleChange}>
                    <option value="2568">2568</option>
                    <option value="2567">2567</option>
                </select>
            </div>
            <div className="col-md-6">
                <label className="form-label-clean">สถานะ <span className="text-danger">*</span></label>
                <select className="form-select form-select-clean" name="status" value={formData.status} onChange={handleChange}>
                    <option value="จัดทำโครงการ">จัดทำโครงการ</option>
                    <option value="ร่างTOR">ร่าง TOR</option>
                    <option value="ยื่นข้อเสนอ">ยื่นข้อเสนอ</option>
                    <option value="ดำเนินงาน">ดำเนินงาน</option>
                </select>
            </div>

            <div className="col-md-6">
                <label className="form-label-clean">มูลค่าโครงการ (รวม Vat) <span className="text-danger">*</span></label>
                <input type="number" className={`form-control form-control-clean ${isInvalid(formData.amount) ? 'is-invalid' : ''}`} name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" />
            </div>
            
            {/* ✅ 2. ช่องบริษัท: เลือกบริษัท (Inno) */}
            <div className="col-md-6">
                <label className="form-label-clean">บริษัท (หน่วยงาน) <span className="text-danger">*</span></label>
                <select 
                    className={`form-select form-select-clean ${isInvalid(formData.company) ? 'is-invalid' : ''}`} 
                    name="company" 
                    value={formData.company} 
                    onChange={handleCompanyChange}
                    style={{cursor: 'pointer'}}
                >
                    <option value="">เลือกบริษัท...</option>
                    {customers.map((comp) => (
                        <option key={comp.id} value={comp.name}>{comp.name}</option>
                    ))}
                </select>
            </div>

            {/* --- Grey Box Area --- */}
            <div className="col-12">
                <div className="p-4 rounded border" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="row g-4">
                        <div className="col-md-6 d-flex flex-column">
                            <label className="form-label-clean">รายละเอียด</label>
                            <textarea className="form-control form-control-clean mb-4" rows="5" name="description" placeholder="เตรียมเอกสารยื่นงาน..." value={formData.description} onChange={handleChange} style={{resize: 'none'}}></textarea>
                            
                            <div className="mt-auto">
                                <div className="d-flex align-items-center mb-2">
                                    <label className="form-label-clean mb-0 me-2">Attachments</label>
                                    {attachments.length > 0 && <span className="badge bg-warning text-dark rounded-pill">{attachments.length} files</span>}
                                </div>
                                <div className="mb-2">
                                    <a href="#" className="text-decoration-none fw-bold text-primary d-inline-flex align-items-center hover-underline">
                                        <FontAwesomeIcon icon={faPaperclip} className="me-2"/>
                                        เอกสารประกาศเชิญชวน
                                    </a>
                                </div>
                                <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                                <button type="button" className="btn btn-outline-secondary rounded-pill fw-bold text-dark border-secondary-subtle px-3 py-1 mb-3 d-inline-flex align-items-center shadow-sm bg-white" style={{ fontSize: '0.85rem' }} onClick={() => fileInputRef.current.click()}>
                                    <FontAwesomeIcon icon={faPlus} className="me-2"/> Add Attachment
                                </button>
                                <div className="d-flex flex-column gap-2">
                                    {attachments.map((file, index) => {
                                        const fileType = getFileIcon(file.name);
                                        return (
                                            <div key={index} className="d-flex align-items-center p-3 bg-white border rounded shadow-sm position-relative animate__animated animate__fadeIn">
                                                <div className="rounded p-2 d-flex align-items-center justify-content-center me-3" style={{backgroundColor: fileType.bg, width:'48px', height:'48px'}}>
                                                    <FontAwesomeIcon icon={fileType.icon} style={{color: fileType.color}} size="lg" />
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                                                    <div className="fw-bold text-dark text-truncate" style={{fontSize: '0.9rem'}}>{file.name}</div>
                                                    <div className="d-flex align-items-center small text-muted mt-1">
                                                        <span>{formatFileSize(file.size)}</span>
                                                        <span className="mx-2">•</span>
                                                        <span className="text-success fw-bold d-flex align-items-center"><FontAwesomeIcon icon={faCheckCircle} className="me-1"/> Ready</span>
                                                    </div>
                                                </div>
                                                <button type="button" className="btn btn-link text-danger p-2 ms-2 hover-danger" onClick={() => handleRemoveAttachment(index)} title="Remove file">
                                                    <FontAwesomeIcon icon={faTimes} size="lg"/>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label-clean">ผู้รับผิดชอบ</label>
                            <div className="">
                                <div className="input-group mb-3">
                                    <select className="form-select form-select-clean" value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)}>
                                        <option value="" hidden>เลือกรายชื่อ...</option>
                                        {MOCK_EMPLOYEES.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                                        ))}
                                    </select>
                                    <button className="btn text-white" type="button" onClick={handleAddMember} style={{backgroundColor: '#334155', borderColor: '#334155', height: '48px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </button>
                                </div>
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="d-flex align-items-center justify-content-between p-2 mb-2 border rounded bg-white shadow-sm">
                                            <div className="d-flex align-items-center">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="rounded-circle me-3" style={{width:35, height:35, objectFit: 'cover'}} />
                                                ) : (
                                                    <div className="bg-dark rounded-circle me-3 d-flex align-items-center justify-content-center text-white small" style={{width:35, height:35}}>
                                                        <FontAwesomeIcon icon={faUser}/>
                                                    </div>
                                                )}
                                                <div style={{lineHeight: '1.2'}}>
                                                    <div className="fw-bold text-dark" style={{fontSize: '0.85rem'}}>{member.name}</div>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>{member.role}</div>
                                                </div>
                                            </div>
                                            <button type="button" className="btn btn-link text-danger p-0 me-2" onClick={() => handleRemoveMember(member.id)}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </button>
                                        </div>
                                    ))}
                                    {teamMembers.length === 0 && <div className="text-center text-muted small py-4 bg-white border rounded">ยังไม่มีผู้รับผิดชอบ</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             <div className="col-12 mt-4 d-flex justify-content-end align-items-center gap-3 pt-3 border-top">
                {isSubmitted && !validateForm() && (
                    <div className="text-danger fw-bold me-2 animate__animated animate__shakeX">
                        <FontAwesomeIcon icon={faExclamationCircle} className="me-2"/>
                        กรุณากรอกข้อมูลให้ครบถ้วน
                    </div>
                )}
                <button type="button" className="btn btn-clean-cancel" onClick={() => navigate('/projects')}>ยกเลิก</button>
                <button type="button" className="btn btn-clean-primary" onClick={handleInitialSave}>
                   <FontAwesomeIcon icon={faCheckCircle} className="me-2"/> บันทึก
                </button>
             </div>
        </form>
      </div>

      <SaveModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleFinalConfirm} />
    </div>
  );
};

export default CreateProjectPage;