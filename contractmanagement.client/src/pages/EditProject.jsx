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
            // 1.1 ดึงข้อมูล Customer และ Contact (ใช้ /Customers ที่ถูกต้อง)
            // ---------------------------------------------------------
            let fetchedContacts = [];
            let fetchedCompanies = [];

            try {
                // ✅ ใช้ Endpoint /Customers (พหูพจน์) ซึ่งถูกต้องตาม Controller
                const resCustomers = await fetch(`${API_BASE_URL}/Customers`); 
                if (resCustomers.ok) {
                    const customers = await resCustomers.json();
                    fetchedCompanies = customers;
                    
                    // ✅ ดึง Contacts ทั้งหมดจาก Customers (เพราะมีความสัมพันธ์กัน)
                    customers.forEach(c => {
                        if (c.contacts && Array.isArray(c.contacts)) fetchedContacts.push(...c.contacts);
                        else if (c.Contacts && Array.isArray(c.Contacts)) fetchedContacts.push(...c.Contacts);
                    });
                } else {
                    throw new Error("API Customers failed");
                }
            } catch (err) {
                console.warn("Customers API failed, trying fallback.");
            }

            // ---------------------------------------------------------
            // 1.2 ถ้ายังไม่มี Contact ให้ลองดึงจาก /Contact (Backup)
            // ---------------------------------------------------------
            if (fetchedContacts.length === 0) {
                try {
                    const resContact = await fetch(`${API_BASE_URL}/Contact`);
                    if (resContact.ok) {
                        fetchedContacts = await resContact.json();
                    }
                } catch (err) {
                    console.warn("Contact API failed.");
                }
            }

            // ✅ Set State (ถ้าไม่มีข้อมูลให้ใช้ Fallback)
            if (fetchedCompanies.length > 0) {
                setCompanyOptions(fetchedCompanies);
            } else {
                setCompanyOptions([{ Id: 6, Name: 'Inno' }]);
            }

            if (fetchedContacts.length > 0) {
                setContactOptions(fetchedContacts);
            } else {
                setContactOptions([{ Id: 5, FirstName: "P'Nutty", LastName: "" }]);
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

  // --- Styles ---
  const styles = `
    .form-control:focus, .form-select:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        background-color: #fff;
    }
    .btn-lively-cancel {
        background: #f1f5f9;
        color: #64748b;
        border: 1px solid #e2e8f0;
        transition: all 0.2s ease;
    }
    .btn-lively-cancel:hover {
        background: #e2e8f0;
        color: #475569;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .btn-lively-save {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        border: none;
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
    .btn-lively-save:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 10px -1px rgba(37, 99, 235, 0.3);
        color: white !important;
    }
    .btn-lively-save:active {
        transform: translateY(0);
    }
  `;

  const inputStyle = {
      borderRadius: '12px', 
      padding: '12px 15px', 
      backgroundColor: '#f8fafc', 
      borderColor: '#e2e8f0',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease'
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <style>{styles}</style>
      
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

                    {/* ลูกค้า (Contact Person - P'Nutty) */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">ลูกค้า</label>
                        <select 
                            name="customerName"
                            className="form-select" 
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            value={formData.customerName || ''} 
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        >
                            
                            {contactOptions.map(c => {
                                const fName = c.firstName || c.FirstName || "";
                                const lName = c.lastName || c.LastName || "";
                                const fullName = `${fName} ${lName}`.trim();
                                return (
                                    <option key={c.id || c.Id} value={fullName}>
                                        {fullName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* บริษัท (Company - Inno) */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">บริษัท</label>
                        <select 
                            name="customerId"
                            className="form-select" 
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            value={formData.customerId || ''} 
                            onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                const selectedCompany = companyOptions.find(c => (c.id || c.Id) === selectedId);
                                setFormData(prev => ({
                                    ...prev,
                                    customerId: selectedId,
                                    companyName: selectedCompany ? (selectedCompany.name || selectedCompany.Name) : ''
                                }));
                            }}
                        >
                            
                            {companyOptions.map((comp, index) => (
                                <option key={comp.id || comp.Id || index} value={comp.id || comp.Id}>
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

                <div className="d-flex gap-3 justify-content-end">
                    <button 
                        type="button" 
                        className="btn btn-lively-cancel fw-bold px-4 py-2 rounded-3 d-flex align-items-center" 
                        onClick={handleGoBack} 
                        disabled={loading}
                        style={{ height: '48px' }}
                    >
                        <FontAwesomeIcon icon={faTimes} className="me-2" /> ยกเลิก
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-lively-save fw-bold px-5 py-2 rounded-3 d-flex align-items-center" 
                        disabled={loading} 
                        style={{ height: '48px' }}
                    >
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