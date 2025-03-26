import React from 'react';
import { NavLink } from 'react-router-dom';
import '../header/header.css';
const Header = () => {
  return (
    <nav className="nav nav-pills flex-column flex-sm-row">

      <NavLink 
        className="flex-sm-fill text-sm-center nav-link" 
        to="/work-order-details" 
        activeClassName="active"
        exact ></NavLink>
     
        
      
      <NavLink 
        className="flex-sm-fill text-sm-center nav-link" 
        to="/sidebar" 
        activeClassName="active"></NavLink>
      
        
      
      <NavLink 
        className="flex-sm-fill text-sm-center nav-link" 
        to="/AdminLoging" 
        activeClassName="active">Loging</NavLink>
      
       
      
      <NavLink 
        className="flex-sm-fill text-sm-center nav-link " 
        to="/3" 
        activeClassName="active">  </NavLink>
     
       
      
    </nav>
  );
}

export default Header;
