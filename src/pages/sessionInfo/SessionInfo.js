import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import {BiEditAlt} from "react-icons/bi";
import {MdDeleteOutline} from "react-icons/md";
import {RiDeleteBin5Line} from "react-icons/ri";
import moment from 'moment'
import axios from 'axios';
import ReactSelect from '../../ReactSelect';
// Data import ...
// Icons...
import { Trash, PencilSquare,Search, Filter} from "react-bootstrap-icons";
import SearchableDropdown from '../../searchableDropdown';

import ReactPaginate from "react-paginate";
// import axios from 'axios';
import {MdAdd} from "react-icons/md";
import DatePicker from "react-datepicker";
// CSS...
import "../../App.css";
import "../sessionInfo/sessioninfo.css";
import Pagination from '../../Pagination';
import { CSVLink } from 'react-csv';
import { baseUrl } from '../../api/apiConfig';
import SessionEditModal from '../../components/editModals/SessionEditModal';
import { MdClose } from "react-icons/md";
const momentDate = require('moment-timezone');


const SessionInfo = () => {
    const [loading,setLoading]=useState(true)
    const[Filter_Loading,setFilter_Loading]=useState(false)
    const[data,setData]=useState([]);
    const[anotherData,setAnotherData]=useState([])
    const[driversData,setDriversData]=useState([])
    const[totalCount,setTotalCount]=useState(null)
    const[pageNumber,setPageNumber]=useState(0)
    const [open, setOpen] = useState(false);
    const [add, setAdd] = useState(false);
    const[show,setShow]=useState(false) /// for Download btn hide
    const[message,setMessage]=useState(true) // for Records message indication
    const[dateMessage,setDateMessage]=useState(false)
    const[date1,setDate1]=useState(null)
    const[date2,setDate2]=useState(null)
    const[searchDate,setSearchDate]=useState("")
    const[userId,setUserId]=useState("")
    const[session_sdate,setSession_sdate]=useState("")
    const[session_edate,setSession_edate]=useState("")
    const[session_startKM,setSession_startKM]=useState("")
    const[session_endKM,setSession_endKM]=useState("")
    const[totalKm,setTotalKm]=useState("")
    const[add_session,setAdd_session]=useState()
    const[timeDiff,setTimeDiff]=useState("")
    const[sessionReport,setSessionReport]=useState([])

    const[search,setSearch]=useState("")
    const[searchCount,setSearchCount]=useState("")
    const[deleteModal,setDeleteModal]=useState(false)
    const[deleteId,setDeleteId]=useState(null)
    const[isEditModalOpen,setIsEditModalOpen]=useState(false)
    const[editData,setEditData]=useState(null)


    const openEditModal=(item)=>{
        setIsEditModalOpen(true)
        setEditData(item)
    }

    const closeEditModal=()=>{
        setIsEditModalOpen(false)
        setEditData(null)
    }

    const toggle = () => {
        setOpen(!open)
        setShow(false)// hide downld btn
        setDate1(null)
        setDate2(null)
        setMessage(false)
        setDateMessage(false)
    }
    
    const toggle2 = () => {
        setSession_edate("")
        setSession_sdate("")
        setTimeDiff("")
        setSession_startKM("")
        setSession_endKM("")
        setTotalKm("")
        setAdd(!add)
    }
    const handleSearch=(e)=>{
        if(e.target?.value){
            let value=e.target.value.trim().toLowerCase()
            setSearch(e.target.value.trim().toLowerCase())
            const searchData=data.filter((item)=>
                                        item.driver_name?.toLowerCase()?.includes(search)
                                            ||item.id.toString() == value
                                            )
            console.log("SearchResult..",searchData)
            setTotalCount(searchData.length)
                                             
                                            
        }
        else{
            setTotalCount(data.length)
            setData(data)
        }
        setPageNumber(0)
        const searchCount=data.filter((item)=>item.driver_name.toLowerCase().includes(search.toLowerCase()));
        setSearchCount(searchCount.length)

    }

    const showDataPerPage=10;
    const pageCount=Math.ceil(totalCount/showDataPerPage)
    console.log("Total Page",pageCount)
    const handlePageChange=({selected})=>{
        setPageNumber(selected)
        setLoading(true)
    }
    const pagesVisited=pageNumber*showDataPerPage;
    const keys=["id","created_at","driver_name","total_distance","total_time","no_tours","no_trips","driver_mobile",
                "vehicle_number","truck_owner_id","start_odometer_reading","session_start_time","session_end_time","fare"]


    
    const handleSearchDate=(date)=>{
        setSearchDate(date)  
        const formattedDate = moment(date).format("YYYY-MM-DD");
        reOrderData(formattedDate);      
        
    }
    const reOrderData=(formattedDate)=>{
        console.log(formattedDate)
        if(!formattedDate){
            setData(data); 
            setTotalCount(data.length);
            setSearchDate("")
            return 
        }        
        // const formattedDate=moment(formattedDate).format("YYYY-MM-DD")
        const filteredData= data.filter((item)=>
         moment(item.created_at).format("YYYY-MM-DD")=== moment(formattedDate).format("YYYY-MM-DD")
    )   
        setAnotherData([...filteredData]);
        setTotalCount(filteredData.length);

    }

    const handleSelection=(selected)=>{
        setUserId(Number(selected.value))
    }

    const handleSessionEndDate=(date)=>{
        setSession_edate(date);
        // console.log(setSession_edate(date))
        // diff();
       
    }

  

    const diff = () => {
        console.log(new Date(session_sdate));
        console.log(session_edate);
    
        // Make sure session_sdate and session_edate are valid Date objects
        let dat1 = new Date(session_sdate);
        let dat2 = new Date(session_edate);
    
        // Check the difference between the dates
        let timeDifference = Math.abs((dat2 - dat1) / (1000 * 60));
        
        setTimeDiff(Math.round(timeDifference));
       
        // console.log(`Time difference between ${session_sdate?.toISOString()} and ${session_edate?.toISOString()}: ${minutesDifference} minutes`);
    };

    const handleSessionendKM=(e)=>{
        setSession_endKM(e.target.value)
       kmDifference()
    }
    const kmDifference=()=>{
        let km=session_startKM-session_endKM;
        setTotalKm(Math.abs(km))
    }
    
        


    React.useMemo(()=>{
        diff();
    },[session_edate])
    React.useMemo(()=>{
        kmDifference()
    },[session_endKM])


    // Adding new Session ...

    const handleAddSession=async(e)=>{
        e.preventDefault();
        const addSessionPayload={
            start_odometer_reading:session_startKM,
            end_odometer_reading:session_endKM,
            session_start_time:session_sdate.toISOString(),
            session_end_time:session_edate.toISOString(),
            total_distance:totalKm,
            total_time:timeDiff,
            user_id:userId
        }

        try {
            const request=await axios.post(`${baseUrl}/driver/createSession`,addSessionPayload)
            if(request.data.success === true){
                setAdd(false)
                alert("New Session Added sucessfully");
                getSessionData(url)
            }
            
        } catch (error) {
            alert("session not Added")
            console.log(error);
            
        }
        
        
    }

    // get AllDrivers from APi..

    const getAllDrivers=async()=>{
        const request=await axios.post(`${baseUrl}/driver/getDrivers`,{limit:1000,offset:0})
        const allDriversData=request.data.data.drivers;
        console.log(allDriversData,"allDriversData");
        const data=allDriversData.map((item)=>({
            label:`${item.name}-${item.mobile_number}`,
            value:`${item.user_id}`
        }))
        setDriversData(data)
    }


    // Api Calling ...
    const url=`${baseUrl}/driver/getAllSessions`

    const getSessionData=async ()=>{
        setTotalCount(0)
        setData([])
        setLoading(true)

        try {
            const response=await axios.post(`${baseUrl}/driver/getAllSessions`,{
                limit:300,offset:0
            })
            if(response.data.success){
                const data=response.data.data.sessionList;
                setData(data)
                setTotalCount(data.length)
                
            }
            
        } catch (error) {
            console.error("Error fetching session data:", error);
            
        }finally{
            setLoading(false)

        }

    }
    

    console.log(data)

    const restore_Original_Data=(data)=>{
        console.log("data",data)
        setData(data)
        setTotalCount(data.length)

    }



    //  get Session report by the Date ...

    const getSessionReport=async()=>{
        const payload={start_date:moment(date1).format("YYYY-MM-DD"),end_date:moment(date2).format("YYYY-MM-DD")}
        console.log(payload,"payload");
        if(payload.start_date=="Invalid date" && payload.end_date=="Invalid date"){
            setDateMessage(true)
            return
        }else{
            try {
                setFilter_Loading(true)
            const response=await axios.post(`${baseUrl}/location/sessionReports`,payload)
            console.log(response);
            if(response.data.success){
                const result=response.data.data.locations
                setSessionReport(result)
                setShow(true)
                setFilter_Loading(false)
                setMessage(false)
                setDateMessage(false)
                // alert("Done")
            }else{
                setShow(false)
                setMessage(true)
                setDateMessage(false)

                // alert("Failed !")
            }
            
        } catch (error) {
            setDateMessage(true)
            setFilter_Loading(false)

            console.log(error);
            
        }

        }
        
        

    }

    // Delete Icon fn.. 
    const handleDeleteModal=(id)=>{
        setDeleteModal(!deleteModal)
        setDeleteId(id)
    }
    const deleteSelectedSession=async (id)=>{
        console.log(id,"delete id");
        try {
                const request=await axios.post(`${baseUrl}/driver/deleteSession/${id}`)
                // console.log(request,"ppp");
                if(request.data.success){
                    getSessionData(url)
                    alert("Deleted Successfully.")
                    setDeleteModal(false)
                    
                }
                
                } catch (error) {
                    alert("Failed to Delete !")
                    console.error(error.message);
                    
                }

    }




   useEffect(()=>{
    // getSessionData(url)
    getAllDrivers()
   },[])
   useEffect(()=>{
    getSessionData()
   },[])
  

//    useEffect(() => {
//     if (searchDate) {
//         reOrderData(searchDate);
    
//     }
// }, [searchDate]);





    return (
        <div id='sessionPage'>
            <Layout>
                <div style={{ marginTop: "30px", padding: "10px" }}>
                    {/* used for common style in input tags */}
                    <section className='session-Top'>
                        <div className='session-Top-Input'>
                            <Search className='searchIcon' />
                            
                            <input type="text" className='inputSearch'
                            placeholder='Search by id,driver name,mobile,veh no'
                            onChange={handleSearch} />&nbsp;&nbsp;
                            {/* {search.length>=1 && `${searchCount} - Records Found..`} */}


                        </div>
                        <div className='session-TopButton'>
                            <button  onClick={toggle}>Trukers Records</button>
                                <Modal isOpen={open} toggle={toggle} id='trukers-record-modal-mobile'>
                                    <ModalHeader toggle={toggle} style={{border:"none"}}>
                                        <p style={{position:"relative",top:"15px"}}>Filter</p> 
                                    </ModalHeader>
                                    <ModalBody className='trukers-modalBody'>
                                        <p>Period of Time :</p>
                                        <div className='date-input' style={{display:"flex",gap:"5px",marginBottom:"20px"}}>
                                            
                                                <DatePicker
                                                selected={date1}
                                                onChange={(date)=>setDate1(date)}
                                                placeholderText='Date From'
                                                dateFormat="yyyy-MM-dd" 
                                                className='datePicker'
                                                />
                                                <DatePicker
                                                selected={date2}
                                                onChange={(date)=>setDate2(date)}
                                                placeholderText='To'
                                                dateFormat="yyyy-MM-dd"
                                                className='datePicker'
                                                
                                                />
                                        </div>
                                        <div className='modalFilterBtn'>
                                            <button className='btn-small' onClick={()=>{
                                                
                                                getSessionReport()
                                            }}>Filter</button>
                                            {show && <CSVLink
                                            data={sessionReport}
                                            filename='TruckersRecord.csv'
                                            target='_blank'
                                            className='btn-small'
                                            >Download</CSVLink>
                                            }
                                            {Filter_Loading ? "Loading...":""}
                                            {message ? "No records are found":""}
                                            {dateMessage ? "Please choose date":""}
                                        </div>
                                    </ModalBody>
                                    
                                </Modal>

                            
                            <button  onClick={toggle2}><MdAdd size={23} color='white'/>Add Session</button>
                                <Modal isOpen={add} toggle={toggle2} id='addSession-modal-mobile'>
                                    <ModalHeader toggle={toggle2} style={{border:"none"}}>
                                        <p style={{position:"relative", top:"15px"}}>Add Session Details</p>
                                    </ModalHeader>
                                    <ModalBody className='inputs'>
                                     <form className='session-form' onSubmit={handleAddSession}>
                                     <label htmlFor="driverName-mob">Driver Name - Mobile :</label>
                                        <ReactSelect
                                        options={driversData}
                                        handleSelectedOption={handleSelection}
                                        isMulti={false}
                                        />
                                        {/* session_endKM,setSession_endKM
                                        <SearchableDropdown state={add_session} setState={setAdd_session} data={addSessiondata}/> */}
                                        <label htmlFor="startKm">Session Start Km :</label>
                                        <input type="text" id='startKm' value={session_startKM}onChange={(e)=>setSession_startKM(e.target.value)} name='startKm' placeholder='session start Km' />
                                        <label htmlFor="endKm">Session End Km :</label>
                                        <input type="text" id='endKm' value={session_endKM} onChange={handleSessionendKM} name='endKm'placeholder='session end Km' />
                                        <label htmlFor="start time">Session Start Time :</label>
                                            <DatePicker
                                            className='session-dateRange'
                                                selected={session_sdate}
                                                value={session_sdate}
                                                onChange={(date)=>setSession_sdate(date)}
                                                showTimeSelect
                                                showTimeInput
                                                dateFormat="dd-MM-yyyy HH:mm:ss"
                                                placeholderText='session start time'
                                            />
                                        <label htmlFor="end time">Session End Time :</label>
                                            <DatePicker
                                            className='session-dateRange'
                                                selected={session_edate}
                                                value={session_edate}
                                                onChange={(date)=>handleSessionEndDate(date)}
                                                showTimeSelect
                                                showTimeInput
                                                dateFormat="dd-MM-yyyy HH:mm:ss"
                                                placeholderText='session end time'
                                            />   
                                        <label htmlFor="total time">Total Time :</label>
                                        <input type="text" id='total time' value={timeDiff} name='total time' placeholder='total time'/>
                                        <label htmlFor="distance travel">Distance Travelled :</label>
                                        <input type="text" id='distance travel' value={totalKm} name='distance travel' placeholder='distance travelled'/>
                                        <button type='submit' className='btn-small'>Add Session</button>
                                     </form>
                                    </ModalBody>
                                    
                                </Modal>
                        </div>
                    </section>
                        
                {/* Delete Modal */}
                    <section id='DeleteModal'>
                        <Modal isOpen={deleteModal} size='sm' style={{marginTop:"5%"}} className='delete-modal-mobile'>
                            <ModalHeader toggle={handleDeleteModal}style={{ border: "none" }} >
                            
                            </ModalHeader>
                            <ModalBody>
                                <div id='deleteModalBody' >
                                    <p>Are you sure you want to delete this record? - <b>{deleteId}</b></p>
                                    <div className='confirm-cancel-button'>
                                    <button onClick={()=>deleteSelectedSession(deleteId)}>Confirm</button>
                                    <button onClick={()=>handleDeleteModal()}>Cancel</button>
                                    </div>
                                </div>
                            </ModalBody>
                            </Modal>
                    </section>
                    {/* Session Edit Modal.. */}
                    <section>
                        <SessionEditModal
                        isOpen={isEditModalOpen}
                        toggle={closeEditModal}
                        editData={editData}
                        getSessionData={getSessionData}
                        />
                    </section>

                    
                    
                        <section>
                        <Table responsive hover  className='session-Table'>
                            <thead>
                                <tr>
                                    <th><td></td></th>
                                    <th><pre>EDIT</pre></th>
                                    <th><pre>DELETE</pre></th>
                                    <th style={{position:"relative"}}><pre>ID</pre><input type="text"  placeholder='Filter' onChange={handleSearch} />
                                    </th>
                                    <th style={{position:"relative"}}><pre>DATE (DD:MM:YY)</pre><DatePicker selected={searchDate} 
                                    onChange={date=>handleSearchDate(date)}  dateFormat="yyyy-MM-dd" placeholderText='Filter'/>
                                    <MdClose size={17} className='dateCloseIcon' style={{position:"absolute",right:"20px",top:"48px",cursor:"pointer"}} 
                                    onClick={()=>
                                        {
                                            setSearchDate("")
                                            setAnotherData([])
                                            restore_Original_Data(data)
                                        }
                                    }/>
                                    </th>
                                    <th style={{position:"relative"}}><pre>DRIVER NAME</pre><input type="text" placeholder='Filter'
                                    onChange={handleSearch} /></th>
                                    <th><pre>DISTANCE TRAVELLED</pre><input type="text" placeholder='Filter'onChange={handleSearch} /></th>
                                    <th><pre>TOTAL TIME</pre><input type="text" placeholder='Filter'onChange={handleSearch} /></th>
                                    <th><pre>TOTAL TOURS</pre><input type="text" placeholder='Filter' onChange={handleSearch}/></th>
                                    <th><pre>TOTAL BOOKINGS</pre><input type="text" placeholder='Filter'onChange={handleSearch} /></th>
                                    <th><pre>MOBILE NO</pre><input type="text" placeholder='Filter' onChange={handleSearch} /></th>
                                    <th><pre>VEHICLE NO</pre><input type="text" placeholder='Filter'onChange={handleSearch} /></th>
                                    <th><pre>TRUCK OWNER'S NAME</pre><input type="text" placeholder='Filter'onChange={handleSearch} /></th>
                                    {/* <th><pre>SESSION-START<small>(KM)</small></pre><input type="text" placeholder='Filter' /></th>
                                    <th><pre>SESSION-END<small>(KM)</small></pre><input type="text" placeholder='Filter' /></th> */}
                                    <th><pre>SESSION START-TIME</pre><input type="text" placeholder='Filter' /></th>
                                    <th><pre>SESSION END-TIME</pre><input type="text" placeholder='Filter' /></th>
                                    <th><pre>EARNINGS</pre><input type="text" placeholder='Filter'onChange={handleSearch} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                   anotherData?.length ? (
                                    anotherData
                                        .slice(pagesVisited,pagesVisited+showDataPerPage)
                                    .map((item,index)=>(
                                    <tr key={index}>
                                        <td><input type="checkbox" name="" id="" /></td> 
                                        <td><BiEditAlt size={19} className='edit-icon'
                                        onClick={()=>openEditModal(item)}
                                        /></td>
                                        <td><RiDeleteBin5Line size={19}
                                        className='deleteIcon'
                                        onClick={()=>handleDeleteModal(item.id)}
                                        /></td>
                                        <td>{item.id}</td>
                                        {/* <td>{moment(item.created_at).format('YYYY-MM-DD').includes(search)}</td> */}
                                        <td><Time time={item.created_at} id={item.id}/></td>
                                        <td>{item.driver_name}</td>
                                        <td>{item.total_distance}</td>
                                        <td>{item.total_time}</td>
                                        <td>{item.no_tours}</td>
                                        <td>{item.no_trips}</td>
                                        <td>{item.driver_mobile}</td>
                                        <td>{item.vehicle_number}</td>
                                        <td>{item.truck_owner_id}</td>
                                        {/* <td>{item.start_odometer_reading}</td>
                                        <td>{item.end_odometer_reading}</td> */}
                                        <td><Time time={item.session_start_time}/></td>
                                        <td>{(item.session_end_time===null)?"":<Time time={item.session_end_time}/>}</td>
                                        <td>{item.final_fare ? item.final_fare:0}</td>

                                    </tr>
                                ))
                                   ):(
                                    data.length==0 ? (
                                        <tr>
                                          <td colSpan={10}>
                                            <div className="loading-spinner-container">
                                              <div className="loading-spinner"></div>
                                              <p style={{ fontSize: "16px" }}>Loading....</p>
                                            </div>
                                          </td>
                                        </tr>
                                      ):
                                    data.
                                    filter((item)=>
                                        item.driver_name?.toLowerCase()?.includes(search)
                                            ||item.driver_mobile?.includes(search)
                                            // ||moment(item.created_at).format("YYYY-MM-DD").includes(moment(searchDate).format("YYYY-MM-DD"))
                                            ||item.vehicle_number?.includes(search)
                                            ||item.id.toString()?.includes(search)
                                            ||item.truck_owner_id?.includes(search)
                                            ||String(item.total_distance)?.includes(search)
                                            ||String(item.total_time)?.includes(search)
                                            ||String(item.no_tours)?.includes(search)
                                            ||String(item.no_trips)?.includes(search)
                                            // ||item.no_tours.toString().includes(search)
                                            // ||item.no_trips.toString().includes(search)
                                            ||String(item.fare)?.includes(search)
                                            )
                                        .slice(pagesVisited,pagesVisited+showDataPerPage)
                                    .map((item,index)=>(
                                    <tr key={index}>
                                        <td><input type="checkbox" name="" id="" /></td> 
                                        <td><BiEditAlt size={19} className='edit-icon'
                                        onClick={()=>openEditModal(item)}
                                        /></td>
                                        <td><RiDeleteBin5Line size={19}
                                        className='deleteIcon'
                                        onClick={()=>handleDeleteModal(item.id)}
                                        /></td>
                                        <td>{item.id}</td>
                                        {/* <td>{moment(item.created_at).format('YYYY-MM-DD').includes(search)}</td> */}
                                        <td><Time time={item.created_at} id={item.id}/></td>
                                        <td>{item.driver_name}</td>
                                        <td>{item.total_distance}</td>
                                        <td>{Math.round(item.total_time)}</td>
                                        <td>{item.no_tours}</td>
                                        <td>{item.no_trips}</td>
                                        <td>{item.driver_mobile}</td>
                                        <td>{item.vehicle_number}</td>
                                        <td>{item.truck_owner_id}</td>
                                        {/* <td>{item.start_odometer_reading}</td>
                                        <td>{item.end_odometer_reading}</td> */}
                                        <td><Time time={item.session_start_time}/></td>
                                        <td>{(item.session_end_time===null)?"":<Time time={item.session_end_time}/>}</td>
                                        <td>{item.final_fare ? item.final_fare:0}</td>

                                    </tr>
                                ))
                                   )    
                                    
                                }
                            </tbody>
                            <tfoot>
                        
                            </tfoot>
                        </Table>
                        </section>
                    
                    
                                 
                    

                    <div className='pagination' style={{position:"relative",marginBottom:"30px",marginTop:"10px"}}>
                         
                        <div className='paginationContainer'>
                        {Boolean(totalCount) && <Pagination
                        pageCount={pageCount}
                        handlePageChange={handlePageChange}
                        pageNumber={pageNumber}/>}
                        </div>

                    </div>

                </div>
            </Layout>
        </div>
    )
}

const Time=({time,id})=>{
    let dat = new Date(time)

    let date=new Date(time).getDate();
    let month=new Date(time).getMonth()+1;
    let year=new Date(time).getFullYear();
    

    const hrs=dat.getHours()
    const minutes=dat.getMinutes()
    const secs=dat.getSeconds();
    const ampm=hrs>=12 ? "PM":"AM"
    const x=(hrs % 12 || 12) +":"+
    (minutes < 10 ? '0' : '') + minutes + ':' +
    (secs < 10 ? '0' : '') + secs + ' ' + ampm;
    // console.log(id,":",date,month,year,":",x);
    return(
        <>
        <p>{date}-{month}-{year} <br /> {x}</p>
        </>
    )
}

export default SessionInfo


