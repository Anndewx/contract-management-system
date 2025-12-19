// SaveModal.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const SaveModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  // วันที่ปัจจุบันสำหรับแสดงผล
  const currentDate = new Date().toLocaleString('th-TH', { 
    dateStyle: 'long', 
    timeStyle: 'short' 
  });

  return (
    <>
      <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-center">
            
            <div className="mb-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-success" style={{ fontSize: '4rem' }} />
            </div>

            <h3 className="fw-bold mb-4">ยืนยันการบันทึกข้อมูล</h3>

            {/* ✅ จุดที่แก้ไข: สลับตำแหน่งปุ่ม */}
            <div className="d-flex justify-content-center gap-3 mb-4">
                {/* ปุ่มยกเลิก (สีเทา) อยู่ซ้าย */}
                <button 
                    type="button" 
                    className="btn btn-secondary px-4 py-2 fw-bold" 
                    style={{ minWidth: '120px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none' }} 
                    onClick={onClose}
                >
                    ยกเลิก
                </button>

                {/* ปุ่มยืนยัน (สีฟ้า) อยู่ขวา */}
                <button 
                    type="button" 
                    className="btn btn-primary px-4 py-2 fw-bold" 
                    style={{ minWidth: '120px', backgroundColor: '#3b82f6', border: 'none' }} 
                    onClick={onConfirm}
                >
                    ยืนยัน
                </button>
            </div>

            <div className="text-muted small">
                วันที่รายการ {currentDate} น.
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SaveModal;