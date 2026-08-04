import React, { useEffect, useState } from 'react';
import { Modal,ModalHeader,ModalBody } from 'reactstrap';
import { baseUrl } from '../../api/apiConfig';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/Tours/bookingEditModal.css"

const BookingsEditModal = ({isOpen,toggle,editData,getTodayBookings}) => {
    const[addressModal,setAddressModal]=useState(false)
    const[dropoffAddressModal,setdropoffAddressModal]=useState(false)
    const[pickupTime,setPickupTime]=useState(null)
    const[dropoffTime,setDropoffTime]=useState(null)
    const[searchQuery,setSearchQuery]=useState("")
    const[editedData,setEditedData]=useState({})
    const[pickupAddress,setPickupAddress]=useState([])
    const[dropoffAddress,setDropoffAddress]=useState([])

    // adress Modal
    const openAddressModal=()=>{
        setAddressModal(!addressModal)
    }
    const opendropoffAddressModal=()=>{
        setdropoffAddressModal(!dropoffAddressModal)
    }
    // choose PickupAddress from modal
    const choosePickupAddress=(elem)=>{
        console.log(elem,"i am ");

        console.log(elem);
        console.log({...editedData,pickup_location:elem.address});
        setEditedData({...editedData,pickup_location:elem.address})
        setAddressModal(false)
    }
    // choosing DropoffAddress from modal
    const chooseDropoffAddress=(elem)=>{
        console.log(elem,"i am fromm");
        console.log({...editedData,dropoff_location:elem.address});

        setEditedData({...editedData,dropoff_location:elem.address})
        setdropoffAddressModal(false)

    }
    // console.log(editedData);

    // Get saved Address for a customer...

    const getAddressofCustomer=async(id)=>{
        try {
            const resp=await axios.post(`${baseUrl}/users/getAddress`,{customer_id:id})
            if(resp.data.success){
                const address=resp.data.data.Pickup_address;
                const address1=resp.data.data.Dropoff_address;
                console.log("pickup ",address);
                console.log("Dropoff ",address1);
                setPickupAddress(address)
                setDropoffAddress(address1)

            }
            
        } catch (error) {
            console.error(error)
            console.log("Failed to fetch customer saved Address ?");
            
        }

    }

    useEffect(()=>{
        getAddressofCustomer(editedData?.customer_id)

    },[editedData?.customer_id])

    useEffect(()=>{
        setEditedData(editData)

    },[editData])



    const updateBookings=async(e)=>{
        e.preventDefault()
        console.log(editedData);

    try {
        const response=await axios.post(`${baseUrl}/booking/updateBooking/${editData.id}`,editedData)
        if(response.data.success){
            alert("Booking Upated Successfully ✅")
            toggle()
            getTodayBookings()
        }
        
    } catch (error) {
        console.error(error)
        alert("Failed to Update ?")
        
    }
        

    }   
    
    // for cancel
    const cancelSave=()=>{
        toggle()
    }

    useEffect(()=>{
            setEditedData(editData)
        },[editData])



  return (
    <div>
        <section id='BookingsEditModal'>
        <Modal isOpen={isOpen} className='bookings-edit-modal-mobile'>
            <ModalHeader toggle={toggle}>
                <span style={{fontSize:"18px"}}>Bookings Edit :</span>
            </ModalHeader>
            <ModalBody>
                <form action="#" onSubmit={updateBookings} id='bookingsEditForm'>
                <label htmlFor="">Pickup Time :</label>
                <DatePicker
                    className='session-dateRange '
                    selected={pickupTime}
                    timeIntervals={15}
                    onChange={(date)=>{
                        setPickupTime(date);
                        setEditedData({...editedData,pickup_time:moment(date).format("YYYY-MM-DD hh:mm:ss")})
                    }}
                    dateFormat="dd-MM-yyyy hh:mm:ss"
                    value={editedData?.pickup_time || ""}
                    // value={moment(editedData?.pickup_time).format("YYYY-MM-DD hh:mm:ss")|| ""}
                    showTimeSelect
                    placeholderText='Pickup Time'/>
                    <label htmlFor="">Dropoff Time :</label>
                    <DatePicker
                    className='session-dateRange '
                    selected={dropoffTime}
                    showTimeSelect
                    timeIntervals={15}
                    onChange={(date)=>{
                        setDropoffTime(date);
                        setEditedData({...editedData,dropoff_time:moment(date).format("YYYY-MM-DD hh:mm:ss")})
                    }}
                    dateFormat="dd-MM-yyyy hh:mm:ss"
                    value={editedData?.dropoff_time || ""}
                    // value={moment(editedData?.dropoff_time).format("YYYY-MM-DD hh:mm:ss")|| ""}
                    placeholderText='Dropoff Time'/>
                    <label htmlFor="">Pickup Location:</label>
                    <div className='bookingsEditPickup'>
                    <input type="text" value={editedData?.pickup_location} onChange={(e)=>setEditedData({...editedData,pickup_location:e.target.value})}/>
                    <span><FaMapMarkerAlt size={33} color='green' onClick={openAddressModal}/></span>
                    </div>
                    <label htmlFor="">Dropoff Location:</label>
                    <div className='bookingsEditDropoff'>
                    <input type="text" value={editedData?.dropoff_location} onChange={(e)=>setEditedData({...editedData,dropoff_location:e.target.value})}/>
                    <FaMapMarkerAlt size={33} color='green' onClick={opendropoffAddressModal}/>
                    </div>
                    <label htmlFor="">Commodity Weight:</label>
                    <input type="text" value={editedData?.commodity_weight} onChange={(e)=>setEditedData({...editedData,commodity_weight:e.target.value})}/>
                   <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>
                   <button type='submit' className='btn-small'>Save</button>
                   <button type='button' className='btn-small' onClick={cancelSave}>Cancel</button>
                   </div>
                    </form>
            </ModalBody>
        </Modal>
        </section>

        <section id='bookingAddressChooseModal'>
            <Modal isOpen={addressModal} scrollable className='bookings-editpickup-modal-mobile'>
                <ModalHeader toggle={openAddressModal}>
                    <span>Saved Address :</span>
                </ModalHeader>
                <ModalBody id='bookingAddressChooseModal'>
                    <input type="text" placeholder='Search Address...' onChange={(e)=>setSearchQuery(e.target.value)}/>
                    {
                        pickupAddress.filter((elem)=>elem.address.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())).map((elem,index)=>
                        <div key={index} className='addressBox'>
                            <p>{elem.address}</p>
                            <button  onClick={()=>
                                {
                                    choosePickupAddress(elem)
                                    // chooseDropoffAddress(elem)
                                }
                                }>{elem.address_type}</button> 
                        </div>
                        )
                    }
                    {
                        dropoffAddress.filter((elem)=>elem.address.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())).map((elem,index)=>
                        <div key={index} className='addressBox'>
                            <p>{elem.address}</p>
                            {/* <button onClick={()=>chooseDropoffAddress(elem)}>{elem.address_type}</button> */}
                            <button onClick={()=>{
                                    choosePickupAddress(elem)
                                    // chooseDropoffAddress(elem)
                                }}>{elem.address_type}</button>
                        </div>
                        )
                    }

                </ModalBody>
            </Modal>

        </section>

        <section >
            <Modal isOpen={dropoffAddressModal} className='bookings-editdrop-modal-mobile'>
                <ModalHeader toggle={opendropoffAddressModal}>
                <span>Saved Address :</span>
                </ModalHeader>
                <ModalBody id='bookingAddressChooseModal'>
                <input type="text" placeholder='Search Address...' onChange={(e)=>setSearchQuery(e.target.value)}/>
                    {
                        pickupAddress.filter((elem)=>elem.address.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())).map((elem,index)=>
                        <div key={index} className='addressBox'>
                            <p>{elem.address}</p>
                            <button  onClick={()=>
                                {
                                    // choosePickupAddress(elem)
                                    chooseDropoffAddress(elem)
                                }
                                }>{elem.address_type}</button> 
                        </div>
                        )
                    }
                    {
                        dropoffAddress.filter((elem)=>elem.address.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())).map((elem,index)=>
                        <div key={index} className='addressBox'>
                            <p>{elem.address}</p>
                            {/* <button onClick={()=>chooseDropoffAddress(elem)}>{elem.address_type}</button> */}
                            <button onClick={()=>{
                                    // choosePickupAddress(elem)
                                    chooseDropoffAddress(elem)
                                }}>{elem.address_type}</button>
                        </div>
                        )
                    }
                    

                </ModalBody>
            </Modal>

        </section>

        

    </div>
  )
}

export default BookingsEditModal