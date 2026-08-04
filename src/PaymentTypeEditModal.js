import React, { useState } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { baseUrl } from './api/apiConfig';

const PaymentTypeEditModal = ({handleEditPayment,editPayment,item,initialFunction,params}) => {
    const[status,setStatus]=useState("Pending")

    const handleStatusChange=(event)=>{
        setStatus(event.target.value)
    }
    const updatePaymentStatus=async ()=>{
        try {
            const response=await axios.post(`${baseUrl}/booking/updateBookingPaymentStatus`,{
                booking_id:item.id,status:status},{headers:{"Content-Type":"application/json"}})
            if(response.data.success === true){
                alert("Status Changed !.")
                handleEditPayment()
                initialFunction(params)
            }
        } catch (error) {
            console.log(error.messaage);
            alert("Something Wrong,Check Again ?")
            
        }

    }
  return (
    <div id="EditPayment-Modal">
        <Modal isOpen={editPayment} id='edit-payment-type-mobile'>
            <ModalHeader
                className="modal-header"
                toggle={handleEditPayment}
                style={{ border: "none" }}
            >
                EDIT PAYMENT TYPE :
            </ModalHeader>
            <ModalBody>
                <div className="editpay-Modal-body">
                    <div style={{marginBottom:"20px"}}>
                    <span>Choose Option :</span>
                    </div>
                <div>
                    <input type="radio" checked={status==="Pending"} onChange={handleStatusChange} value="Pending"  id='one'   />
                    &nbsp;&nbsp; <label htmlFor="one" >Pending</label>
                </div>
                <div>
                    <input type="radio" checked={status==="Completed"} value="Completed" onChange={handleStatusChange}  id='two'   />
                    &nbsp;&nbsp;<label htmlFor="two">Completed</label>
                </div>

                <button onClick={updatePaymentStatus}>confirm</button>
                </div>
            </ModalBody>
        </Modal>
</div>
  )
}

export default PaymentTypeEditModal