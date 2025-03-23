import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="nav nav-pills flex-column flex-sm-row">

      <NavLink 
        className="flex-sm-fill text-sm-center nav-link" 
        to="/work-order-details" 
        activeClassName="active"
        exact >Home</NavLink>
     
        
      
      <NavLink 
        className="flex-sm-fill text-sm-center nav-link" 
        to="/sidebar" 
        activeClassName="active">dash</NavLink>
      
        
      
      <NavLink 
        className="flex-sm-fill text-sm-center nav-link" 
        to="/AdminLoging" 
        activeClassName="active"> AdminLoging</NavLink>
      
       
      
      <NavLink 
        className="flex-sm-fill text-sm-center nav-link " 
        to="/3" 
        activeClassName="active"> Disabled </NavLink>
     
       
      
    </nav>
  );
}

export default Header;
