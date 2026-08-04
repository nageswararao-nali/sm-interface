import React from 'react';
import{Modal,ModalHeader,ModalBody} from "reactstrap";
import { baseUrl } from '../../api/apiConfig';
import axios from 'axios';


const TourEditModal = (props) => {
    const{tourEditModal,handleChangesTourEditModal,editdriverId}=props;
    console.log("editdriverId -",editdriverId);
    

    const updateTourDetails=async(id)=>{
      const payload={
        tour_id:id
      }
      try {
        const request=await axios.post(`${baseUrl}/tours/updateTourTrips`,payload);
        console.log(request);
        if(request.data.success){
          alert("done")
          window.location.reload()
        }
        
      } catch (error) {
        alert("Someting error",error.message)
        
      }

    }

  return (
    <Modal isOpen={tourEditModal}>
        <ModalHeader toggle={handleChangesTourEditModal} style={{border:"none"}}>
          <p>Tour Edit :</p>
        </ModalHeader>
        <ModalBody>
            <button className='tourEditModalBtn' onClick={()=>updateTourDetails(editdriverId)}>
              Confirm
            </button>
        </ModalBody>
    </Modal>
    
  )
}

export default TourEditModal