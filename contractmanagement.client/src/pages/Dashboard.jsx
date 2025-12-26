import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, faFileContract, faCheckCircle, faChartLine, 
  faCalendarAlt, faChevronDown, faListAlt 
} from "@fortawesome/free-solid-svg-icons";

import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, PointElement, LineElement, Title, Filler 
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2'; 
import './Dashboard.css'; 

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

function Dashboard() {
  const navigate = useNavigate();
  
  // ✅ State สำหรับปี และ การเปิด/ปิดเมนู
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showYearPicker, setShowYearPicker] = useState(false); 

  // ✅ สร้างรายการปี (ย้อนหลัง 5 ปี - ล่วงหน้า 5 ปี)
  const yearsList = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/'); 
  }, [navigate]);

  // --- ข้อมูลกราฟ (Mock Data) ---
  const pieData = {
    labels: ['เสร็จสิ้น', 'รอดำเนินการ', 'กำลังทำ', 'ยกเลิก'],
    datasets: [{
      data: [25, 25, 32, 18],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'], 
      hoverOffset: 10, borderWidth: 0,
    }],
  };
  
  const pieOptions = {
    plugins: { legend: { position: 'right', labels: { usePointStyle: true, padding: 20, font: { family: 'Prompt', size: 12 } } } },
    layout: { padding: 10 }, maintainAspectRatio: false
  };

  const lineData = {
    labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.'],
    datasets: [
      { label: 'เป้าหมาย (Target)', data: [2.0, 2.8, 2.2, 2.5, 3.5, 2.8], borderColor: '#94a3b8', borderDash: [5, 5], borderWidth: 2, pointRadius: 0, tension: 0.4, fill: false },
      { label: 'ผลงานจริง (Actual)', data: [2.5, 4.2, 3.8, 4.5, 3.2, 4.0], borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderWidth: 3, tension: 0.4, fill: true, pointBackgroundColor: '#ffffff', pointBorderColor: '#6366f1', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7 },
    ],
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { align: 'end', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { backgroundColor: 'rgba(30, 41, 59, 0.9)', padding: 10, cornerRadius: 8, displayColors: false, callbacks: { label: (c) => c.dataset.label + ': ' + c.parsed.y + ' ล้านบาท' } } },
    scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9', drawBorder: false }, ticks: { font: { family: 'Prompt' }, color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { font: { family: 'Prompt' }, color: '#64748b' } } },
    interaction: { mode: 'index', intersect: false },
  };

  const projectsToSend = [
    { name: 'โครงการจ้างบำรุงรักษาฯ', unit: 'ส.กทม.', date: '26 ก.ย.', color: '#ef4444' }, 
    { name: 'โครงการติดตั้งระบบ CCTV', unit: 'สตช.', date: '28 ก.ย.', color: '#f59e0b' },   
    { name: 'โครงการพัฒนาระบบ ERP', unit: 'ศสป.', date: '01 ต.ค.', color: '#3b82f6' },    
    { name: 'โครงการจัดซื้อคุรุภัณฑ์', unit: 'อพวช.', date: '05 ต.ค.', color: '#10b981' }, 
  ];

  // เพิ่ม CSS สำหรับสีม่วง (ถ้ายังไม่มีใน Dashboard.css)
  const additionalStyles = `
    .bg-purple-soft { background-color: #ede9fe; color: #8b5cf6; }
  `;

  return (
    <div className="container-fluid p-4 dashboard-bg">
      {/* ✅ CSS ปรับขนาดให้เล็กลง (Compact Version) และเพิ่มสีม่วง */}
      <style>
        {`
          ${additionalStyles}
          .year-popover {
            position: absolute;
            top: 120%;
            right: 0;
            width: 240px; /* ลดความกว้าง */
            background: white;
            border-radius: 12px;
            box-shadow: 0 15px 20px -5px rgba(99, 102, 241, 0.1), 0 8px 8px -5px rgba(99, 102, 241, 0.04);
            padding: 0.75rem;
            z-index: 50;
            border: 1px solid #eef2ff;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .year-option {
            padding: 8px 2px; /* ลด Padding */
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            background-color: #f8fafc;
            font-size: 0.9rem;
          }
          .year-option:hover {
            background-color: #eef2ff;
            color: #6366f1;
            border-color: #c7d2fe;
          }
          .year-option.active {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            box-shadow: 0 4px 10px -2px rgba(99, 102, 241, 0.4);
            border-color: transparent;
          }

          /* ✅ ปรับแก้ปุ่มหลักให้ Compact ขึ้น */
          .custom-picker-btn {
            background: linear-gradient(to right, #ffffff, #f8fafc);
            border: 1px solid #c7d2fe;
            border-radius: 12px;
            padding: 6px 16px; /* ลด Padding ปุ่ม */
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px -1px rgba(99, 102, 241, 0.1);
          }
          .custom-picker-btn:hover {
            background: linear-gradient(to right, #f8fafc, #e0e7ff);
            border-color: #818cf8;
            transform: translateY(-1px);
            box-shadow: 0 8px 12px -3px rgba(99, 102, 241, 0.15);
          }
        `}
      </style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 className="fw-bold m-0" style={{color: '#1e293b', letterSpacing: '-0.5px'}}>Dashboard</h4>
            <span className="text-muted small">สรุปภาพรวมโครงการ ประจำปี {selectedYear + 543}</span>
        </div>

        {/* ✅ ส่วนเลือกปีแบบ Compact */}
        <div className="position-relative">
            {/* ปุ่มกดเลือก */}
            <div 
                className="custom-picker-btn d-flex align-items-center justify-content-between gap-3"
                onClick={() => setShowYearPicker(!showYearPicker)}
            >
                <div className="d-flex align-items-center gap-2">
                  {/* ไอคอนปรับให้เล็กลง */}
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width:'34px', height:'34px', border:'1px solid #f1f5f9'}}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{color: '#6366f1', fontSize: '0.9rem'}} />
                  </div>
                  
                  {/* ตัวอักษรปรับให้กระชับ */}
                  <div className="d-flex flex-column" style={{lineHeight: 1}}>
                      <span style={{fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase'}}>YEAR</span>
                      <div className="d-flex align-items-baseline gap-1">
                        <span style={{fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px'}}>
                            {selectedYear + 543}
                        </span>
                        <span style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 600}}>
                            ({selectedYear})
                        </span>
                      </div>
                  </div>
                </div>

                <FontAwesomeIcon 
                    icon={faChevronDown} 
                    style={{ 
                        color: '#818cf8',
                        fontSize: '0.75rem',
                        transform: showYearPicker ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s'
                    }} 
                />
            </div>

            {/* เมนู Popover */}
            {showYearPicker && (
                <>
                    <div 
                        style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:40}} 
                        onClick={()=>setShowYearPicker(false)}
                    />
                    
                    <div className="year-popover">
                        {yearsList.map((year) => (
                            <div 
                                key={year}
                                className={`year-option ${selectedYear === year ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedYear(year);
                                    setShowYearPicker(false);
                                }}
                            >
                                <div className="fw-bold" style={{fontSize: '0.95rem'}}>{year + 543}</div>
                                <small style={{fontSize: '0.65rem', opacity: 0.9}}>{year}</small>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
      </div>

      {/* --- Section 1: KPI Cards --- */}
      {/* ✅ ปรับ col เป็น col-12 col-sm-6 col-xl-3 เพื่อให้แสดง 4 กล่องในแถวเดียวบนจอใหญ่ */}
      <div className="row g-4 mb-4">
        {/* กล่องที่ 1: โครงการทั้งหมด (เพิ่มใหม่) */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">โครงการทั้งหมด</div>
                    <div className="text-value">271</div> {/* ตัวอย่างผลรวม (122+50+99) */}
                    {/* Trend ถูกลบออก */}
                </div>
                <div className="icon-box-premium bg-purple-soft"><FontAwesomeIcon icon={faListAlt} /></div>
            </div>
          </div>
        </div>
        {/* กล่องที่ 2: ยังไม่ได้ดำเนินการ */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">ยังไม่ได้ดำเนินการ</div>
                    <div className="text-value">122</div>
                    {/* ✅ Trend ถูกลบออกตามที่แจ้ง */}
                </div>
                <div className="icon-box-premium bg-blue-soft"><FontAwesomeIcon icon={faFileAlt} /></div>
            </div>
          </div>
        </div>
        {/* กล่องที่ 3: อยู่ระหว่างดำเนินการ */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">อยู่ระหว่างดำเนินการ</div>
                    <div className="text-value">50</div>
                    {/* ✅ Trend ถูกลบออกตามที่แจ้ง */}
                </div>
                <div className="icon-box-premium bg-orange-soft"><FontAwesomeIcon icon={faFileContract} /></div>
            </div>
          </div>
        </div>
        {/* กล่องที่ 4: เสร็จสิ้นโครงการ */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">เสร็จสิ้นโครงการ</div>
                    <div className="text-value">99</div>
                    {/* ✅ Trend ถูกลบออกตามที่แจ้ง */}
                </div>
                <div className="icon-box-premium bg-green-soft"><FontAwesomeIcon icon={faCheckCircle} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Charts & List --- */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-4">
            <div className="card premium-card h-100 p-3">
                <div className="card-body">
                    <h6 className="fw-bold mb-4" style={{color: '#334155'}}>สถานะโครงการ ปี {selectedYear + 543}</h6>
                    <div style={{ height: '250px' }}><Doughnut data={pieData} options={pieOptions} /></div>
                </div>
            </div>
        </div>
        <div className="col-12 col-lg-4">
            <div className="card premium-card h-100 p-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold m-0" style={{color: '#334155'}}>โครงการเร่งด่วน ({selectedYear})</h6>
                        <a href="#" className="text-decoration-none small fw-bold text-dark">ดูทั้งหมด</a>
                    </div>
                    <div className="mt-3">
                        {projectsToSend.map((item, idx) => (
                            <div key={idx} className="hover-list-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-3 bg-light d-flex align-items-center justify-content-center me-3" 
                                         style={{width:'40px', height:'40px', borderLeft: `4px solid ${item.color}`}}>
                                        <span className="fw-bold text-dark small">{idx+1}</span>
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark small mb-0">{item.name}</div>
                                        <small className="text-muted" style={{fontSize:'0.75rem'}}>{item.unit}</small>
                                    </div>
                                </div>
                                <div className="text-end"><small className="fw-bold" style={{color: item.color}}>{item.date}</small></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="col-12 col-lg-4">
            <div className="card premium-card h-100 p-3">
                <div className="card-body">
                    <h6 className="fw-bold mb-3" style={{color: '#334155'}}>สถิติย้อนหลัง</h6>
                    <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                            <thead className="border-bottom">
                                <tr className="text-muted small text-uppercase">
                                    <th>ปีงบประมาณ</th>
                                    <th className="text-end">จำนวน (โครงการ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[{ year: '2025', count: 79, trend: 'up' }, { year: '2024', count: 131, trend: 'up' }, { year: '2023', count: 66, trend: 'down' }, { year: '2022', count: 86, trend: 'up' }].map((row, idx) => (
                                    // ✅ แก้ไข: เอา bg-light ที่เป็นเงื่อนไข selectedYear ออก ให้เหลือแค่ class ปกติ
                                    <tr key={idx} className="hover-table-row border-bottom-dash">
                                        <td className="fw-bold text-dark py-3">{row.year}</td>
                                        <td className="text-end py-3"><span className="fw-bold" style={{fontSize:'1.1rem'}}>{row.count}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- Section 3: Performance Chart --- */}
      <div className="row g-4">
        <div className="col-12">
            <div className="card premium-card p-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold m-0" style={{color: '#334155'}}>Performance Overview</h5>
                            <small className="text-muted">เปรียบเทียบเป้าหมายและผลงานจริง ประจำปี {selectedYear + 543}</small>
                        </div>
                        <div className="px-3 py-1 rounded-pill bg-light text-muted small fw-bold">
                            Year: {selectedYear}
                        </div>
                    </div>
                    <div style={{ height: '350px' }}><Line data={lineData} options={lineOptions} /></div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;