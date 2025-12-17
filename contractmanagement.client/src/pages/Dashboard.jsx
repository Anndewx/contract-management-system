import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, faFileContract, faCheckCircle, faChartLine 
} from "@fortawesome/free-solid-svg-icons";

// Import Components สำหรับกราฟ
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import './Dashboard.css'; 

// ลงทะเบียน ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/'); 
  }, [navigate]);

  // --- 1. กราฟวงกลม (Pie) ---
  const pieData = {
    labels: ['เสร็จสิ้น', 'รอดำเนินการ', 'กำลังทำ', 'ยกเลิก'],
    datasets: [{
      data: [25, 25, 32, 18],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'], 
      hoverOffset: 10, 
      borderWidth: 0,
    }],
  };

  const pieOptions = {
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, padding: 20, font: { family: 'Prompt', size: 12 } } },
      tooltip: { 
          backgroundColor: 'rgba(30, 41, 59, 0.9)', 
          padding: 12, 
          cornerRadius: 8,
          bodyFont: { family: 'Prompt' }
      }
    },
    layout: { padding: 10 },
    maintainAspectRatio: false
  };

  // --- 2. กราฟเส้น (Line) ---
  const lineData = {
    labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.'],
    datasets: [
      {
        label: 'เป้าหมาย (Target)',
        data: [2.0, 2.8, 2.2, 2.5, 3.5, 2.8],
        borderColor: '#94a3b8', 
        borderDash: [5, 5], 
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'ผลงานจริง (Actual)',
        data: [2.5, 4.2, 3.8, 4.5, 3.2, 4.0],
        borderColor: '#6366f1', 
        backgroundColor: 'rgba(99, 102, 241, 0.1)', 
        borderWidth: 3,
        tension: 0.4, 
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7, 
        fill: true, 
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { align: 'end', labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
            label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + ' ล้านบาท';
            }
        }
      }
    },
    scales: {
      y: { 
          beginAtZero: true, 
          grid: { color: '#f1f5f9', drawBorder: false }, 
          ticks: { font: { family: 'Prompt' }, color: '#94a3b8' }
      },
      x: { 
          grid: { display: false }, 
          ticks: { font: { family: 'Prompt' }, color: '#64748b' }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  // Mock Data
  const projectsToSend = [
    { name: 'โครงการจ้างบำรุงรักษาฯ', unit: 'ส.กทม.', period: 'งวดที่ 1', date: '26/9/68' },
    { name: 'โครงการติดตั้งระบบ CCTV', unit: 'สตช.', period: 'งวดที่ 1', date: '26/8/68' },
    { name: 'โครงการพัฒนาระบบ ERP', unit: 'ศสป.', period: 'งวดที่ 2', date: '26/9/68' },
    { name: 'โครงการจัดซื้อคุรุภัณฑ์', unit: 'อพวช.', period: 'งวดสุดท้าย', date: '26/9/68' },
  ];

  return (
    <div className="container-fluid p-4 dashboard-bg">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 className="fw-bold m-0" style={{color: '#1e293b'}}>Dashboard</h4>
            <span className="text-muted small">ระบบบริหารจัดการโครงการ</span>
        </div>
        <div className="bg-white px-3 py-2 rounded-3 shadow-sm d-flex align-items-center">
            <span className="badge bg-success bg-opacity-10 text-success me-2">Online</span>
            <small className="text-muted fw-bold">Update: Just now</small>
        </div>
      </div>

      {/* --- Section 1: KPI Cards --- */}
      <div className="row g-4 mb-4">
        {/* Card 1 */}
        <div className="col-12 col-md-4">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">ยังไม่ได้ดำเนินการ</div>
                    <div className="text-value">122</div>
                    <small className="text-danger"><FontAwesomeIcon icon={faChartLine} /> +5% จากเดือนก่อน</small>
                </div>
                <div className="icon-box-premium bg-blue-soft">
                    <FontAwesomeIcon icon={faFileAlt} />
                </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-12 col-md-4">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">อยู่ระหว่างดำเนินการ</div>
                    <div className="text-value">50</div>
                    <small className="text-warning"><FontAwesomeIcon icon={faChartLine} /> คงที่</small>
                </div>
                <div className="icon-box-premium bg-orange-soft">
                    <FontAwesomeIcon icon={faFileContract} />
                </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-12 col-md-4">
          <div className="card premium-card h-100 p-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-label mb-1">เสร็จสิ้นโครงการ</div>
                    <div className="text-value">99</div>
                    <small className="text-success"><FontAwesomeIcon icon={faChartLine} /> +12% ยอดเยี่ยม</small>
                </div>
                <div className="icon-box-premium bg-green-soft">
                    <FontAwesomeIcon icon={faCheckCircle} />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Middle Row --- */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-4">
            <div className="card premium-card h-100 p-3">
                <div className="card-body">
                    <h6 className="fw-bold mb-4" style={{color: '#334155'}}>สัดส่วนสถานะโครงการ</h6>
                    <div style={{ height: '250px' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 col-lg-4">
            <div className="card premium-card h-100 p-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold m-0" style={{color: '#334155'}}>โครงการที่ต้องส่งมอบเร็วๆ นี้</h6>
                        <a href="#" className="text-decoration-none small fw-bold text-dark">ดูทั้งหมด</a>
                    </div>
                    <div className="mt-3">
                        {projectsToSend.map((item, idx) => (
                            <div key={idx} className="hover-list-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{width:'40px', height:'40px'}}>
                                        <span className="fw-bold text-muted" style={{fontSize:'0.8rem'}}>{idx+1}</span>
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark small mb-0">{item.name}</div>
                                        <small className="text-muted" style={{fontSize:'0.75rem'}}>{item.unit}</small>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-purple-soft text-purple fw-normal px-2 py-1 rounded-3">{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 col-lg-4">
            <div className="card premium-card h-100 p-3">
                <div className="card-body">
                    <h6 className="fw-bold mb-3" style={{color: '#334155'}}>สถิติรายปี</h6>
                    <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                            <thead className="border-bottom">
                                <tr className="text-muted small text-uppercase">
                                    <th>ปีงบประมาณ</th>
                                    <th className="text-end">จำนวน (โครงการ)</th>
                                    <th className="text-end">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { year: '2025', count: 79, trend: 'up' },
                                    { year: '2024', count: 131, trend: 'up' },
                                    { year: '2023', count: 66, trend: 'down' },
                                    { year: '2022', count: 86, trend: 'up' },
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover-table-row border-bottom-dash">
                                        <td className="fw-bold text-dark py-3">{row.year}</td>
                                        <td className="text-end py-3">
                                            <span className="fw-bold" style={{fontSize:'1.1rem'}}>{row.count}</span>
                                        </td>
                                        <td className="text-end py-3">
                                            {row.trend === 'up' ? 
                                                <span className="text-success small"><FontAwesomeIcon icon={faChartLine}/></span> : 
                                                <span className="text-muted small">-</span>
                                            }
                                        </td>
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
                            <small className="text-muted">เปรียบเทียบเป้าหมายและผลงานจริง (หน่วย: ล้านบาท)</small>
                        </div>
                        {/* --- แก้ไขจุดนี้: เปลี่ยนสี Dropdown ให้เป็นสีดำเข้ม --- */}
                        <select 
                            className="form-select w-auto border-0 fw-bold cursor-pointer" 
                            style={{ color: '#333333', backgroundColor: '#FFFFFF' }}
                        >
                            <option>Last 6 Months</option>
                            <option>Year 2025</option>
                        </select>
                    </div>
                    <div style={{ height: '350px' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;