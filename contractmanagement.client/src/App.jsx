import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 

// --- Pages Imports ---
import Login from './pages/Login.jsx'; 
import Dashboard from './pages/Dashboard.jsx'; 
import CalendarPage from './pages/CalendarPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';

// Import หน้า Settings ต่างๆ
import ProjectTypePage from './pages/ProjectTypePage'; 
import ExpenseTypePage from './pages/ExpenseTypePage.jsx';
import EquipmentTypePage from './pages/EquipmentTypePage';
import ContractsPage from './pages/ContractsPage.jsx';
import ContractDetailPage from './pages/ContractDetailPage.jsx';
import CustomerPage from './pages/CustomerPage';
import ContactPage from './pages/ContactPage';
import CreateProjectPage from './pages/CreateProjectPage';
import EditProject from './pages/EditProject';
import CreateCustomerPage from './pages/CreateCustomerPage.jsx';
import EditCustomerPage from './pages/EditCustomerPage';
import EditContractPage from './pages/EditContractPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
      <Route path="/projects" element={<Layout><ProjectPage /></Layout>} />

      <Route path="/settings/project-type" element={<Layout><ProjectTypePage /></Layout>} />
      <Route path="/settings/expense-type" element={<Layout><ExpenseTypePage /></Layout>} />
      <Route path="/settings/equipment-type" element={<Layout><EquipmentTypePage /></Layout>} />
    
      <Route path="/contracts" element={<Layout><ContractsPage /></Layout>} />
      <Route path="/contract/detail/:id" element={<Layout><ContractDetailPage /></Layout>} />
      <Route path="/contract/edit/:id" element={<Layout><EditContractPage /></Layout>} />
      
      {/* Route สำหรับหน้าลูกค้า */}
      <Route path="/customers" element={<Layout><CustomerPage /></Layout>} />
      <Route path="/contacts" element={<Layout><ContactPage /></Layout>} />
      <Route path="/create-project" element={<Layout><CreateProjectPage /></Layout>} />
      <Route path="/edit-project/:id" element={<Layout><EditProject /></Layout>} />
      <Route path="/create-customer" element={<Layout><CreateCustomerPage /></Layout>} />
      <Route path="/edit-customer/:id" element={<Layout><EditCustomerPage /></Layout>} />
    </Routes>
  );
}

export default App;