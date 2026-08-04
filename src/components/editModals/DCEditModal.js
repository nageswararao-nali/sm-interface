import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Modal,ModalHeader,ModalBody} from "reactstrap"
import { baseUrl } from '../../api/apiConfig'
import "../../styles/dcEdit.css"

const DCEditModal = ({item,handleDcNumber,dcNumber,initialFunction}) => {
  const [dcObj,setDcObj]=useState({})
  
  const handleEdit_DCNumber=async()=>{
    console.log({bookingId: dcObj.id, dcNumber:dcObj.dcNumber, tdcNumber:dcObj.tdcNumber})
    try {
      const response=await axios.post(`${baseUrl}/booking/updateBookingDCNumberFromManager`,{
        bookingId: dcObj.id, dcNumber:dcObj.dcNumber, tdcNumber:dcObj.tdcNumber
      })
      if(response.data.success){
        alert("DC No updated successfully.")
        initialFunction()
        handleDcNumber()
      }
      
    } catch (error) {
      console.error(error.error)
      alert("DC Not Updated.")
      
    }
  }
  
  useEffect(()=>{
    setDcObj(item)
  },[item])

  return (
      <div >
          <Modal isOpen={dcNumber} id='DCModal'>
          <ModalHeader toggle={handleDcNumber}>
            <span> DC Number Edit :</span>
          </ModalHeader>
          <ModalBody>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              <label htmlFor="cusDC_no">Customer DC Number :</label>
              <input type="text" id='cusDC_no' value={dcObj?.dcNumber} onChange={(e)=>setDcObj({...dcObj,dcNumber:e.target.value.trim()})} />
              <label htmlFor="driverDC_no">Driver DC Number :</label>
              <input type="text" id='driverDC_no' value={dcObj?.tdcNumber} onChange={(e)=>setDcObj({...dcObj,tdcNumber:e.target.value.trim()})} />
              <button className='btn-big' onClick={handleEdit_DCNumber}>Save</button>
            </div>
          </ModalBody>
        </Modal>
      </div>
  )
}

export default DCEditModal