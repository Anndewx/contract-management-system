import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faPaperclip, faPlus } from "@fortawesome/free-solid-svg-icons";
import './SaveConfirmation.css'; 

const SubContractModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay">
      <div className="bg-white rounded shadow-lg d-flex flex-column" 
           style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', animation: 'popUp 0.3s ease' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="fw-bold m-0 text-dark">เพิ่มข้อมูลสัญญาย่อย</h5>
          <button className="btn text-secondary" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4" style={{ overflowY: 'auto', flex: 1 }}>
          
          <div className="row g-3 mb-4">
             <div className="col-md-12">
                <label className="form-label fw-bold small text-muted">ชื่อบริษัทคู่สัญญา (Vendor) <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="ระบุชื่อบริษัท..." />
             </div>
             
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">เลขที่สัญญา/ใบสั่งจ้าง</label>
                <input type="text" className="form-control" placeholder="เช่น PO-2025-001" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วันที่ทำสัญญา</label>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="DD/MM/YYYY" />
                    <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
                </div>
             </div>

             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">มูลค่าสัญญา (บาท)</label>
                <input type="text" className="form-control text-end" placeholder="0.00" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">สถานะสัญญา</label>
                <select className="form-select bg-light">
                    <option>กำลังดำเนินการ</option>
                    <option>ส่งมอบงานแล้ว</option>
                    <option>ยกเลิก</option>
                </select>
             </div>

             <div className="col-md-12">
                <label className="form-label fw-bold small text-muted">รายละเอียดขอบเขตงาน (Scope of Work)</label>
                <textarea className="form-control bg-light border-0" rows="4" placeholder="รายละเอียดงานที่ว่าจ้าง..."></textarea>
             </div>

             <div className="col-md-12">
                 <div className="mt-2">
                    <label className="form-label fw-bold small text-muted">เอกสารแนบ (สัญญา/PO)</label>
                    <div className="small text-primary mb-1 cursor-pointer"><FontAwesomeIcon icon={faPaperclip} /> Document Links</div>
                    <div className="small text-dark cursor-pointer"><FontAwesomeIcon icon={faPlus} /> Add Attachment</div>
                 </div>
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

export default SubContractModal;