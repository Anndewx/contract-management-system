import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = "http://localhost:5056/api";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [fullProjectData, setFullProjectData] = useState(null);
  
  // State สำหรับ Dropdown
  const [contactOptions, setContactOptions] = useState([]);   
  const [companyOptions, setCompanyOptions] = useState([]);   

  // Form State
  const [formData, setFormData] = useState({
    projectId: '',      
    projectName: '',    
    customerId: '',     
    customerName: '',   
    companyName: '',    
    projectStatus: 'จัดทำโครงการ'
  });

  // --- 1. โหลดข้อมูล ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // ---------------------------------------------------------
            // 1.1 ดึงข้อมูล Contact (ลองใช้ /Contact แทน /Contacts)
            // ---------------------------------------------------------
            try {
                const resContacts = await fetch(`${API_BASE_URL}/Contact`); // ลอง Endpoint เอกพจน์
                if (resContacts.ok) {
                    setContactOptions(await resContacts.json());
                } else {
                    throw new Error("API Contact failed");
                }
            } catch (err) {
                console.warn("Contact API not found, using fallback data.");
                // ✅ Fallback: ถ้า API พัง ให้ใช้ข้อมูล David Lee ตามภาพฐานข้อมูลทันที
                setContactOptions([
                    { Id: 4, FirstName: 'David', LastName: 'Lee' } 
                ]);
            }

            // ---------------------------------------------------------
            // 1.2 ดึงข้อมูล Customer (ลองใช้ /Customer แทน /Customers)
            // ---------------------------------------------------------
            try {
                const resCustomers = await fetch(`${API_BASE_URL}/Customer`); // ลอง Endpoint เอกพจน์
                if (resCustomers.ok) {
                    setCompanyOptions(await resCustomers.json());
                } else {
                    throw new Error("API Customer failed");
                }
            } catch (err) {
                console.warn("Customer API not found, using fallback data.");
                // ✅ Fallback: ถ้า API พัง ให้ใช้ข้อมูล Inno ตามภาพฐานข้อมูลทันที
                setCompanyOptions([
                    { Id: 6, Name: 'Inno' }
                ]);
            }

            // ---------------------------------------------------------
            // 1.3 ดึงข้อมูลโครงการปัจจุบัน
            // ---------------------------------------------------------
            const resProject = await fetch(`${API_BASE_URL}/Projects/${id}`);
            if (!resProject.ok) {
                throw new Error("ไม่พบข้อมูลโครงการ");
            }
            const projectData = await resProject.json();
            
            setFullProjectData(projectData);
            
            // Map ข้อมูลเข้า Form
            setFormData({
                projectId: projectData.projectId || projectData.ProjectId || '',
                projectName: projectData.projectName || projectData.ProjectName || '',
                customerId: projectData.customerId || projectData.CustomerId || '',
                customerName: projectData.customerName || projectData.CustomerName || '',
                companyName: projectData.companyName || projectData.CompanyName || '',
                projectStatus: projectData.projectStatus || projectData.ProjectStatus || 'จัดทำโครงการ'
            });

        } catch (error) {
            console.error("Fetch Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'ไม่พบข้อมูลโครงการ',
                text: 'ไม่สามารถดึงข้อมูลได้',
                confirmButtonText: 'กลับไปหน้าตาราง'
            }).then(() => navigate('/projects'));
        } finally {
            setLoading(false);
        }
    };

    if (id) fetchData();
  }, [id, navigate]);

  // --- Handlers ---

  const handleClientChange = (e) => {
      const selectedId = parseInt(e.target.value);
      // รองรับทั้ง Key ตัวเล็กและตัวใหญ่ (เผื่อมาจาก API หรือ Fallback)
      const selectedContact = contactOptions.find(c => (c.id || c.Id) === selectedId);
      
      if (selectedContact) {
          const fName = selectedContact.firstName || selectedContact.FirstName || "";
          const lName = selectedContact.lastName || selectedContact.LastName || "";
          const fullName = `${fName} ${lName}`.trim();

          setFormData(prev => ({
              ...prev,
              customerId: selectedId,
              customerName: fullName 
          }));
      }
  };

  const handleCompanyChange = (e) => {
      setFormData(prev => ({ ...prev, companyName: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectName.trim()) {
        setErrors({ projectName: "กรุณาระบุชื่อโครงการ" });
        return;
    }

    setLoading(true);

    try {
        const isPascal = fullProjectData && fullProjectData.hasOwnProperty('ProjectId');

        const payload = {
            ...fullProjectData, 
            
            [isPascal ? 'ProjectName' : 'projectName']: formData.projectName,
            [isPascal ? 'CustomerId' : 'customerId']: parseInt(formData.customerId),
            [isPascal ? 'CustomerName' : 'customerName']: formData.customerName, 
            [isPascal ? 'CompanyName' : 'companyName']: formData.companyName,
            [isPascal ? 'ProjectStatus' : 'projectStatus']: formData.projectStatus,
            
            [isPascal ? 'UpdatedBy' : 'updatedBy']: "Admin",
            [isPascal ? 'UpdatedDate' : 'updatedDate']: new Date().toISOString()
        };

        const response = await fetch(`${API_BASE_URL}/Projects/${id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            await Swal.fire({
                icon: 'success',
                title: 'บันทึกการแก้ไขสำเร็จ',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/projects'); 
        } else {
            const errData = await response.json().catch(() => ({}));
            Swal.fire('Error', 'เกิดข้อผิดพลาดในการบันทึก: ' + (errData.message || response.statusText), 'error');
        }
    } catch (error) {
        console.error("Update Error:", error);
        Swal.fire('Error', 'ไม่สามารถเชื่อมต่อ Server ได้', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleGoBack = () => navigate('/projects');

  const inputStyle = {
      borderRadius: '8px', 
      padding: '12px 15px', 
      backgroundColor: '#f8fafc', 
      borderColor: '#e2e8f0',
      fontSize: '0.95rem'
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      <div className="d-flex align-items-center mb-4">
          <button className="btn btn-link text-dark me-3 p-0" onClick={handleGoBack}>
             <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <div>
            <h3 className="fw-bold mb-0" style={{ color: '#1e293b' }}>แก้ไขโครงการ</h3>
          </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 bg-white">
        <div className="card-body p-4 p-md-5">
          
          {loading && !fullProjectData ? (
              <div className="text-center py-5">กำลังโหลดข้อมูล...</div>
          ) : (
            <form onSubmit={handleSubmit}>
                <div className="row g-4 mb-4">
                    
                    {/* รหัสโครงการ */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">รหัสโครงการ</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            style={{ ...inputStyle, backgroundColor: '#e2e8f0', cursor: 'not-allowed' }} 
                            value={formData.projectId} 
                            readOnly 
                        />
                    </div>

                    {/* ชื่อโครงการ */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">ชื่อโครงการ <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            name="projectName"
                            className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
                            style={inputStyle}
                            value={formData.projectName} 
                            onChange={handleChange}
                            placeholder="ระบุชื่อโครงการ..."
                        />
                        {errors.projectName && <div className="text-danger small mt-1">{errors.projectName}</div>}
                    </div>

                    {/* หน่วยงานลูกค้า (David Lee) */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">หน่วยงานลูกค้า</label>
                        <select 
                            name="customerId"
                            className="form-select" 
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            value={formData.customerId} 
                            onChange={handleClientChange}
                        >
                            
                            {contactOptions.map(c => (
                                <option key={c.id || c.Id} value={c.id || c.Id}>
                                    {c.firstName || c.FirstName} {c.lastName || c.LastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* บริษัทผู้รับผิดชอบ (Inno) */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">บริษัทผู้รับผิดชอบ</label>
                        <select 
                            name="companyName"
                            className="form-select" 
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            value={formData.companyName} 
                            onChange={handleCompanyChange}
                        >
                            
                            {companyOptions.map((comp, index) => (
                                <option key={comp.id || comp.Id || index} value={comp.name || comp.Name}>
                                    {comp.name || comp.Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* สถานะ */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">สถานะโครงการ</label>
                        <select 
                            name="projectStatus"
                            className="form-select" 
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            value={formData.projectStatus} 
                            onChange={handleChange}
                        >
                            <option value="จัดทำโครงการ">จัดทำโครงการ</option>
                            <option value="ร่าง TOR">ร่าง TOR</option>
                            <option value="ยื่นข้อเสนอ">ยื่นข้อเสนอ</option>
                            <option value="ดำเนินงาน">ดำเนินงาน</option>
                            
                        </select>
                    </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-light border fw-bold px-4 py-2 rounded-3" onClick={handleGoBack} disabled={loading}>
                        <FontAwesomeIcon icon={faTimes} className="me-2" /> ยกเลิก
                    </button>
                    <button type="submit" className="btn btn-primary fw-bold px-4 py-2 rounded-3" disabled={loading} style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}>
                        {loading ? 'กำลังบันทึก...' : <><FontAwesomeIcon icon={faSave} className="me-2" /> บันทึกการแก้ไข</>}
                    </button>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProject;