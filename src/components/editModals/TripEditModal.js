import React, { useEffect, useState } from 'react';
import {Modal,ModalHeader,ModalBody} from "reactstrap";


const TripEditModal = (props) => {
  const[pickup_time,setPickup_time]=useState(null)
  const[editedData,setEditedData]=useState({})

  const{tripEditModal,handleTripEditModalChanges,editObj,onSave}=props
  // console.log("editObj-",editObj);
  console.log(editedData,"ppp");


  const handleSave=()=>{
    console.log(editedData,"eiuyyt");
    onSave(editedData)
  }
  useEffect(()=>{
    setEditedData(editObj)
  },[editObj])

  // const handleInputChange=(e)=>{
  //   setEditedData({...editedData,pickup_time:e.target.value})
  // }
  // console.log(editedData.pickup_time,"lll");

  return (
    <Modal isOpen={tripEditModal}>
        <ModalHeader toggle={handleTripEditModalChanges}>

        </ModalHeader>

        <ModalBody>
          <input type="text" value={editedData.pickup_time || " "} onChange={(e)=>setEditedData({...editedData,pickup_time:e.target.value})}  />
          <input type="text" value={editedData.dropoff_time || " "} onChange={(e)=>setEditedData({...editedData,dropoff_time:e.target.value})}  />
          {/* <input type="text" value={editObj.dropoff_time} onChange={(e)=>console.log(e.target.value)} /> */}
          <button onClick={handleSave}>save</button>

        </ModalBody>

    </Modal>
  )
}

export default TripEditModal