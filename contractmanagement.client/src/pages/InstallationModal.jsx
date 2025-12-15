import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faPaperclip, faPlus } from "@fortawesome/free-solid-svg-icons";
import './SaveConfirmation.css'; 

const InstallationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay">
      <div className="bg-white rounded shadow-lg d-flex flex-column" 
           style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', animation: 'popUp 0.3s ease' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="fw-bold m-0 text-dark">การติดตั้งและทดสอบ</h5>
          <button className="btn text-secondary" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4" style={{ overflowY: 'auto', flex: 1 }}>
          
          <div className="row g-3 mb-4">
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วันที่ติดตั้งอุปกรณ์</label>
                <div className="input-group">
                    <input type="text" className="form-control" defaultValue="28-03-2568" />
                    <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
                </div>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">รายละเอียดผลการทดสอบ</label>
                <div className="bg-light p-2 rounded" style={{ minHeight: '80px' }}>
                    <div className="small">1. xxx</div>
                    <div className="small">2. xxx</div>
                </div>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ชื่อทีม/ช่างที่ติดตั้ง</label>
                <input type="text" className="form-control" defaultValue="ทีม Service 1" />
             </div>
             <div className="col-md-6">
                 {/* Empty column for layout balance */}
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">จุดติดตั้ง <span className="text-danger">*</span></label>
                <input type="text" className="form-control" defaultValue="Server Room 1" />
             </div>
              <div className="col-md-6">
                 <div className="mt-2">
                    <label className="form-label fw-bold small text-muted">Attachments</label>
                    <div className="small text-primary mb-1 cursor-pointer"><FontAwesomeIcon icon={faPaperclip} /> Document Links</div>
                    <div className="small text-dark cursor-pointer"><FontAwesomeIcon icon={faPlus} /> Add Attachment</div>
                 </div>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ผลการทดสอบ</label>
                <select className="form-select bg-light"><option>กำลังดำเนินการ</option></select>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 text-end bg-light border-top">
           <button className="btn btn-white border me-2" onClick={onClose}>ยกเลิก</button>
           <button className="btn btn-dark px-4" onClick={onClose}>บันทึก</button> 
        </div>

      </div>
    </div>
  );
};

export default InstallationModal;