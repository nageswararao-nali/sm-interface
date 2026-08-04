import React from 'react'

const DriversCount = ({driverCount}) => {
  localStorage.setItem("driversCount",driverCount)
  let count=localStorage.getItem("driversCount")
  return (
    <span
    style={{
        position:"relative",
        bottom:"50px",
        left:"52px",
        width:"auto",
        height:"24px",
        backgroundColor:"#30A46C",
        padding:"3px",
        borderRadius:"50%",
        fontSize:"12px",
        fontWeight:"bold",
        color:"white"
    }}>{count && count}</span>
  )
}

export default DriversCount