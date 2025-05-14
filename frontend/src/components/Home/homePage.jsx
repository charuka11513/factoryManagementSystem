// FactoryProHomePage.jsx

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // Custom CSS for additional styling

const FactoryProHomePage = () => {
  const navigate = useNavigate();
  const managementSectionRef = useRef(null);
  const [isManagementVisible, setIsManagementVisible] = useState(false);

  // Function to handle auto-scrolling to the management section
  const handleScrollToManagement = () => {
    managementSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // IntersectionObserver to detect when the management section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsManagementVisible(true);
          observer.disconnect(); // Stop observing once the section is visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (managementSectionRef.current) {
      observer.observe(managementSectionRef.current);
    }

    return () => {
      if (managementSectionRef.current) {
        observer.unobserve(managementSectionRef.current);
      }
    };
  }, []);

  // Navigation functions for each role's login page
  const handleProductionLogin = () => {
    navigate('/AdminLoging');
  };

  const handleSalesLogin = () => {
    navigate('/AdminLoging');
  };

  const handleMachineEmployeeLogin = () => {
    navigate('/AdminLoging');
  };

  const handleInventoryLogin = () => {
    navigate('/AdminLoging');
  };

  return (
    <div className="factory-pro-container">
      {/* Welcome Section - Animations Start Immediately */}
      <div
        className="welcome-section d-flex flex-column justify-content-center align-items-center text-center text-white vh-100 vw-100"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 255, 0.5), rgba(0, 0, 255, 0.5)), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          
        }}
      >
        <div className="header position-absolute top-0 start-0 p-4">
          <h1 className="logo fs-3 fw-bold animate__animated animate__fadeIn">FactoryPro</h1>
        </div>
        <div className="welcome-content">
          <h2 className="display-3 fw-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
            Welcome to FactoryPro
          </h2>
          <p className="lead mb-5 animate__animated animate__fadeIn animate__delay-2s">
            Streamline your factory operations with our comprehensive management solution. <br />
            Monitor production, manage orders, and optimize resources all in one place.
          </p>
          <button
            className="btn btn-primary btn-lg px-5 py-3 shadow animate__animated animate__fadeIn animate__delay-3s"
            onClick={handleScrollToManagement}
          >
            Explore Now
          </button>
        </div>
      </div>

      {/* Management Section - Animations Start After Scrolling */}
      <div
        className="management-section py-5 vh-100 vw-100 d-flex align-items-center"
        ref={managementSectionRef}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://media.gettyimages.com/id/1467902457/video/collaboration-industry-and-manufacturing-with-a-business-team-working-in-a-factory-using.jpg?s=640x640&k=20&c=8XprEj4VNTJTVbvydwkWWWkuE6WVmaQwMDxjbNtCLnM=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Parallax effect
        }}
      >
        <div className="container">
          <h2
            className={`text-center fw-bold mb-5 text-white ${
              isManagementVisible ? 'animate__animated animate__fadeInDown' : ''
            }`} >
         
            Management Solutions
          </h2>
          <div className="row g-4">
            {/* Production & Work Order */}
            <div className="col-md-6 col-lg-3">
              <div
                className={`card h-100 shadow-lg border-0 management-card ${
                  isManagementVisible ? 'animate__animated animate__zoomIn animate__delay-1s' : ''
                }`}
              >
                <div className="card-body text-center">
                  <i className="bi bi-gear-fill display-4 text-primary mb-3"></i>
                  <h3 className="card-title fw-bold text-white">Production & Work Order</h3>
                  <p className="card-text text-light">
                    Manage production schedules and work orders
                  </p>
                  <button
                    className="btn btn-primary mt-3 shadow-sm"
                    onClick={handleProductionLogin}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Sales & Order */}
            <div className="col-md-6 col-lg-3">
              <div
                className={`card h-100 shadow-lg border-0 management-card ${
                  isManagementVisible ? 'animate__animated animate__zoomIn animate__delay-2s' : ''
                }`}
              >
                <div className="card-body text-center">
                  <i className="bi bi-cart-fill display-4 text-primary mb-3"></i>
                  <h3 className="card-title fw-bold text-white">Sales & Order</h3>
                  <p className="card-text text-light">
                    Track sales and manage customer orders
                  </p>
                  <button
                    className="btn btn-primary mt-3 shadow-sm"
                    onClick={handleSalesLogin}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Machine & Employee */}
            <div className="col-md-6 col-lg-3">
              <div
                className={`card h-100 shadow-lg border-0 management-card ${
                  isManagementVisible ? 'animate__animated animate__zoomIn animate__delay-3s' : ''
                }`}
              >
                <div className="card-body text-center">
                  <i className="bi bi-people-fill display-4 text-primary mb-3"></i>
                  <h3 className="card-title fw-bold text-white">Machine & Employee</h3>
                  <p className="card-text text-light">
                    Monitor equipment and manage workforce
                  </p>
                  <button
                    className="btn btn-primary mt-3 shadow-sm"
                    onClick={handleMachineEmployeeLogin}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory & Raw Material */}
            <div className="col-md-6 col-lg-3">
              <div
                className={`card h-100 shadow-lg border-0 management-card ${
                  isManagementVisible ? 'animate__animated animate__zoomIn animate__delay-4s' : ''
                }`}
              >
                <div className="card-body text-center">
                  <i className="bi bi-box-fill display-4 text-primary mb-3"></i>
                  <h3 className="card-title fw-bold text-white">Inventory & Raw Material</h3>
                  <p className="card-text text-light">
                    Track inventory and manage supplies
                  </p>
                  <button
                    className="btn btn-primary mt-3 shadow-sm"
                    onClick={handleInventoryLogin}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Full Display */}
      <footer className="management-section py-5 vh-10 vw-100 d-flex align-items-center">
        <div className="container text-center">
          <h3 className="fw-bold mb-4">About Us</h3>
          <p className="lead mb-0">
            FactoryPro is a leading factory management system designed to help businesses streamline their operations, 
            improve productivity, and manage resources efficiently. Our mission is to empower factories with the tools 
            they need to succeed in a competitive market.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FactoryProHomePage;