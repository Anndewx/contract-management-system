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

const API_BASE_URL = "http://localhost:5056/api";

function Dashboard() {
  const navigate = useNavigate();
  
  // ✅ State สำหรับปี และ การเปิด/ปิดเมนู
  const currentYear = new Date().getFullYear();
  // ตั้งค่าเริ่มต้นเป็นปีก่อนหน้า (2025) แทนปีปัจจุบัน เพราะข้อมูลส่วนใหญ่อยู่ในปีนั้น
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);
  const [showYearPicker, setShowYearPicker] = useState(false); 

  // ✅ State สำหรับข้อมูลโครงการจริง
  const [projectStats, setProjectStats] = useState({
    total: 0,
    pending: 0,      // ร่าง TOR / ยื่นข้อเสนอ
    inProgress: 0,   // ดำเนินงาน / ดำเนินโครงการ
    completed: 0,    // เสร็จสิ้น
    cancelled: 0     // ปิดโครงการ
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ สร้างรายการปี (ย้อนหลัง 5 ปี - ล่วงหน้า 5 ปี)
  const yearsList = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/'); 
  }, [navigate]);

  // ✅ Fetch ข้อมูลโครงการจาก API
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลจาก Projects และ Contracts พร้อมกัน
        const [projectsRes, contractsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/Projects`),
          fetch(`${API_BASE_URL}/Contracts`)
        ]);
        
        const projects = projectsRes.ok ? await projectsRes.json() : [];
        const contracts = contractsRes.ok ? await contractsRes.json() : [];
        
        // 🔍 แปลงปี ค.ศ. ที่เลือกเป็น พ.ศ. เพื่อเปรียบเทียบกับ fiscalYear ในฐานข้อมูล
        const selectedYearBE = selectedYear + 543; // แปลงเป็น พ.ศ.
        
        // 🔍 กรองข้อมูลตามปีที่เลือก (fiscalYear เก็บเป็น พ.ศ.)
        const filteredProjects = projects.filter(p => {
          const year = p.fiscalYear || (new Date(p.createdDate).getFullYear() + 543);
          return year === selectedYearBE;
        });
        
        const filteredContracts = contracts.filter(c => {
          const year = (new Date(c.startDate || c.createdDate).getFullYear() + 543);
          return year === selectedYearBE;
        });
        
        console.log('📊 Selected Year BE:', selectedYearBE);
        console.log('📊 Filtered Projects:', filteredProjects.length);
        console.log('📊 Filtered Contracts:', filteredContracts.length);
        
        // นับจำนวนโครงการตามสถานะ (จาก Projects ที่กรองตามปี)
        const total = filteredProjects.length;
        const pending = filteredProjects.filter(p => 
          ['ร่างTOR', 'ร่าง TOR', 'ยื่นข้อเสนอ'].includes(p.projectStatus)
        ).length;
        
        // กล่อง "อยู่ระหว่างดำเนินการ" อิงจากสถานะ จัดทำโครงการ และ ดำเนินงาน ในหน้าโครงการ
        const inProgress = filteredProjects.filter(p => 
          ['จัดทำโครงการ', 'ดำเนินงาน'].includes(p.projectStatus)
        ).length;
        
        // เสร็จสิ้นโครงการ
        const completed = filteredProjects.filter(p => 
          p.projectStatus === 'เสร็จสิ้น'
        ).length;
        
        // ปิดโครงการ (จาก Contracts ที่ isActive = false)
        const cancelled = filteredContracts.filter(c => c.isActive === false).length;
        
        console.log('📊 Stats - total:', total, 'pending:', pending, 'inProgress:', inProgress, 'completed:', completed, 'cancelled:', cancelled);

        setProjectStats({ total, pending, inProgress, completed, cancelled });

        // หาโครงการล่าสุด (เรียงตามวันที่สร้าง) 4 รายการ - จากปีที่เลือก
        const sortedProjects = [...filteredProjects]
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .slice(0, 4)
          .map((p, idx) => {
            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
            const createdDate = new Date(p.createdDate);
            const thaiDate = createdDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
            return {
              name: p.projectName || 'โครงการไม่ระบุชื่อ',
              unit: p.companyName || p.customerName || '-',
              date: thaiDate,
              color: colors[idx % colors.length]
            };
          });
        setRecentProjects(sortedProjects);

        // นับจำนวนโครงการแยกตามปีงบประมาณ (ทั้งหมด ไม่กรองตามปี)
        const yearCounts = {};
        projects.forEach(p => {
          const year = p.fiscalYear || new Date(p.createdDate).getFullYear();
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        });
        
        // แปลงเป็น Array และเรียงจากปีล่าสุด
        const yearStatsArray = Object.entries(yearCounts)
          .map(([year, count]) => ({ year: year.toString(), count }))
          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
          .slice(0, 4);
        setYearlyStats(yearStatsArray);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [selectedYear]);

  // --- ข้อมูลกราฟ Doughnut (ใช้ข้อมูลจริง) ---
  const pieData = {
    labels: ['เสร็จสิ้น', 'รอดำเนินการ', 'กำลังทำ', 'ปิดโครงการ'],
    datasets: [{
      data: [
        projectStats.completed, 
        projectStats.pending, 
        projectStats.inProgress, 
        projectStats.cancelled  // ปิดโครงการ
      ],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'], 
      hoverOffset: 10, borderWidth: 0,
    }],
  };
  
  // ✅ ปรับ Pie Options ให้แสดง % เมื่อ hover
  const pieOptions = {
    plugins: { 
      legend: { 
        position: 'right', 
        labels: { usePointStyle: true, padding: 20, font: { family: 'Prompt', size: 12 } } 
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Prompt', size: 13, weight: 'bold' },
        bodyFont: { family: 'Prompt', size: 12 },
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} โครงการ (${percentage}%)`;
          }
        }
      }
    },
    layout: { padding: 10 }, 
    maintainAspectRatio: false
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
        {/* กล่องที่ 1: โครงการทั้งหมด */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">โครงการทั้งหมด</div>
                    <div className="text-value">{loading ? '...' : projectStats.total}</div>
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
                    <div className="text-value">{loading ? '...' : projectStats.pending}</div>
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
                    <div className="text-value">{loading ? '...' : projectStats.inProgress}</div>
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
                    <div className="text-value">{loading ? '...' : projectStats.completed}</div>
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
                        {recentProjects.length > 0 ? recentProjects.map((item, idx) => (
                            <div key={idx} className="hover-list-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-3 bg-light d-flex align-items-center justify-content-center me-3" 
                                         style={{width:'40px', height:'40px', borderLeft: `4px solid ${item.color}`}}>
                                        <span className="fw-bold text-dark small">{idx+1}</span>
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark small mb-0" style={{maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{item.name}</div>
                                        <small className="text-muted" style={{fontSize:'0.75rem'}}>{item.unit}</small>
                                    </div>
                                </div>
                                <div className="text-end"><small className="fw-bold" style={{color: item.color}}>{item.date}</small></div>
                            </div>
                        )) : (
                            <div className="text-center text-muted py-4">
                                <small>ไม่มีโครงการ</small>
                            </div>
                        )}
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
                                {yearlyStats.length > 0 ? yearlyStats.map((row, idx) => (
                                    <tr key={idx} className="hover-table-row border-bottom-dash">
                                        <td className="fw-bold text-dark py-3">{row.year}</td>
                                        <td className="text-end py-3"><span className="fw-bold" style={{fontSize:'1.1rem'}}>{row.count}</span></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="text-center text-muted py-4">
                                            <small>ไม่มีข้อมูล</small>
                                        </td>
                                    </tr>
                                )}
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