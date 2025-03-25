import React, { useState,useContext } from 'react';
import { Nav, Container, Row, Col, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from '../TEST/context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

//import '../workoderManager/';
// import FactoryLogo from './asset

import Workoder from './workOders';
import Dashboard from './dashboard';
import RecentOder from './oder_Viewer';


const AdminProfile = () => {
  const { user } = useContext(AuthContext);
 const [activeTab, setActiveTab] = useState('dashboard');
 const navigate = useNavigate();

 const handleLogout = () => {  navigate('/');};



  return (
 <Container fluid className="mt-6 m-0 vh-100 vw-95"  >  
   <Row className="min-vh-100 ">
      <Col md={2} lg={2} className="bg-light text-black p-0 m-0 ">

        <Nav variant="pills" className="flex-column">
          <h4 className='d-flex align-items-center py-3 px-'>FACTORY PRO</h4>
          <div className="p-3">
            {/*<div className="bg-secondary" style={{ height: "160px", width: "100%" }}></div>*/}
            <img src='../../../src/assets/FactoryLogo.png'className="img-thumbnail" alt="Factory Logo"style={{ height: "160px", width: "100%" }}/> 
          </div> 
          
          <Nav.Item>
            <Nav.Link
              eventKey="dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-tachometer-alt me-2"></i>
              dashboard
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              eventKey="orders"
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-shopping-cart me-2"></i>
              orders
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              eventKey="workOrders"
              active={activeTab === 'workOrders'}
              onClick={() => setActiveTab('workOrders')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-tasks me-2"></i>
              work Orders
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              eventKey="button"
              active={activeTab === 'button'}
              onClick={() => setActiveTab('button')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-cog me-2"></i>
              message
            </Nav.Link>
          </Nav.Item>
          
          {/* Logout button at bottom */}
          <div className="mt-auto" style={{ position: 'absolute', bottom: '-150px', left: '150px' }}>
            <Nav.Link onClick={handleLogout} className="d-flex align-items-center py-2 px-3 text-black">
              <span className="me-2">logout</span>
              <i className="fas fa-sign-out-alt"></i>
            </Nav.Link>
          </div>
        </Nav>
        
            
        </Col>
              
        <Col md={1} lg={10} className="bg-light ">
            <Tab.Content className="p-4">

              <Tab.Pane active={activeTab === 'customerMessage'} >
              <Workoder /></Tab.Pane>

              <Tab.Pane active={activeTab === 'dashboard'} >
              <Dashboard /></Tab.Pane>

              <Tab.Pane active={activeTab === 'workOrders'} >
              <Workoder /></Tab.Pane>

              <Tab.Pane active={activeTab === 'orders'} >
              <RecentOder /></Tab.Pane>




            </Tab.Content>
          </Col>  
      </Row>
    </Container>
  );
};

export default AdminProfile;