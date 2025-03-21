import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/header/header';
import WorkOder from './components/workoderManager/workOders';
import AdminProfile from './components/workoderManager/adminProfile';

function App() {
  return (
    <div className="App">
       
      <Router>
      <ToastContainer position="top-right" autoClose={5000} />
        <Header />
        <Routes>
          {/* Correctly define the Route with a valid path */}
          <Route path="/work-order-details" element={<WorkOder />} />
          <Route path="/sidebar" element={<AdminProfile/>} />


        </Routes>
      </Router>
    </div>
  );
}

export default App;
