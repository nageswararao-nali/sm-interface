import React,{useState,useEffect} from 'react';
import UpdateTime from './pages/Admin/UpdateTime';
import{Modal,ModalHeader,ModalBody} from "reactstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import axios from 'axios';
import { baseUrl } from './api/apiConfig';

const TimeEditModal = ({handleChangeEditTime,editTime,item,initialFunction,params}) => {
    console.log(item);
    const [updatetime1, setUpdateTime1] = useState("");
    const [updatetime2, setUpdateTime2] = useState("");
    const [updatetime3, setUpdateTime3] = useState("");
    const [updatetime4, setUpdateTime4] = useState("");
    const[editedData,setEditedData]=useState({})




  useEffect(()=>{
    setEditedData(item)
  },[item])
  console.log("editedData :",editedData);

  const getAllTimes =async () => {
    const timePayload={
        booking_id: editedData.id,
        reached_pickup:editedData.reached_pickup ,
        completed_pickup: editedData.completed_pickup,
        reached_drop: editedData.reached_drop,
        completed_drop:editedData.completed_drop,
    }

    console.log(timePayload);

    try {
        const response=await axios.post(`${baseUrl}/tours/updateBookingTime`,timePayload,{
        headers:{"Content-Type":"application/json"}
    })
    if(response.data.success === true){
        alert("Time Updated Successfully")
        handleChangeEditTime();
        initialFunction(params)
        
    }
        
    } catch (error) {
        console.log(error.message);
        alert("Something Wrong !")
        
    }

    
    
  };
  
  return (
    <div id="EditTime-Modal">
        <Modal isOpen={editTime} id='edit-time-modal-mobile'>
          <ModalHeader toggle={handleChangeEditTime} style={{ border: "none" }}>
            <p>EDIT TIME :</p>
          </ModalHeader>
          <div>
            <ModalBody className="editTimeModal">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div>
                  <label htmlFor="">Pickup Location Reached-Time :</label>
                  <DatePicker
                  selected={updatetime1}
                  value={editedData?.reached_pickup || ""}
                  // selected={new Date(editedData?.reached_pickup)}
                  onChange={(date)=>{
                    setUpdateTime1(date);
                    console.log("pickup update ", updatetime1);
                    setEditedData({...editedData,reached_pickup:moment(date).format("YYYY-MM-DD HH:mm:ss")})
                   }}
                   
                  showTimeSelect
                  showTimeInput
                  placeholderText='Pickuplocation Reach Time'
                  // timeIntervals={15}
                  />
                </div>
                <div>
                  <label htmlFor="">Goods Pickup -Time :</label>
                  <DatePicker
                  value={editedData?.completed_pickup || ""}
                  // selected={new Date(editedData?.completed_pickup)}
                  selected={updatetime2}
                  onChange={(date)=>{
                    setUpdateTime2(date);
                    setEditedData({...editedData,completed_pickup:moment(date).format("YYYY-MM-DD HH:mm:ss")})
                   }}
                  showTimeSelect
                  showTimeInput
                  // timeIntervals={15}
                  placeholderText='Goodspickup Time'
                  
                  />
                </div>
                <div>
                  <label htmlFor="">Drop Location Reached-Time :</label>
                  <DatePicker
                  value={editedData?.reached_drop || ""}
                  selected={updatetime3}
                  onChange={(date)=>{
                    setUpdateTime3(date);
                    setEditedData({...editedData,reached_drop:moment(date).format("YYYY-MM-DD HH:mm:ss")})
                   }}
                   
                  showTimeSelect
                  showTimeInput
                  // timeIntervals={15}
                  placeholderText='Droplocation Reach Time'
                  />
                </div>
                <div>
                  <label htmlFor="">Goods Deliver -Time :</label>
                  <DatePicker
                  value={editedData?.completed_drop || ""}
                  // selected={new Date(editedData?.completed_drop)}
                  selected={updatetime4}
                  onChange={(date)=>{
                    setUpdateTime4(date);
                    setEditedData({...editedData,completed_drop:moment(date).format("YYYY-MM-DD HH:mm:ss")})
                   }}
                  showTimeSelect
                  showTimeInput
                  // timeIntervals={15}
                  placeholderText='Goods deliver Time'
                  />
                </div>
                <button className="btn-small" onClick={getAllTimes}>
                  Update Time
                </button>
              </div>
            </ModalBody>
          </div>
        </Modal>
      </div>
  )
}

export default TimeEditModal