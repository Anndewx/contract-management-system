import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import './SaveConfirmation.css'; 

const DisbursementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock รายการย่อยในตาราง
  const [items, setItems] = useState([
    { id: 1, name: 'เบิกจ่ายงวดงานที่ 1', qty: 1, unit: 'งาน', price: 1000000 }
  ]);

  // คำนวณยอดรวม
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  return (
    <div className="save-modal-overlay">
      <div className="bg-white rounded shadow-lg d-flex flex-column" 
           style={{ maxWidth: '1100px', width: '95%', maxHeight: '95vh', animation: 'popUp 0.3s ease' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="fw-bold m-0" style={{ color: '#1e293b' }}>การเบิกจ่าย</h5>
          <button className="btn text-secondary hover-dark" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-4" style={{ overflowY: 'auto', flex: 1 }}>
          
          {/* Top Form Section */}
          <div className="row g-3 mb-4">
             {/* Left Column */}
             <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#333333' }}>คนของ</label>
                    <input type="text" className="form-control" defaultValue="สำนักงานกองทุนหมู่บ้านและชุมชนเมืองแห่งชาติ (สทบ.)" />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#333333' }}>เลขที่เอกสาร <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" defaultValue="BL2025090001" />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#333333' }}>วันที่</label>
                    <div className="input-group">
                        <input type="text" className="form-control" defaultValue="28-03-2568" />
                        <span className="input-group-text bg-white"><FontAwesomeIcon icon={faCalendarAlt} className="text-secondary"/></span>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#333333' }}>ประเภทการเบิกจ่าย</label>
                    <select className="form-select cursor-pointer">
                        <option>งวดงาน, ค่าวัสดุ, ค่าแรง, เงินมัดจำ</option>
                    </select>
                </div>
             </div>

             {/* Right Column */}
             <div className="col-md-6">
                <div className="mb-3 d-flex flex-column gap-2 pt-4">
                    <div className="form-check">
                        <input className="form-check-input cursor-pointer" type="checkbox" defaultChecked />
                        <label className="form-check-label small text-dark cursor-pointer">ออกใบแจ้งหนี้ เมื่อมีการบันทึกท้ายฟอร์มแล้ว</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input cursor-pointer" type="checkbox" defaultChecked />
                        <label className="form-check-label small text-dark cursor-pointer">ออกใบวางบิลที่มีการนี้ด้วยเลย</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#333333' }}>เลขที่อ้างอิง</label>
                    <input type="text" className="form-control" defaultValue="INV2025080009" />
                </div>
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>วิธีชำระเงิน</label>
                        <select className="form-select cursor-pointer"><option>โอนเงิน, เช็ค, เงินสด ฯลฯ</option></select>
                    </div>
                    <div className="col-6">
                        <label className="form-label fw-bold small" style={{ color: '#333333' }}>ภาษีมูลค่าเพิ่ม (%)</label>
                        <select className="form-select cursor-pointer"><option>7</option></select>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small" style={{ color: '#333333' }}>สถานะ</label>
                    {/* ปรับพื้นหลังให้ขาวสะอาด */}
                    <select className="form-select" style={{ backgroundColor: '#ffffff' }}><option>รอวิศวกรยืนยัน</option></select>
                </div>
             </div>
          </div>

          <hr className="text-secondary opacity-25" />

          {/* Detail Table */}
          <h6 className="fw-bold mb-3" style={{ color: '#1e293b' }}>รายละเอียดการเบิกจ่าย</h6>
          <div className="table-responsive mb-3">
            <table className="table table-bordered align-middle">
                <thead className="bg-light">
                    <tr className="small text-center" style={{ color: '#333333', fontWeight: 'bold' }}>
                        <th width="5%">ลำดับ</th>
                        <th width="40%">คำอธิบายงาน/รายการค่าใช้จ่าย</th>
                        <th width="10%">จำนวน</th>
                        <th width="10%">หน่วย</th>
                        <th width="15%">ราคาต่อหน่วย</th>
                        <th width="15%">ยอดรวม</th>
                        <th width="5%"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id}>
                            <td className="text-center">{index + 1}</td>
                            <td><input type="text" className="form-control border-0" defaultValue={item.name} /></td>
                            <td><input type="text" className="form-control border-0 text-center" defaultValue={item.qty} /></td>
                            <td><input type="text" className="form-control border-0 text-center" defaultValue={item.unit} /></td>
                            <td><input type="text" className="form-control border-0 text-end" defaultValue={item.price.toLocaleString(undefined, {minimumFractionDigits: 2})} /></td>
                            <td className="text-end px-3">{ (item.qty * item.price).toLocaleString(undefined, {minimumFractionDigits: 2}) }</td>
                            <td className="text-center text-danger cursor-pointer"><FontAwesomeIcon icon={faTrash} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* --- จุดแก้ไข: เปลี่ยนปุ่มเพิ่มรายการเป็นสีน้ำเงินเข้ม --- */}
            <button 
                className="btn btn-sm btn-primary shadow-sm fw-bold" 
                style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
            >
                <FontAwesomeIcon icon={faPlus} className="me-1" /> เพิ่มรายการ
            </button>

          </div>

          {/* Footer Summary */}
          <div className="row">
              <div className="col-md-7">
                  <label className="form-label fw-bold small" style={{ color: '#333333' }}>หมายเหตุ</label>
                  {/* ลบ bg-light ออก */}
                  <textarea className="form-control border-1" rows="4"></textarea>
              </div>
              <div className="col-md-5">
                  <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">รวมเป็นเงิน (บาท)</span>
                      <span className="fw-bold">{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">ภาษีมูลค่าเพิ่ม (7%)</span>
                      <span className="fw-bold">{vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">ราคาที่รวมภาษีมูลค่าเพิ่ม</span>
                      <span className="fw-bold text-primary">{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">จำนวนเงินรวมทั้งสิ้น</span>
                      <span className="fw-bold fs-5 text-dark">{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
              </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3 text-end bg-white border-top">
           {/* เปลี่ยนปุ่มยกเลิกเป็นสีดำ */}
           <button 
               className="btn btn-white border me-2 fw-bold" 
               style={{ color: '#000000' }}
               onClick={onClose}
            >
                ยกเลิก
            </button>
           <button className="btn btn-dark px-4 fw-bold" onClick={onClose}>บันทึก</button> 
        </div>

      </div>
    </div>
  );
};

export default DisbursementModal;