import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUser, faTrash, faArrowLeft, faPaperclip, faPlus, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import SaveModal from "./SaveModal"; // ตรวจสอบว่า path ถูกต้อง

const API_BASE_URL = "http://localhost:5056/api";

// Mock Data พนักงาน
const MOCK_EMPLOYEES = [
    { id: 1, name: 'วิชิต ทาก้อน', role: 'Project Manager' },
    { id: 2, name: 'ชมพูนุช จะตะกานนท์', role: 'Co-ordinator' },
    { id: 3, name: 'ณัฐพล ใจดี', role: 'Developer' },
    { id: 4, name: 'สมชาย ขายเก่ง', role: 'Sales' }
];

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [projectTypes, setProjectTypes] = useState([]);
  
  // Team Member State
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  // Form State
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // ✅ 1. เพิ่ม State สำหรับตรวจสอบว่ามีการกดบันทึกหรือยัง (เพื่อโชว์ Error)
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch Master Data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const resProject = await fetch(`${API_BASE_URL}/ProjectType`);
        if(resProject.ok) setProjectTypes(await resProject.json());
      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    };
    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // ถ้ามีการแก้ไขข้อมูล ให้ลบสถานะ error ออกเพื่อให้ข้อความสีแดงหายไป (Optional)
    // setIsSubmitted(false); 
  };

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

  // ✅ 2. ฟังก์ชันตรวจสอบความถูกต้อง (Validation)
  const validateForm = () => {
    // เช็คค่าว่างในฟิลด์ที่จำเป็น (ที่มีดอกจัน *)
    if (
        !formData.title.trim() || 
        !formData.contractNumber.trim() || 
        !formData.projectTypeId || 
        !formData.procurementMethod ||
        !formData.evaluationMethod ||
        !formData.fiscalYear ||
        !formData.status ||
        !formData.amount
    ) {
        return false; // ข้อมูลไม่ครบ
    }
    return true; // ข้อมูลครบ
  };

  // ✅ 3. ปรับแก้ปุ่มกดบันทึก
  const handleInitialSave = () => {
    setIsSubmitted(true); // บอกว่ามีการกดปุ่มแล้ว จะได้แสดง Error ถ้ามี

    if (validateForm()) {
        // ถ้าข้อมูลครบ ค่อยเปิด Modal ยืนยัน
        setShowConfirmModal(true);
    } else {
        // ถ้าข้อมูลไม่ครบ ไม่ต้องทำอะไร (ข้อความสีแดงจะโชว์เองเพราะ isSubmitted = true)
        // อาจจะเลื่อนหน้าจอขึ้นไปบนสุดเพื่อให้เห็นช่องว่าง
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
            navigate('/projects'); 
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

  // Helper เพื่อเช็คว่า Input ไหน Error บ้าง (ใช้สำหรับใส่กรอบแดงที่ input)
  const isInvalid = (fieldValue) => isSubmitted && !fieldValue;

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link text-dark me-3 p-0" onClick={() => navigate('/projects')}>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <div>
            <h3 className="fw-bold mb-1">สร้างโครงการ</h3>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <form className="row g-4">
            
            <div className="col-12">
                <label className="form-label fw-bold small text-muted">ชื่อโครงการ *</label>
                <input 
                    type="text" 
                    className={`form-control bg-light ${isInvalid(formData.title) ? 'is-invalid' : ''}`} 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="ระบุชื่อโครงการ..." 
                />
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">เลขที่โครงการ *</label>
                <input 
                    type="text" 
                    className={`form-control ${isInvalid(formData.contractNumber) ? 'is-invalid' : ''}`}
                    name="contractNumber" 
                    value={formData.contractNumber} 
                    onChange={handleChange} 
                    placeholder="เช่น 2024-063" 
                />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ประเภทโครงการ *</label>
                <select 
                    className={`form-select ${isInvalid(formData.projectTypeId) ? 'is-invalid' : ''}`}
                    name="projectTypeId" 
                    value={formData.projectTypeId} 
                    onChange={handleChange}
                >
                    <option value="">เลือกประเภท...</option>
                    {projectTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วิธีการจัดหา *</label>
                <select className="form-select" name="procurementMethod" value={formData.procurementMethod} onChange={handleChange}>
                    <option value="คัดเลือก">คัดเลือก</option>
                    <option value="เฉพาะเจาะจง">เฉพาะเจาะจง</option>
                    <option value="ประกวดราคา">ประกวดราคา</option>
                </select>
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วิธีการพิจารณา *</label>
                <select className="form-select" name="evaluationMethod" value={formData.evaluationMethod} onChange={handleChange}>
                    <option value="ราคาต่ำสุด">ราคาต่ำสุด</option>
                    <option value="เกณฑ์คุณภาพ">เกณฑ์คุณภาพ</option>
                </select>
            </div>

            <div className="col-12">
                <label className="form-label fw-bold small text-muted">ชื่อหน่วยงาน</label>
                <input type="text" className="form-control" name="agency" value={formData.agency} onChange={handleChange} />
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ปีงบประมาณ *</label>
                <select className="form-select" name="fiscalYear" value={formData.fiscalYear} onChange={handleChange}>
                    <option value="2568">2568</option>
                    <option value="2567">2567</option>
                </select>
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">สถานะ *</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                    <option value="จัดทำโครงการ">จัดทำโครงการ</option>
                    <option value="ร่างTOR">ร่าง TOR</option>
                    <option value="ยื่นข้อเสนอ">ยื่นข้อเสนอ</option>
                    <option value="ดำเนินงาน">ดำเนินงาน</option>
                </select>
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">มูลค่าโครงการ (รวม Vat) *</label>
                <input 
                    type="number" 
                    className={`form-control ${isInvalid(formData.amount) ? 'is-invalid' : ''}`}
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleChange} 
                    placeholder="0.00" 
                />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">บริษัท *</label>
                <input type="text" className="form-control text-muted" value="Inno" disabled style={{ backgroundColor: '#f3f4f6' }} />
            </div>

            <div className="col-md-7">
                <label className="form-label fw-bold small text-muted">รายละเอียด</label>
                <textarea 
                    className="form-control" 
                    rows="8" 
                    name="description" 
                    placeholder="เตรียมเอกสารยื่นงาน..." 
                    value={formData.description} 
                    onChange={handleChange}
                    style={{resize: 'none'}}
                ></textarea>
                
                <div className="mt-4">
                    <label className="form-label fw-bold small text-muted">Attachments</label>
                    <div className="d-flex align-items-center gap-2 text-primary" style={{cursor:'pointer'}}>
                        <FontAwesomeIcon icon={faPaperclip} />
                        <span className="text-decoration-underline">เอกสารประกาศเชิญชวน</span>
                    </div>
                     <button type="button" className="btn btn-link text-dark p-0 mt-2 text-decoration-none fw-bold" style={{fontSize:'0.9rem'}}>
                        <FontAwesomeIcon icon={faPlus} className="me-2"/> Add Attachment
                    </button>
                </div>
            </div>

            <div className="col-md-5">
                <label className="form-label fw-bold small text-muted">ผู้รับผิดชอบ</label>
                <div className="bg-light p-3 rounded border">
                    <div className="input-group mb-3">
                        <select className="form-select" value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)}>
                            <option value="">เลือกรายชื่อ...</option>
                            {MOCK_EMPLOYEES.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                            ))}
                        </select>
                        <button className="btn btn-outline-secondary" type="button" onClick={handleAddMember}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                    </div>
                    
                    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {teamMembers.map((member) => (
                            <div key={member.id} className="d-flex align-items-center justify-content-between p-2 mb-2 border rounded bg-white shadow-sm">
                                <div className="d-flex align-items-center">
                                    <div className="bg-dark rounded-circle me-3 d-flex align-items-center justify-content-center text-white small" style={{width:35, height:35}}>
                                        <FontAwesomeIcon icon={faUser}/>
                                    </div>
                                    <div style={{lineHeight: '1.2'}}>
                                        <div className="fw-bold text-dark" style={{fontSize: '0.85rem'}}>{member.name}</div>
                                        <div className="text-muted" style={{fontSize: '0.75rem'}}>{member.role}</div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-link text-secondary p-0 me-2" onClick={() => handleRemoveMember(member.id)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </div>
                        ))}
                         {teamMembers.length === 0 && <div className="text-center text-muted small py-3">ยังไม่มีผู้รับผิดชอบ</div>}
                    </div>
                </div>
            </div>

            {/* ✅ 4. ส่วนแสดงผลปุ่ม และ ข้อความแจ้งเตือนสีแดง */}
             <div className="col-12 mt-4 d-flex justify-content-end align-items-center gap-3 pt-3 border-top">
                {/* ถ้ามีการกดปุ่ม และ validateForm เป็นเท็จ ให้โชว์ข้อความนี้ */}
                {isSubmitted && !validateForm() && (
                    <div className="text-danger fw-bold me-2 animate__animated animate__shakeX">
                        <FontAwesomeIcon icon={faExclamationCircle} className="me-2"/>
                        กรุณากรอกข้อมูลให้ครบถ้วน
                    </div>
                )}
                
                <button type="button" className="btn btn-white border fw-bold px-4 py-2" onClick={() => navigate('/projects')}>ยกเลิก</button>
                <button type="button" className="btn btn-primary fw-bold px-5 py-2" style={{ backgroundColor: '#3b82f6', border:'none' }} onClick={handleInitialSave}>
                   บันทึก
                </button>
             </div>
        </form>
      </div>

      <SaveModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleFinalConfirm} />
    </div>
  );
};

export default CreateProjectPage;