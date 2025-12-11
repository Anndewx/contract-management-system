import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faBold, faItalic, faList, faLink, faCode, faPaperclip, faPlus } from "@fortawesome/free-solid-svg-icons";
import './SaveConfirmation.css';

const DeliveryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay">
      {/* ปรับแก้: เพิ่ม maxHeight, display flex และลด maxWidth ลงเล็กน้อย */}
      <div className="bg-white rounded shadow-lg overflow-hidden d-flex flex-column" 
           style={{ maxWidth: '750px', width: '95%', maxHeight: '90vh', animation: 'popUp 0.3s ease' }}>
        
        {/* Header (ส่วนหัว Fixed) */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <h5 className="fw-bold m-0 text-dark">ประวัติส่งมอบงาน</h5>
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
            <div className="col-md-5">
               <label className="form-label small text-muted">เลขที่หนังสือส่งมอบงาน</label>
               <input type="text" className="form-control text-center" defaultValue="ODG2568-007" />
            </div>
            <div className="col-md-5">
               <label className="form-label small text-muted">วันที่หนังสือ</label>
               <div className="input-group">
                 <input type="text" className="form-control text-center" placeholder="DD/MM/YYYY" />
                 <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
               </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
             <div className="col-md-6">
                <label className="form-label small text-muted">กำหนดส่งมอบ</label>
                <div className="input-group">
                 <input type="text" className="form-control text-center" placeholder="DD/MM/YYYY" />
                 <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
               </div>
             </div>
             <div className="col-md-6">
                <label className="form-label small text-muted">ส่งมอบจริง</label>
                <div className="input-group">
                 <input type="text" className="form-control text-center" placeholder="DD/MM/YYYY" />
                 <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
               </div>
             </div>
          </div>

          <hr className="text-muted opacity-25" />

          <div className="mb-4">
             <label className="form-label small text-muted fw-bold">หมายเหตุ</label>
             <div className="border rounded bg-light">
                <div className="p-2 border-bottom bg-white rounded-top d-flex gap-2 text-secondary">
                    <small>Normal Text</small> | <FontAwesomeIcon icon={faBold} /> <FontAwesomeIcon icon={faItalic} /> <FontAwesomeIcon icon={faList} /> <FontAwesomeIcon icon={faLink} /> <FontAwesomeIcon icon={faCode} />
                </div>
                <textarea className="form-control border-0 bg-light" rows="3" placeholder="Add Attachment or add comment to describe the issues..."></textarea>
             </div>
          </div>

           <div className="row g-3">
             <div className="col-md-4">
                <label className="form-label small text-muted">เลขที่รับจากสารบรรณ</label>
                <div className="input-group">
                    <input type="text" className="form-control text-end" defaultValue="1234/5" />
                </div>
             </div>
             <div className="col-md-4">
                <label className="form-label small text-muted">วันที่รับเรื่องจากสารบรรณ</label>
                <div className="input-group">
                    <input type="text" className="form-control text-center" placeholder="DD/MM/YYYY" />
                </div>
             </div>
             <div className="col-md-4">
                 <label className="form-label small text-muted fw-bold">Attachments</label>
                 <div className="small text-primary mb-1"><FontAwesomeIcon icon={faPaperclip} /> Document Links</div>
                 <div className="small text-dark cursor-pointer"><FontAwesomeIcon icon={faPlus} /> Add Attachment</div>
             </div>
          </div>

          <div className="mt-3">
             <label className="form-label small text-muted">สถานะดำเนินการ</label>
             <select className="form-select"><option>ตรวจรับแล้ว</option></select>
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

export default DeliveryModal;