import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // โหมดดูรายเดือน
import timeGridPlugin from '@fullcalendar/timegrid'; // โหมดดูรายสัปดาห์
import interactionPlugin from '@fullcalendar/interaction'; // เพื่อให้คลิกวันที่ได้


const CalendarPage = () => {
  return (
    <div id="wrapper">
      {/* ⚠️ คุณต้องเอา Sidebar และ Topbar มาใส่ตรงนี้ด้วยเพื่อให้เหมือนหน้า Dashboard 
          (หรือใช้วิธีแยก Component Layout ซึ่งเป็นวิธีก้าวหน้า) 
          แต่เบื้องต้น ให้ก็อปปี้โครงสร้างหลักจาก Dashboard.jsx มาครอบไว้ครับ 
      */}
      
      {/* --- ส่วนเนื้อหาหลัก (Content Wrapper) --- */}
      <div id="content-wrapper" className="d-flex flex-column" style={{ height: '100vh' }}>
        <div id="content">
          
          {/* เริ่มเนื้อหาหน้าปฏิทิน */}
          <div className="container-fluid mt-4">
            
            {/* หัวข้อหน้า */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800">ปฏิทินกิจกรรม</h1>
            </div>

            {/* กล่องปฏิทิน (ใช้ Card ของ Theme เพื่อความสวยงาม) */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Calendar</h6>
              </div>
              <div className="card-body">
                {/* ตัวปฏิทิน FullCalendar */}
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={[
                    { title: 'ประชุมทีม', date: '2025-06-01' },
                    { title: 'ส่งงานลูกค้า', date: '2025-06-07' }
                  ]}
                  height="auto" 
                />
              </div>
            </div>

          </div>
          {/* จบเนื้อหา */}

        </div>
      </div>
    </div>
  );
};

export default CalendarPage;