import React,{useState} from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { baseUrl } from './api/apiConfig';

const VegamEditModal = ({isOpen,handleVegam,item,initialFunction,params={}}) => {
    const[editCharge,setEditCharge]=useState(0)
    // console.log(editCharge);
    // console.log(item.id);

    const updateVegam=async()=>{
        try {
            const response=await axios.post(`${baseUrl}/location/updateMultiBookingFare`,
            {is_vivegam: !item.is_vivegam,bookingId:item.id},{headers:{"Content-Type":"application/json"}})
            // console.log(response.data);
            if(response.data.success === true){
                alert("Booking Updated!")
                handleVegam()
                initialFunction(params)
                // window.location.reload()

            }
        } catch (error) {
            console.log(error.message);
            alert("Charges Not Added ?")
            
        }

    }
  return (
    <div id="editWaitingCharges">
        <Modal isOpen={isOpen} id="editCharges">
          <ModalHeader
            className="modal-header"
            style={{ border: "none" }}
            toggle={handleVegam}
          >
            Edit Waiting Charges :
          </ModalHeader>
          <ModalBody>
            <div className="modal-body">
              <div>Are you sure the booking update to {item.is_vivegam ? 'Vegam' : 'Vivegam'}?</div>
              <div>
                <button onClick={updateVegam}>confirm</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
  )
}

export default VegamEditModal