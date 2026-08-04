import React from 'react';
import '../../styles/dashboard.css';
import Layout from '../../components/VerticalLayout';
import {Link,NavLink,Outlet} from "react-router-dom"

import "../../styles/Tourss.css"
import Menus from '../counts/Menus';

const Tourss = ({}) => {
    return (
        <>
        
          <Layout >
            <div className='toursMenu' style={{marginTop: '20px',display:"flex",gap:"30px"}}>
                <NavLink to="bookings" className="tours-Link">Bookings</NavLink>
                <NavLink to="trips" className="tours-Link">Trips </NavLink>
                <NavLink to="tours" className="tours-Link">Tours</NavLink>
                <NavLink to="closedBookings" className="tours-Link">Closed Bookings</NavLink>
            </div>
            
            <Outlet/>
          </Layout>
        </>


    )
}

export default Tourss