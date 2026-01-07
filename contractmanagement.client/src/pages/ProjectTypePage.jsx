import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faFilter, 
  faChevronLeft, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5056/api";

const ProjectTypePage = () => {
  // --- UI State ---
  const [showModal, setShowModal] = useState(false);
  
  // --- Data State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Filter & Sort State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [sortOrder, setSortOrder] = useState('latest'); // latest, oldest

  // --- ✅ Pagination State (เพิ่มใหม่) ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // --- Fetch Data ---
  const fetchProjectTypes = async () => {
    setLoading(true); 
    try {
      const response = await fetch(`${API_BASE_URL}/ProjectType`);
      if (response.ok) {
        const result = await response.json();
        const mappedData = result.map(item => ({
            id: item.id || item.Id, 
            name: item.name,
            description: item.description,
            createdBy: item.createdBy || 'Admin',
            date: item.createdDate ? new Date(item.createdDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
            isActive: item.isActive
        }));
        setData(mappedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error connecting to API:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  // --- Filter & Sort Logic ---
  const filteredData = useMemo(() => {
    let result = [...data];

    // 1. Search
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(item => 
            item.name.toLowerCase().includes(lowerTerm) ||
            (item.description && item.description.toLowerCase().includes(lowerTerm))
        );
    }

    // 2. Filter Status
    if (filterStatus !== 'all') {
        const isActive = filterStatus === 'active';
        result = result.filter(item => item.isActive === isActive);
    }

    // 3. Sort Order
    result.sort((a, b) => {
        if (sortOrder === 'latest') {
            return b.id - a.id; // ID มาก = ใหม่กว่า
        } else {
            return a.id - b.id; // ID น้อย = เก่ากว่า
        }
    });

    return result;
  }, [data, searchTerm, filterStatus, sortOrder]);

  // --- ✅ Reset Page when Filter Changes ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortOrder]);

  // --- ✅ Pagination Calculation ---
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
  const handleClearFilters = () => {
      setSearchTerm('');
      setFilterStatus('all');
      setSortOrder('latest');
  };

  const handleOpenModal = () => {
    setFormData({ name: '', description: '', isActive: true });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Swal.fire({
          icon: 'warning',
          title: 'ข้อมูลไม่ครบ',
          text: 'กรุณาระบุชื่อประเภท',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
      });
      setError('กรุณาระบุชื่อประเภท');
      return; 
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        createdBy: "Admin" 
      };

      const response = await fetch(`${API_BASE_URL}/ProjectType`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchProjectTypes(); 
        Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            text: 'เพิ่มข้อมูลเรียบร้อยแล้ว',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
      } else {
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการบันทึก', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'ไม่สามารถเชื่อมต่อ Server ได้', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่ ข้อมูลจะกู้คืนไม่ได้",
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

    if (!result.isConfirmed) return;

    const previousData = [...data];
    setData(prev => prev.filter(item => item.id !== id));

    try {
      const response = await fetch(`${API_BASE_URL}/ProjectType/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
         Swal.fire({
            icon: 'success',
            title: 'ลบข้อมูลสำเร็จ',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      Swal.fire('Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
      setData(previousData);
    }
  }

  // --- Styles ---
  const styles = `
    body { background-color: #f8fafc; }
    .card-premium {
        border: none;
        border-radius: 20px;
        box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
        background: white;
        overflow: hidden;
        min-height: 600px;
        display: flex;
        flex-direction: column;
    }
    .table-header {
        background-color: #f8fafc;
        font-size: 0.85rem;
        font-weight: 700;
        color: #000000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid #e2e8f0;
    }
    .table-row {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f1f5f9;
    }
    .table-row:hover {
        background-color: #f8fafc;
    }
    .btn-action {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
        border: 1px solid #f1f5f9;
        background: white;
        cursor: pointer;
    }
    .btn-action.edit:hover {
        background-color: #eff6ff;
        color: #3b82f6;
        border-color: #dbeafe;
        transform: translateY(-2px);
    }
    .btn-action.delete { color: #dc2626; }
    .btn-action.delete:hover {
        background-color: #fef2f2;
        color: #dc2626;
        border-color: #fee2e2;
        transform: translateY(-2px);
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
    .custom-input {
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        height: 42px;
        background-color: #f8fafc;
        color: #000;
    }
    .custom-input:focus {
        background-color: white;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .filter-select {
        height: 42px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        cursor: pointer;
        font-size: 0.9rem;
        background-color: white;
        color: #334155;
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
               ประเภทโครงการ
            </h3>
            <span className="text-black small ps-1 fw-bold">จัดการข้อมูลประเภทโครงการทั้งหมดในระบบ</span>
        </div>
        <button 
          className="btn btn-clean px-4 py-2 rounded-3 fw-bold d-flex align-items-center"
          style={{ height: '45px' }}
          onClick={handleOpenModal}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> 
          <span className="d-none d-sm-inline">เพิ่มประเภทใหม่</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="card-premium">
        
        {/* Filter Bar */}
        <div className="p-4 border-bottom bg-white">
            <div className="d-flex flex-wrap gap-3">
                {/* Search */}
                <div className="position-relative flex-grow-1" style={{ minWidth: '250px' }}>
                    <FontAwesomeIcon icon={faSearch} className="text-black position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        className="form-control ps-5 custom-input" 
                        placeholder="ค้นหาชื่อประเภท..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Status Filter */}
                <div style={{ minWidth: '180px' }}>
                    <select 
                        className="form-select filter-select shadow-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">สถานะทั้งหมด</option>
                        <option value="active">เปิดใช้งาน</option>
                        <option value="inactive">ปิดใช้งาน</option>
                    </select>
                </div>

                {/* Date Sort */}
                <div style={{ minWidth: '180px' }}>
                    <select 
                        className="form-select filter-select shadow-sm"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="latest">วันที่บันทึก (ล่าสุด)</option>
                        <option value="oldest">วันที่บันทึก (เก่าสุด)</option>
                    </select>
                </div>

                {/* Clear Button */}
                <div>
                    <button 
                        className="btn btn-light border text-dark fw-bold d-flex align-items-center justify-content-center shadow-sm" 
                        style={{ height: '42px', borderRadius: '10px', minWidth: '100px', backgroundColor: '#f1f5f9' }}
                        onClick={handleClearFilters}
                    >
                        <FontAwesomeIcon icon={faFilter} className="me-2" /> ล้างค่า
                    </button>
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="table-responsive flex-grow-1">
          <table className="table mb-0 align-middle">
            <thead className="table-header">
              <tr>
                <th className="py-3 ps-4 text-start border-0" style={{ width: '20%' }}>ชื่อประเภท</th>
                <th className="py-3 text-start border-0" style={{ width: '20%' }}>รายละเอียด</th>
                <th className="py-3 text-center border-0" style={{ width: '20%' }}>บันทึกโดย</th>
                <th className="py-3 text-start border-0" style={{ width: '20%' }}>วันที่บันทึก</th>
                <th className="py-3 text-center border-0" style={{ width: '10%' }}>สถานะ</th>
                <th className="py-3 text-center border-0" style={{ width: '10%' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 [...Array(itemsPerPage)].map((_, i) => (
                    <tr key={i}>
                        <td colSpan="6" className="py-4 ps-4">
                            <div className="d-flex align-items-center placeholder-glow">
                                <span className="placeholder col-6 rounded" style={{height: '20px'}}></span>
                            </div>
                        </td>
                    </tr>
                 ))
              ) : filteredData.length === 0 ? (
                 <tr><td colSpan="6" className="text-center py-5 text-dark">ไม่พบข้อมูล</td></tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="py-3 ps-4">
                        <span className="fw-bold text-dark">{item.name}</span>
                    </td>

                    <td className="py-3">
                        <span className="text-muted small">{item.description || '-'}</span>
                    </td>

                    <td className="py-3 text-center text-dark small">
                        {item.createdBy}
                    </td>

                    <td className="py-3 text-dark small">{item.date}</td>
                    
                    <td className="py-3 text-center">
                      {item.isActive ? (
                        <span className="badge rounded-pill fw-medium border-0" style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '6px 12px' }}>
                            <span className="me-1" style={{width:'6px', height:'6px', backgroundColor:'#059669', borderRadius:'50%', display:'inline-block'}}></span>
                            เปิดใช้งาน
                        </span>
                      ) : (
                        <span className="badge rounded-pill fw-medium border-0" style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '6px 12px' }}>
                            <span className="me-1" style={{width:'6px', height:'6px', backgroundColor:'#dc2626', borderRadius:'50%', display:'inline-block'}}></span>
                            ปิดใช้งาน
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button 
                            className="btn-action edit shadow-sm"
                            onClick={() => Swal.fire('Info', 'ฟีเจอร์แก้ไขยังไม่เปิดใช้งาน', 'info')}
                            title="แก้ไข"
                          >
                              <FontAwesomeIcon icon={faEdit} size="sm" />
                          </button>
                          <button 
                            className="btn-action delete shadow-sm" 
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            title="ลบ"
                          >
                              <FontAwesomeIcon icon={faTrash} size="sm" />
                          </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* End Card */}
        
      {/* Pagination (ชิดขวา & ลบข้อความแล้ว) */}
      <div className="d-flex justify-content-end align-items-center mt-3 px-2">
          <div className="d-flex align-items-center">
            {/* Previous */}
            <button 
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`} 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: '0.7rem'}}/>
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
                <button 
                    key={i} 
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => goToPage(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            {/* Next */}
            <button 
                className={`pagination-btn ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`} 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
            >
                <FontAwesomeIcon icon={faChevronRight} style={{fontSize: '0.7rem'}}/>
            </button>
        </div>
      </div>

      {/* --- Modal Popup --- */}
      {showModal && (
        <>
        <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)'}}></div>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{maxWidth: '600px'}}>
            <div className="modal-content border-0 shadow-lg rounded-4" style={{ overflow: 'hidden' }}>
              
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-5">
                <div>
                    <h4 className="modal-title fw-bold text-dark">เพิ่มประเภทโครงการ</h4>
                    <span className="text-muted small">กรอกข้อมูลเพื่อสร้างประเภทโครงการใหม่</span>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body px-5 py-4">
                <form>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-dark">ชื่อประเภท <span className="text-danger">*</span></label>
                    <input 
                        type="text" 
                        className={`form-control form-control-lg fs-6 ${error ? 'is-invalid' : ''}`}
                        placeholder="เช่น Software, Hardware..." 
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if(error) setError('');
                        }}
                        style={{ borderRadius: '8px', padding: '12px 15px', backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                    {error && <div className="text-danger small mt-1">{error}</div>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-dark">รายละเอียด</label>
                    <textarea 
                        className="form-control" 
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ borderRadius: '8px', backgroundColor: '#f8fafc', borderColor: '#e2e8f0', resize: 'none' }}
                    ></textarea>
                  </div>
                  
                  <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="activeCheck" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        style={{ 
                            cursor: 'pointer', 
                            width: '3em', 
                            height: '1.5em',
                            backgroundColor: formData.isActive ? '#10b981' : undefined, 
                            borderColor: formData.isActive ? '#10b981' : undefined
                        }}
                    />
                    <label className="form-check-label ms-2 mt-1 small fw-bold text-dark" htmlFor="activeCheck" style={{ cursor: 'pointer' }}>
                        เปิดใช้งานสถานะ
                    </label>
                  </div>
                </form>
              </div>

              <div className="modal-footer border-top-0 px-5 pb-4 pt-0">
                 <div className="w-100 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light border fw-bold px-4 py-2 rounded-3" onClick={() => setShowModal(false)}>ยกเลิก</button>
                    <button 
                        type="button" 
                        className="btn btn-primary fw-bold px-4 py-2 rounded-3" 
                        style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)' }}
                        onClick={handleSave}
                    >
                        บันทึกข้อมูล
                    </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
        </>
      )}

    </div>
  );
};

export default ProjectTypePage;