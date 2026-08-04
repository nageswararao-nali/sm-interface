import React from 'react';
import Layout from '../../components/Layout';
import { Table } from 'reactstrap';
import { NavLink,Outlet } from 'react-router-dom';
import "../../styles/invoice/invoiceBill.css"

const Invoice = () => {
  return (
    <div>
        <Layout>
        <div style={{marginTop:"20px",padding:"10px",display:"flex",gap:"20px"}}>
                <NavLink to="bookings" className="tours-Link">Bookings</NavLink>
                <NavLink to="invoices" className="tours-Link">Generated Invoices</NavLink>
        </div>
        <Outlet/>
        </Layout>
    </div>
  )
}

export default Invoice

   