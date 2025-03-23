import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/header/header';
import WorkOder from './components/workoderManager/workOders';
import AdminProfile from './components/workoderManager/adminProfile';
import AdminLoging from './components/Loging/loging';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          {/* Correctly define the Route with a valid path */}
          <Route path="/work-order-details" element={<WorkOder />} />
          <Route path="/sidebar" element={<AdminProfile/>} />
          <Route path="/AdminLoging"element={<AdminLoging />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
