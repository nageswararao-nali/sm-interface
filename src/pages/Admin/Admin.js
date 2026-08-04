import React from 'react';
import Layout from '../../components/Layout';
import { NavLink, Outlet } from 'react-router-dom';
import "../../styles/Tourss.css"

const Admin = () => {
    return (
        <>
            <Layout>
                <div className='toursMenu' style={{marginTop: '20px',display:"flex",gap:"30px"}}>
                    <NavLink className="tours-Link" to="addAddress">Add Address</NavLink>
                    <NavLink className="tours-Link" to="editAddress">Edit Address</NavLink>
                    <NavLink className="tours-Link" to="addBooking">Add Bookings</NavLink>
                    <NavLink className="tours-Link" to="invoiceGeneration">Invoice</NavLink>
                    <NavLink className="tours-Link" to="driverPayments">Driver Payments</NavLink>
                    <NavLink className="tours-Link" to="baseLocation">Base Location</NavLink>
                    <NavLink className="tours-Link" to="portalSettings">Portal Settings</NavLink>

                </div>

                <Outlet/>
            </Layout>
        </>

    )
}

export default Admin