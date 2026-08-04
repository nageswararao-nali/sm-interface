import React from 'react';
import "../../styles/Admin/DriverPayments.css"

const DriverPayments = () => {
  return (
    <div style={{margin:"8px",padding:"15px",width:"710px",boxShadow:" 0 0 5px 2px rgba(0, 0, 0, 0.2)"}}>
      <p style={{fontWeight:"bold"}}>Driver Payments :</p>
      <form>
        <input type="file" style={{marginBottom:"30px"}} />
      </form>
      <button className='btn-small'>Upload</button>
    </div>
  )
}

export default DriverPayments