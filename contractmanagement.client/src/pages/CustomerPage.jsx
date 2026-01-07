import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faSearch, faChevronLeft, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5056/api";

const CustomerPage = () => {
  const navigate = useNavigate();

  // --- State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState(''); 

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // --- Fetch Data ---
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Customers`);
      if (response.ok) {
        const result = await response.json();
        const mappedData = result.map(item => ({
            id: item.id || item.Id,
            name: item.name || item.Name,
            address: item.address || item.Address || '-',
            email: item.email || item.Email || '-',
            phone: item.phone || item.Phone || '-'
        })).sort((a, b) => b.id - a.id);

        setData(mappedData);
        setLoading(false);
      } else {
        console.error("Failed to fetch customers");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error connecting to API:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    return data.filter(item => 
        item.name.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        item.email.toLowerCase().includes(submittedSearch.toLowerCase())
    );
  }, [data, submittedSearch]);

  // --- Reset Page when Filter Changes ---
  useEffect(() => {
    setCurrentPage(1);
  }, [submittedSearch]);

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
    if (value === '') {
        setSubmittedSearch('');
    }
  };

  // ✅ เปลี่ยนชื่อเป็น handleEditClick (ใช้เฉพาะปุ่มดินสอ)
  const handleEditClick = (id) => {
    navigate(`/edit-customer/${id}`);
  };

  // --- Delete Logic ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: "คุณต้องการลบข้อมูลลูกค้ารายนี้ใช่หรือไม่ ข้อมูลจะกู้คืนไม่ได้",
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
            const response = await fetch(`${API_BASE_URL}/Customers/${id}`, {
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
            Swal.fire('Error', 'เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
            setData(previousData);
        }
    }
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
        background-color: #f8fafc;
        font-size: 0.85rem;
        font-weight: 700;
        color: #000000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid #e2e8f0;
    }
    .table-row {
        /* ❌ เอา cursor: pointer ออก เพื่อไม่ให้เข้าใจผิดว่าคลิกได้ */
        transition: all 0.2s ease;
        border-bottom: 1px solid #f1f5f9;
    }
    .table-row:hover {
        background-color: #f8fafc;
        /* เอา effect ยกตัวขึ้นออกเล็กน้อยเพื่อให้ดูเป็น list ธรรมดา */
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
      
      {/* --- Page Header --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h3 className="fw-bold mb-1 text-black">
                ข้อมูลและประวัติลูกค้า
            </h3>
            <span className="text-black small ps-1 fw-bold">ระบบจัดการข้อมูลลูกค้า</span>
        </div>
        
        <button 
            className="btn btn-clean px-4 py-2 rounded-3 fw-bold d-flex align-items-center" 
            style={{ height: '45px' }}
            onClick={() => navigate('/create-customer')} 
        >
            <FontAwesomeIcon icon={faPlus} className="me-2" /> เพิ่มลูกค้าใหม่
        </button>
      </div>

      {/* --- Main Card --- */}
      <div className="card-premium">
        
        {/* Filter Bar */}
        <div className="p-4 border-bottom">
            <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="flex-grow-1"></div>

                <div className="position-relative" style={{ width: '300px' }}>
                    <FontAwesomeIcon icon={faSearch} className="text-black position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        className="form-control ps-5 custom-input" 
                        placeholder="ค้นหาชื่อบริษัท, อีเมล..." 
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
                <th className="py-3 ps-4 border-0" style={{width: '60px'}}>NO.</th>
                <th className="py-3 text-center border-0">ชื่อหน่วยงาน/บริษัท</th>
                <th className="py-3 border-0">ที่อยู่</th>
                <th className="py-3 border-0">อีเมล</th>
                <th className="py-3 border-0">เบอร์โทรศัพท์</th>
                <th className="py-3 text-center border-0" style={{width: '120px'}}>ส่วนจัดการ</th>
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
              ) : currentItems.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">ไม่พบข้อมูลลูกค้า</td></tr>
              ) : (
                currentItems.map((item, index) => (
                <tr key={item.id} className="table-row"> {/* ❌ เอา onClick ออกแล้ว */}
                  <td className="py-4 ps-4 fw-bold text-black small">{indexOfFirstItem + index + 1}</td>
                  <td className="py-4 text-center">
                      <div className="fw-bold text-black">{item.name}</div>
                  </td>
                  <td className="py-4 text-black small text-truncate" style={{maxWidth: '250px'}}>
                      {item.address}
                  </td>
                  <td className="py-4 text-black small">{item.email}</td>
                  <td className="py-4 text-black small">{item.phone}</td>
                  
                  <td className="py-4 text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {/* ✅ ปุ่มดินสอ: กดแล้วไปหน้าแก้ไข */}
                        <button 
                            className="btn-action edit shadow-sm" 
                            title="แก้ไข"
                            onClick={() => handleEditClick(item.id)} 
                        >
                            <FontAwesomeIcon icon={faEdit} style={{fontSize: '14px'}}/>
                        </button>
                        
                        {/* ปุ่มลบ */}
                        <button 
                            className="btn-action delete shadow-sm" 
                            title="ลบ"
                            onClick={() => handleDelete(item.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: '14px'}}/>
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

export default CustomerPage;