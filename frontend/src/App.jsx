// D:\zzzzzzzzzzzzzzzzzzzzzzzzzz\factoryManagementSystem\frontend\src\App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import WorkOrders from './components/workoderManager/workOders';
import SalesOrder from './components/SalesOrderManager/SalesOrder';
import InventoryMaterial from './components/InventoryMaterialManager/InventoryMaterial';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/work-order-details" element={<WorkOrders />} />
        <Route path="/SalesOrder-details" element={<SalesOrder />} />
        <Route path="/inventory-details" element={<InventoryMaterial />} />
      </Routes>
    </Router>
  );
}

export default App;