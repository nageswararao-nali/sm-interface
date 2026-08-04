import React, { useEffect, useState } from 'react';
import {Modal,ModalBody,ModalHeader} from "reactstrap";
import "../../pages/sessionInfo/sessioninfo.css"
import moment from 'moment';
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { baseUrl } from '../../api/apiConfig';
import axios from 'axios';


const SessionEditModal = ({isOpen,toggle,editData,getSessionData}) => {
    const[editedData,setEditedData]=useState({})
    const[session_sdate,setSession_sdate]=useState(null)
    const[session_edate,setSession_edate]=useState(null)

    useEffect(()=>{
        setEditedData(editData)
    },[editData])
    console.log(editedData," - editedData");
    // console.log(editedData.id," - editedData");

    const saveChanges=async(e)=>{
        e.preventDefault();
        console.log(editedData.session_start_time);
        console.log(editedData.session_end_time);
        let date1=new Date(editedData.session_start_time)
        let date2=new Date(editedData.session_end_time)
        let milliSecs=Math.abs(date2-date1)
        let totalmins=Math.floor(milliSecs/(1000*60))
        console.log(totalmins,"final time");
        // console.log();
        

        const payload={
            end_buffer_time:editedData.end_buffer_time,
            end_location:editedData.end_location,
            end_odometer_photo:editedData.end_odometer_photo,
            end_odometer_reading:editedData.end_odometer_reading,
            final_fare:editedData.final_fare,
            paid:editedData.paid,
            parent_session_id:editedData.parent_session_id,
            session_end_time:editedData.session_end_time,
            session_start_time:editedData.session_start_time,
            start_buffer_time:editedData.start_buffer_time,
            start_location:editedData.start_location,
            start_odometer_photo:editedData.start_odometer_photo,
            start_odometer_reading:editedData.start_odometer_reading,
            status:editedData.status,
            total_distance:editedData.total_distance,
            total_time:totalmins,
            user_id:editedData.user_id
        }

        try {
            const response=await axios.post(`${baseUrl}/driver/updateSession/${editData.id}`,payload);
            if(response.data.success){
                alert("updated Successfully ✅")
                toggle()
                getSessionData(`${baseUrl}/driver/getAllSessions`)

            }
            
        } catch (error) {
            alert("Failed to update ?")
            console.error(error,error.message)
            
        }
        
        
    }
    // console.log(moment(session_sdate).utc().format(),"lll");

    const cancelSave=()=>{
        toggle()

    }
  return (
    <div>

        <Modal isOpen={isOpen} toggle={toggle} id='session-edit-modal-mobile'>
            <ModalHeader toggle={toggle}>
                <p style={{marginTop:"13px"}}>Session Edit :</p>
            </ModalHeader>
            <ModalBody>
            {/* <input type="text" value= {editedData?.id || ""} onChange={(e)=>setEditedData({...editedData,id:e.target.value})}/>
            <button onClick={save}>submit</button> */}
            <form action="#" id='session-edit-form' onSubmit={saveChanges}>
                <label htmlFor="">Session Start Km :</label>
                <input type="text" placeholder='starting Km..' value={editedData?.start_odometer_reading} 
                onChange={(e)=>setEditedData({...editedData,start_odometer_reading:e.target.value})} />
                <label htmlFor="">Session End Km :</label>
                <input type="text" placeholder='Ending Km..' value={editedData?.end_odometer_reading} 
                onChange={(e)=>setEditedData({...editedData,end_odometer_reading:e.target.value})} />
                <label htmlFor="">Session Start Time :</label>
                <DatePicker
                                        className='session-dateRange'
                                            selected={session_sdate}
                                            value={moment(editedData?.session_start_time).format("YYYY-MM-DD hh:mm:ss")}
                                            onChange={(date)=>{
                                                setEditedData({...editedData,session_start_time:moment(date).utc().format()})
                                                setSession_sdate(date)
                                            }}
                                            showTimeSelect
                                            showTimeInput
                                            dateFormat="dd-MM-yyyy hh:mm:ss"
                                            placeholderText='session start time'
                                        />

                {/* <input type="text" placeholder='start time' value={moment(editedData?.session_start_time).format("YYYY-MM-DD ")}
                onChange={(e)=>setEditedData({...editedData,session_start_time:e.target.value})} /> */}
                <label htmlFor="">Session End Time :</label>

                <DatePicker
                                        className='session-dateRange'
                                            selected={session_edate}
                                            value={moment(editedData?.session_end_time).format("YYYY-MM-DD hh:mm:ss")}
                                            onChange={(date)=>{
                                                setEditedData({...editedData,session_end_time:moment(date).utc().format()})
                                                setSession_edate(date)
                                            }}
                                            showTimeSelect
                                            showTimeInput
                                            dateFormat="dd-MM-yyyy hh:mm:ss"
                                            placeholderText='session start time'
                                        />
                {/* <input type="text" placeholder='end time' value={editedData?.session_end_time}
                onChange={(e)=>setEditedData({...editedData,session_end_time:e.target.value})}/> */}

                <label htmlFor="">Total Fare :</label>
                <input type="text" placeholder='total fare' value={editedData?.final_fare}
                onChange={(e)=>setEditedData({...editedData,final_fare:e.target.value})} />
                <div className='submit-cancel-buttons'>
                    <button type='submit' className='btn-small'>Save</button>
                    <button type='button' onClick={cancelSave} className='btn-small'>Cancel</button>
                </div>

            </form>

            </ModalBody>
        </Modal>
    </div>
  )
}

export default SessionEditModal