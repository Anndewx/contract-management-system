import React, { useState, useEffect } from 'react';
import './SaveConfirmation.css'; 

const SaveModal = ({ isOpen, onClose, onConfirm }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      // จัดรูปแบบวันที่และเวลาตามรูปเป๊ะๆ (23 เมษายน 2568 13:30 น.)
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      };
      // หมายเหตุ: toLocaleDateString อาจให้ผลลัพธ์ต่างกันในแต่ละ Browser 
      // แต่วิธีนี้พื้นฐานที่สุด
      setCurrentDate(now.toLocaleDateString('th-TH', options));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // เปลี่ยนชื่อ class เป็น save-modal-... ทั้งหมด
    <div className="save-modal-overlay">
      <div className="save-modal-content">
        
        <div className="save-modal-header">
          <div className="save-status-badge">
            <span className="save-checkmark-icon">✓</span> 
            ยืนยันการบันทึกรายการ
          </div>
        </div>

        <div className="save-modal-body">
          <h2>ยืนยันการบันทึกข้อมูล</h2>
          
          <div className="save-modal-actions">
            <button className="btn-save-confirm" onClick={onConfirm}>
              ยืนยัน
            </button>
            <button className="btn-save-cancel" onClick={onClose}>
              ยกเลิก
            </button>
          </div>

          <p className="save-timestamp">
            วันที่รายการ {currentDate} น.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default SaveModal;