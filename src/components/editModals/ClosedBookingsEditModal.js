import React,{useState,useEffect} from 'react';
import {Modal,ModalBody,ModalHeader} from "reactstrap";
import DatePicker from "react-datepicker";
import moment from 'moment';
import axios from 'axios';
import { baseUrl } from '../../api/apiConfig';
import { FaMapMarkerAlt } from "react-icons/fa";

const ClosedBookingsEditModal = ({isOpen,toggle,editData,getClosedBookingsData,pickupAddress,dropoffAddress}) => {
    const[editedData,setEditedData]=useState({})
    const[pickupTime,setPickupTime]=useState(null)
    const[dropoffTime,setDropoffTime]=useState(null)
    const[pickupAddModal,setPickupAddModal]=useState(false)
    const[searchAddress,setSearchAddress]=useState("")
    console.log(editData,"Original Object");
    console.log(pickupAddress,"pickupAddress");
    console.log(dropoffAddress,"dropoffAddress");
    useEffect(()=>{
        setEditedData(editData)
    },[editData])

    const saveChanges=async(e)=>{
        e.preventDefault();
        console.log(editedData,"ccc");
        try {
            const response=await axios.post(`${baseUrl}/booking/updateBooking/${editData.id}`,editedData)
            if(response.data.success){
                getClosedBookingsData()
                alert(response.data.message);
                toggle()
                
            }
            
        } catch (error) {
            alert("Failed to update ?");
            console.log(error);
            console.error(error.message)
            
        }

    }

    const cancelSaveChanges=()=>{
        toggle()

    }

    const changepickupAddModal=()=>{
        setPickupAddModal(!pickupAddModal)
    }

    console.log("new Edited Object :- ",editedData);
    

  return (
    <div>
        <Modal isOpen={isOpen} toggle={toggle} className='closed-bookings-edit-modal-mobile'>
            <ModalHeader toggle={toggle}>
                <p>Closed Bookings Edit :</p>
            </ModalHeader>
            <ModalBody>
                <form action="#" onSubmit={saveChanges} id='closedBookingModal'>

                    <label>Pickup Time :</label>
                    <DatePicker
                    className='session-dateRange'
                    selected={pickupTime}
                    timeIntervals={15}
                    onChange={(date)=>{
                        setPickupTime(date);
                        setEditedData({...editedData,pickup_time:moment(date).format("YYYY-MM-DD hh:mm:ss")})
                    }}
                    dateFormat="dd-MM-yyyy hh:mm:ss"
                    value={editedData?.pickup_time || ""}
                    showTimeSelect
                    placeholderText='Pickup Time'/>
                    <label>Dropoff Time :</label>
                    <DatePicker
                    className='session-dateRange'
                    selected={dropoffTime}
                    showTimeSelect
                    timeIntervals={15}
                    onChange={(date)=>{
                        setDropoffTime(date);
                        setEditedData({...editedData,dropoff_time:moment(date).format("YYYY-MM-DD hh:mm:ss")})
                    }}
                    dateFormat="dd-MM-yyyy hh:mm:ss"
                    value={editedData?.dropoff_time || ""}
                    placeholderText='Dropoff Time'/>
                    <label htmlFor="">Pickup Location :</label>
                    <div style={{display:"flex",gap:"10px"}}>
                    <input style={{width:"90%"}} type="text" value={editedData?.pickup_location} 
                    onChange={(e)=>setEditedData({...editedData,pickup_location:e.target.value})} />
                    <FaMapMarkerAlt size={33} color='green' onClick={changepickupAddModal}/>
                    </div>
                    <label htmlFor="">Dropoff Location :</label>
                    <div style={{display:"flex",gap:"10px"}}>
                    <input style={{width:"90%"}} type="text" value={editedData?.dropoff_location} 
                    onChange={(e)=>setEditedData({...editedData,dropoff_location:e.target.value})} />
                     <FaMapMarkerAlt size={33} color='green' onClick={changepickupAddModal}/>
                    </div>
                    <label htmlFor="">Commodity Weight :</label>
                    <input type="text" value={editedData?.commodity_weight} 
                    onChange={(e)=>setEditedData({...editedData,commodity_weight:e.target.value})}  />
                    <div className='edit-modal-button'>
                        <button type='submit'>Save</button>
                        <button type='button' onClick={cancelSaveChanges}>Cancel</button>
                    </div>
                </form>
                
            </ModalBody>
        </Modal>

        <Modal isOpen={pickupAddModal} scrollable id='closedBookingModal' className='closed-bookings-editpickup-modal-mobile'>
            <ModalHeader toggle={changepickupAddModal}>
                    <span>Choose Address:</span>
            </ModalHeader>
            <ModalBody>
                <input type="text" style={{width:"90%",padding:"3px"}} placeholder='Search ..' onChange={(e)=>setSearchAddress(e.target.value)} />
                {/* <p>Length-{pickupAddress.length}:{editData?.customer_id}</p> */}
                {pickupAddress.length == 0 ?"No Pickup Address ": pickupAddress.filter((elem)=>elem.address.toLowerCase().includes(searchAddress.trim()))
                .map((elem,index)=>
                <div key={index}>
                    <p>{elem.address}</p>
                    <button className='card-btn' onClick={()=>setEditedData({...editedData,pickup_location:elem.address})}>{elem.address_type}</button>
                </div>
                    
                )}
                <br />
                {/* <p>{dropoffAddress.length}</p> */}
                {dropoffAddress.length==0?"No dropoff Adress":dropoffAddress.filter((elem)=>elem.address.toLowerCase().includes(searchAddress.trim())).
                map((elem,index)=>
                <div key={index}>
                    <p>{elem.address}</p>
                    <button className='card-btn' onClick={()=>setEditedData({...editedData,dropoff_location:elem.address})}>{elem.address_type}</button>
                </div>
                )}

            </ModalBody>
        </Modal>


        

    </div>
  )
}

export default ClosedBookingsEditModal