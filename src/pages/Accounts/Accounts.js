import React from 'react';
import Layout from '../../components/Layout';
import { NavLink, Outlet } from "react-router-dom";
import "../../styles/Accounts/accounts.css"

const Accounts = () => {
  return (
    <div className='toursMenuu'>
      <Layout >
      <div className='toursMenu navlinks' style={{ marginTop: "20px", padding: "10px",display:"flex",gap:"30px" }}>
                <NavLink to="drivers" className="tours-Link">Drivers</NavLink>
                <NavLink to="vehicles" className="tours-Link">Vehicles</NavLink>
                <NavLink to="owners" className="tours-Link">Owners</NavLink>
                <NavLink to="customers" className="tours-Link">Customers</NavLink>
                <NavLink to="companies" className="tours-Link">Companies</NavLink>
                <NavLink to="companySettings" className="tours-Link">CompanySettings</NavLink>
                <NavLink to="trucksRate" className="tours-Link">Truck Rate</NavLink>
                <NavLink to="shops" className="tours-Link">Shops</NavLink>
            </div>
            <Outlet/>
        </Layout>
    </div>
  )
}

export default Accounts