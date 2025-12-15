import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // โหมดดูรายเดือน
import timeGridPlugin from '@fullcalendar/timegrid'; // โหมดดูรายสัปดาห์
import interactionPlugin from '@fullcalendar/interaction'; // เพื่อให้คลิกวันที่ได้

const CalendarPage = () => {
  return (
    // ใช้ container-fluid p-0 เหมือนหน้าอื่นๆ เพื่อให้ Layout จัดการ padding ให้
    <div className="container-fluid p-0">
      
      {/* Header - Responsive */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <h1 className="h3 mb-0 text-gray-800">ปฏิทินกิจกรรม</h1>
      </div>

      {/* Calendar Card */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">ตารางกิจกรรมโครงการ</h6>
        </div>
        <div className="card-body p-2 p-md-4"> {/* ลด padding ในมือถือเพื่อเพิ่มพื้นที่ */}
          
          {/* Wrapper สำหรับ FullCalendar เพื่อปรับแต่ง Responsive */}
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              
              // ปรับ Toolbar ให้ยืดหยุ่น
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              
              // ข้อมูลจำลอง
              events={[
                { title: 'ประชุมทีม', date: '2025-06-01', color: '#4e73df' },
                { title: 'ส่งงานลูกค้า', date: '2025-06-07', color: '#1cc88a' },
                { title: 'ตรวจสอบระบบ', date: '2025-06-15', color: '#f6c23e' }
              ]}
              
              height="auto" // ให้ความสูงปรับตามเนื้อหา
              aspectRatio={1.5} // สัดส่วนการแสดงผล
              contentHeight="auto"
              
              // เพิ่ม Class สำหรับปรับแต่ง CSS เพิ่มเติมได้
              dayMaxEvents={true} // ถ้ากิจกรรมเยอะให้ซ่อนแล้วกดดู more
            />
          </div>

        </div>
      </div>

      {/* เพิ่ม CSS inline เล็กน้อยสำหรับ Responsive ขั้นสูงของ Calendar บนมือถือ */}
      <style>{`
        @media (max-width: 768px) {
          .fc-header-toolbar {
            flex-direction: column;
            gap: 10px;
          }
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>

    </div>
  );
};

export default CalendarPage;