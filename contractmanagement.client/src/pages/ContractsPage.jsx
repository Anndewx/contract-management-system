import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faEdit, faCalendarAlt, faChevronDown, faCheck, 
  faChevronLeft, faChevronRight, faFileContract
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5056/api"; 

const ContractsPage = () => {
  const navigate = useNavigate();
  
  // --- Data State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedYear, setSelectedYear] = useState('2568'); 
  const [showYearDropdown, setShowYearDropdown] = useState(false); 

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const yearOptions = ["2567", "2568", "2569"];

  // --- Fetch Data ---
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Contracts`);
      if (response.ok) {
        const result = await response.json();
        
        const mappedData = result.map((item, index) => {
            // ดึงข้อมูล Project และ Customer
            const project = item.project || {};
            const customerObj = project.customer || {};
            
            return {
                id: item.id,
                code: item.contractNumber || project.projectId || '-',
                
                // ✅ แก้ไขตรงนี้: สลับเอา project.projectName ขึ้นก่อน
                // เพื่อให้แสดงชื่อล่าสุดจากฐานข้อมูล Project (ถ้ามีการแก้ไขมา)
                projectName: project.projectName || item.title || 'โครงการ',
                
                amount: item.amount ? item.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00',
                status: item.isActive ? 'ดำเนินโครงการ' : 'ปิดโครงการ',
                
                // แสดงชื่อผู้ติดต่อและบริษัทจาก Project
                customer: project.customerName || '-',
                company: project.companyName || '-', 
                
                date: item.startDate 
                      ? new Date(item.startDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) 
                      : (item.createdDate ? new Date(item.createdDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-')
            };
        })
        .sort((a, b) => b.id - a.id);

        setTimeout(() => {
            setData(mappedData);
            setLoading(false);
        }, 800);
      } else {
        console.error("Fetch failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesYear = item.date.includes(selectedYear);
      const matchesStatus = selectedStatus === '' || item.status === selectedStatus;
      const matchesSearch = String(item.projectName).toLowerCase().includes(submittedSearch.toLowerCase()) || 
                            String(item.code).toLowerCase().includes(submittedSearch.toLowerCase());
      return matchesYear && matchesStatus && matchesSearch;
    });
  }, [data, selectedYear, selectedStatus, submittedSearch]);

  // --- Reset Page when Filter Changes ---
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedStatus, submittedSearch]);

  // --- Pagination Calculation ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  };

  // --- Handlers ---
  const handleSearchClick = () => {
    setSubmittedSearch(searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') setSubmittedSearch('');
  };

  const handleRowClick = (id) => {
    navigate(`/contract/detail/${id}`);
  };

  const handleEdit = (e, item) => {
    e.stopPropagation(); 
    navigate(`/contract/edit/${item.id}`);
  };

  // --- Status Badge Renderer ---
  const renderStatusBadge = (status) => {
    let config = { bg: '#f3f4f6', color: '#1f2937', dot: '#9ca3af' }; 

    if (status === 'ดำเนินโครงการ') {
      config = { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' }; 
    } else if (status === 'ปิดโครงการ') {
      config = { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' }; 
    }

    return (
      <span className="badge rounded-pill fw-medium border-0 shadow-sm"
          style={{ 
            backgroundColor: config.bg, 
            color: config.color, 
            fontSize: '0.85rem', 
            padding: '8px 16px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            minWidth: '110px', 
            justifyContent: 'center'
          }}>
          <span style={{width:'8px', height:'8px', backgroundColor: config.dot, borderRadius:'50%', display:'inline-block'}}></span>
          {status}
      </span>
    );
  };

  // --- Premium Styles ---
  const styles = `
    body { background-color: #f8fafc; }
    .card-premium {
        border: none;
        border-radius: 20px;
        box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
        background: white;
        overflow: hidden;
        min-height: 650px;
        display: flex;
        flex-direction: column;
    }
    .table-header {
        background-color: #fff;
        font-size: 0.85rem;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        border-bottom: 1px solid #f1f5f9;
    }
    .table-row {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
    }
    .table-row:hover {
        background-color: #f8fafc;
    }
    .btn-action-square {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: white;
        color: #475569;
        transition: all 0.2s;
    }
    .btn-action-square:hover {
        background-color: #f1f5f9;
        color: #0f172a;
        border-color: #cbd5e1;
    }
    .pagination-btn {
        min-width: 36px;
        height: 36px;
        border-radius: 8px;
        border: none;
        background: white;
        color: #000000;
        font-weight: 600;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        margin: 0 3px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .pagination-btn:hover:not(.active):not(.disabled) {
        background-color: #fff;
        color: #3b82f6;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .pagination-btn.active {
        background-color: #3b82f6;
        color: white;
        box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }
    .pagination-btn.disabled {
        color: #cbd5e1;
        cursor: not-allowed;
        box-shadow: none;
        background-color: #f8fafc;
    }
    .custom-select-year {
        min-width: 130px;
        height: 42px;
        border-color: #e2e8f0;
        cursor: pointer;
    }
    .custom-input {
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        height: 42px;
        background-color: #f8fafc;
        color: #000;
    }
    .btn-clean {
        background-color: #3b82f6;
        border: none;
        color: white;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
    }
    .btn-clean:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        color: white !important;
    }
    .btn-clean:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
    }
  `;

  return (
  <div className="container-fluid px-4 py-4" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
    <style>{styles}</style>
    
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
          <h3 className="fw-bold mb-1 text-black">
             สัญญาโครงการ
          </h3>
          <span className="text-black small ps-1 fw-bold">บริหารจัดการและติดตามสถานะสัญญา</span>
      </div>
    </div>

    {/* Main Card */}
    <div className="card-premium">
      
      {/* Filter Bar */}
      <div className="p-4 border-bottom">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          
          {/* Year Dropdown */}
          <div className="position-relative">
            <div className="bg-light border rounded px-3 d-flex align-items-center justify-content-between shadow-sm custom-select-year" 
                onClick={() => setShowYearDropdown(!showYearDropdown)}>
                  <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-muted me-2"/> 
                      <span className="fw-bold text-dark">{selectedYear}</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className="text-dark" style={{ fontSize: '0.8rem', transform: showYearDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}/> 
            </div>
            
            {showYearDropdown && (
              <div className="position-absolute mt-1 bg-white border rounded-3 shadow-lg p-1" style={{ width: '100%', zIndex: 1000 }}>
                {yearOptions.map(year => (
                  <div 
                    key={year}
                    className="px-3 py-2 rounded-2 d-flex justify-content-between align-items-center"
                    style={{ 
                        cursor: 'pointer', 
                        backgroundColor: selectedYear === year ? '#f3f4f6' : 'transparent',
                        color: '#000'
                    }}
                    onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                    onMouseEnter={(e) => { if(selectedYear !== year) e.currentTarget.style.backgroundColor = '#f9fafb' }} 
                    onMouseLeave={(e) => { if(selectedYear !== year) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <span>{year}</span>
                    {selectedYear === year && <FontAwesomeIcon icon={faCheck} size="xs" className="text-dark"/>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <select 
            className="form-select border-light-subtle bg-light text-dark shadow-sm" 
            style={{ width: '220px', height: '42px', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer', border: '1px solid #e2e8f0' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
             <option value="">สถานะทั้งหมด</option>
             <option value="ดำเนินโครงการ">ดำเนินโครงการ</option>
             <option value="ปิดโครงการ">ปิดโครงการ</option>
          </select>

          <div className="flex-grow-1"></div>

          <div className="position-relative" style={{ width: '300px' }}>
              <FontAwesomeIcon icon={faSearch} className="text-black position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" className="form-control ps-5 custom-input" 
                     placeholder="ค้นหาชื่อหรือรหัสสัญญา..." 
                     value={searchTerm}
                     onChange={handleSearchChange}
                     onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              />
          </div>

          <button className="btn btn-clean fw-bold px-4" 
                  onClick={handleSearchClick}
                  style={{ borderRadius: '10px', height: '42px' }}>
              ค้นหา
          </button>

        </div>
      </div>

      {/* Table */}
      <div className="table-responsive flex-grow-1">
          <table className="table mb-0 align-middle">
            <thead className="table-header">
              <tr>
                <th className="py-4 ps-4 text-center border-0" style={{ width: '5%' }}>NO.</th>
                <th className="py-4 text-start border-0" style={{ width: '10%' }}>เลขที่โครงการ</th>
                <th className="py-4 text-start border-0" style={{ width: '25%' }}>ชื่อโครงการ</th>
                <th className="py-4 text-end border-0 pe-4" style={{ width: '12%' }}>มูลค่าโครงการ</th>
                <th className="py-4 text-center border-0" style={{ width: '13%' }}>สถานะงาน</th>
                <th className="py-4 text-center border-0" style={{ width: '15%' }}>ชื่อลูกค้า</th>
                <th className="py-4 text-center border-0" style={{ width: '10%' }}>บริษัท</th>
                <th className="py-4 text-center border-0" style={{ width: '10%' }}>ส่วนจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 [...Array(itemsPerPage)].map((_, i) => (
                    <tr key={i}>
                         <td colSpan="8" className="py-4 ps-4">
                            <div className="d-flex align-items-center placeholder-glow">
                                <span className="placeholder col-6 rounded" style={{height: '20px'}}></span>
                            </div>
                        </td>
                    </tr>
                 ))
              ) : filteredData.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-5 text-dark">ไม่พบข้อมูลสัญญา</td></tr>
              ) : (
                currentItems.map((item, index) => (
                <tr 
                    key={item.id} 
                    onClick={() => handleRowClick(item.id)}
                    className="table-row"
                >
                  <td className="py-3 ps-4 text-center fw-bold text-dark">{indexOfFirstItem + index + 1}</td>
                  <td className="py-3 text-start text-dark">{item.code}</td>
                  <td className="py-3 text-start fw-bold text-dark">{item.projectName}</td>
                  <td className="py-3 text-end fw-bold text-dark pe-4">{item.amount}</td>
                  <td className="py-3 text-center">{renderStatusBadge(item.status)}</td>
                  
                  {/* แสดงชื่อผู้ติดต่อ */}
                  <td className="py-3 text-center text-dark">{item.customer}</td>
                  
                  {/* แสดงชื่อบริษัท */}
                  <td className="py-3 text-center text-dark">{item.company}</td>
                  
                  <td className="py-3 text-center">
                        <div className="d-flex justify-content-center">
                            <button 
                              className="btn-action-square shadow-sm"
                              onClick={(e) => handleEdit(e, item)} 
                              title="แก้ไขรายละเอียด"
                            >
                              <FontAwesomeIcon icon={faEdit} size="sm" />
                            </button>
                        </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
      </div>
    </div>
    
    {/* Pagination */}
    <div className="d-flex justify-content-end align-items-center mt-3 px-2">
        <div className="d-flex align-items-center">
            <button 
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`} 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: '0.7rem'}}/>
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button 
                    key={i} 
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => goToPage(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button 
                className={`pagination-btn ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`} 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
            >
                <FontAwesomeIcon icon={faChevronRight} style={{fontSize: '0.7rem'}}/>
            </button>
        </div>
    </div>

  </div>
  );
};

export default ContractsPage;