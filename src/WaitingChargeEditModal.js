import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { baseUrl } from './api/apiConfig';

const WaitingChargeEditModal = ({waitingCharges,handle_waitingCharges,item,initialFunction,params}) => {
    const[editCharge,setEditCharge]=useState(0)
    const[editedData,setEditedData]=useState({})
    const updateWaitingCharges=async()=>{
        try {
            const response=await axios.post(`${baseUrl}/booking/updateBookingWaitingCharge`,
            {waiting_charge:editedData.waiting_charge,booking_id:item.id},{headers:{"Content-Type":"application/json"}})
            // console.log(response.data);
            if(response.data.success === true){
                alert("New Charges Added .")
                handle_waitingCharges()
                initialFunction(params)
                // window.location.reload()

            }
        } catch (error) {
            console.log(error.message);
            alert("Charges Not Added ?")
            
        }

    }

    useEffect(()=>{
      setEditedData(item)
  },[item])
  return (
    <div id="editWaitingCharges">
        <Modal isOpen={waitingCharges} id="editCharges">
          <ModalHeader
            className="modal-header"
            style={{ border: "none" }}
            toggle={handle_waitingCharges}
          >
            Edit Waiting Charges :
          </ModalHeader>
          <ModalBody>
            <div className="modal-body">
              <input
                type="number"
                min="0"
                // value={editCharge}
                value={editedData?.waiting_charge}
                onChange={(event)=>setEditedData({...editedData,waiting_charge:event.target.value})}
                placeholder="Enter Your waiting charges"
              />
              <div>
                <button onClick={updateWaitingCharges}>confirm</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
  )
}

export default WaitingChargeEditModal