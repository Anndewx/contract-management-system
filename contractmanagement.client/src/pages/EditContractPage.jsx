import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faArrowLeft, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = "http://localhost:5056/api";

const EditContractPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    contractNumber: '',
    title: '', // Project Name or Contract Title
    amount: '',
    isActive: true
  });

  // --- Load Data ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/Contracts/${id}`);
            if (!response.ok) throw new Error("ไม่พบข้อมูลสัญญา");
            
            const data = await response.json();
            setContractData(data);
            
            // Map data to form
            setFormData({
                contractNumber: data.contractNumber || '',
                title: data.title || (data.project ? data.project.projectName : '') || '',
                amount: data.amount || 0,
                isActive: data.isActive
            });

        } catch (error) {
            console.error("Fetch Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'ไม่พบข้อมูล',
                text: 'ไม่สามารถดึงข้อมูลสัญญาได้',
                confirmButtonText: 'กลับ'
            }).then(() => navigate('/contracts'));
        } finally {
            setLoading(false);
        }
    };

    if (id) fetchData();
  }, [id, navigate]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (status) => {
      setFormData({ ...formData, isActive: status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const payload = {
            ...contractData,
            contractNumber: formData.contractNumber,
            title: formData.title,
            amount: parseFloat(formData.amount),
            isActive: formData.isActive,
            updatedDate: new Date().toISOString()
        };

        const response = await fetch(`${API_BASE_URL}/Contracts/${id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            await Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/contracts'); 
        } else {
            throw new Error("Update failed");
        }
    } catch (error) {
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleGoBack = () => navigate('/contracts');

  // --- Styles ---
  const styles = `
    .status-option {
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
    }
    .status-option:hover {
        transform: translateY(-2px);
    }
    .status-option.active-yellow {
        background-color: #fffbeb;
        border-color: #f59e0b;
        color: #b45309;
    }
    .status-option.active-red {
        background-color: #eff6ff; /* Using blueish/redish mix or just red? User said Red Frame */
        background-color: #fef2f2;
        border-color: #ef4444;
        color: #991b1b;
    }
    .status-option.inactive {
        background-color: #f8fafc;
        border-color: #e2e8f0;
        color: #64748b;
        opacity: 0.7;
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
  `;

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <style>{styles}</style>
      
      <div className="d-flex align-items-center mb-4">
          <button className="btn btn-link text-dark me-3 p-0" onClick={handleGoBack}>
             <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <div>
            <h3 className="fw-bold mb-0" style={{ color: '#1e293b' }}>แก้ไขสัญญาโครงการ</h3>
          </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 bg-white">
        <div className="card-body p-4 p-md-5">
          
          {loading && !contractData ? (
              <div className="text-center py-5">กำลังโหลดข้อมูล...</div>
          ) : (
            <form onSubmit={handleSubmit}>
                <div className="row g-4 mb-4">
                    
                    {/* เลขที่สัญญา */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">เลขที่สัญญา</label>
                        <input 
                            type="text" 
                            name="contractNumber"
                            className="form-control p-3 rounded-3 bg-light border-0 text-muted" 
                            value={formData.contractNumber} 
                            readOnly
                            style={{ cursor: 'not-allowed' }}
                        />
                    </div>

                    {/* ชื่อโครงการ */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">ชื่อโครงการ</label>
                        <input 
                            type="text" 
                            name="title"
                            className="form-control p-3 rounded-3 bg-light border-0 text-muted" 
                            value={formData.title} 
                            readOnly
                            style={{ cursor: 'not-allowed' }}
                        />
                    </div>

                    {/* มูลค่าโครงการ */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark small">มูลค่าโครงการ</label>
                        <input 
                            type="number" 
                            name="amount"
                            className="form-control p-3 rounded-3 bg-light border-0 text-muted" 
                            value={formData.amount} 
                            readOnly
                            style={{ cursor: 'not-allowed' }}
                        />
                    </div>

                    {/* สถานะ (Custom UI) */}
                    <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-3">สถานะสัญญา</label>
                        <div className="d-flex gap-3">
                            
                            {/* Option: ดำเนินโครงการ (Yellow) */}
                            <div 
                                className={`status-option p-4 rounded-4 flex-fill d-flex align-items-center justify-content-center gap-3 ${formData.isActive ? 'active-yellow' : 'inactive'}`}
                                onClick={() => handleStatusChange(true)}
                            >
                                <div className={`rounded-circle d-flex align-items-center justify-content-center ${formData.isActive ? 'bg-warning text-white' : 'bg-secondary bg-opacity-25 text-secondary'}`} style={{width: '40px', height: '40px'}}>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0">ดำเนินโครงการ</h6>
                                    <small className="opacity-75">โครงการกำลังดำเนินการอยู่</small>
                                </div>
                            </div>

                            {/* Option: ปิดโครงการ (Red) */}
                            <div 
                                className={`status-option p-4 rounded-4 flex-fill d-flex align-items-center justify-content-center gap-3 ${!formData.isActive ? 'active-red' : 'inactive'}`}
                                onClick={() => handleStatusChange(false)}
                            >
                                <div className={`rounded-circle d-flex align-items-center justify-content-center ${!formData.isActive ? 'bg-danger text-white' : 'bg-secondary bg-opacity-25 text-secondary'}`} style={{width: '40px', height: '40px'}}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0">ปิดโครงการ</h6>
                                    <small className="opacity-75">โครงการเสร็จสิ้นหรือยกเลิก</small>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <hr className="my-4 text-muted opacity-25" />

                <div className="d-flex gap-3 justify-content-end">
                    <button 
                        type="button" 
                        className="btn btn-light fw-bold px-4 py-2 rounded-3" 
                        onClick={handleGoBack} 
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faTimes} className="me-2" /> ยกเลิก
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-lively-save fw-bold px-5 py-2 rounded-3" 
                        disabled={loading} 
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

export default EditContractPage;
