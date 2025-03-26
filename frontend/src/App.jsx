import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/header/header';
import WorkOder from './components/workoderManager/workOders';
import Employees from './components/EmployeeManager/employee';
import Machines from './components/MachineManager/machine';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          {/* Correctly define the Route with a valid path */}
          <Route path="/work-order-details" element={<WorkOder />} />
          <Route path="/employees-details" element={<Employees />} />
          <Route path="/machines-details" element={<Machines />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
