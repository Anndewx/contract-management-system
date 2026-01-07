import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUploadAlt, faFileAlt, faFileImage, faPlus, faEllipsisH, faArrowLeft, 
  faSave, faSearch, faCalendarAlt, faPaperclip, faTrash, faEdit, faFilePdf, faFileWord
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

// Import Modals ทั้งหมด
import PaymentModal from './PaymentModal';
import DeliveryModal from './DeliveryModal';
import SaveModal from './SaveModal';
import DisbursementModal from './DisbursementModal';
import EquipmentModal from './EquipmentModal'; 
import InstallationModal from './InstallationModal';
import SubContractModal from './SubContractModal';

const API_BASE_URL = "http://localhost:5056/api";

const ContractDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState('project_info');
  
  // Project Data State
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  
  // Form State สำหรับข้อมูลสัญญา
  const [contractForm, setContractForm] = useState({
    contractNo: '',
    contractDate: '',
    hireMethod: 'ประกวดราคา',
    procurementMethod: 'ประกวดราคา',
    warrantyYears: 1,
    durationDays: 360,
  });
  
  // Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showInstallationModal, setShowInstallationModal] = useState(false);
  const [showSubContractModal, setShowSubContractModal] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // --- Mock Data ---
  const payments = [
    { id: 1, desc: 'รายงานผลการดำเนินงาน (Progress Report)', date: '13 ม.ค. 2568', percent: '40%', amount: '900,000', docs: 4, usb: 1 },
    { id: 2, desc: 'รายงานฉบับสมบูรณ์ (Final Report)', date: '27 พ.ค. 2568', percent: '60%', amount: '1,200,000', docs: 4, usb: 1 },
  ];

  const deliveries = [
    { id: 1, docNo: 'ODG2568-007', docDate: '10/01/68', dueDate: '13 ม.ค. 2568', actualDate: '14 ก.พ. 2568', status: 'ตรวจรับแล้ว' },
    { id: 2, docNo: 'ODG2568-008', docDate: '11/01/68', dueDate: '28 พ.ค. 2568', actualDate: '27 พ.ค. 2568', status: 'กรรมการพิจารณาตรวจรับ' },
  ];

  const disbursementList = [
    { id: 1, docNo: 'BL2025090001', installment: 1, amount: '0.00', refNo: 'INV2025080001', date: '26-02-2568', status: 'สำเร็จ', statusClass: 'text-success' },
    { id: 2, docNo: 'BL2025090002', installment: 2, amount: '0.00', refNo: 'INV2025080002', date: '26-10-2568', status: 'รอดำเนินการ', statusClass: 'text-secondary' },
  ];

  const equipmentList = [
    { id: 1, name: 'Switch Cisco 2960', qty: 1, type: 'Network', model: 'WS-C2960+24LC-L', brand: 'Cisco Switch', serial: 'S/N Xxx-Xxx' },
    { id: 2, name: 'Cisco Antenna For Wireless Access Point', qty: 1, type: 'Access Point', model: 'AIR-ANT2524DW-R', brand: 'Cisco Antenna', serial: 'S/N Xxx-Xxx' }
  ];

  const installationList = [
    { id: 1, detail: 'Switch Cisco 2980', date: '20-03-2568', team: 'ทีมติดตั้ง 1', location: 'Cisco Switch', result: 'ไม่ผ่าน' },
    { id: 2, detail: 'Cisco Antenna For Wireless Access Point', date: '21-03-2568', team: 'ทีมติดตั้ง 1', location: 'Cisco Antenna', result: 'ผ่าน' }
  ];

  const subContractList = [
    { id: 1, vendor: 'บริษัท เดินสายไฟ จำกัด', contractNo: 'SC-001/68', work: 'เดินสาย Fiber Optic จุดที่ 1-5', amount: '150,000.00', date: '15 ม.ค. 2568', status: 'กำลังดำเนินการ' },
    { id: 2, vendor: 'บริษัท กล้องวงจรปิด จำกัด', contractNo: 'SC-002/68', work: 'ติดตั้งกล้อง CCTV และทดสอบระบบ', amount: '85,000.00', date: '20 ก.พ. 2568', status: 'ส่งมอบแล้ว' }
  ];

  // --- Fetch Project Data ---
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/Projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProjectData(data);
          setContractForm(prev => ({
            ...prev,
            contractNo: data.projectId || '',
            hireMethod: data.procurementMethod || 'ประกวดราคา',
            procurementMethod: data.evaluationMethod || 'ประกวดราคา',
          }));
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  // --- File Upload Handler ---
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString('th-TH'),
      uploadBy: 'Admin'
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = null;
  };

  const handleRemoveAttachment = (fileId) => {
    setAttachments(prev => prev.filter(a => a.id !== fileId));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { icon: faFilePdf, color: '#ef4444', bg: '#fef2f2' };
    if (['doc', 'docx'].includes(ext)) return { icon: faFileWord, color: '#3b82f6', bg: '#eff6ff' };
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return { icon: faFileImage, color: '#f59e0b', bg: '#fffbeb' };
    return { icon: faFileAlt, color: '#6b7280', bg: '#f3f4f6' };
  };

  // --- Format Helpers ---
  const formatCurrency = (num) => new Intl.NumberFormat('th-TH').format(num);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ตรวจรับแล้ว': { bg: '#ecfdf5', color: '#059669' },
      'กรรมการพิจารณาตรวจรับ': { bg: '#fef3c7', color: '#d97706' },
      'สำเร็จ': { bg: '#ecfdf5', color: '#059669' },
      'รอดำเนินการ': { bg: '#f1f5f9', color: '#64748b' },
      'กำลังดำเนินการ': { bg: '#e0f2fe', color: '#0284c7' },
      'ส่งมอบแล้ว': { bg: '#ecfdf5', color: '#059669' },
    };
    const config = statusConfig[status] || { bg: '#f1f5f9', color: '#64748b' };
    return (
      <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: config.bg, color: config.color, fontWeight: 500, fontSize: '0.75rem' }}>
        {status}
      </span>
    );
  };

  const handleFinalSave = async () => {
    try {
      await Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลเรียบร้อย',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      setShowSaveConfirm(false);
      navigate('/contract');
    } catch (error) {
      Swal.fire('Error', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
  };

  // --- Clean Styles ---
  const cleanStyles = `
    .form-control-clean, .form-select-clean {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 0.95rem;
      color: #1e293b;
      transition: all 0.2s ease;
      height: 48px;
    }
    .form-control-clean:focus, .form-select-clean:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      outline: none;
    }
    .form-label-clean {
      font-weight: 600;
      color: #334155;
      font-size: 0.875rem;
      margin-bottom: 8px;
      display: block;
    }
    .card-clean {
      background: #ffffff;
      border-radius: 16px;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
    }
    .btn-primary-clean {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border: none;
      border-radius: 10px;
      padding: 10px 20px;
      font-weight: 600;
      color: white;
      transition: all 0.2s ease;
    }
    .btn-primary-clean:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
      color: white;
    }
    .btn-outline-clean {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 20px;
      font-weight: 600;
      color: #334155;
      transition: all 0.2s ease;
    }
    .btn-outline-clean:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #1e293b;
    }
    .tab-btn {
      border: none;
      background: transparent;
      padding: 12px 0;
      margin-right: 32px;
      font-size: 0.95rem;
      color: #64748b;
      font-weight: 500;
      position: relative;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      color: #3b82f6;
      font-weight: 600;
    }
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border-radius: 3px 3px 0 0;
    }
    .table-clean thead th {
      background: #f8fafc;
      color: #334155;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 14px 16px;
      border: none;
    }
    .table-clean tbody td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.9rem;
      color: #334155;
      vertical-align: middle;
    }
    .table-clean tbody tr:hover {
      background: #f8fafc;
    }
    .upload-zone {
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .upload-zone:hover {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    }
    .section-title {
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border-radius: 2px;
    }
    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .action-btn.edit {
      background: #eff6ff;
      color: #3b82f6;
    }
    .action-btn.edit:hover {
      background: #dbeafe;
    }
    .action-btn.delete {
      background: #fef2f2;
      color: #ef4444;
    }
    .action-btn.delete:hover {
      background: #fee2e2;
    }
  `;

  // ==========================================
  // Render Functions
  // ==========================================

  // Tab 1: ข้อมูลโครงการ
  const renderProjectInfo = () => (
    <>
      <div className="card-clean p-4 mb-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <h5 className="section-title">ข้อมูลโครงการเบื้องต้น</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label-clean">สัญญาเลขที่ <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control form-control-clean" 
                  value={contractForm.contractNo}
                  onChange={(e) => setContractForm({...contractForm, contractNo: e.target.value})}
                  placeholder="จ.2/2568"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label-clean">ลงวันที่ <span className="text-danger">*</span></label>
                <input 
                  type="date" 
                  className="form-control form-control-clean" 
                  value={contractForm.contractDate}
                  onChange={(e) => setContractForm({...contractForm, contractDate: e.target.value})}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label-clean">วิธีการจ้าง <span className="text-danger">*</span></label>
                <select 
                  className="form-select form-select-clean"
                  value={contractForm.hireMethod}
                  onChange={(e) => setContractForm({...contractForm, hireMethod: e.target.value})}
                >
                  <option value="ประกวดราคา">ประกวดราคา</option>
                  <option value="คัดเลือก">คัดเลือก</option>
                  <option value="เฉพาะเจาะจง">เฉพาะเจาะจง</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label-clean">วิธีการจัดหา <span className="text-danger">*</span></label>
                <select 
                  className="form-select form-select-clean"
                  value={contractForm.procurementMethod}
                  onChange={(e) => setContractForm({...contractForm, procurementMethod: e.target.value})}
                >
                  <option value="ประกวดราคา">ประกวดราคา</option>
                  <option value="คัดเลือก">คัดเลือก</option>
                  <option value="เฉพาะเจาะจง">เฉพาะเจาะจง</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label-clean">ระยะการรับประกัน (ปี)</label>
                <input 
                  type="number" 
                  className="form-control form-control-clean text-end" 
                  value={contractForm.warrantyYears}
                  onChange={(e) => setContractForm({...contractForm, warrantyYears: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label-clean">ระยะเวลา (วัน)</label>
                <input 
                  type="number" 
                  className="form-control form-control-clean text-end" 
                  value={contractForm.durationDays}
                  onChange={(e) => setContractForm({...contractForm, durationDays: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="col-12 col-lg-4">
            <label className="form-label-clean mb-3">เอกสารแนบ</label>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} multiple />
            <div className="upload-zone mb-3" onClick={() => fileInputRef.current.click()}>
              <FontAwesomeIcon icon={faCloudUploadAlt} className="mb-2" style={{ fontSize: '2rem', color: '#3b82f6' }} />
              <div className="text-muted small">ลากไฟล์มาวางที่นี่ หรือ <span className="text-primary fw-bold">เลือกไฟล์</span></div>
            </div>
            <div className="d-flex flex-column gap-2">
              {attachments.map(file => {
                const fileType = getFileIcon(file.name);
                return (
                  <div key={file.id} className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div className="rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: fileType.bg, width: 40, height: 40 }}>
                      <FontAwesomeIcon icon={fileType.icon} style={{ color: fileType.color }} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-dark">{file.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>upload by: {file.uploadBy} | {file.uploadDate}</div>
                    </div>
                    <button className="action-btn delete" onClick={() => handleRemoveAttachment(file.id)}>
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* งวดเงินและรายละเอียดการชำระเงิน */}
      <div className="card-clean p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="section-title mb-0">งวดเงินและรายละเอียดการชำระเงิน</h5>
          <button className="btn btn-primary-clean btn-sm" onClick={() => setShowPaymentModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มรายการ
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-clean align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>งวด</th>
                <th>รายการ</th>
                <th style={{ width: '150px' }} className="text-end">จำนวนเงิน</th>
                <th style={{ width: '100px' }} className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(item => (
                <tr key={item.id}>
                  <td><span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{item.id}</span></td>
                  <td className="fw-medium">{item.desc}</td>
                  <td className="text-end fw-bold">{item.amount}</td>
                  <td className="text-center">
                    <button className="action-btn edit me-1"><FontAwesomeIcon icon={faEdit} size="sm" /></button>
                    <button className="action-btn delete"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ประวัติส่งมอบงาน */}
      <div className="card-clean p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="section-title mb-0">ประวัติส่งมอบงาน</h5>
          <button className="btn btn-primary-clean btn-sm" onClick={() => setShowDeliveryModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มรายการ
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-clean align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>งวด</th>
                <th>เลขที่หนังสือ</th>
                <th>กำหนดส่ง</th>
                <th>วันที่ส่งจริง</th>
                <th>สถานะ</th>
                <th style={{ width: '100px' }} className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(item => (
                <tr key={item.id}>
                  <td><span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{item.id}</span></td>
                  <td className="fw-medium">{item.docNo}</td>
                  <td>{item.dueDate}</td>
                  <td>{item.actualDate}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td className="text-center">
                    <button className="action-btn edit me-1"><FontAwesomeIcon icon={faEdit} size="sm" /></button>
                    <button className="action-btn delete"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // Tab 2: ข้อมูลสัญญา
  const renderContractInfo = () => (
    <>
      <div className="card-clean p-4 mb-4">
        <h5 className="section-title">ข้อมูลสัญญาหรือข้อตกลง</h5>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label-clean">ชื่อผู้ว่าจ้าง <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className="form-control form-control-clean" 
              defaultValue={projectData?.customerName || "สำนักงานกองทุนหมู่บ้านและชุมชนเมืองแห่งชาติ (สทบ.)"} 
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">เลขประจำตัวผู้เสียภาษีอากร <span className="text-danger">*</span></label>
            <input type="text" className="form-control form-control-clean" placeholder="Txxx-xxxxx-xxx-xxxx" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">ประเภทสัญญา <span className="text-danger">*</span></label>
            <select className="form-select form-select-clean">
              <option value="สัญญาจ้างทั่วไป">สัญญาจ้างทั่วไป</option>
              <option value="สัญญาจ้างที่ปรึกษา">สัญญาจ้างที่ปรึกษา</option>
              <option value="สัญญาซื้อขาย">สัญญาซื้อขาย</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">เลขที่สัญญา <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className="form-control form-control-clean" 
              value={contractForm.contractNo}
              onChange={(e) => setContractForm({...contractForm, contractNo: e.target.value})}
              placeholder="จ.๒/๒๕๖๘" 
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">ลงวันที่ <span className="text-danger">*</span></label>
            <input 
              type="date" 
              className="form-control form-control-clean" 
              value={contractForm.contractDate}
              onChange={(e) => setContractForm({...contractForm, contractDate: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="card-clean p-4 mb-4">
        <h5 className="section-title">ยื่นหลักประกันสัญญา</h5>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label-clean">ประเภทหลักประกัน <span className="text-danger">*</span></label>
            <select className="form-select form-select-clean">
              <option value="หลักประกันสัญญา">หลักประกันสัญญา</option>
              <option value="หลักประกันผลงาน">หลักประกันผลงาน</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">วันที่รับหลักประกัน <span className="text-danger">*</span></label>
            <input type="date" className="form-control form-control-clean" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">ระยะเวลาประกันเริ่มต้นวันที่ <span className="text-danger">*</span></label>
            <input type="date" className="form-control form-control-clean" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">จนถึงวันที่ <span className="text-danger">*</span></label>
            <input type="date" className="form-control form-control-clean" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">วงเงินประกันสัญญา (บาท) <span className="text-danger">*</span></label>
            <input 
              type="number" 
              className="form-control form-control-clean text-end" 
              defaultValue={projectData?.projectValue ? Math.round(projectData.projectValue * 0.05) : 130000} 
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">อัตราร้อยละ</label>
            <input type="number" className="form-control form-control-clean text-end" defaultValue="5.00" step="0.01" />
          </div>
          <div className="col-12">
            <label className="form-label-clean">ประเภทหลักทรัพย์</label>
            <select className="form-select form-select-clean">
              <option value="หนังสือค้ำประกันอิเล็กทรอนิกส์">หนังสือค้ำประกันอิเล็กทรอนิกส์</option>
              <option value="เงินสด">เงินสด</option>
              <option value="เช็คธนาคาร">เช็คธนาคาร</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );

  // Tab 3: การเบิกจ่าย
  const renderDisbursement = () => (
    <div className="card-clean p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="section-title mb-0">รายละเอียดการเบิกจ่าย</h5>
        <button className="btn btn-primary-clean btn-sm" onClick={() => setShowDisbursementModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มรายการ
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-clean align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ลำดับ</th>
              <th>เลขที่เบิกจ่าย</th>
              <th>งวด</th>
              <th className="text-end">จำนวนเงิน</th>
              <th>วันที่</th>
              <th>สถานะ</th>
              <th style={{ width: '100px' }} className="text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {disbursementList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="fw-medium">{item.docNo}</td>
                <td><span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{item.installment}</span></td>
                <td className="text-end fw-bold">{item.amount}</td>
                <td>{item.date}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td className="text-center">
                  <button className="action-btn edit me-1"><FontAwesomeIcon icon={faEdit} size="sm" /></button>
                  <button className="action-btn delete"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Tab 4: รายการอุปกรณ์
  const renderEquipment = () => (
    <>
      <div className="card-clean p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="section-title mb-0">รายละเอียดอุปกรณ์</h5>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                <FontAwesomeIcon icon={faSearch} className="text-muted"/>
              </span>
              <input type="text" className="form-control border-start-0" placeholder="ค้นหาอุปกรณ์..." style={{ borderRadius: '0 10px 10px 0' }} />
            </div>
            <button className="btn btn-primary-clean btn-sm" onClick={() => setShowEquipmentModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มรายการ
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-clean align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ลำดับ</th>
                <th>ชื่ออุปกรณ์</th>
                <th className="text-center">จำนวน</th>
                <th>ประเภท</th>
                <th>รุ่น</th>
                <th>ยี่ห้อ</th>
                <th>S/N</th>
                <th style={{ width: '100px' }} className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="fw-medium text-dark">{item.name}</td>
                  <td className="text-center">{item.qty}</td>
                  <td><span className="badge bg-light text-dark px-2 py-1">{item.type}</span></td>
                  <td>{item.model}</td>
                  <td>{item.brand}</td>
                  <td className="text-muted small">{item.serial}</td>
                  <td className="text-center">
                    <button className="action-btn edit me-1"><FontAwesomeIcon icon={faEdit} size="sm" /></button>
                    <button className="action-btn delete"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-clean p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="section-title mb-0">ข้อมูลการติดตั้งและทดสอบ</h5>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                <FontAwesomeIcon icon={faSearch} className="text-muted"/>
              </span>
              <input type="text" className="form-control border-start-0" placeholder="ค้นหา..." style={{ borderRadius: '0 10px 10px 0' }} />
            </div>
            <button className="btn btn-primary-clean btn-sm" onClick={() => setShowInstallationModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มรายการ
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-clean align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ลำดับ</th>
                <th>รายละเอียดผลการติดตั้ง</th>
                <th>วันที่ติดตั้ง</th>
                <th>ทีมติดตั้ง</th>
                <th>สถานที่</th>
                <th>ผลการทดสอบ</th>
                <th style={{ width: '100px' }} className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {installationList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="fw-medium">{item.detail}</td>
                  <td>{item.date}</td>
                  <td>{item.team}</td>
                  <td>{item.location}</td>
                  <td>{getStatusBadge(item.result)}</td>
                  <td className="text-center">
                    <button className="action-btn edit me-1"><FontAwesomeIcon icon={faEdit} size="sm" /></button>
                    <button className="action-btn delete"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-clean p-4 mb-4">
        <h5 className="section-title">ข้อมูลการส่งมอบ (Delivery Information)</h5>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label-clean">วันที่ส่งมอบอุปกรณ์</label>
            <input type="date" className="form-control form-control-clean" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">หมายเลขใบส่งของ (DN)</label>
            <input type="text" className="form-control form-control-clean" placeholder="DN-XXXXX" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">ชื่อผู้รับอุปกรณ์</label>
            <input type="text" className="form-control form-control-clean" placeholder="ระบุชื่อผู้รับ" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label-clean">สถานะการส่งมอบ</label>
            <select className="form-select form-select-clean">
              <option value="รอส่งมอบ">รอส่งมอบ</option>
              <option value="ส่งมอบแล้ว">ส่งมอบแล้ว</option>
              <option value="ตรวจรับแล้ว">ตรวจรับแล้ว</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );

  // Tab 5: สัญญาย่อย
  const renderSubContract = () => (
    <div className="card-clean p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="section-title mb-0">ข้อมูลสัญญาย่อย (Sub-contract)</h5>
        <button className="btn btn-primary-clean btn-sm" onClick={() => setShowSubContractModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มรายการ
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-clean align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ลำดับ</th>
              <th>บริษัทคู่สัญญา (Vendor)</th>
              <th>เลขที่สัญญา/PO</th>
              <th>รายละเอียดงาน</th>
              <th className="text-end">มูลค่าสัญญา</th>
              <th>วันที่ทำสัญญา</th>
              <th>สถานะ</th>
              <th style={{ width: '100px' }} className="text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {subContractList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="fw-bold text-dark">{item.vendor}</td>
                <td>{item.contractNo}</td>
                <td className="text-muted small">{item.work}</td>
                <td className="text-end fw-bold">{item.amount}</td>
                <td>{item.date}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td className="text-center">
                  <button className="action-btn edit me-1"><FontAwesomeIcon icon={faEdit} size="sm" /></button>
                  <button className="action-btn delete"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <style>{cleanStyles}</style>
      
      {/* Header */}
      <div className="card-clean p-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-4 gap-3">
          <button className="btn btn-outline-clean" onClick={() => navigate('/contract')} style={{ padding: '10px 16px' }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-2" style={{ color: '#1e293b' }}>
              {projectData ? `${projectData.projectId}_${projectData.projectName}` : '2024-063_กองทุนหมู่บ้านระบบ AccessDor'}
            </h4>
            <div className="d-flex flex-wrap gap-3 align-items-center" style={{ fontSize: '0.9rem' }}>
              <span className="text-muted">
                งบประมาณ <span className="fw-bold" style={{ color: '#ef4444' }}>
                  {projectData ? formatCurrency(projectData.projectValue || 0) : '2,700,000'} บาท
                </span>
              </span>
              <span className="text-muted d-none d-md-inline">|</span>
              <span className="text-muted">
                ปีงบประมาณ <span className="fw-bold text-dark">
                  {projectData ? projectData.fiscalYear : '2024-2025'}
                </span>
              </span>
              <span className="text-muted d-none d-md-inline">|</span>
              <span className="text-muted">
                สถานะโครงการ 
                <span className="badge ms-2 px-3 py-2 rounded-pill" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                  {projectData?.projectStatus || 'กำลังดำเนินการ'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex border-bottom overflow-auto text-nowrap" style={{ borderColor: '#e2e8f0' }}>
          {[
            { key: 'project_info', label: 'ข้อมูลโครงการ' },
            { key: 'contract_info', label: 'ข้อมูลสัญญา' },
            { key: 'disbursement', label: 'การเบิกจ่าย' },
            { key: 'equipment', label: 'รายการอุปกรณ์' },
            { key: 'sub_contract', label: 'สัญญาย่อย' }
          ].map(tab => (
            <button 
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'project_info' && renderProjectInfo()}
      {activeTab === 'contract_info' && renderContractInfo()}
      {activeTab === 'disbursement' && renderDisbursement()}
      {activeTab === 'equipment' && renderEquipment()} 
      {activeTab === 'sub_contract' && renderSubContract()}

      {/* Footer */}
      <div className="d-flex justify-content-end gap-3 mb-5">
        <button className="btn btn-outline-clean px-4 py-2" onClick={() => navigate('/contract')}>
          ยกเลิก
        </button>
        <button className="btn btn-primary-clean px-4 py-2" onClick={() => setShowSaveConfirm(true)}>
          <FontAwesomeIcon icon={faSave} className="me-2" /> บันทึก
        </button>
      </div>

      {/* Modals */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
      <DeliveryModal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} />
      <DisbursementModal isOpen={showDisbursementModal} onClose={() => setShowDisbursementModal(false)} />
      <EquipmentModal isOpen={showEquipmentModal} onClose={() => setShowEquipmentModal(false)} />
      <InstallationModal isOpen={showInstallationModal} onClose={() => setShowInstallationModal(false)} />
      <SubContractModal isOpen={showSubContractModal} onClose={() => setShowSubContractModal(false)} />
      <SaveModal isOpen={showSaveConfirm} onClose={() => setShowSaveConfirm(false)} onConfirm={handleFinalSave} />

    </div>
  );
};

export default ContractDetailPage;