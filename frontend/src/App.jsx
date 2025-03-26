// D:\zzzzzzzzzzzzzzzzzzzzzzzzzz\factoryManagementSystem\frontend\src\App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';



import SalesOrder from './components/SalesOrderManager/SalesOrder';
import InventoryMaterial from './components/InventoryMaterialManager/InventoryMaterial';
import Header from './components/header/header';
import WorkOder from './components/workoderManager/workOders';
import AdminProfile from './components/workoderManager/adminProfile';
import AdminLoging from './components/Loging/loging';
import HOME from './components/Home/homePage';

function App() {
  return (
    <div className="App">
      <Router>
       {/* <Header /> */}
        <Routes>
          <Route path="/"element={<HOME />} />
          <Route path="/work-order-details" element={<WorkOder />} />
          <Route path="/sidebar" element={<AdminProfile/>} />
          <Route path="/AdminLoging"element={<AdminLoging />} />
            
        <Route path="/SalesOrder-details" element={<SalesOrder />} />
        <Route path="/inventory-details" element={<InventoryMaterial />} />
          

        </Routes>
      </Router>
    </div>

  );
}

export default App;