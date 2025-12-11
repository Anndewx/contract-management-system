import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 

// --- Pages Imports ---
import Login from './pages/Login.jsx'; 
import Dashboard from './pages/Dashboard.jsx'; 
import CalendarPage from './pages/CalendarPage.jsx';

// Import หน้า "โครงการทั้งหมด" (ไฟล์ใหม่ที่เราเพิ่งทำ)
import ProjectPage from './pages/ProjectPage.jsx';

// Import หน้า Settings ต่างๆ
import ProjectTypePage from './pages/ProjectTypePage'; 
import ExpenseTypePage from './pages/ExpenseTypePage.jsx';
import EquipmentTypePage from './pages/EquipmentTypePage';
import ContractsPage from './pages/ContractsPage.jsx';
import ContractDetailPage from './pages/ContractDetailPage.jsx';


function App() {
  return (
    <Routes>
      {/* 1. หน้า Login (ไม่มีเมนู) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* 2. หน้า Dashboard */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      
      {/* 3. หน้าปฏิทิน */}
      <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
      
      {/* 4. หน้า "โครงการทั้งหมด" (แก้ตรงนี้ให้ถูกต้อง!) */}
      {/* ให้ชี้ไปที่ ProjectPage และครอบด้วย Layout เพื่อให้มีเมนู */}
      <Route path="/projects" element={<Layout><ProjectPage /></Layout>} />

      {/* 5. กลุ่มหน้า Settings (ประเภทโครงการอยู่ที่นี่แล้ว) */}
      <Route path="/settings/project-type" element={<Layout><ProjectTypePage /></Layout>} />
      <Route path="/settings/expense-type" element={<Layout><ExpenseTypePage /></Layout>} />
      <Route path="/settings/equipment-type" element={<Layout><EquipmentTypePage /></Layout>} />
    
      <Route path="/contracts" element={<Layout><ContractsPage /></Layout>} />
      <Route path="/contract/detail/:id" element={<Layout><ContractDetailPage /></Layout>} />
    </Routes>
  );
}

export default App;