import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, faFileContract, faCheckCircle, faCalendarAlt 
} from "@fortawesome/free-solid-svg-icons";

// Import Components สำหรับกราฟ
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import './Dashboard.css'; // Import CSS ที่เราจะสร้าง

// ลงทะเบียน ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/'); 
  }, [navigate]);

  // --- ข้อมูลกราฟวงกลม (Pie Chart) ---
  const pieData = {
    labels: ['เสร็จสิ้นโครงการ', 'ยังไม่ได้ดำเนินการ', 'ระหว่างดำเนินการ', 'ยกเลิกโครงการ'],
    datasets: [{
      data: [25, 25, 32, 18],
      backgroundColor: ['#6366f1', '#3b82f6', '#0ea5e9', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const pieOptions = {
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { family: 'Prompt', size: 12 } } }
    },
    maintainAspectRatio: false
  };

  // --- ข้อมูลกราฟเส้น (Line Chart) ---
  const lineData = {
    labels: ['Oct 2021', 'Nov 2021', 'Dec 2021', 'Jan 2022', 'Feb 2022', 'Mar 2022'],
    datasets: [
      {
        label: 'Achieved',
        data: [2.5, 4.2, 3.8, 4.5, 3.2, 4.0],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        tension: 0.4, // เส้นโค้ง
        pointRadius: 0,
      },
      {
        label: 'Target',
        data: [2.0, 2.8, 2.2, 2.5, 3.5, 2.8],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4, // เส้นโค้ง
        pointRadius: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'start', labels: { usePointStyle: true, boxWidth: 8 } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  // --- ข้อมูล Mock รายการ ---
  const projectsToSend = [
    { name: 'โครงการจ้างบำรุงรักษาฯ', unit: 'ส.กทม.', period: 'งวดที่ 1', date: '26/9/68' },
    { name: 'โครงการ...', unit: 'สตช. กระทรวงพาณิชย์', period: 'งวดที่ 1', date: '26/8/68' },
    { name: 'โครงการ...', unit: 'ศสป.', period: 'งวดที่ 1', date: '26/9/68' },
    { name: 'โครงการ...', unit: 'อพวช.', period: 'งวดที่ 1', date: '26/9/68' },
  ];

  return (
    <div className="container-fluid p-4 dashboard-bg">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark m-0">Dashboard</h4>
      </div>

      {/* --- Section 1: KPI Cards --- */}
      <div className="row g-4 mb-4">
        {/* Card 1 */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="card-body">
                <h6 className="fw-bold text-dark mb-4">ยังไม่ได้ดำเนินการ</h6>
                <div className="d-flex align-items-center">
                    <div className="icon-box bg-blue-light text-blue me-3">
                        <FontAwesomeIcon icon={faFileAlt} />
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0 text-dark">122</h2>
                        <small className="text-muted">โครงการ</small>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="card-body">
                <h6 className="fw-bold text-dark mb-4">อยู่ระหว่างดำเนินการ</h6>
                <div className="d-flex align-items-center">
                    <div className="icon-box bg-orange-light text-orange me-3">
                        <FontAwesomeIcon icon={faFileContract} />
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0 text-dark">50</h2>
                        <small className="text-muted">โครงการ</small>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="card-body">
                <h6 className="fw-bold text-dark mb-4">เสร็จสิ้นโครงการ</h6>
                <div className="d-flex align-items-center">
                    <div className="icon-box bg-green-light text-green me-3">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0 text-dark">99</h2>
                        <small className="text-muted">โครงการ</small>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Middle Row (Pie + List + Table) --- */}
      <div className="row g-4 mb-4">
        {/* Pie Chart */}
        <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                <div className="card-body">
                    <h6 className="fw-bold text-dark mb-3">สถานะดำเนินการทั้งหมด</h6>
                    <div style={{ height: '220px' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>

        {/* Project List */}
        <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                <div className="card-body">
                    <h6 className="fw-bold text-dark mb-3">โครงการ ที่ต้องส่ง</h6>
                    <div className="list-group list-group-flush">
                        {projectsToSend.map((item, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-start py-2 border-bottom-0 mb-2">
                                <div>
                                    <div className="fw-bold text-dark small">{item.name}</div>
                                    <small className="text-muted">{item.unit}</small>
                                </div>
                                <div className="text-end">
                                    <div className="fw-bold small text-dark">{item.period}</div>
                                    <span className="badge bg-purple-light text-purple rounded-pill fw-normal">{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Project Count Table */}
        <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                <div className="card-body">
                    <h6 className="fw-bold text-dark mb-3">จำนวนโครงการ</h6>
                    <div className="table-responsive">
                        <table className="table table-borderless align-middle">
                            <thead className="border-bottom">
                                <tr className="text-muted small">
                                    <th>ปีงบประมาณ</th>
                                    <th className="text-end">โครงการทั้งหมด</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { year: '2025', count: 79 },
                                    { year: '2024', count: 131 },
                                    { year: '2023', count: 66 },
                                    { year: '2022', count: 86 },
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-bottom-dash">
                                        <td className="text-dark fw-bold">{row.year}</td>
                                        <td className="text-end text-muted fst-italic">{row.count}</td>
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
            <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="card-body">
                    <h5 className="fw-bold text-dark mb-4">Performance</h5>
                    <div style={{ height: '300px' }}>
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