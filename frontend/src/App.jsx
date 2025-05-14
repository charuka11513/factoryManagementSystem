import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'antd/dist/reset.css'; // Make sure Ant Design CSS is imported



import SalesOrder from './components/SalesOrderManager/SalesOrder';
import InventoryMaterial from './components/InventoryMaterialManager/InventoryMaterial';
import Header from './components/header/header';
import WorkOder from './components/workoderManager/workOders';

import Employees from './components/EmployeeManager/employee';
import Machines from './components/MachineManager/machine';

import AdminProfile from './components/workoderManager/adminProfile';
import AdminLoging from './components/Loging/loging';
import MaterialPrediction from './components/workoderManager/MaterialPrediction';
import RecipeManagement from './components/workoderManager/RecipeManagement';
import HOME from './components/Home/homePage';
import AdminCreate from './components/Loging/Admincreate';



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
          <Route path="/MaterialPrediction" element={<MaterialPrediction />} />
          <Route path="/RecipeManagement" element={<RecipeManagement />} />
          {/* Add more routes as needed */}


          <Route path="/AdminAdd"element={<AdminCreate />} />

          {/*  */}
         
        <Route path="/SalesOrder-details" element={<SalesOrder />} />
        <Route path="/inventory-details" element={<InventoryMaterial />} />
          
         <Route path="/employees-details" element={<Employees />} />
         <Route path="/machines-details" element={<Machines />} />
          



        </Routes>
      </Router>
    </div>

  );
}

export default App;