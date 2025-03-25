import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import 'animate.css'; // For animations
import $ from 'jquery'; // For jQuery animations
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL2 } from '../TEST/Utils/config';



import '../workoderManager/dashboard.css';  //css import


const FactoryManagementDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());// State for current time

    const [Workoder, setWorkoder] = useState([]);
   // const [processingOrders, setprocessingOrders] = useState([]);
    const [recentOrders, setrecentOrders] = useState([]);
    const [employees, setemployees] = useState([]);
    //const [materials, setmaterials] = useState([]);
  
   const convObjToArry = (response,setveriale) => {
    if (response && Array.isArray(response.data.data)) {
      setveriale(response.data.data); } 
      else { setveriale([]); }};

     

  //const [employees] = useState(15);
    const [materials] = useState([
    { name: 'Material 1', value: 10 },
    { name: 'Material 2', value: 50 },
    { name: 'Material 3', value: 80 },
    { name: 'Material 4', value: 55 },
    { name: 'Material 5', value: 45 },
  ]);
  
  const REFRESH_INTERVAL = 6000;

  // Update time every second
        useEffect(() => {
          
            const fetchData = async () => {
            try {
                const timer = setInterval(() => {setCurrentTime(new Date()); }, 1000);  
                
                const oderResponse = await axios.get(`${BASE_URL2}/WorkOder`);//pending process processing odre
                setWorkoder(oderResponse.data);
                convObjToArry(oderResponse, setWorkoder);

                /*const processingOrders = await axios.get(`${BASE_URL2}/WorkOder`);
                setprocessingOrders(processingOrders.data);
                convObjToArry(processingOrders, setprocessingOrders);*/
                

                const Orders = await axios.get(`${BASE_URL2}/SalesOrder`); 
                setrecentOrders(Orders.data );
                convObjToArry(Orders, setrecentOrders);
                
              
                const Emp = await axios.get(`${BASE_URL2}/employee`);
                setemployees(Emp.data );
                convObjToArry(Emp, setemployees);
                
              
            } catch (error) {toast.error('Error fetching data');}
                
            
           };
            fetchData();  // Animate cards on load
            const timeIntervalId = setInterval(() => {
              setCurrentTime(new Date());
            }, 1000);
            const dataIntervalId = setInterval(() => {
              fetchData();
            }, REFRESH_INTERVAL);

            $('.card').addClass('animate__animated animate__fadeInUp');
            $('.card').hover(
            function () { $(this).addClass('shadow-lg').css('cursor', 'pointer'); },
             function () { $(this).removeClass('shadow-lg');}              
            );
            
            //return () => clearInterval(timer);
            return () =>clearInterval(dataIntervalId);
        }, []); 

    

  // Bar chart rendering for materials
  const renderMaterialBars = () => {
    const colors = ['#ff9999', '#ffcc99', '#99ccff', '#cc99ff', '#ccffcc'];
    return materials.map((material, index) => (
<div key={index} className="material-bar-container" style={{ textAlign: 'center' ,margin: '5px' }}>
      {/* Material Bar */}
      <div
        className="material-bar"
        style={{
          height: `${material.value * 2}px`,
          backgroundColor: colors[index % colors.length],
          width: '55px',  
          margin: '0 auto' 
        }}
      ></div>
      
      {/* Material Name */}
      <div style={{ marginTop: '0px', fontSize: '12px' }}>
        {material.name}
      </div>
    </div>
  ));
};


  return (
    <div className="dashboard-container  ">
      {/* Header */}
      <h1 className="dashboard-title">FACTORY MANAGEMENT</h1>

      {/* Orders, Employees, and Clock */}
      <div className="row mb-4 wh-100">
        {/* Orders Card */}
        <div className="col-12 col-md-3">
          <div className="card card-custom text-center">
            <h5 className="card-title card-title-custom">orders</h5>
            <p className="card-text card-text-large">{recentOrders.length}</p>
          </div>
        </div>

        {/* Employees Card */}
        <div className="col-12 col-md-3">
          <div className="card card-custom text-center">
            <h5 className="card-title card-title-custom">Employee</h5>
            <p className="card-text card-text-large">{employees.length}</p>
          </div>
        </div>

         {/* Employees Card */}
        <div className="col-12 col-md-3">
          <div className="card card-custom text-center">
            <h5 className="card-title card-title-custom">pending process</h5>
            <p className="card-text card-text-large">{/*Workoder.length*/}
            {Workoder.filter(oderResponse => oderResponse.order_status == "Pending").length}
            </p>
          </div>
        </div>

        {/* Clock */}
        <div className="col-1 col-md-3 text-end">
        <div className="clock position-relative d-inline-block">
     
    <div
        className="clock-hand hour-hand position-absolute bg-dark"
        style={{
          transform: `rotate(${(currentTime.getHours() % 12) * 30}deg)`,
        }} >
      </div>
      
      <div
        className="clock-hand minute-hand position-absolute bg-dark"
        style={{
          transform: `rotate(${currentTime.getMinutes() * 6}deg)`,
        }}>
      </div>
      <div
        className="clock-hand minute-hand position-absolute bg-dark"
        style={{
          transform: `rotate(${currentTime.getSeconds() * 6}deg)`,
        }}>
      </div>
      
    </div>
  <div>
    <p className="clock-date-time fw-light text-muted">
      {currentTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}{'    __'} 
      {currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })}
    </p>
  </div>
</div>
      </div>

      {/* Materials and Processing Orders */}
      <div className="row mb-4">
        {/* Materials Bar Chart */}
        <div className="col-12 col-md-6">
          <div className="card card-custom">
            <h5 className="card-title card-title-custom">materials</h5>
            <div className="material-chart">
                 
              {/* Y-Axis Labels */}
              <div className="y-axis-labels">
                <span>90</span>
                <span>80</span>
                <span>70</span>
                <span>60</span>
                <span>50</span>
                <span>40</span>
              </div>
              {renderMaterialBars()}
            </div>
          </div>
        </div>

        {/* Processing Orders */}
        <div className="col-12 col-md-6">
          <div className="card card-processing">
            <h5 className="card-title card-title-custom">processing oders</h5>
            <div className="scrollable-content">
              {Workoder
              .filter((oderResponse) => oderResponse.order_status == "processing") 
              .map((oderResponse) => ( 
                <div key={oderResponse.work_order_Id} className="processing-order-item">
                  <div>
                    <h6 className="order-name">
                      <span role="img" aria-label="star">
                        ⭐
                      </span>{' '}
                      {oderResponse.product}
                    </h6>
                    <p className="order-description">{oderResponse.quentity}</p>
                  </div>
                  <span className="arrow-up">↑</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Orders */}
        <div className="col-12 col-md-6">
          <div className="card card-custom">
            <h5 className="card-title card-title-custom">recent oders</h5>
            <div className="scrollable-content">
              {recentOrders.length > 0 ? (
                recentOrders.map((recentOrders) => (
                  <div key={recentOrders.id} className="recent-order-item">
                    <h6 className="order-name">{recentOrders.Product_Ordered}</h6>
                    <p className="order-description">Date: {}</p>
                  </div>
                ))
              ) : (
                <p>No recent orders available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Active Process */}
        <div className="col-12 col-md-6">
          <div className="card card-custom">
            <h5 className="card-title card-title-custom">Active process</h5>
            <div className="active-process-content">
              <p className="text-muted">No active processes to display.</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FactoryManagementDashboard;