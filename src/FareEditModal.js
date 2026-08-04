import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { baseUrl } from './api/apiConfig';

const FareEditModal = ({editfare,handleEditFare,item,initialFunction,params}) => {
    const[editFare,setEditFare]=useState(null)
    const[editedData,setEditedData]=useState({})
    // console.log(item,"Getting obj from Booking.js");
    // console.log(item.id,"Getting id from Obj");
    const updateBookingFare=async()=>{
        try {
            const response=await axios.post(`${baseUrl}/booking/updateBookingFare`,
            {fare:editedData.fare,booking_id:item.id},{headers:{"Content-Type":"application/json"}})
            if(response.data.success===true){
                alert("Your New Fare Added !");
                handleEditFare()
                initialFunction(params)
                // window.location.reload()
            }
            
        } catch (error) {
            console.log(error,"From editfare APi");
        }

    }

    useEffect(()=>{
        setEditedData(item)
    },[item])
  return (
    <div id="editFareContainer" key={item.id}>
            <Modal isOpen={editfare} id="editFare">
            <ModalHeader toggle={handleEditFare} style={{ border: "none" }}>
                EDIT FARE:
            </ModalHeader>
            <ModalBody>
                <div className="modal-body">
                <input type="number" min="0" value={editedData?.fare} 
                onChange={(event)=>setEditedData({...editedData,fare:event.target.value})} placeholder="Enter Your fare" />
                <div>
                    <button onClick={updateBookingFare}>Confirm</button>
                </div>
                </div>
            </ModalBody>
            </Modal>
    </div>
  )
}

export default FareEditModal