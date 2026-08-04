import React from 'react';
import Layout from '../../components/Layout';
import { NavLink,Outlet } from 'react-router-dom';

const History = () => {
    return (
        <div>
            <Layout>
                <div style={{marginTop:"20px",padding:"10px",display:"flex",gap:"20px"}}>
                <NavLink to="historyTable" className="tours-Link">History</NavLink>
                <NavLink to="trackHistoryMap" className="tours-Link">Track Map</NavLink>
                <NavLink to="analysis" className="tours-Link">Analysis</NavLink>
                </div>
                <Outlet/>
            </Layout>
        </div>
    )
}

export default History