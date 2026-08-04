import React from 'react';
import {Link,NavLink,Outlet} from "react-router-dom"
import {Badge } from "reactstrap";

const Menus = ({bookingCount}) => {
    localStorage.setItem("bookingCount",bookingCount);
    let count=localStorage.getItem("bookingCount")
    console.log(count)
  return (
    <div>
       {
        <span 
        style={{
            position:"relative",
            bottom:"50px",
            left:"68px",
            width:"10px !important",
            height:"10px !important",
            backgroundColor:"#30A46C",
            padding:"0px 3px",
            borderRadius:"50%",
            fontSize:"12px",
            fontWeight:"bold",
            color:"white"
            // top:"0px"
        }}
        >{count}</span>
       }
        
    </div>
  )
}

export default Menus