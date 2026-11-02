import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { BiEditAlt, BiChevronDown } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import {RiDeleteBin5Line} from "react-icons/ri"
import { FaArrowRight,FaMapMarkerAlt } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
// CSS....
import "../../styles/Tours/booking.css";
import Layout from "../../components/Layout";
import { Modal, ModalHeader, ModalBody, ModalFooter,Badge } from "reactstrap";
import SearchableDropdown from "../../searchableDropdown";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import UpdateTime from "../Admin/UpdateTime";
import Select from "react-select";
import axios from "axios";
import FareEditModal from "../../FareEditModal";
import WaitingChargeEditModal from "../../WaitingChargeEditModal";
import PaymentTypeEditModal from "../../PaymentTypeEditModal";
import moment from "moment";
import TimeEditModal from "../../TimeEditModal";
import { CSVLink } from "react-csv";
import ReactSelect from "../../ReactSelect";
import { baseUrl } from "../../api/apiConfig";
import BookingsEditModal from "../../components/editModals/BookingsEditModal";
import Pagination from "../../Pagination";
import VegamEditModal from "../../VegamEditModal";
import Tourss from "./Tourss";
import Menus from "../counts/Menus";
import DCEditModal from "../../components/editModals/DCEditModal";
import { useNavigate } from "react-router-dom";
// lodash....
import {debounce} from "lodash"

import {getBookingsData} from "../../store/bookings/action"
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";



const Bookings = () => {
  // const dispatch=useDispatch()
  // const {bookings,bookingsCount}=useSelector((state)=>state.bookingsReducer)
  // console.log(bookings,"--from Redux")
  const navigate=useNavigate()
  const [bookData, setBookData] = useState([]);
  const [loading,setLoading]=useState(false)
  const[error,setError]=useState("")
  const [locationData, setLocationData] = useState([]);
  const [location,setLocation]=useState("")
  const [summ, setSumm] = useState(false);
  const [summ1, setSumm1] = useState(false);
  const [bookCsv, setBookCsv] = useState(false);
  const [bookdata, setBookdata] = useState(false);

  const [startdate, setStartDate] = useState(null);
  const [enddate, setEndDate] = useState(null);
  const [summ_date, setSumm_date] = useState(null);
  const [csvDate, setCsvDate] = useState(null);
  const [csvDate1, setCsvDate1] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingDate1, setBookingDate1] = useState(null);
  

  // Modal date- state
  const [bookingDate2, setBookingDate2] = useState(null);
  const [editTime, setEditTime] = useState(false);
  const [editPayment, setEditPayment] = useState(false);
  const [editfare, setEditfare] = useState(false);
  const [waitingCharges, setWaitingCharges] = useState(false);
  const [dcNumber,setDcNumber] = useState(false);
  //
  const[obj,setObj]=useState({})
  // FOR TBE & SPLIT
    const [disable,setDisable] = useState(false);
    const [declineBtn,setDeclineBtn]=useState(true)
    const [splitdisable,setSplitDisable] = useState(false);
    const[tripId,setTripId]=useState("")
    const[bookingAction,setBookingAction]=useState({value:"TBE"})  
    const[splitOption,setSplitOption]=useState({value:"no split"})  
    const[bookingId,setBookingId]=useState(0)
    const[fare,setFare]=useState(0) 
    //  FARE and DECLINE MODAL
    const[fareModal,setFareModal]=useState(false)
    const[tripDeclineModal,settripDeclineModal]=useState(false)
    const[splitModal,setSplitModal]=useState(false)
    const[dateMessage,setDateMessage]=useState(false)
    const[summaryDownloadBtn,setSummaryDownloadBtn]=useState(false)
    const[errorMessage,setErrorMessage]=useState(false)
    const[url,setUrl]=useState(null)
    const[reportCsv,setReportCsv]=useState(null)
    const[trackReport,setTrackReport]=useState([])
    const[customerList,setCustomerList]=useState([])
    const[value,setValue]=useState(null)
    const[customerId,setCustomerId]=useState(null)
    const[isClearable,setIsClearable]=useState(true)
    const[bookingReport,setBookingReport]=useState([])
    // Filter ...
    const[statusPayload,setStatusPayload]=useState({
      booking_status:localStorage.getItem("bookingStatus")?localStorage.getItem("bookingStatus"):"",
      booking_type:localStorage.getItem("booking_type")?localStorage.getItem("booking_type"):"",
      customer_id:localStorage.getItem("customerId")?localStorage.getItem("customerId"):"",
      driver_name:localStorage.getItem("driverId")?localStorage.getItem("driverId"):"",
      id:localStorage.getItem("bookingId")?localStorage.getItem("bookingId"):"",
      limit:10,
      offset:0,
      status:localStorage.getItem("status")?localStorage.getItem("status"):""

    })
    const[deleteModal,setDeleteModal]=useState(false)
    const[deleteId,setDeleteId]=useState(null)
    const[filterCusList,setFilterCusList]=useState([])
    const[driversList,setDriversList]=useState([])
    const[filterDriverList,setFilterDriverList]=useState([])
    const[customerName,setCustomerName]=useState("")
    const[driverName,setDriverName]=useState("")
    const [edit, setEdit] = useState(false);
    const[editData,setEditData]=useState(null)
    const[pageNumber,setPageNumber]=useState(0)
    const [inputPageNumber, setInputPageNumber] = useState(''); 
    const[totalCount,setTotalCount]=useState(0) 
    const[pagedataCount,setPageDataCount]=useState(10)    
    const [isVegamEdit, setIsVegamEdit] = useState(false);
    const[loadingMsg,setLoadingMsg]=useState(false)
    const[indexNo,setIndexNo]=useState()
    const[tripId2,setTripId2]=useState()
    const[search,setSearch]=useState("")
    const[expandedId,setExpandedId]=useState(null)
    const[reportsOpen,setReportsOpen]=useState(false)
    const[filtersOpen,setFiltersOpen]=useState(false)
    const[notificationShow,setNotificationShow]=useState(false)
    const[currentDateTime,SetCurrentDateTime]=useState(new Date())
    const [ondcSelection,setOndcSelection]=useState(false)




    // For Bookings Edit Modal..
    const handleEdit = (item) => {
      setEdit(!edit);
      setEditData(item)
    };
    const handleVegam = () => {
      setIsVegamEdit(!isVegamEdit)
    }


    const openDeleteModal=(id)=>{
      setDeleteModal(!deleteModal)
      setDeleteId(id)
    }

    // Delete Bookings ..

    const deleteBooking=async()=>{
    try {
      const resp=await axios.post(`${baseUrl}/booking/deleteBooking/${deleteId}`)
      if(resp.data.success){
        alert(resp.data.message)
        getTodayBookings()
        setDeleteModal(false)
      }
      
    } catch (error) {
      console.log(error,"Failed to Delete ?");
      
    }
    }


    






    const filterByStatus=async()=>{
      try {
        setLoading(true)
        const resp=await axios.post(`${baseUrl}/booking/getTodayBookings`,{
          ...statusPayload,limit:showDataPerPage,offset:offset
        });
        console.log("response",resp);
        if(resp.data.success){
          const data=resp.data.data.bookings;
          setBookData(data)
          setTotalCount(resp.data.data.count)
          setPageNumber(0)
        }
        
      } catch (error) {
        console.log(error,"Failed to filter ");
        console.error(error);
        
      }finally{
        setLoading(false)

      }

    }





// Clear Filter status ,,,
    const resetField=()=>{
      window.location.reload();
      localStorage.removeItem("status")
      localStorage.removeItem("bookingId")
      localStorage.removeItem("customerId")
      localStorage.removeItem("driverId")
      localStorage.removeItem("customerObj")
      localStorage.removeItem("driverObj")
      localStorage.removeItem("bookingStatus")
      localStorage.removeItem("booking_type")

      
    }

    const getAllCustomersForFilter=async()=>{
      try {
            const request=await axios.post(`${baseUrl}/users/getAllCustomers`,{limit:600,offset:0})
          if(request.data.success){
            const result=request.data.data.customers
            const filterData=result.map((elem)=>({
              label:`${elem.name}`,
              value:`${elem.id}`
            }))
            setFilterCusList(filterData)
          }else{
  
          }
      } catch (error) {
        console.log(error);
        
      }
      
    }

    const getAllDriversForFilter=async()=>{
        try {
          const resp=await axios.post(`${baseUrl}/driver/getDrivers`,{limit:100,offset:0})
          if(resp.data.success){
            const data=resp.data.data.drivers;
            setDriversList(data)
            const reData=data.map((elem,index)=>({label:elem.name,value:elem.name}))
            setFilterDriverList(reData)
          }
          
        } catch (error) {
          console.log(error);
          
        }     
    }
    console.log("getAllDriversForFilter..",filterDriverList)

    const getcustomerId=(selected)=>{
      setCustomerName(selected)
      setStatusPayload({...statusPayload,customer_id:selected.value})
      localStorage.setItem("customerId",selected.value)
      localStorage.setItem("customerObj",JSON.stringify(selected))
    }

    const getDriverName=(selected)=>{
      console.log(selected)
      setDriverName(selected)
      setStatusPayload({...statusPayload,driver_name:selected.value})
      localStorage.setItem("driverId",selected.value)
      localStorage.setItem("driverObj",JSON.stringify(selected))
    }

    // useEffect(()=>{
    //   getAllCustomersForFilter()
    //   getAllDriversForFilter()
    // },[])

    
  
    
    const handleFareModal_state=()=>{
        setFareModal(!fareModal)
    }
    const handleDeclineModal_state=()=>{
        settripDeclineModal(!tripDeclineModal)
    }
    const handlesplitModal=()=>{
        setSplitModal(!splitModal)
    }

  const handleBookingAction=(event,id)=>{
    setBookingId(id)
    setBookingAction({value:event.target.value})
    setFareModal(true)
    settripDeclineModal(true)
  }

  const handleSplitOption=(event)=>{
    setSplitOption({value:event.target.value})
    setSplitModal(true)

  }
  console.log(splitOption);
  console.log("Bookingid :",bookingId)

  // pagination ..
  const showDataPerPage = pagedataCount;
  const offset = pageNumber * showDataPerPage;
  const pageCount = Math.ceil(totalCount / showDataPerPage);

  // bookingsCount have to replace totalCount

  const outputNumber = totalCount; // Dynamic input number
  const result = [];
  
  if (outputNumber < 10) {
    result.push(10); // Push 10 if the outputNumber is less than 10
  } else {
    let nextMultipleOfTen = Math.ceil(outputNumber / 10) * 10; // Round up to the next multiple of 10
    for (let i = 10; i <= nextMultipleOfTen; i += 10) {
      result.push(i); // Push multiples of 10 up to the next multiple of 10
    }
  }
  
  console.log(result,"result");

  
  const handlePageNumber=(e)=>{
    setInputPageNumber(e.target.value)
    if( e.target.value == ""){
        console.log("no page no")
        setPageNumber(0)
    }
}

console.log(pageNumber)
    const handleGoToPage = () => {
    const pageNumber = parseInt(inputPageNumber);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount) {
        setPageNumber(pageNumber - 1); // Page numbers start from 1, but indexes start from 0
    } else {
      console.error('Invalid page number');
    }

    };

  const handlePageChange=({selected})=>{
      setPageNumber(selected)
  }

  const tripCancellation=async(bookingId)=>{
    console.log("poo - ",bookingId);
    setTripId(bookingId)
    try {
        const response=await axios.post(`${baseUrl}/booking/cancelByManager`,{"booking_id":bookingId},
        {headers:{"Content-Type":"application/json"}})
        console.log("Trip cancellation",response);
        if(response.data.success === true){
            alert(response.data.message)
            settripDeclineModal(false)
            getTodayBookings(statusPayload)
        }
        
    } catch (error) {
        console.log(error.message);
        alert("Failed Cancellation")
        
    }
  }

  

  const submitFare=async ()=>{
    console.log(bookingId,"From Suubmit fare Button");
    try {
        const response=await axios.post(`${baseUrl}/booking/acceptBooking`,
        {"booking_id":bookingId,fare:fare},{
        headers:{"Content-Type":"application/json"}
        })
        if(response.data.success === true){
          getTodayBookings()
            alert("Fare sent Successfully.");
            setFareModal(false)
            
        }
    } catch (error) {
        console.log(error.message);
        alert("sending Fare Failed !")
        
    }
    
  }



  // TBE button function...

  const handletbeConfirmation = async (booking_id) => {
    const result=await axios.post(`${baseUrl}/booking/tbeBooking`,{"booking_id":booking_id},{
        headers:{"Content_type":"application/json"}
    })
    if(result.data.success){
      getTodayBookings()
    }else{
        console.log("something went Wrong");
    }

  };

  // Manual re-broadcast: for a multi-booking group nobody has accepted yet, re-search for
  // nearby drivers at any time instead of waiting for the original 30s dispatch window.
  const [rebroadcastingId, setRebroadcastingId] = useState(null);
  const handleRebroadcast = async (multiBookingId) => {
    setRebroadcastingId(multiBookingId)
    try {
      const resp = await axios.post(`${baseUrl}/booking/rebroadcastDispatch`, { multi_booking_id: multiBookingId })
      alert(resp.data.message)
      if (resp.data.success) {
        getTodayBookings()
      }
    } catch (error) {
      console.log(error, "Failed to re-broadcast");
      alert("Failed to re-broadcast")
    } finally {
      setRebroadcastingId(null)
    }
  }

  const handleConfirmation = async (booking_id) => {
    console.log(booking_id);
    const result=await axios.post(`${baseUrl}/booking/confirmBooking`,{"booking_id":booking_id},{
        headers:{"Content_type":"application/json"}
    })
    console.log(result,"from Tbe");
    console.log(result.data.success);
    if(result.data.success){
      getTodayBookings()
    }else{
        console.log("something went Wrong");
    }
  };
  

  // BY Split and No split....

  const handleSplitConfirmation = async (item,tripId,index) => {
    setIndexNo(index)
    console.log("trip id...", tripId,index);
    console.log(item.id);
    
    
    
    const result=await axios.post(`${baseUrl}/booking/markTrip`,{
    booking_id:tripId});
    console.log(result,"from split");
    if(result.data.success){
      getTodayBookings(statusPayload)
    }else{
        console.log("something Wrong Check");
    }

  };

  const summary = () => {
    setSumm(!summ);
    setDateMessage(false)
    setSummaryDownloadBtn(false)
    setStartDate(null)
    setEndDate(null)
    setErrorMessage(false)
  };
  const summary1 = () => {
    setSumm1(!summ1);
    setSumm_date(null)
    setSummaryDownloadBtn(false)
    setErrorMessage(false)
    setDateMessage(false)
  };
  const bookingCSV = () => {
    setBookCsv(!bookCsv);
    setCsvDate(null)
    setCsvDate1(null)
    setSummaryDownloadBtn(false)
    setErrorMessage(false)
    setDateMessage(false)
  };
  const bookingdata = () => {
    setBookdata(!bookdata);
    setBookingDate(null)
    setBookingDate1(null)
    setSummaryDownloadBtn(false)
    setValue(null)
    setDateMessage(false)
    setErrorMessage(false)
  };
  
  

  // API CALL GET TODAY BOOKINGS DATA...
  const fakedata = {
    pickup_location:
      "#02 Parthasarathypuram 2nd street, Tnagar,chennai District,Tamil Nadu, 600017, India",
    pickup_time: "2023-10-17 05:10:00",
    dropoff_location:
      "KFC, Near Vavin, 1, 1C, Kambar St, Reddipalaiyam, Mogappair, Chennai, Tamil Nadu 600037, India",
    dropoff_time: "2023-10-18 04:00:00",
    commodity_weight: 555,
    receiver_name: "venkatachalam",
    receiver_contact: "8778620133",
    pickup_lat: 13.0405026,
    pickup_long: 80.2336924,
    dropoff_lat: 13.084683,
    dropoff_long: 80.16985,
  };


    useEffect(()=>{
      const intervalId=setInterval(()=>{
        SetCurrentDateTime(new Date())
      },300000) // 10 mins Once update the current date and Time

      return ()=>clearInterval(intervalId)

    },[])

    

  const getTodayBookings = async () => {
    try {
      setLoading(true);
      const request = await axios.post(`${baseUrl}/booking/getTodayBookings`, {
        ...statusPayload,
        limit: showDataPerPage,
        offset: offset,
      });
      const data = request.data.data.bookings;
      
      // Notication Added
      let notification = false;
      let waiting_time=""
      let point=""
      const processedData = data.map((booking) => {
        if (booking.reached_pickup && booking.completed_pickup == null) {
          const reachedPickup = new Date(booking.reached_pickup);
          const reachedPickupPlus15 = new Date(reachedPickup);
          reachedPickupPlus15.setMinutes(reachedPickup.getMinutes() + 30);
          if (currentDateTime > reachedPickupPlus15) {
            const date1=moment(currentDateTime,"ddd MMM DD YYYY HH:mm:ss ZZ")
            const date2=moment(reachedPickup,"ddd MMM DD YYYY HH:mm:ss ZZ")
            const diffInMis=(date2-date1)/(1000*60)
            notification = true;
            const hours = Math.floor(diffInMis / 60);
            const minutes = diffInMis % 60;
            const diffinSecs=date1.diff(date2)
            const duration=moment.duration(diffinSecs)
            const hrs=Math.floor(duration.asHours())
            const mins=duration.minutes()
            const secs=duration.seconds()

            // waiting_time=Math.floor(minutes)
            waiting_time=`${hrs} hr ${mins} mins ${secs} sec`
            point="Pickup"
             
          }
          

        } else if (booking.reached_pickup && booking.completed_pickup && booking.reached_drop == null && booking.completed_drop == null) {
          notification = false;
          waiting_time=""
          point=""
        } else if (booking.reached_pickup && booking.completed_pickup && booking.reached_drop && booking.completed_drop == null) {
          const reachedDrop = new Date(booking.reached_drop);
          const reachedDropPlus15 = new Date(reachedDrop);
          reachedDropPlus15.setMinutes(reachedDrop.getMinutes() + 30);
          if (currentDateTime > reachedDropPlus15) {
            notification = true;
            // const date1=new Date(reachedDrop)
            // const date2=new Date(currentDateTime)
            // const diffInMis=(date2-date1)/(1000*60)
            // const hours = Math.floor(diffInMis / 60);
            // const minutes = diffInMis % 60;
            const date1=moment(currentDateTime,"ddd MMM DD YYYY HH:mm:ss ZZ")
            const date2=moment(reachedDrop,"ddd MMM DD YYYY HH:mm:ss ZZ")
            const diffinHrs=date1.diff(date2,'hours',true)
            const diffinMins=date1.diff(date2,'minutes')
            const diffinSecs=date1.diff(date2)
            const duration=moment.duration(diffinSecs)
            const hrs=Math.floor(duration.asHours())
            const mins=duration.minutes()
            const secs=duration.seconds()

            // waiting_time=Math.floor(minutes)
            waiting_time=`${hrs} hr ${mins} mins ${secs} secs`
            point="Drop"
          } else {
            notification = false;
            waiting_time=""
            point=""
          }
        } else if(booking.reached_pickup && booking.completed_pickup && booking.reached_drop && booking.completed_drop){
          notification=false;
          waiting_time=""
          point=""
        } else {
          notification = false;
          waiting_time=""
          point=""
        }

        return { ...booking, notification ,waiting_time,point};
      });
      console.log(processedData,"processedData")
      setBookData(processedData);
      // setBookData(data);
      setTotalCount(request.data.data.count);
      
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };
  



 

  const handleNotificationClose=(id)=>{
    const updatedData=bookData.map((booking)=>{
      if(booking.id == id){
        return{
          ...booking,
          notification:false,
          point:"",
          waiting_time:""
        }
      }
      return booking
    })
    setBookData(updatedData)
  }



  // DELETE & EDIT- CHECKING FUNCTION..
  
 
  const handleChangeEditTime = () => {
    setEditTime(!editTime);
  };
  
  const handleEditPayment = () => {
    setEditPayment(!editPayment);
  };
  const handleEditFare = () => {
    setEditfare(!editfare);
    
  };

const getObj=(obj)=>{
    setObj(obj);
}

  const handle_waitingCharges = () => {
    setWaitingCharges(!waitingCharges);
  };

  // All Download Btns fn...

  // 1.Daily Summary Btn..

  const getDailySummaryReport = async () => {
  setLoadingMsg(true);
  setErrorMessage(false); // Reset error state

  const reportDate = moment(summ_date).format("YYYY-MM-DD");

  if (reportDate === "Invalid date") {
    setDateMessage(true);
    setLoadingMsg(false);
    return;
  }

  setDateMessage(false);

  try {
    const payload = { report_date: reportDate };
    const response = await axios.post(`${baseUrl}/location/daySummaryReports`, payload);

    if (response.data.success) {
      setSummaryDownloadBtn(true);
      setUrl(response.data.data.report);
    } else {
      setErrorMessage(true);
    }
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    setErrorMessage(true);
  } finally {
    setLoadingMsg(false);
  }
};


  // 2.Tracking Records Btn..
  const getTrackingReports=async()=>{
    const payload={
      start_date:moment(startdate).format("YYYY-MM-DD"),
      end_date:moment(enddate).format("YYYY-MM-DD"),
      limit:1000
    }
    console.log(payload,"payload");
    if(payload.start_date =="Invalid date" || payload.end_date =="Invalid date" ){
      setDateMessage(true)
    }else{
      setDateMessage(false)
      try {
        const request=await axios.post(`${baseUrl}/booking/getBookingsReport`,payload)
        if(request.data.success){
          setSummaryDownloadBtn(true)
          const result=request.data.data.bookings
          setTrackReport(result)
        }
        else{
          setErrorMessage(true)

        }
        
      } catch (error) {
        console.log(error);
        
      }

    }
    
  }
  
  // 3. Export Booking csv Btn...
  const getBookingsReportCsv=async()=>{
    const payload={
      start_date:moment(csvDate).format("YYYY-MM-DD"),
      end_date:moment(csvDate1).format("YYYY-MM-DD"),
    }
    if(payload.start_date =="Invalid date" || payload.end_date =="Invalid date" ){
      setDateMessage(true)
    }else{
      setDateMessage(false)
      try {
         setLoadingMsg(true)
         let request;
         if(ondcSelection){
            request=await axios.post(`${baseUrl}/booking/exportONDCInvoiceBookingsCsv`,payload)
         }else{
           request=await axios.post(`${baseUrl}/booking/exportInvoiceBookingsCsv`,payload)
         }
          if(request.data.success){
            setSummaryDownloadBtn(true)
            const result=request.data.data
            setReportCsv(result)
            // alert(request.data.message)
            alert("Report Generated Successfully.")
          }
          else{
            setErrorMessage(true)

          }
      } catch (error) {
        console.log(error);
      }finally{
        setLoadingMsg(false)
      }

    }
    
  }

  // 4.Export Booking Data Button ..

  const getAllCustomers=async()=>{
    try {
          const request=await axios.post(`${baseUrl}/users/getAllCustomers`,{limit:600,offset:0})
        if(request.data.success){
          const result=request.data.data.customers
          const data=result.map((elem)=>({
            label:`${elem.name}-${elem.mobile}`,
            value:`${elem.id}`
          }))
          setCustomerList(data);
          const filterData=result.map((elem)=>({
            label:`${elem.name}`,
            value:`${elem.id}`
          }))
          setFilterCusList(filterData)
        }else{

        }
    } catch (error) {
      console.error(error,error.message)
      
    }
    
  }

  const handleSelectedOption=(selected)=>{
    setValue(selected)
    setCustomerId(selected.value)
  }

  const getBookingDataReport=async()=>{
    const payload={
      start_date:moment(bookingDate).format("YYYY-MM-DD"),
      end_date:moment(bookingDate1).format("YYYY-MM-DD"),
      customer_id:customerId,
      limit:5000
    }

    if(payload.start_date=="Invalid date"||payload.end_date=="Invalid date"||payload.customer_id==null){
      setDateMessage(true)

    }else{
      setDateMessage(false)
      try {
        const request=await axios.post(`${baseUrl}/booking/getBookingsDetails`,payload)
        console.log(request.data.success);
      if(request.data.success){
        const result=request.data.data.bookings;
        setBookingReport(result)
        setSummaryDownloadBtn(true)

      }else{
        setErrorMessage(true)

      }
      
    } catch (error) {
      console.log(error);
      
    }
    }
  }
  const handleDcNumber=()=>{
    setDcNumber(!dcNumber)
  }

  const getNotification=(bookings)=>{
      console.log(";;;;;")
  }
 


  useEffect(()=>{
    getAllCustomersForFilter()
    getAllDriversForFilter()
  },[])
  


 
  const pendingCreatedBookings = bookData.filter(item => item.status === "Pending" && item.booking_status === "Created");
  const confirmedConfirmedBookings = bookData.filter(item => item.status === "Confirmed" && item.booking_status === "Confirmed");
  const nonFilteredBookings = bookData.filter(item => !((item.status === "Pending" && item.booking_status === "Created") || (item.status === "Confirmed" && item.booking_status === "Confirmed")));
  const sortedBookings = [...confirmedConfirmedBookings, ...pendingCreatedBookings, ...nonFilteredBookings];

 

  useEffect(() => {

    getTodayBookings({...statusPayload,limit:showDataPerPage,offset:offset});
  }, [offset,currentDateTime,pagedataCount]);
  //currentDateTime 
  // pagedataCount,pageNumber,bookData?.length,

  const customOrder = ["Pending", "Confirmed", "Accepted", "Canceled By Manager"];
  
  const handleOndcSelection=(e)=>{
    // e.preventDefault()
    setOndcSelection(e.target.checked)
    setSummaryDownloadBtn(false)
  }
  console.log("ondcSelection..",ondcSelection)
  

  const isCanceled = (item) =>
    item.booking_canceled_by_manager || item.booking_canceled_by_customer;

  const statusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending")   return "bg-yellow-100 text-yellow-700";
    if (s === "confirmed") return "bg-blue-100 text-blue-700";
    if (s === "accepted")  return "bg-green-100 text-green-700";
    if (s.includes("cancel")) return "bg-red-100 text-red-600";
    if (s.includes("complet")) return "bg-brand-50 text-brand-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-4" id="bookingComp">
      <Menus bookingCount={totalCount}/>
      {/* <Menus bookingCount={totalCount}/> */}
      {/* Top bar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
          <input
            type="text"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Mobile: single Reports dropdown button */}
        <div className="relative sm:hidden">
          <button onClick={() => setReportsOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl transition-colors"
            style={{width:"auto"}}>
            Reports
            <BiChevronDown size={14} className={`transition-transform ${reportsOpen ? "rotate-180" : ""}`}/>
          </button>
          {reportsOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-card-md z-50 min-w-[170px] py-1 overflow-hidden">
              {[
                { label: "Tracking Records",    fn: summary },
                { label: "Daily Summary",       fn: summary1 },
                { label: "Export Booking Data", fn: () => { bookingdata(); getAllCustomers(); } },
                { label: "Export Booking CSV",  fn: bookingCSV },
              ].map(({ label, fn }) => (
                <button key={label} onClick={() => { fn(); setReportsOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  style={{background:"transparent"}}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile: Filters toggle */}
        <button onClick={() => setFiltersOpen(o => !o)}
          className="sm:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl transition-colors"
          style={{width:"auto",background:"white"}}>
          Filters
          <BiChevronDown size={14} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}/>
        </button>

        {/* Desktop: all report buttons */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {[
            { label: "Tracking Records",    fn: summary },
            { label: "Daily Summary",       fn: summary1 },
            { label: "Export Booking Data", fn: () => { bookingdata(); getAllCustomers(); } },
            { label: "Export Booking CSV",  fn: bookingCSV },
          ].map(({ label, fn }) => (
            <button key={label} onClick={fn}
              className="px-3 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
              style={{width:"auto"}}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* 1. Tracking Records Modal */}
      <Modal isOpen={summ} toggle={summary} centered>
        <ModalHeader toggle={summary} className="border-0 pb-0">
          <span className="text-lg font-semibold text-gray-900">Tracking Records</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6">
          <p className="text-sm text-gray-500 mb-3">Select date range</p>
          <div className="flex gap-3 mb-4">
            <DatePicker placeholderText="Start Date" selected={startdate} onChange={setStartDate} dateFormat="yyyy-MM-dd"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"/>
            <DatePicker placeholderText="End Date" selected={enddate} onChange={setEndDate} dateFormat="yyyy-MM-dd"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"/>
          </div>
          {dateMessage && <p className="text-xs text-red-500 mb-2">Please choose a date range</p>}
          {errorMessage && <p className="text-xs text-red-500 mb-2">No records found</p>}
          <div className="flex gap-2">
            <button onClick={getTrackingReports} className="px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>Filter</button>
            {summaryDownloadBtn && <CSVLink data={trackReport} target="_blank" filename="Bookings Record.csv"
              className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors" style={{textDecoration:"none"}}>Download</CSVLink>}
          </div>
        </ModalBody>
      </Modal>

      {/* 2. Daily Summary Modal */}
      <Modal isOpen={summ1} toggle={summary1} centered>
        <ModalHeader toggle={summary1} className="border-0 pb-0">
          <span className="text-lg font-semibold text-gray-900">Daily Summary</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6">
          <p className="text-sm text-gray-500 mb-3">Select report date</p>
          <div className="mb-4">
            <DatePicker placeholderText="Choose date" selected={summ_date} onChange={setSumm_date} dateFormat="yyyy-MM-dd"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"/>
          </div>
          {dateMessage && <p className="text-xs text-red-500 mb-2">Please choose a date</p>}
          {errorMessage && <p className="text-xs text-red-500 mb-2">No records found</p>}
          {loadingMsg && <p className="text-xs text-gray-400 mb-2">Loading...</p>}
          <div className="flex gap-2">
            <button onClick={getDailySummaryReport} className="px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>Filter</button>
            {summaryDownloadBtn && <a href={url} target="_blank"
              className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors" style={{textDecoration:"none"}}>Download</a>}
          </div>
        </ModalBody>
      </Modal>

      {/* 3. Export Booking Data Modal */}
      <Modal isOpen={bookdata} toggle={bookingdata} centered>
        <ModalHeader toggle={bookingdata} className="border-0 pb-0">
          <span className="text-lg font-semibold text-gray-900">Export Booking Data</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6">
          <p className="text-sm text-gray-500 mb-1">Customer</p>
          <div className="mb-4">
            <ReactSelect value={value} isClearable={isClearable} placeholder="Choose customer"
              options={customerList} isMulti={false} handleSelectedOption={handleSelectedOption}/>
          </div>
          <p className="text-sm text-gray-500 mb-3">Period of time</p>
          <div className="flex gap-3 mb-4">
            <DatePicker selected={bookingDate} onChange={setBookingDate} dateFormat="yyyy-MM-dd" placeholderText="From"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"/>
            <DatePicker selected={bookingDate1} onChange={setBookingDate1} dateFormat="yyyy-MM-dd" placeholderText="To"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"/>
          </div>
          {dateMessage && <p className="text-xs text-red-500 mb-2">Please fill all fields</p>}
          {errorMessage && <p className="text-xs text-red-500 mb-2">No records found</p>}
          <div className="flex gap-2">
            <button onClick={getBookingDataReport} className="px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>Filter</button>
            {summaryDownloadBtn && <CSVLink filename="Bookings.csv" data={bookingReport} target="_blank"
              className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors" style={{textDecoration:"none"}}>Download</CSVLink>}
          </div>
        </ModalBody>
      </Modal>

      {/* 4. Export Booking CSV Modal */}
      <Modal isOpen={bookCsv} toggle={bookingCSV} centered>
        <ModalHeader toggle={bookingCSV} className="border-0 pb-0">
          <span className="text-lg font-semibold text-gray-900">Export Booking CSV</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
            <input type="checkbox" name="ondc" id="ondc" checked={ondcSelection} onChange={handleOndcSelection} className="w-4 h-4 accent-brand-500"/>
            ONDC report
          </label>
          <p className="text-sm text-gray-500 mb-3">Select date range</p>
          <div className="flex gap-3 mb-4">
            <DatePicker selected={csvDate} onChange={setCsvDate} dateFormat="yyyy-MM-dd" placeholderText="From"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"/>
            <DatePicker selected={csvDate1} onChange={setCsvDate1} dateFormat="yyyy-MM-dd" placeholderText="To"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"/>
          </div>
          {dateMessage && <p className="text-xs text-red-500 mb-2">Please choose a date range</p>}
          {errorMessage && <p className="text-xs text-red-500 mb-2">No records found</p>}
          {loadingMsg && <p className="text-xs text-gray-400 mb-2">Loading...</p>}
          <div className="flex gap-2">
            <button onClick={getBookingsReportCsv} className="px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>Filter</button>
            {summaryDownloadBtn && <a href={reportCsv} target="_blank"
              className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors" style={{textDecoration:"none"}}>Download</a>}
          </div>
        </ModalBody>
      </Modal>

      

      <BookingsEditModal
      isOpen={edit}
      toggle={handleEdit}
      editData={editData}
      getTodayBookings={getTodayBookings}
      />



      {
        (bookingAction.value ==="TBE") ? ("")
        :bookingAction.value === "Fare"?(<div id="FareModal">
            <Modal isOpen={fareModal} id="FareModal-mobile">
                <ModalHeader 
                className="modal-header"
                style={{ border: "none" }}
                toggle={handleFareModal_state}>Enter Fare :</ModalHeader>
                <ModalBody>
                <div className="fare-modal-body">
                <input
                    type="number"
                    min="0"
                    placeholder="Enter Your Fare"
                    value={fare}
                    onChange={(event)=>setFare(event.target.value)}
                />
                <div>
                    <button onClick={submitFare}>confirm</button>
                </div>
                </div>
                </ModalBody>
            </Modal>
        </div>)
        :bookingAction.value === "Decline"?(
            <div id="TripDeclineModal">
                <Modal isOpen={tripDeclineModal} id="TripDeclineModal-mobile">
                    <ModalHeader 
                    className="modal-header"
                    style={{ border: "none" }}
                    toggle={handleDeclineModal_state}>Confirm Decline :</ModalHeader>
                    <ModalBody>
                    <div className="fare-modal-body">
                        <button onClick={()=>tripCancellation(bookingId)}>Decline</button>
                    </div>
                    </ModalBody>
                </Modal>
            </div>
        ):""
      }
      {
        (splitOption.value === "split")?(<div>
            <Modal isOpen={splitModal}>
                <ModalHeader 
                className="modal-header"
                style={{ border: "none" }}
                toggle={handlesplitModal}>
                    split Logic
                </ModalHeader>
                <ModalBody>
                    
                </ModalBody>
            </Modal>
        </div>):""
      }

      {/* Filter panel — always open on desktop, collapsible on mobile */}
      <div className={`sm:block ${filtersOpen ? "block" : "hidden"}`}>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-card">
          {/* Mobile: 2-column grid */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            <input type="text" placeholder="Search by Id"
              value={statusPayload.id}
              onChange={(e) => { setStatusPayload({...statusPayload, id: e.target.value}); localStorage.setItem("bookingId", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 col-span-2"
            />
            <div className="col-span-2">
              <ReactSelect isMulti={false}
                value={localStorage.getItem("customerObj") ? JSON.parse(localStorage.getItem("customerObj")) : ""}
                handleSelectedOption={getcustomerId} options={filterCusList} placeholder="Customer"/>
            </div>
            <div className="col-span-2">
              <ReactSelect isMulti={false}
                value={localStorage.getItem("driverObj") ? JSON.parse(localStorage.getItem("driverObj")) : ""}
                handleSelectedOption={getDriverName} options={filterDriverList} placeholder="Driver"/>
            </div>
            <select value={statusPayload.booking_type}
              onChange={(e) => { setStatusPayload({...statusPayload, booking_type: e.target.value.trim()}); localStorage.setItem("booking_type", e.target.value.trim()); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Type</option>
              <option value="GoodMove">GoodMove</option>
              <option value="ONDC">ONDC</option>
            </select>
            <select value={statusPayload.status}
              onChange={(e) => { setStatusPayload({...statusPayload, status: e.target.value}); localStorage.setItem("status", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Status</option>
              <option value="Accepted">Accepted</option>
              <option value="Canceled By Manager">Cancelled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
            </select>
            <select value={statusPayload.booking_status}
              onChange={(e) => { setStatusPayload({...statusPayload, booking_status: e.target.value}); localStorage.setItem("bookingStatus", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 col-span-2">
              <option value="">Booking Status</option>
              {["Accepted","Cancelled By Manager","Completed drop","Completed pickup","Confirmed","Created","Fare","Pending","Reached drop","Reached pickup","Tour Completed","Tour Created","Trip Created"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => { filterByStatus(); setFiltersOpen(false); }}
              className="py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>Apply</button>
            <button onClick={() => { resetField(); setFiltersOpen(false); }}
              className="py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl transition-colors" style={{width:"auto",background:"white",color:"#4b5563"}}>Clear</button>
          </div>

          {/* Desktop: original flex-wrap row */}
          <div className="hidden sm:flex flex-wrap gap-3 items-end">
            <input type="text" placeholder="Search by Id"
              value={statusPayload.id}
              onChange={(e) => { setStatusPayload({...statusPayload, id: e.target.value}); localStorage.setItem("bookingId", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-32 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <div className="w-44">
              <ReactSelect isMulti={false}
                value={localStorage.getItem("customerObj") ? JSON.parse(localStorage.getItem("customerObj")) : ""}
                handleSelectedOption={getcustomerId} options={filterCusList} placeholder="Search customer"/>
            </div>
            <div className="w-48">
              <ReactSelect isMulti={false}
                value={localStorage.getItem("driverObj") ? JSON.parse(localStorage.getItem("driverObj")) : ""}
                handleSelectedOption={getDriverName} options={filterDriverList} placeholder="Search driver"/>
            </div>
            <select value={statusPayload.booking_type}
              onChange={(e) => { setStatusPayload({...statusPayload, booking_type: e.target.value.trim()}); localStorage.setItem("booking_type", e.target.value.trim()); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Booking Type</option>
              <option value="GoodMove">GoodMove</option>
              <option value="ONDC">ONDC</option>
            </select>
            <select value={statusPayload.status}
              onChange={(e) => { setStatusPayload({...statusPayload, status: e.target.value}); localStorage.setItem("status", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Choose Status</option>
              <option value="Accepted">Accepted</option>
              <option value="Canceled By Manager">Cancelled By Manager</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
            </select>
            <select value={statusPayload.booking_status}
              onChange={(e) => { setStatusPayload({...statusPayload, booking_status: e.target.value}); localStorage.setItem("bookingStatus", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Booking Status</option>
              {["Accepted","Cancelled By Manager","Completed drop","Completed pickup","Confirmed","Created","Fare","Pending","Reached drop","Reached pickup","Tour Completed","Tour Created","Trip Created"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={filterByStatus} className="px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>Filter</button>
            <button onClick={resetField} className="px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" style={{width:"auto",background:"white",color:"#4b5563"}}>Clear</button>
          </div>
        </div>
      </div>


      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered size="sm">
        <ModalBody className="px-6 py-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RiDeleteBin5Line size={22} className="text-red-500"/>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Delete booking?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteModal(false)}
                className="px-5 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors" style={{width:"auto",background:"white",color:"#4b5563"}}>Cancel</button>
              <button onClick={deleteBooking}
                className="px-5 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>Delete</button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Time & Fare & Waiting charges Modal */}
      <TimeEditModal
       editTime={editTime} handleChangeEditTime={handleChangeEditTime}  item={obj}
        initialFunction={getTodayBookings} params={statusPayload}/>
      <PaymentTypeEditModal 
        editPayment={editPayment} handleEditPayment={handleEditPayment} item={obj}
        initialFunction={getTodayBookings} params={statusPayload}
        />
      <FareEditModal
       editfare={editfare} handleEditFare={handleEditFare} item={obj}
        initialFunction={getTodayBookings} params={statusPayload}
        />
       <WaitingChargeEditModal 
        waitingCharges={waitingCharges} 
        handle_waitingCharges={handle_waitingCharges} item={obj}
        initialFunction={getTodayBookings} params={statusPayload}/>               

      <VegamEditModal isOpen={isVegamEdit} 
        initialFunction={getTodayBookings}
        handleVegam={handleVegam} item={obj}/>

        <DCEditModal dcNumber={dcNumber} handleDcNumber={handleDcNumber}  
        initialFunction={getTodayBookings} item={obj}/>
      {/* TABLE — commented out, replaced by card rows below
      <div className="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" id="BookingTable" style={{minWidth:"2200px"}}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Edit","Del","Alert","ID","Tour ID","Type","Action","Split","Customer","Company",
                  "Pickup Location","Pickup Time","Drop Location","Driver",
                  "Reached Pickup","Picked Up","Reached Drop","Delivered","Edit Time",
                  "Weight","Cus DC","Drv DC","Status","Tour Status","Pay Type","Pay Status",
                  "Est Fare","Fare Coll.","Wait Chg","Vivegam","Info","Loading","Unloading","Both L&U"
                ].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={34}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-sm text-gray-400">Loading bookings...</p>
                  </div>
                </td></tr>
              ) : bookData.length > 0 ? (
                bookData
                  .filter(item => item.customer_name?.toLowerCase().includes(search.toLowerCase()) || item.driver_name?.toLowerCase().includes(search.toLowerCase()))
                  .map((item, index) => {
                    const canceled = isCanceled(item);
                    const rowBase = canceled ? "bg-gray-50 opacity-70" : (index % 2 === 0 ? "bg-white" : "bg-gray-50/50");
                    const td = `px-3 py-2 whitespace-nowrap align-middle ${canceled ? "text-gray-400" : "text-gray-700"}`;
                    return (
                      <tr key={index} className={`${rowBase} border-b border-gray-100 hover:bg-brand-50/30 transition-colors`}>
                        <td className={td}>
                          <BiEditAlt size={16} className="cursor-pointer text-gray-400 hover:text-brand-500 transition-colors" onClick={() => handleEdit(item)}/>
                        </td>
                        <td className={td}>
                          <RiDeleteBin5Line size={16} className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors" onClick={() => openDeleteModal(item.id)}/>
                        </td>
                        <td className={td}>
                          {item.notification && (
                            <span onClick={() => handleNotificationClose(item.id)}
                              className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full cursor-pointer whitespace-nowrap">
                              <IoMdClose size={12}/> Delay @ {item.point}
                            </span>
                          )}
                        </td>
                        <td className={`${td} font-medium text-gray-900`}>{item.id}</td>
                        <td className={td}>{item.tour_id || "—"}</td>
                        <td className={td}>
                          {item.booking_type && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">{item.booking_type}</span>}
                        </td>
                        <td className={td}>
                          {item.estimated_fare == 0 && item.fare === null && item.booking_confirm_status == 0 && !item.booking_canceled_by_manager ? (
                            <div className="flex items-center gap-1">
                              <select value={bookingAction} onChange={(e) => handleBookingAction(e, item.id)}
                                className="text-xs border border-gray-200 rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                <option value="TBE">TBE</option>
                                <option value="Fare">Fare</option>
                                <option value="Decline">Decline</option>
                              </select>
                              <button onClick={() => handletbeConfirmation(item.id)}
                                className="text-xs bg-brand-500 hover:bg-brand-600 text-white px-2 py-1 rounded-lg transition-colors" style={{width:"auto"}}>OK</button>
                            </div>
                          ) : item.fare == null && item.estimated_fare != 0 && item.booking_canceled_by_manager == 0 && item.booking_confirm_status == 0 ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleConfirmation(item.id)}
                                className="text-xs bg-brand-500 hover:bg-brand-600 text-white px-2 py-1 rounded-lg transition-colors" style={{width:"auto"}}>Confirm</button>
                              <button onClick={() => tripCancellation(item.id)}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition-colors" style={{width:"auto"}}>Decline</button>
                            </div>
                          ) : null}
                        </td>
                        <td className={td}>
                          {(!item.marked_as_trip && !item.booking_canceled_by_manager && !item.booking_canceled_by_customer) && (
                            <div className="flex items-center gap-1">
                              <select value={splitOption.value} onChange={(e) => handleSplitOption(e, item.id)}
                                className="text-xs border border-gray-200 rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                <option value="no split">No Split</option>
                                <option value="split">Split</option>
                              </select>
                              <button onClick={() => handleSplitConfirmation(item, item.id, index)}
                                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-lg transition-colors" style={{width:"auto"}}>OK</button>
                            </div>
                          )}
                        </td>
                        <td className={`${td} font-medium`}>{item.customer_name}</td>
                        <td className={td}>{item.company_name}</td>
                        <td className={`${td} max-w-[160px] truncate`} title={item.pickup_location}>{item.pickup_location}</td>
                        <td className={td}>{item.pickup_time}</td>
                        <td className={`${td} max-w-[160px] truncate`} title={item.dropoff_location}>{item.dropoff_location}</td>
                        <td className={td}>
                          <div className="flex items-center gap-1">
                            {(item.id && item.tour_id) && (
                              <FaMapMarkerAlt size={14} className="text-brand-500 cursor-pointer flex-shrink-0"
                                onClick={() => navigate(`/dashboard/tours/bookings/${item.id}`)}/>
                            )}
                            <span>{item.driver_name}</span>
                            {(item.multi_booking_id && !item.tour_id && !canceled) && (
                              <button onClick={() => handleRebroadcast(item.multi_booking_id)}
                                disabled={rebroadcastingId === item.multi_booking_id}
                                className="text-xs bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-2 py-1 rounded-lg transition-colors" style={{width:"auto"}}>
                                {rebroadcastingId === item.multi_booking_id ? "..." : "Re-broadcast"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className={td}>{item.reached_pickup || ""}</td>
                        <td className={td}>{item.completed_pickup || ""}</td>
                        <td className={td}>{item.reached_drop || ""}</td>
                        <td className={td}>{item.completed_drop || ""}</td>
                        <td className={td}>
                          <BiEditAlt size={15} className="cursor-pointer text-gray-400 hover:text-brand-500 transition-colors"
                            onClick={() => { handleChangeEditTime(); getObj(item); }}/>
                        </td>
                        <td className={td}>{item.commodity_weight} {item.weight_unit == 12 ? "Kg" : "Cu.ft"}</td>
                        <td className={td}>
                          <div className="flex items-center gap-1">
                            {item.dcNumber}
                            {item.dcNumber && <BiEditAlt size={14} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleDcNumber(); getObj(item); }}/>}
                          </div>
                        </td>
                        <td className={td}>
                          <div className="flex items-center gap-1">
                            {item.tdcNumber}
                            {item.tdcNumber && <BiEditAlt size={14} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleDcNumber(); getObj(item); }}/>}
                          </div>
                        </td>
                        <td className={td}>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor(item.status)}`}>{item.status}</span>
                        </td>
                        <td className={td}>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor(item.booking_status)}`}>{item.booking_status}</span>
                        </td>
                        <td className={td}>
                          {(item.is_regular === true && item.payment_status === "Pending") ? "TBE" : item.payment_type}
                          {" - "}
                          {item.payment_made_by === "other_party_pay" ?
                            (item.trip_type === "oneway" && item.booking_for === "pickup") ? (item.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid") :
                            (item.trip_type === "oneway" && item.booking_for === "drop") ? (item.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid") :
                            (item.trip_type === "round" && item.booking_for === "pickup") ? (item.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid") :
                            (item.trip_type === "round" && item.booking_for === "drop") ? (item.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid") : "" :
                            item.payment_made_by === "pay_at_pickup" ? (item.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid") :
                            item.payment_made_by === "pay_at_drop" ? (item.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid") :
                            item.payment_made_by === "ill_pay" ? (item.payment_status?.toLowerCase() !== "completed" ? "Customer choose to pay" : "Customer paid") :
                            item.payment_made_by}
                        </td>
                        <td className={td}>
                          <div className="flex items-center gap-1">
                            <BiEditAlt size={15} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleEditPayment(); getObj(item); }}/>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor(item.payment_status)}`}>{item.payment_status}</span>
                          </div>
                        </td>
                        <td className={td}>
                          <div className="flex items-center gap-1">
                            <BiEditAlt size={15} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleEditFare(); getObj(item); }}/>
                            {item.booking_type === "ONDC" && item.multi_booking_id ? item.estimated_fare :
                              (item.booking_type === null && item.multi_booking_id ? item.total_booking_fare : item.fare)}
                          </div>
                        </td>
                        <td className={td}>
                          {item.booking_type === "ONDC" && item.multi_booking_id ? item.requestInfo?.collection_amount :
                            (item.booking_type === null && item.multi_booking_id ? item.amount_collected : item.fare)}
                        </td>
                        <td className={td}>
                          <div className="flex items-center gap-1">
                            <BiEditAlt size={15} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handle_waitingCharges(); getObj(item); }}/>
                            {item.waiting_charge}
                          </div>
                        </td>
                        <td className={td}>
                          <div className="flex items-center gap-1">
                            <BiEditAlt size={15} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleVegam(); getObj(item); }}/>
                            <span className={item.is_vivegam ? "text-brand-600 font-medium" : ""}>{item.is_vivegam ? "Yes" : "No"}</span>
                          </div>
                        </td>
                        <td className={`${td} max-w-[120px] truncate`} title={item.instruction}>{item.instruction}</td>
                        <td className={td}><span className={item.loading_charge_applicable ? "text-green-600 font-medium" : "text-gray-400"}>{item.loading_charge_applicable ? "Yes" : "No"}</span></td>
                        <td className={td}><span className={item.unloading_charge_applicable ? "text-green-600 font-medium" : "text-gray-400"}>{item.unloading_charge_applicable ? "Yes" : "No"}</span></td>
                        <td className={td}><span className={item.both_loading_unloading_charge_applicable ? "text-green-600 font-medium" : "text-gray-400"}>{item.both_loading_unloading_charge_applicable ? "Yes" : "No"}</span></td>
                      </tr>
                    );
                  })
              ) : (
                <tr><td colSpan={34}>
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-sm text-gray-400">No bookings found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      TABLE COMMENT END — */}

      {/* Card rows */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-gray-100">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-gray-400">Loading bookings...</p>
          </div>
        ) : bookData.filter(item =>
            item.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.driver_name?.toLowerCase().includes(search.toLowerCase())
          ).length > 0 ? (
          bookData
            .filter(item =>
              item.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
              item.driver_name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((item, index) => {
              const canceled = isCanceled(item);
              const isExpanded = expandedId === item.id;

              const fare = item.booking_type === "ONDC" && item.multi_booking_id
                ? item.estimated_fare
                : (item.booking_type === null && item.multi_booking_id ? item.total_booking_fare : item.fare);

              const fareCollected = item.booking_type === "ONDC" && item.multi_booking_id
                ? item.requestInfo?.collection_amount
                : (item.booking_type === null && item.multi_booking_id ? item.amount_collected : item.fare);

              const paymentLabel =
                item.payment_made_by === "other_party_pay" ?
                  (item.trip_type === "oneway" && item.booking_for === "pickup") ? (item.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid") :
                  (item.trip_type === "oneway" && item.booking_for === "drop") ? (item.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid") :
                  (item.trip_type === "round" && item.booking_for === "pickup") ? (item.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid") :
                  (item.trip_type === "round" && item.booking_for === "drop") ? (item.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid") : "" :
                item.payment_made_by === "pay_at_pickup" ? (item.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid") :
                item.payment_made_by === "pay_at_drop" ? (item.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid") :
                item.payment_made_by === "ill_pay" ? (item.payment_status?.toLowerCase() !== "completed" ? "Customer choose to pay" : "Customer paid") :
                item.payment_made_by;

              const canRebroadcast = item.multi_booking_id && !item.tour_id && !canceled;

              const needsAction =
                (item.estimated_fare == 0 && item.fare === null && item.booking_confirm_status == 0 && !item.booking_canceled_by_manager) ||
                (item.fare == null && item.estimated_fare != 0 && item.booking_canceled_by_manager == 0 && item.booking_confirm_status == 0) ||
                (!item.marked_as_trip && !canceled) ||
                canRebroadcast;

              return (
                <div key={item.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                    canceled ? "border-gray-100 opacity-60" : isExpanded ? "border-brand-300 shadow-card-md" : "border-gray-200 hover:border-gray-300 hover:shadow-card"
                  }`}>

                  {/* ── Summary row ── */}
                  <div className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}>

                    {/* ── MOBILE layout (hidden on sm+) ── */}
                    <div className="sm:hidden">
                      {/* Top line: ID + badges + fare + actions */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="text-sm font-bold text-gray-900">#{item.id}</span>
                          {item.booking_type && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{item.booking_type}</span>
                          )}
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(item.status)}`}>{item.status}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-sm font-bold text-gray-900">₹{fare ?? "—"}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                            className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                            <BiEditAlt size={15}/>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openDeleteModal(item.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                            <RiDeleteBin5Line size={15}/>
                          </button>
                          <BiChevronDown size={17} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}/>
                        </div>
                      </div>
                      {/* Customer + company */}
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.customer_name || "—"}
                        {item.company_name && <span className="text-xs font-normal text-gray-500 ml-1">· {item.company_name}</span>}
                      </p>
                      {/* Route */}
                      <div className="mt-1 space-y-0.5">
                        <div className="flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></span>
                          <p className="text-xs font-semibold text-gray-800 leading-snug">{item.pickup_location || "—"}</p>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></span>
                          <p className="text-xs font-semibold text-gray-800 leading-snug">{item.dropoff_location || "—"}</p>
                        </div>
                      </div>
                      {/* Driver + time + notification */}
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {(item.id && item.tour_id) && (
                          <FaMapMarkerAlt size={11} className="text-brand-500 cursor-pointer flex-shrink-0"
                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/tours/bookings/${item.id}`); }}/>
                        )}
                        <span className="text-xs text-gray-500">{item.driver_name || "No driver"}{item.pickup_time ? ` · ${item.pickup_time}` : ""}</span>
                        {item.notification && (
                          <span onClick={(e) => { e.stopPropagation(); handleNotificationClose(item.id); }}
                            className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full cursor-pointer">
                            <IoMdClose size={10}/> Delay @ {item.point}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── DESKTOP layout (hidden on mobile) ── */}
                    <div className="hidden sm:flex items-center gap-4">
                      {/* ID + type */}
                      <div className="flex-shrink-0 w-20">
                        <p className="text-sm font-bold text-gray-900">#{item.id}</p>
                        {item.booking_type && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mt-0.5 inline-block">{item.booking_type}</span>
                        )}
                      </div>
                      {/* Customer + route + driver grid */}
                      <div className="flex-1 grid grid-cols-3 gap-4 min-w-0">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">Customer</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{item.customer_name || "—"}</p>
                          <p className="text-xs text-gray-500 truncate">{item.company_name}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-1">Route</p>
                          <div className="flex items-start gap-1.5 mb-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></span>
                            <p className="text-sm font-semibold text-gray-800 truncate" title={item.pickup_location}>{item.pickup_location || "—"}</p>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></span>
                            <p className="text-sm font-semibold text-gray-800 truncate" title={item.dropoff_location}>{item.dropoff_location || "—"}</p>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">Driver · {item.pickup_time}</p>
                          <div className="flex items-center gap-1">
                            {(item.id && item.tour_id) && (
                              <FaMapMarkerAlt size={12} className="text-brand-500 cursor-pointer flex-shrink-0"
                                onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/tours/bookings/${item.id}`); }}/>
                            )}
                            <p className="text-sm text-gray-700 truncate">{item.driver_name || "—"}</p>
                          </div>
                        </div>
                      </div>
                      {/* Right: notification + status + fare + actions + chevron */}
                      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                        {item.notification && (
                          <span onClick={(e) => { e.stopPropagation(); handleNotificationClose(item.id); }}
                            className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full cursor-pointer whitespace-nowrap">
                            <IoMdClose size={11}/> Delay @ {item.point}
                          </span>
                        )}
                        <div className="text-right">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(item.status)}`}>{item.status}</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">₹ {fare ?? "—"}</p>
                        </div>
                        <div className="flex gap-0.5">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                            className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                            <BiEditAlt size={16}/>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openDeleteModal(item.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                            <RiDeleteBin5Line size={16}/>
                          </button>
                        </div>
                        <BiChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}/>
                      </div>
                    </div>
                  </div>

                  {/* ── Quick action bar — always visible, no need to expand ── */}
                  {needsAction && (
                    <div onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2.5 bg-amber-50/70 border-t border-amber-100 flex flex-wrap items-center gap-3">
                      {item.estimated_fare == 0 && item.fare === null && item.booking_confirm_status == 0 && !item.booking_canceled_by_manager && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-amber-700 hidden sm:inline">Action</span>
                          <select value={bookingAction} onChange={(e) => handleBookingAction(e, item.id)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
                            <option value="TBE">TBE</option>
                            <option value="Fare">Fare</option>
                            <option value="Decline">Decline</option>
                          </select>
                          <button onClick={() => handletbeConfirmation(item.id)}
                            className="text-xs bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg transition-colors" style={{width:"auto"}}>Confirm</button>
                        </div>
                      )}
                      {item.fare == null && item.estimated_fare != 0 && item.booking_canceled_by_manager == 0 && item.booking_confirm_status == 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-amber-700 hidden sm:inline">Action</span>
                          <button onClick={() => handleConfirmation(item.id)}
                            className="text-xs bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg transition-colors" style={{width:"auto"}}>Confirm</button>
                          <button onClick={() => tripCancellation(item.id)}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors" style={{width:"auto"}}>Decline</button>
                        </div>
                      )}
                      {!item.marked_as_trip && !canceled && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 hidden sm:inline">Split</span>
                          <select value={splitOption.value} onChange={(e) => handleSplitOption(e, item.id)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
                            <option value="no split">No Split</option>
                            <option value="split">Split</option>
                          </select>
                          <button onClick={() => handleSplitConfirmation(item, item.id, index)}
                            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition-colors" style={{width:"auto"}}>Confirm</button>
                        </div>
                      )}
                      {canRebroadcast && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-amber-700 hidden sm:inline">No driver yet</span>
                          <button onClick={() => handleRebroadcast(item.multi_booking_id)}
                            disabled={rebroadcastingId === item.multi_booking_id}
                            className="text-xs bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors" style={{width:"auto"}}>
                            {rebroadcastingId === item.multi_booking_id ? "Re-broadcasting..." : "Re-broadcast"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Expanded detail panel ── */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/40 px-4 py-4 space-y-4">

                      {/* Timeline */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Timeline</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { label: "Reached Pickup",  value: item.reached_pickup },
                            { label: "Picked Up Goods", value: item.completed_pickup },
                            { label: "Reached Drop",    value: item.reached_drop },
                            { label: "Delivered",       value: item.completed_drop },
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-white rounded-xl border border-gray-100 px-3 py-2">
                              <p className="text-xs text-gray-400">{label}</p>
                              <p className="text-xs font-medium text-gray-700 mt-0.5">{value || "—"}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                        {/* Financials */}
                        <div className="bg-white rounded-xl border border-gray-100 px-3 py-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Financials</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Est. Fare</span>
                            <div className="flex items-center gap-1">
                              <BiEditAlt size={13} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleEditFare(); getObj(item); }}/>
                              <span className="text-xs font-medium text-gray-700">₹ {fare ?? "—"}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Collected</span>
                            <span className="text-xs font-medium text-gray-700">₹ {fareCollected ?? "—"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Waiting Chg</span>
                            <div className="flex items-center gap-1">
                              <BiEditAlt size={13} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handle_waitingCharges(); getObj(item); }}/>
                              <span className="text-xs font-medium text-gray-700">{item.waiting_charge || "—"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-xl border border-gray-100 px-3 py-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Status</span>
                            <div className="flex items-center gap-1">
                              <BiEditAlt size={13} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleEditPayment(); getObj(item); }}/>
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusColor(item.payment_status)}`}>{item.payment_status}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Type</span>
                            <span className="text-xs font-medium text-gray-700">{(item.is_regular && item.payment_status === "Pending") ? "TBE" : item.payment_type}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Paid by</span>
                            <span className="text-xs font-medium text-gray-700 text-right max-w-[100px] truncate" title={paymentLabel}>{paymentLabel}</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-xl border border-gray-100 px-3 py-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Tour ID</span>
                            <span className="text-xs font-medium text-gray-700">{item.tour_id || "—"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Tour Status</span>
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusColor(item.booking_status)}`}>{item.booking_status}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Weight</span>
                            <span className="text-xs font-medium text-gray-700">{item.commodity_weight} {item.weight_unit == 12 ? "Kg" : "Cu.ft"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Edit Time</span>
                            <BiEditAlt size={13} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleChangeEditTime(); getObj(item); }}/>
                          </div>
                          {item.instruction && (
                            <div>
                              <span className="text-xs text-gray-500">Info: </span>
                              <span className="text-xs text-gray-700">{item.instruction}</span>
                            </div>
                          )}
                        </div>

                        {/* Misc */}
                        <div className="bg-white rounded-xl border border-gray-100 px-3 py-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Misc</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Vivegam</span>
                            <div className="flex items-center gap-1">
                              <BiEditAlt size={13} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleVegam(); getObj(item); }}/>
                              <span className={`text-xs font-medium ${item.is_vivegam ? "text-brand-600" : "text-gray-400"}`}>{item.is_vivegam ? "Yes" : "No"}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Cus DC</span>
                            <div className="flex items-center gap-1">
                              {item.dcNumber && <BiEditAlt size={13} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleDcNumber(); getObj(item); }}/>}
                              <span className="text-xs font-medium text-gray-700">{item.dcNumber || "—"}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Drv DC</span>
                            <div className="flex items-center gap-1">
                              {item.tdcNumber && <BiEditAlt size={13} className="cursor-pointer text-gray-400 hover:text-brand-500" onClick={() => { handleDcNumber(); getObj(item); }}/>}
                              <span className="text-xs font-medium text-gray-700">{item.tdcNumber || "—"}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Loading</span>
                            <span className={`text-xs font-medium ${item.loading_charge_applicable ? "text-green-600" : "text-gray-400"}`}>{item.loading_charge_applicable ? "Yes" : "No"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Unloading</span>
                            <span className={`text-xs font-medium ${item.unloading_charge_applicable ? "text-green-600" : "text-gray-400"}`}>{item.unloading_charge_applicable ? "Yes" : "No"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Both L&U</span>
                            <span className={`text-xs font-medium ${item.both_loading_unloading_charge_applicable ? "text-green-600" : "text-gray-400"}`}>{item.both_loading_unloading_charge_applicable ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-400">No bookings found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {Boolean(bookData.length) && (
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-card flex flex-col gap-2">
          {/* Row 1: page buttons — full width, centered */}
          <div className="flex justify-center overflow-x-auto">
            <Pagination pageNumber={pageNumber} handlePageChange={handlePageChange} pageCount={pageCount}/>
          </div>
          {/* Row 2: go-to + per-page side by side */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <input type="text" onChange={handlePageNumber} placeholder="Page #"
                className="w-16 px-2.5 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"/>
              <button onClick={handleGoToPage}
                className="p-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors" style={{width:"auto"}}>
                <FaArrowRight size={13}/>
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="whitespace-nowrap">Per page</span>
              <select onChange={(e) => setPageDataCount(parseInt(e.target.value))}
                className="px-2 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                {result.map((elem, i) => <option key={i} value={elem}>{elem}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {   
  // console.log(state)
  
  };

export default Bookings;










                      
