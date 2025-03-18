import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/header/header';
import WorkOder from './components/workoderManager/workOders';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          {/* Correctly define the Route with a valid path */}
          <Route path="/work-order-details" element={<WorkOder />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
