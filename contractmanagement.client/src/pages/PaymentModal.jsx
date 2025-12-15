import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faBold, faItalic, faList, faLink, faCode } from "@fortawesome/free-solid-svg-icons";
import './SaveConfirmation.css'; 

const PaymentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay">
      {/* ปรับแก้: เพิ่ม maxHeight, display flex และลด maxWidth ลงเล็กน้อยเพื่อให้ดูสมส่วน */}
      <div className="bg-white rounded shadow-lg overflow-hidden d-flex flex-column" 
           style={{ maxWidth: '750px', width: '95%', maxHeight: '90vh', animation: 'popUp 0.3s ease' }}>
        
        {/* Header (ส่วนหัว Fixed) */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <h5 className="fw-bold m-0 text-dark">เพิ่มงวดเงินและรายละเอียดการชำระเงิน</h5>
          <button className="btn text-secondary p-0" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body (ส่วนเนื้อหา Scroll ได้) */}
        <div className="p-4 text-start" style={{ overflowY: 'auto', flex: 1 }}>
          
          <div className="row g-3 mb-3">
            <div className="col-md-2">
              <label className="form-label small text-muted">งวดที่</label>
              <select className="form-select text-center"><option>1</option></select>
            </div>
            <div className="col-md-3">
               <label className="form-label small text-muted">ร้อยละ (%)</label>
               <select className="form-select text-center"><option>40</option></select>
            </div>
            <div className="col-md-7">
               <label className="form-label small text-muted">กำหนดส่งมอบ</label>
               <div className="input-group">
                 <input type="text" className="form-control" placeholder="DD/MM/YYYY" />
                 <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
               </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
             <div className="col-md-6">
                <label className="form-label small text-muted">จำนวนเงิน</label>
                <input type="text" className="form-control text-end" defaultValue="900,000.00" />
             </div>
             <div className="col-md-6">
                <label className="form-label small text-muted">จำนวน (วัน)</label>
                <input type="text" className="form-control text-end" defaultValue="30" />
             </div>
          </div>

          <hr className="text-muted opacity-25" />

          <div className="mb-4">
             <label className="form-label small text-muted fw-bold">รายละเอียดงานที่ต้องส่งมอบ</label>
             <div className="border rounded bg-light">
                <div className="p-2 border-bottom bg-white rounded-top d-flex gap-2 text-secondary">
                    <small>Normal Text</small> | <FontAwesomeIcon icon={faBold} /> <FontAwesomeIcon icon={faItalic} /> <FontAwesomeIcon icon={faList} /> <FontAwesomeIcon icon={faLink} /> <FontAwesomeIcon icon={faCode} />
                </div>
                <textarea className="form-control border-0 bg-light" rows="3" placeholder="Add Attachment or add comment to describe the issues..."></textarea>
             </div>
          </div>

           <div className="row g-3">
             <div className="col-md-6">
                <label className="form-label small text-muted">เอกสารส่งมอบ</label>
                <div className="d-flex align-items-center gap-2">
                    <span className="small text-nowrap">จำนวน (ชุด)</span>
                    <select className="form-select w-50"><option>4</option></select>
                </div>
             </div>
             <div className="col-md-6">
                <label className="form-label small text-muted">USB ส่งมอบ</label>
                <div className="d-flex align-items-center gap-2">
                    <span className="small text-nowrap">จำนวน (ชุด)</span>
                    <select className="form-select w-50"><option>1</option></select>
                </div>
             </div>
          </div>

        </div>

        {/* Footer (ส่วนท้าย Fixed) */}
        <div className="p-3 text-end bg-light border-top">
           <button className="btn btn-white border me-2" onClick={onClose}>ยกเลิก</button>
           <button className="btn btn-dark" onClick={onClose}>บันทึก</button> 
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;