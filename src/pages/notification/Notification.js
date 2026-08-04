import React from 'react';
import Layout from '../../components/Layout';
import { NavLink,Outlet } from 'react-router-dom';
// CSS..
import "../notification/notification.css"

const Notification = () => {
  return (
    <div>
        <Layout>
            
            <div className='notificationContainer' style={{marginTop:"70px",width:"600px",height:"100px",position:"absolute",
            top:"20px",left:"350px"}}>

            <p style={{fontSize:"20px"}}>Notifications</p>

                <div style={{display:"flex",justifyContent:"center",gap:"25px",width:"450px",
                boxShadow:"10px 10px 32px 0px rgba(173,161,173,1)",padding:"25px"
            }}>

                    <NavLink className="tours-Link" >All</NavLink>
                    <NavLink className="tours-Link">Unread</NavLink>
                    <Outlet></Outlet>
                </div>

            </div>
            
            

        </Layout>

    </div>
  )
}

export default Notification

{/* <div className='notificationContainer' style={{marginTop:"70px",width:"600px",height:"100px",position:"absolute",
            top:"20px",left:"350px"}}>

            <p style={{fontSize:"20px"}}>Notifications</p>

                <div style={{display:"flex",justifyContent:"center",gap:"25px",width:"450px",
                boxShadow:"10px 10px 32px 0px rgba(173,161,173,1)",padding:"25px"
            }}>

                    <NavLink className="tours-Link" >All</NavLink>
                    <NavLink className="tours-Link">Unread</NavLink>
                    <Outlet></Outlet>
                </div>

            </div> */}