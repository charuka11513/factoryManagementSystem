import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/header/header';
import WorkOder from './components/workoderManager/workOders';
import AdminProfile from './components/workoderManager/adminProfile';
import AdminLoging from './components/Loging/loging';
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

          <Route path="/AdminAdd"element={<AdminCreate />} />

          {/*  */}
        

        </Routes>
      </Router>
    </div>
  );
}

export default App;
