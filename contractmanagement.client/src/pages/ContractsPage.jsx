import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. เพิ่ม import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faChevronLeft, faChevronRight, faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";

const ContractPage = () => {
  const navigate = useNavigate(); // 2. เรียกใช้ hook navigate
  const [activeTab, setActiveTab] = useState('all');

  // Mock Data ตามรูปภาพ
  const [data, setData] = useState([
    { id: 1, code: '2024-063', name: 'โครงการปรับปรุงระบบเข้าออกและบันทึกเวลา', value: '2,700,000', status: 'Closed', contractNo: 'จ.๒/๒๕๖๘', contractDate: 'ลว.29/11/68', customer: 'กทม.', company: 'ODG' },
    { id: 2, code: '2025-033', name: 'โครงการจ้างบำรุงรักษาและซ่อมแซม', value: '1,169,600', status: 'In Progress', contractNo: '๐๐๒/๒๕๖๘', contractDate: 'ลว.29/11/68', customer: 'ส.กทม.', company: 'Inno' },
    { id: 3, code: '2025-001', name: 'โครงการจัดซื้อคุรุภัณฑ์คอมพิวเตอร์', value: '1,000,000', status: 'In Progress', contractNo: '-', contractDate: '', customer: 'TIJ', company: 'Inno' },
    { id: 4, code: '2025-002', name: 'โครงการพัฒนาแพลตฟอร์มดิจิทัล', value: '1,000,000', status: 'In Progress', contractNo: '-', contractDate: '', customer: 'NSM', company: 'มจพ./Inno' },
    { id: 5, code: '2025-003', name: 'โครงการที่ปรึกษาด้านความปลอดภัย', value: '1,000,000', status: 'In Progress', contractNo: '-', contractDate: '', customer: 'DITP', company: 'Inno' },
  ]);

  // Helper เลือกสี Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Closed': return { bg: '#e0f2fe', text: '#0ea5e9', label: 'ปิดโครงการ' }; // สีฟ้าอ่อน
      case 'In Progress': return { bg: '#fef9c3', text: '#ca8a04', label: 'ดำเนินการ' }; // สีเหลืองอ่อน
      default: return { bg: '#f1f5f9', text: '#64748b', label: '-' };
    }
  };

  return (
    <div className="container-fluid p-0">
      
      {/* --- 1. Page Header --- */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>สัญญาโครงการ</h3>
        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>ข้อมูลโครงการ</span>
      </div>

      {/* --- 2. Tabs Section --- */}
      <div className="d-flex border-bottom mb-4" style={{ borderColor: '#e2e8f0' }}>
        {['โครงการทั้งหมด', 'โครงการ Software', 'โครงการ Hardware', 'โครงการ งานเช่า'].map((tab, index) => {
           const tabKey = index === 0 ? 'all' : tab;
           const isActive = activeTab === tabKey;
           return (
             <button
                key={index}
                className="btn border-0 pb-3 me-4"
                style={{ 
                    borderBottom: isActive ? '2px solid #3b82f6' : 'none',
                    color: isActive ? '#3b82f6' : '#64748b',
                    fontWeight: isActive ? '600' : '400',
                    borderRadius: 0,
                    fontSize: '0.95rem'
                }}
                onClick={() => setActiveTab(tabKey)}
             >
                {tab}
             </button>
           );
        })}
      </div>

      {/* --- 3. Filter Bar --- */}
      <div className="row g-3 mb-4">
        {/* ปีงบประมาณ */}
        <div className="col-md-2 col-6">
            <div className="position-relative">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-muted small" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#94a3b8' }} />
                <select className="form-select border-0 ps-5 shadow-sm" style={{ height: '45px', borderRadius: '8px', color: '#1e293b', fontSize: '0.9rem', backgroundColor: '#fff' }}>
                    <option>2568</option>
                    <option>2567</option>
                </select>
            </div>
        </div>
        
        {/* ค้นหาตามสถานะ */}
        <div className="col-md-3 col-6">
            <select className="form-select border-0 shadow-sm" style={{ height: '45px', borderRadius: '8px', color: '#1e293b', fontSize: '0.9rem', backgroundColor: '#fff' }}>
                <option>ค้นหาตามสถานะโครงการ</option>
                <option>ปิดโครงการ</option>
                <option>ดำเนินการ</option>
            </select>
        </div>

        {/* Spacer */}
        <div className="col-md-1 d-none d-md-block"></div>

        {/* ค้นหาหน่วยงาน */}
        <div className="col-md-2 col-6">
            <div className="position-relative">
                <FontAwesomeIcon icon={faSearch} className="text-muted small" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" className="form-control border-0 shadow-sm" style={{ paddingLeft: '40px', height: '45px', color: '#1e293b', fontSize: '0.9rem', borderRadius: '8px', backgroundColor: '#fff' }} placeholder="ค้นหาหน่วยงาน" />
            </div>
        </div>

        {/* ค้นหาโครงการ */}
        <div className="col-md-3 col-6">
            <div className="position-relative">
                <FontAwesomeIcon icon={faSearch} className="text-muted small" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" className="form-control border-0 shadow-sm" style={{ paddingLeft: '40px', height: '45px', color: '#1e293b', fontSize: '0.9rem', borderRadius: '8px', backgroundColor: '#fff' }} placeholder="ค้นหาโครงการ" />
            </div>
        </div>

        {/* ปุ่มค้นหา */}
        <div className="col-md-1 col-12">
            <button className="btn w-100 fw-bold shadow-sm" style={{ height: '45px', borderRadius: '8px', backgroundColor: '#0f172a', color: 'white', fontSize: '0.9rem' }}>
                ค้นหา <FontAwesomeIcon icon={faSearch} className="ms-1" style={{fontSize: '0.7rem'}} />
            </button>
        </div>
      </div>

      {/* --- 4. Data Table --- */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle" style={{borderCollapse: 'separate', borderSpacing: '0'}}>
            <thead style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
              <tr>
                <th className="py-4 ps-4 border-bottom-0" style={{ width: '5%' }}><input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} /></th>
                <th className="py-4 border-bottom-0 text-center" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '5%' }}>No.</th>
                <th className="py-4 border-bottom-0" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '15%' }}>เลขที่โครงการ</th>
                <th className="py-4 border-bottom-0" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '25%' }}>ชื่อโครงการ</th>
                <th className="py-4 border-bottom-0" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '10%' }}>มูลค่าโครงการ</th>
                <th className="py-4 border-bottom-0 text-center" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '10%' }}>สถานะงาน</th>
                <th className="py-4 border-bottom-0" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '10%' }}>เลขที่สัญญา</th>
                <th className="py-4 border-bottom-0" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '10%' }}>ชื่อลูกค้า</th>
                <th className="py-4 border-bottom-0 text-end pe-4" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', width: '10%' }}>บริษัท</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const statusStyle = getStatusBadge(item.status);
                return (
                    <tr 
                        key={item.id} 
                        // 3. ใส่ onClick เพื่อลิงก์ไปหน้า Detail ตาม ID
                        onClick={() => navigate(`/contract/detail/${item.id}`)}
                        // 4. เพิ่ม cursor pointer ให้รู้ว่ากดได้
                        style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                    >
                    <td className="py-3 ps-4 border-bottom-0" onClick={(e) => e.stopPropagation()}>
                        {/* ใส่ stopPropagation ที่ checkbox เพื่อไม่ให้กดติ๊กแล้วเด้งเปลี่ยนหน้า */}
                        <input type="checkbox" className="form-check-input cursor-pointer" style={{ width: '18px', height: '18px', borderColor: '#cbd5e1' }} />
                    </td>
                    <td className="py-3 text-center border-bottom-0 fw-bold" style={{ color: '#1e293b', fontSize: '0.9rem' }}>{index + 1}</td>
                    <td className="py-3 border-bottom-0 fw-bold" style={{ color: '#475569', fontSize: '0.9rem' }}>{item.code}</td>
                    <td className="py-3 border-bottom-0 fw-bold" style={{ color: '#1e293b', fontSize: '0.9rem' }}>{item.name}</td>
                    <td className="py-3 border-bottom-0 fw-bold" style={{ color: '#1e293b', fontSize: '0.9rem' }}>{item.value}</td>
                    
                    {/* Badge สถานะ */}
                    <td className="py-3 text-center border-bottom-0">
                        <span className="badge rounded-1 px-3 py-2 fw-bold" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontSize: '0.75rem', minWidth: '80px' }}>
                        {statusStyle.label}
                        </span>
                    </td>

                    {/* เลขที่สัญญา */}
                    <td className="py-3 border-bottom-0">
                        <div className="d-flex flex-column">
                            <span className="fw-bold" style={{ color: '#475569', fontSize: '0.85rem' }}>{item.contractNo}</span>
                            {item.contractDate && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.contractDate}</span>}
                        </div>
                    </td>

                    <td className="py-3 border-bottom-0" style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.customer}</td>
                    <td className="py-3 text-end pe-4 border-bottom-0" style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.company}</td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 5. Pagination --- */}
      <div className="d-flex justify-content-start align-items-center mt-4">
        <button className="btn btn-light me-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', color: '#cbd5e1' }} disabled>
            <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        
        {/* Page Numbers */}
        {[1, 2, 3, 4, 5].map(num => (
            <button key={num} className="btn btn-light fw-bold mx-1" style={{ border: 'none', backgroundColor: 'transparent', color: num === 1 ? '#0f172a' : '#94a3b8' }}>
                {num}
            </button>
        ))}
        <span className="mx-2 text-muted">...</span>
        <button className="btn btn-light fw-bold mx-1" style={{ border: 'none', backgroundColor: 'transparent', color: '#94a3b8' }}>10</button>

        <button className="btn btn-primary ms-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', backgroundColor: '#3b82f6', border: 'none' }}>
            <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

    </div>
  );
};

export default ContractPage;