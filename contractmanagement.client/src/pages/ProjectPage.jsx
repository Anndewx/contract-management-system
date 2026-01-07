import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faCalendarAlt, faChevronDown, faCheck, faChevronLeft, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5056/api"; 

const ProjectPage = () => {
  const navigate = useNavigate();
  
  // --- Data State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  // ✅ ปรับให้เป็นปีปัจจุบันแบบ Dynamic (พ.ศ.)
  const currentThaiYear = (new Date().getFullYear() + 543).toString();
  const [selectedYear, setSelectedYear] = useState("ทั้งหมด"); 
  const [showYearDropdown, setShowYearDropdown] = useState(false); 

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // ✅ เพิ่มปีให้ครอบคลุม
  const yearOptions = ["ทั้งหมด", "2567", "2568", "2569", "2570"];

  // --- Functions ---
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Projects`);
      if (response.ok) {
        const result = await response.json();
        const mappedData = result.map(item => ({
            id: item.id,
            code: item.projectId,   
            name: item.projectName,            
            // ✅ แก้ไขให้ดึงชื่อบริษัท (companyName) ก่อน ถ้าไม่มีค่อยไปดู Customer หรือ customerName
            unit: item.companyName || (item.customer && item.customer.name) || item.customerName || 'กทม.', 
            createdBy: item.createdBy || 'Admin', 
            date: item.createdDate ? new Date(item.createdDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
            status: item.projectStatus || 'จัดทำโครงการ',
            isActive: true 
        }))
        .sort((a, b) => b.id - a.id);

        setTimeout(() => {
            setData(mappedData);
            setLoading(false);
        }, 500);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    setSubmittedSearch(searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
        setSubmittedSearch('');
    }
  };

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesYear = selectedYear === "ทั้งหมด" || item.date.includes(selectedYear);
      const matchesStatus = selectedStatus === '' || 
          item.status.replace(/\s/g, '') === selectedStatus.replace(/\s/g, '');
      const matchesSearch = String(item.name).toLowerCase().includes(submittedSearch.toLowerCase()) || 
                            String(item.code).toLowerCase().includes(submittedSearch.toLowerCase());
      return matchesYear && matchesStatus && matchesSearch;
    });
  }, [data, selectedYear, selectedStatus, submittedSearch]); 

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedStatus, submittedSearch]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: "คุณต้องการลบโครงการนี้ใช่หรือไม่ ข้อมูลจะกู้คืนไม่ได้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#e5e7eb',
        confirmButtonText: 'ลบข้อมูล',
        cancelButtonText: 'ยกเลิก',
        cancelButtonTextColor: '#374151',
        reverseButtons: true,
        focusCancel: true
    });

    if (result.isConfirmed) {
      const previousData = [...data];
      setData(prev => prev.filter(item => item.id !== id));

      try {
        const response = await fetch(`${API_BASE_URL}/Projects/${id}`, { method: 'DELETE' });
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            Swal.fire('Error', 'ไม่สามารถลบข้อมูลได้', 'error');
            setData(previousData);
        }
      } catch (error) {
        console.error("Error deleting:", error);
        Swal.fire('Error', 'Server connection failed', 'error');
        setData(previousData);
      }
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const renderStatusBadge = (status) => {
    let config = { bg: '#e8f0fe', color: '#1a73e8', dot: '#1a73e8' }; 
    const s = status.trim().replace(/\s/g, ''); 

    if (s === 'ร่างTOR') {
      config = { bg: '#fff7ed', color: '#ea580c', dot: '#ea580c' }; 
    } else if (s === 'ยื่นข้อเสนอ') {
      config = { bg: '#f5f3ff', color: '#7c3aed', dot: '#7c3aed' }; 
    } else if (s === 'ดำเนินงาน') {
      config = { bg: '#ecfdf5', color: '#059669', dot: '#059669' }; 
    }

    return (
      <span className="badge rounded-pill fw-medium border-0"
          style={{ 
            backgroundColor: config.bg, 
            color: config.color, 
            fontSize: '0.75rem', 
            padding: '6px 12px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px' 
          }}>
          <span style={{width:'6px', height:'6px', backgroundColor: config.dot, borderRadius:'50%', display:'inline-block'}}></span>
          {status}
      </span>
    );
  };

  const styles = `
    body { background-color: #f8fafc; }
    .card-premium {
        border: none; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
        background: white; overflow: hidden; min-height: 650px; display: flex; flex-direction: column;
    }
    .table-header {
        background-color: #f8fafc; font-size: 0.85rem; font-weight: 700; color: #000000;
        text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;
    }
    .table-row {
        transition: all 0.2s ease; border-bottom: 1px solid #f1f5f9;
        /* ไม่มี cursor: pointer แล้ว เพราะคลิกทั้งแถวไม่ได้ */
    }
    .table-row:hover {
        background-color: #f8fafc; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }
    .btn-action {
        width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
        border-radius: 50%; transition: all 0.2s; border: 1px solid #f1f5f9; background: white; cursor: pointer;
    }
    .btn-action.edit { color: #000000; }
    .btn-action.edit:hover {
        background-color: #eff6ff; color: #3b82f6; border-color: #dbeafe; transform: translateY(-2px);
    }
    .btn-action.delete { color: #dc2626; background-color: #fff5f5; border-color: #fee2e2; }
    .btn-action.delete:hover {
        background-color: #fef2f2; border-color: #fca5a5; transform: translateY(-2px);
    }
    .pagination-btn {
        min-width: 36px; height: 36px; border-radius: 8px; border: none; background: white;
        color: #000000; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center;
        justify-content: center; transition: all 0.2s; margin: 0 3px; cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .pagination-btn.active { background-color: #3b82f6; color: white; }
    .custom-input { border-radius: 10px; border: 1px solid #e2e8f0; height: 42px; background-color: #f8fafc; color: #000; }
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
    
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
      <div>
          <h3 className="fw-bold mb-1 text-black">โครงการ</h3>
          <span className="text-black small ps-1 fw-bold">ระบบจัดการข้อมูลโครงการ</span>
      </div>
      <button 
        className="btn btn-clean px-4 py-2 rounded-3 fw-bold d-flex align-items-center" 
        style={{ height: '45px' }}
        onClick={() => navigate('/create-project')} 
      >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มโครงการ
      </button>
    </div>

    <div className="card-premium">
      <div className="p-4 border-bottom">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          
          <div className="position-relative">
            <div className="bg-light border rounded px-3 d-flex align-items-center justify-content-between shadow-sm" 
                style={{minWidth: '130px', height: '42px', cursor: 'pointer'}}
                onClick={() => setShowYearDropdown(!showYearDropdown)}>
                  <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-muted me-2"/> 
                      <span className="fw-bold text-dark">{selectedYear}</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className="text-dark" style={{ fontSize: '0.8rem' }}/> 
            </div>
            {showYearDropdown && (
              <div className="position-absolute mt-1 bg-white border rounded-3 shadow-lg p-1" style={{ width: '100%', zIndex: 1000 }}>
                {yearOptions.map(year => (
                  <div key={year} className="px-3 py-2 rounded-2" style={{cursor: 'pointer'}} onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}>
                    <span>{year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <select className="form-select bg-light text-dark shadow-sm" style={{ width: '220px', height: '42px', borderRadius: '10px' }} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
             <option value="">สถานะทั้งหมด</option>
             <option value="จัดทำโครงการ">จัดทำโครงการ</option>
             <option value="ร่าง TOR">ร่าง TOR</option>
             <option value="ยื่นข้อเสนอ">ยื่นข้อเสนอ</option>
             <option value="ดำเนินงาน">ดำเนินงาน</option>
          </select>

          <div className="flex-grow-1"></div>

          <div className="position-relative" style={{ width: '300px' }}>
              <FontAwesomeIcon icon={faSearch} className="text-black position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" className="form-control ps-5 custom-input" placeholder="ค้นหาชื่อหรือรหัสโครงการ..." value={searchTerm} onChange={handleSearchChange} onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()} />
          </div>
          
          {/* ✅ แก้ไขตรงนี้: เพิ่ม borderColor ให้เป็นสีเดียวกับ background */}
          <button 
              className="btn btn-clean fw-bold px-4" 
              onClick={handleSearchClick} 
              style={{ 
                  height: '42px', 
                  borderRadius: '10px' 
              }}
          >
              ค้นหา
          </button>
        </div>
      </div>

      <div className="table-responsive flex-grow-1">
          <table className="table mb-0 align-middle">
            <thead className="table-header">
              <tr>
                <th className="py-3 ps-4 text-start border-0" style={{ width: '30%' }}>ชื่อโครงการ</th>
                <th className="py-3 text-center border-0" style={{ width: '15%' }}>หน่วยงาน</th>
                <th className="py-3 text-start border-0" style={{ width: '15%' }}>วันที่สร้าง</th>
                <th className="py-3 text-center border-0" style={{ width: '15%' }}>สร้างโดย</th>
                <th className="py-3 text-center border-0" style={{ width: '15%' }}>สถานะ</th>
                <th className="py-3 text-center border-0" style={{ width: '10%' }}>ส่วนจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 [...Array(itemsPerPage)].map((_, i) => (
                    <tr key={i}><td colSpan="6" className="py-4 ps-4"><div className="placeholder-glow"><span className="placeholder col-6 rounded" style={{height: '20px'}}></span></div></td></tr>
                 ))
              ) : filteredData.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-dark">ไม่พบข้อมูล</td></tr>
              ) : (
                currentItems.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="py-3 ps-4 text-start">
                      <div className="d-flex flex-column">
                          <span className="text-black small mb-1">{item.code}</span>
                          <span className="fw-bold text-dark">{item.name}</span>
                      </div>
                  </td>
                  <td className="py-3 text-center text-black small">{item.unit}</td>
                  <td className="py-3 text-start text-black small">{item.date}</td>
                  <td className="py-3 text-center text-black small">{item.createdBy}</td>
                  <td className="py-3 text-center">{renderStatusBadge(item.status)}</td>
                  <td className="py-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {/* ✅ ปุ่มแก้ไข: คลิกตรงนี้เท่านั้นถึงจะไปหน้า EditProject */}
                        <button 
                          className="btn-action edit shadow-sm"
                          onClick={() => navigate(`/edit-project/${item.id}`)}
                          title="แก้ไข"
                        >
                          <FontAwesomeIcon icon={faEdit} size="sm" />
                        </button>
                        
                        <button className="btn-action delete shadow-sm" onClick={() => handleDelete(item.id)} title="ลบ">
                          <FontAwesomeIcon icon={faTrash} size="sm" />
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
            <button className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><FontAwesomeIcon icon={faChevronLeft} style={{fontSize: '0.7rem'}}/></button>
            {[...Array(totalPages)].map((_, i) => (
                <button key={i} className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => goToPage(i + 1)}>{i + 1}</button>
            ))}
            <button className={`pagination-btn ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`} onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}><FontAwesomeIcon icon={faChevronRight} style={{fontSize: '0.7rem'}}/></button>
        </div>
    </div>
  </div>
  );
};

export default ProjectPage;