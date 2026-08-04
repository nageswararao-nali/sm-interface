import React from 'react'

const TourCount = ({tourCount}) => {
  console.log("totalCount :",tourCount)
   localStorage.setItem("tourCount",tourCount)
  let totalCount=  localStorage.getItem("tourCount",tourCount)
  console.log("totalCount :",totalCount)

  return (
    <span style={{
        position:"relative",
        bottom:"70px",
        left:"205px",
        width:"auto",
        height:"19px",
        backgroundColor:"#30A46C",
        padding:"2px",
        borderRadius:"50%",
        fontSize:"11px",
        fontWeight:"bold",
        color:"white"
    }}>
        {totalCount && totalCount }
        {/* {tourCount} */}
    </span>
  )
}

export default TourCount