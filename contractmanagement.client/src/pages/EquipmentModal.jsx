import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faPaperclip, faPlus } from "@fortawesome/free-solid-svg-icons";
import './SaveConfirmation.css'; 

const EquipmentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay">
      <div className="bg-white rounded shadow-lg d-flex flex-column" 
           style={{ maxWidth: '900px', width: '95%', maxHeight: '95vh', animation: 'popUp 0.3s ease' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="fw-bold m-0 text-dark">ข้อมูลทั่วไปของอุปกรณ์ (Equipment Information)</h5>
          <button className="btn text-secondary" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4" style={{ overflowY: 'auto', flex: 1 }}>
          
          {/* 1. ข้อมูลทั่วไป */}
          <div className="row g-3 mb-4">
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ชื่ออุปกรณ์</label>
                <input type="text" className="form-control" defaultValue="Switch Cisco 2960" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">หมายเลขซีเรียล (S/N)</label>
                <input type="text" className="form-control" placeholder="S/N Xxx-Xxx" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ยี่ห้อของอุปกรณ์ <span className="text-danger">*</span></label>
                <input type="text" className="form-control" defaultValue="Cisco Switch" />
             </div>
             <div className="col-md-6" rowSpan={3}>
                <label className="form-label fw-bold small text-muted">รายละเอียดเพิ่มเติม</label>
                <textarea className="form-control bg-light border-0" rows="5"></textarea>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">รุ่นของอุปกรณ์</label>
                <input type="text" className="form-control" defaultValue="WS-C2960+24LC-L" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ประเภทอุปกรณ์</label>
                <select className="form-select"><option>Network</option></select>
             </div>
          </div>

          <hr className="text-muted opacity-25" />

          {/* 2. ข้อมูลการจัดซื้อ */}
          <h6 className="fw-bold mb-3">ข้อมูลการจัดซื้อ / แหล่งที่มา (Procurement Information)</h6>
          <div className="row g-3 mb-4">
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">เลขที่ใบสั่งซื้อ (PO)</label>
                <input type="text" className="form-control" defaultValue="xxx" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ราคาขายทั้งหมด</label>
                <input type="text" className="form-control text-end" defaultValue="0.00" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ชื่อบริษัทผู้จำหน่าย <span className="text-danger">*</span></label>
                <input type="text" className="form-control" defaultValue="Cisco Switch" />
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วันที่สั่งซื้อ</label>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="DD/MMM/YYYY" />
                    <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
                </div>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">ราคาต่อหน่วย</label>
                <input type="text" className="form-control text-end" defaultValue="0.00" />
             </div>
             <div className="col-md-6">
                 <label className="form-label fw-bold small text-muted">ช่องทางติดต่อผู้จำหน่าย</label>
                 <textarea className="form-control bg-light border-0" rows="2"></textarea>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">จำนวนที่สั่ง</label>
                <select className="form-select"><option>1</option></select>
             </div>
          </div>

          <hr className="text-muted opacity-25" />

          {/* 3. ข้อมูลการรับประกัน */}
          <h6 className="fw-bold mb-3">ข้อมูลการรับประกันและการบำรุงรักษา (Warranty & Maintenance)</h6>
          <div className="row g-3 mb-4">
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วันที่เริ่มรับประกัน</label>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="DD/MMM/YYYY" />
                </div>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วันที่สิ้นสุดการรับประกัน</label>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="DD/MMM/YYYY" />
                </div>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วันที่ระบุรักษาครั้งล่าสุด</label>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="DD/MMM/YYYY" />
                </div>
             </div>
             <div className="col-md-6">
                <label className="form-label fw-bold small text-muted">วันที่บำรุงรักษาครั้งต่อไป</label>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="DD/MMM/YYYY" />
                </div>
             </div>
          </div>

          {/* Attachments */}
          <div className="mb-3">
             <label className="form-label fw-bold small text-muted">Attachments</label>
             <div className="small text-primary mb-2 cursor-pointer"><FontAwesomeIcon icon={faPaperclip} /> Document Links</div>
             <div className="small text-dark cursor-pointer"><FontAwesomeIcon icon={faPlus} /> Add Attachment</div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 text-end bg-light border-top">
           <button className="btn btn-dark px-4" onClick={onClose}>บันทึก</button> 
        </div>

      </div>
    </div>
  );
};

export default EquipmentModal;