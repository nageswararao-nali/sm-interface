import React from 'react';
import Layout from '../../components/Layout';
import {NavLink,Outlet} from "react-router-dom"

const Summary = () => {
  return (
    <Layout>
        <div style={{marginTop:"20px",padding:"10px",display:"flex",gap:"20px"}}>
                <NavLink to="dailysummary" className="tours-Link">Daily Summary</NavLink>
                <NavLink to="transaction" className="tours-Link">Transaction</NavLink>
        </div>
        <Outlet/>
    </Layout>
  )
}

export default Summary