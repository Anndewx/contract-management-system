import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUploadAlt, faFileAlt, faFileImage, faPlus, faEllipsisH, faArrowLeft, 
  faSave, faSearch, faCalendarAlt, faPaperclip, faTrash, faEdit
} from "@fortawesome/free-solid-svg-icons";

// Import Modals ทั้งหมด
import PaymentModal from './PaymentModal';
import DeliveryModal from './DeliveryModal';
import SaveModal from './SaveModal';
import DisbursementModal from './DisbursementModal';
import EquipmentModal from './EquipmentModal'; 
import InstallationModal from './InstallationModal';
import SubContractModal from './SubContractModal';

const ContractDetailPage = () => {
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('project_info');
  
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

  const handleFinalSave = () => {
    console.log("บันทึกข้อมูลเรียบร้อย");
    setShowSaveConfirm(false);
    navigate('/contract');
  };

  // ==========================================
  // Render Functions
  // ==========================================

  // Tab 1: ข้อมูลโครงการ
  const renderProjectInfo = () => (
    <>
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="row g-4">
            <div className="col-12 col-lg-8">
                {/* เปลี่ยนสีหัวข้อ */}
                <h5 className="fw-bold mb-4" style={{ color: '#1e293b', fontSize: '1rem' }}>ข้อมูลโครงการเบื้องต้น</h5>
                <div className="row g-3">
                    {/* เปลี่ยน Label เป็นสีดำ และ Input เป็นพื้นขาว */}
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>สัญญาเลขที่ <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" defaultValue="จ.2/2568" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>ลงวันที่ <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" defaultValue="29 พฤศจิกายน 2567" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>วิธีการจ้าง <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" defaultValue="ประกวดราคา" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>วิธีการจัดหา <span className="text-danger">*</span></label>
                        <input type="text" className="form-control text-end" defaultValue="ประกวดราคา" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>ระยะการรับประกัน</label>
                        <div className="position-relative">
                             <input type="text" className="form-control text-end" defaultValue="1" style={{ paddingRight: '40px', backgroundColor: '#FFFFFF', color: '#000000' }} />
                             <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#333333', fontSize: '0.85rem' }}>ปี</span>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>ระยะเวลา (วัน)</label>
                        <input type="text" className="form-control text-end" defaultValue="360" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 ps-lg-5 border-start-lg">
                <label className="form-label fw-bold small mb-3" style={{ color: '#333333' }}>เอกสารแนบ</label>
                {/* ปรับพื้นหลังส่วน Upload ให้เป็นขาวสะอาด */}
                <div className="d-flex flex-column align-items-center justify-content-center p-4 mb-4" style={{ border: '2px dashed #e2e8f0', borderRadius: '10px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="text-secondary mb-2 fs-2" />
                    <span className="small text-muted">Drag files here or Browse</span>
                </div>
                <div className="d-flex align-items-center p-2 mb-2 border-bottom">
                    <div className="bg-light rounded p-2 me-3"><FontAwesomeIcon icon={faFileImage} className="text-secondary" /></div>
                    <div className="flex-grow-1">
                        <div className="fw-bold" style={{ fontSize: '0.85rem', color: '#1e293b' }}>สัญญาจ้าง.jpg</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>upload by: Nut Date: dd/mm/yyy</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between mb-4">
            <h5 className="fw-bold">งวดเงินและรายละเอียดการชำระเงิน</h5>
            <button className="btn btn-primary btn-sm" onClick={() => setShowPaymentModal(true)}><FontAwesomeIcon icon={faPlus} /> เพิ่มรายการ</button>
        </div>
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                {/* หัวตารางสีดำ */}
                <thead className="bg-light"><tr className="small" style={{ color: '#333333', fontWeight: 'bold' }}><th>งวด</th><th>รายการ</th><th>จำนวนเงิน</th></tr></thead>
                <tbody>{payments.map(i=><tr key={i.id}><td>{i.id}</td><td>{i.desc}</td><td>{i.amount}</td></tr>)}</tbody>
            </table>
        </div>
      </div>
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between mb-4">
            <h5 className="fw-bold">ประวัติส่งมอบงาน</h5>
            <button className="btn btn-primary btn-sm" onClick={() => setShowDeliveryModal(true)}><FontAwesomeIcon icon={faPlus} /> เพิ่มรายการ</button>
        </div>
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="bg-light"><tr className="small" style={{ color: '#333333', fontWeight: 'bold' }}><th>งวด</th><th>เลขที่หนังสือ</th><th>สถานะ</th></tr></thead>
                <tbody>{deliveries.map(i=><tr key={i.id}><td>{i.id}</td><td>{i.docNo}</td><td>{i.status}</td></tr>)}</tbody>
            </table>
        </div>
      </div>
    </>
  );

  // Tab 2: ข้อมูลสัญญา
  const renderContractInfo = () => (
    <>
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <h5 className="fw-bold mb-4" style={{ color: '#1e293b', fontSize: '1rem' }}>ข้อมูลสัญญาหรือข้อตกลง</h5>
        <div className="row g-3">
             <div className="col-12">
                 <label className="form-label fw-bold small" style={{ color: '#333333' }}>ชื่อผู้ว่าจ้าง *</label>
                 <input type="text" className="form-control" defaultValue="สำนักงานกองทุนหมู่บ้านและชุมชนเมืองแห่งชาติ (สทบ.)" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
             </div>
             <div className="col-12 col-md-6">
                 <label className="form-label fw-bold small" style={{ color: '#333333' }}>เลขประจำตัวผู้เสียภาษีอากร *</label>
                 <input type="text" className="form-control" placeholder="Txxx-xxxxx-xxx-xxxx" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
             </div>
             <div className="col-12 col-md-6">
                 <label className="form-label fw-bold small" style={{ color: '#333333' }}>ประเภทสัญญา *</label>
                 <input type="text" className="form-control" defaultValue="สัญญาจ้างทั่วไป" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
             </div>
             <div className="col-12 col-md-6">
                 <label className="form-label fw-bold small" style={{ color: '#333333' }}>เลขที่สัญญา *</label>
                 <input type="text" className="form-control" defaultValue="จ.๒/๒๕๖๘" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
             </div>
             <div className="col-12 col-md-6">
                 <label className="form-label fw-bold small" style={{ color: '#333333' }}>ลงวันที่ *</label>
                 <input type="text" className="form-control" placeholder="dd/MMM/yyyy" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} />
             </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <h5 className="fw-bold mb-4" style={{ color: '#1e293b', fontSize: '1rem' }}>ยื่นหลักประกันสัญญา</h5>
        <div className="row g-3 mb-4">
             {/* แก้ Label ดำ, Input ขาว ทั้งหมด */}
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>ประเภทหลักประกัน *</label><input type="text" className="form-control" defaultValue="หลักประกันสัญญา" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>วันที่รับหลักประกัน *</label><input type="text" className="form-control text-end" placeholder="dd/MMM/yyyy" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>ระยะเวลาประกันเริ่มต้นวันที่ *</label><input type="text" className="form-control text-end" placeholder="dd/MMM/yyyy" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>จนถึงวันที่ *</label><input type="text" className="form-control text-end" placeholder="เมื่อสิ้นสุดภาระผูกพันสัญญา" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>วงเงินประกันสัญญา (บาท)*</label><input type="text" className="form-control text-end" defaultValue="130,000" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>อัตราร้อยละ</label><input type="text" className="form-control text-end" defaultValue="5.00" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12"><label className="form-label fw-bold small" style={{ color: '#333333' }}>ประเภทหลักทรัพย์</label><input type="text" className="form-control" defaultValue="หนังสือค้ำประกันอิเล็กทรอนิกส์" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
        </div>
      </div>
    </>
  );

  // Tab 3: การเบิกจ่าย
  const renderDisbursement = () => (
    <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between mb-4">
            <h5 className="fw-bold">รายละเอียดการเบิกจ่าย</h5>
            <button className="btn btn-primary btn-sm shadow-sm" style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }} onClick={() => setShowDisbursementModal(true)}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> เพิ่มรายการ
            </button>
        </div>
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="bg-light">
                    {/* หัวตารางสีดำ */}
                    <tr className="small fw-bold" style={{ color: '#333333' }}>
                        <th className="py-3 ps-4">ลำดับ</th>
                        <th className="py-3">เลขที่เบิกจ่าย</th>
                        <th className="py-3">งวด</th>
                        <th className="py-3 text-end">จำนวนเงิน</th>
                        <th className="py-3">วันที่</th>
                        <th className="py-3">สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    {disbursementList.map((item, index) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td className="py-3 ps-4">{index + 1}</td>
                            <td className="py-3 fw-bold small">{item.docNo}</td>
                            <td className="py-3 small">{item.installment}</td>
                            <td className="py-3 text-end small fw-bold">{item.amount}</td>
                            <td className="py-3 small">{item.date}</td>
                            <td className={`py-3 small fw-bold ${item.statusClass}`}>{item.status}</td>
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
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <h5 className="fw-bold mb-4">รายละเอียดอุปกรณ์</h5>
        <div className="d-flex justify-content-between mb-3">
            <div className="input-group" style={{ maxWidth: '300px' }}>
                {/* ช่องค้นหาพื้นขาว */}
                <span className="input-group-text border-end-0" style={{ backgroundColor: '#FFFFFF' }}><FontAwesomeIcon icon={faSearch} className="text-muted"/></span>
                <input type="text" className="form-control border-start-0" placeholder="ระบุคำค้นหา" style={{ backgroundColor: '#FFFFFF' }} />
            </div>
            {/* ปุ่มเพิ่มรายการตัวหนังสือดำ */}
            <button className="btn btn-light border fw-bold small shadow-sm" style={{ color: '#000000' }} onClick={() => setShowEquipmentModal(true)}>
                เพิ่มรายการ <FontAwesomeIcon icon={faPlus} className="ms-1" />
            </button>
        </div>
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="bg-light">
                    <tr className="small fw-bold" style={{ color: '#333333' }}>
                        <th className="py-3 ps-4">ลำดับ</th>
                        <th className="py-3">ชื่ออุปกรณ์</th>
                        <th className="py-3 text-center">จำนวน</th>
                        <th className="py-3">ประเภท</th>
                        <th className="py-3">รุ่น</th>
                        <th className="py-3">ยี่ห้อ</th>
                        <th className="py-3">S/N</th>
                    </tr>
                </thead>
                <tbody>
                    {equipmentList.map((item, index) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td className="py-3 ps-4">{index + 1}</td>
                            <td className="py-3 small text-dark fw-bold">{item.name}</td>
                            <td className="py-3 small text-center">{item.qty}</td>
                            <td className="py-3 small">{item.type}</td>
                            <td className="py-3 small">{item.model}</td>
                            <td className="py-3 small">{item.brand}</td>
                            <td className="py-3 small">{item.serial}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <h5 className="fw-bold mb-4">ข้อมูลการติดตั้งและทดสอบ</h5>
        <div className="d-flex justify-content-between mb-3">
            <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text border-end-0" style={{ backgroundColor: '#FFFFFF' }}><FontAwesomeIcon icon={faSearch} className="text-muted"/></span>
                <input type="text" className="form-control border-start-0" placeholder="ระบุคำค้นหา" style={{ backgroundColor: '#FFFFFF' }} />
            </div>
            <button className="btn btn-light border fw-bold small shadow-sm" style={{ color: '#000000' }} onClick={() => setShowInstallationModal(true)}>
                เพิ่มรายการ <FontAwesomeIcon icon={faPlus} className="ms-1" />
            </button>
        </div>
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="bg-light">
                    <tr className="small fw-bold" style={{ color: '#333333' }}>
                        <th className="py-3 ps-4">ลำดับ</th>
                        <th className="py-3">รายละเอียดผลการติดตั้ง</th>
                        <th className="py-3">วันที่ติดตั้ง</th>
                        <th className="py-3">ทีมติดตั้ง</th>
                        <th className="py-3">สถานที่</th>
                        <th className="py-3">ผลการทดสอบ</th>
                    </tr>
                </thead>
                <tbody>
                    {installationList.map((item, index) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td className="py-3 ps-4">{index + 1}</td>
                            <td className="py-3 small text-dark">{item.detail}</td>
                            <td className="py-3 small">{item.date}</td>
                            <td className="py-3 small">{item.team}</td>
                            <td className="py-3 small">{item.location}</td>
                            <td className="py-3 small">{item.result}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <h5 className="fw-bold mb-4">ข้อมูลการส่งมอบ (Delivery Information)</h5>
        <div className="row g-3">
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>วันที่ส่งมอบอุปกรณ์</label><input type="text" className="form-control" defaultValue="DD/MMM/YYYY" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>หมายเลขใบส่งของ (DN)</label><input type="text" className="form-control" defaultValue="Xxxx" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>ชื่อผู้รับอุปกรณ์</label><input type="text" className="form-control" defaultValue="Xxxx" style={{ backgroundColor: '#FFFFFF', color: '#000000' }} /></div>
             <div className="col-12 col-md-6"><label className="form-label fw-bold small" style={{ color: '#333333' }}>สถานะการส่งมอบ</label><select className="form-select" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}><option>ส่งมอบแล้ว</option></select></div>
        </div>
      </div>
    </>
  );

  // Tab 5: สัญญาย่อย
  const renderSubContract = () => (
    <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between mb-4">
            <h5 className="fw-bold">ข้อมูลสัญญาย่อย (Sub-contract)</h5>
            <button className="btn btn-primary btn-sm shadow-sm" style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }} onClick={() => setShowSubContractModal(true)}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> เพิ่มรายการ
            </button>
        </div>
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="bg-light">
                    <tr className="small fw-bold" style={{ color: '#333333' }}>
                        <th className="py-3 ps-4">ลำดับ</th>
                        <th className="py-3">บริษัทคู่สัญญา (Vendor)</th>
                        <th className="py-3">เลขที่สัญญา/PO</th>
                        <th className="py-3">รายละเอียดงาน</th>
                        <th className="py-3 text-end">มูลค่าสัญญา</th>
                        <th className="py-3">วันที่ทำสัญญา</th>
                        <th className="py-3">สถานะ</th>
                        <th className="py-3">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {subContractList.map((item, index) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td className="py-3 ps-4">{index + 1}</td>
                            {/* เปลี่ยน text-primary (ฟ้า) เป็น text-dark (ดำ) */}
                            <td className="py-3 fw-bold small text-dark">{item.vendor}</td>
                            <td className="py-3 small">{item.contractNo}</td>
                            <td className="py-3 small">{item.work}</td>
                            <td className="py-3 text-end small fw-bold">{item.amount}</td>
                            <td className="py-3 small">{item.date}</td>
                            <td className="py-3 small">
                                <span className={`badge rounded-pill fw-normal px-2 ${item.status === 'ส่งมอบแล้ว' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-dark'}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="py-3 small text-secondary">
                                <FontAwesomeIcon icon={faEdit} className="me-2 cursor-pointer hover-dark" />
                                <FontAwesomeIcon icon={faTrash} className="cursor-pointer hover-danger" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="container-fluid p-0">
      
      {/* Header (Common) */}
      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-3 gap-3">
            <button className="btn btn-light text-secondary" onClick={() => navigate('/contract')}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
                <h4 className="fw-bold mb-1" style={{ color: '#1e293b' }}>2024-063_กองทุนหมู่บ้านระบบ AccessDor</h4>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }} className="d-flex flex-wrap gap-2">
                    <span>งบประมาณ <span className="text-danger fw-bold">2,700,000 บาท</span></span>
                    <span className="d-none d-md-inline">|</span> 
                    <span>ปีงบประมาณ <span className="fw-bold text-dark">2024-2025</span></span>
                    <span className="d-none d-md-inline">|</span> 
                    <span>สถานะโครงการ <span className="text-success fw-bold">กำลังดำเนินการ</span></span>
                </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex border-bottom mt-4 overflow-auto text-nowrap" style={{ borderColor: '#e2e8f0' }}>
            {['ข้อมูลโครงการ', 'ข้อมูลสัญญา', 'การเบิกจ่าย', 'รายการอุปกรณ์', 'สัญญาย่อย'].map((tab, idx) => {
                const mapKeys = ['project_info', 'contract_info', 'disbursement', 'equipment', 'sub_contract'];
                const isActive = activeTab === mapKeys[idx];
                return (
                    <button 
                        key={idx}
                        className="btn border-0 pb-3 me-4"
                        style={{ 
                            borderBottom: isActive ? '2px solid #3b82f6' : 'none',
                            color: isActive ? '#3b82f6' : '#64748b',
                            fontWeight: isActive ? '600' : '400',
                            borderRadius: 0,
                            fontSize: '0.95rem'
                        }}
                        onClick={() => setActiveTab(mapKeys[idx])}
                    >
                        {tab}
                    </button>
                )
            })}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'project_info' && renderProjectInfo()}
      {activeTab === 'contract_info' && renderContractInfo()}
      {activeTab === 'disbursement' && renderDisbursement()}
      {activeTab === 'equipment' && renderEquipment()} 
      {activeTab === 'sub_contract' && renderSubContract()}

      {/* Footer */}
      <div className="d-flex justify-content-end mb-5">
        {/* เปลี่ยนปุ่มยกเลิกเป็นสีดำ */}
        <button 
            className="btn btn-white border me-2 px-4 py-2 fw-bold" 
            style={{ color: '#000000' }}
            onClick={() => navigate('/contract')}
        >
            ยกเลิก
        </button>
        <button 
            className="btn btn-primary px-4 py-2 fw-bold shadow-sm" 
            style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
            onClick={() => setShowSaveConfirm(true)}
        >
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