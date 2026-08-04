import React from 'react';
import '../../styles/dashboard.css';
import {FaTruckMoving,FaMapMarkedAlt} from "react-icons/fa"
import {MdPeopleAlt,MdNotificationImportant} from "react-icons/md"
import{AiFillInfoCircle,AiOutlineLogout} from "react-icons/ai"
import {RiAdminFill} from "react-icons/ri"
import {IoMdLocate} from "react-icons/io";
import { Link,useNavigate,NavLink} from "react-router-dom";
import Tours from './Tourss';



const Dashboard = () => {

    const navigate=useNavigate();

  return (
    <div>
        <h3>DASHBORAD</h3>

        <div className='mainBox'>
            <div className='leftBox'>
                <div className='iconDiv'>
                    <div className='icon'>
                    <FaTruckMoving/>
                    </div>
                    <div className='iconDiv-cont'>
                        {/* <a href="#">TOURS</a> */}
                        <Link className ="linkTag"  to="/dashboard/tours">TOURS </Link>
                        <span>Manage trips and tours</span>
                    </div>
                </div>
                <div className='iconDiv'>
                    <div className='icon'>
                    <MdPeopleAlt/>
                    </div>
                    <div className='iconDiv-cont'>
                        <a href="#">ACCOUNTS</a>
                        <span>Manage owners,drivers,vehicles.</span>
                    </div>
                </div>
                <div className='iconDiv'>
                    <div className='icon'>
                    <FaMapMarkedAlt/>
                    </div>
                    <div className='iconDiv-cont'>
                        <a href="#">LIVE LOCATIONS</a>
                        <span>View live driver location.</span>
                    </div>
                </div>
                <div className='iconDiv'>
                    <div className='icon'>
                    <AiFillInfoCircle/>
                    </div>
                    <div className='iconDiv-cont'>
                        <a href="#">SESSION INFO</a>
                        <span>View session info.</span>
                    </div>
                </div>
                <div className='iconDiv'>
                    <div className='icon'>
                    <RiAdminFill/>
                    </div>
                    <div className='iconDiv-cont'>
                        <a href="#">ADMIN</a>
                        <span>Admin workspace</span>
                    </div>
                </div>
                <div className='iconDiv'>
                    <div className='icon'>
                    <IoMdLocate/>
                    </div>
                    <div className='iconDiv-cont'>
                        <a href="#">DRIVER HISTORY</a>
                        <span>Driver location history</span>
                    </div>
                </div>
                <div className='iconDiv'>
                    <div className='icon'>
                    <MdNotificationImportant/>
                    </div>
                    <div className='iconDiv-cont'>
                        <a href="#">NOTIFICATIONS</a>
                        <span>Check Notifications</span>
                    </div>
                </div>

                <div className='bottom'>
                    <div>
                        <span>Logged in as Admin</span>
                        <p>XXXXXX</p>
                    </div>
                    <button className='logBtn'>
                    <span><AiOutlineLogout/> Logout</span>
                    </button>
                </div>

            </div>

            <div className='rightBox'>

                <div>
                    <Tours/>
                </div>

            </div>
        </div>

    </div>
  )
}

export default Dashboard