import React, { useEffect, useMemo, useState } from "react";
import { CheckLg, Search } from "react-bootstrap-icons";
import { BiEditAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import {RiDeleteBin5Line} from "react-icons/ri";
import { Table, Modal, ModalBody, ModalHeader } from "reactstrap";
import { ClipLoader } from "react-spinners"; 
import ReactPaginate from "react-paginate";
import { css} from '@emotion/react';
// import { toursData } from "../../dummyData/Tours/toursData";
import Searchable from "react-searchable-dropdown";

import SearchableDropdown from "../../searchableDropdown";
// CSS...
import "../../styles/Tours/tours.css"

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSelect from "../../ReactSelect";
import moment from "moment";
import { CSVLink } from "react-csv";
import { baseUrl, getAuthHeader } from '../../api/apiConfig';
import TourEditModal from "../../components/editModals/TourEditModal";
import TourCount from "../counts/TourCount";



const Tours = () => {
  const [tourData, setTourData] = useState([]);
  const [loading,setLoading]=useState(false)
  const [count, setTotalCount] = useState(0);
  const [org_tour, setOrg_Tour] = useState(0);
  const [tourCount,setTourCount]=useState(0)
  const [driver, setDriver] = useState(false);
  const [driverIndividual, setDriverIndividual] = useState([]);
  const [tourdata, setTourdata] = useState(false);
  const [btn_view_modal, setBtn_view_modal] = useState(false);
  const [reportDate, setReportDate] = useState(null);
  const [intial_tour_date, setInitial_tour_date] = useState(null);
  const [tourdate, setTourdate] = useState(null);
  const [tourdate1, setTourdate1] = useState(null);
  const [value, setValue] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tourDetails, setTourDetails] = useState([]);
  const [tourId, setTourId] = useState("");
  const [view, setView] = useState(false);
  const [tourStatus, setTourStatus] = useState({});
  const [success, setSuccess] = useState(false);
  const [tourPoints, setTourPoints] = useState();
  const [truckDriverName, setTruckDriverName] = useState();
  // Search
  const [search, setSearch] = useState("");
  // const [tourID, setTourID] = useState(0);
  const [name, setName] = useState({});
  const [mobileNo, setMobieNo] = useState({});
  const [user_id, setUser_id] = useState("");
  const [downloadBtn,setDownloadBtn]=useState(false)
  const [noResult,setNoResult]=useState(false)
  const [result,setResult]=useState([])
  let   [params, setParams] = useState({
    limit: 10,
    offset:0 ,
    driver_id:localStorage.getItem("tour_driverId")?localStorage.getItem("tour_driverId"):"",
    driver_mobile:"",
    id:localStorage.getItem("tourId")?localStorage.getItem("tourId"):"",
    status:localStorage.getItem("tourStatus")?localStorage.getItem("tourStatus"): "",
    tour_date:localStorage.getItem("tourDate")?localStorage.getItem("tourDate"):"" ,
    tour_status:localStorage.getItem("tourCurStatus")?localStorage.getItem("tourCurStatus"): "",
  });
  const[driversDetails,setdriversDetails]=useState([])
  const[driverId,setDriverId]=useState(null)
  const[tourReport,setTourReport]=useState([])
  const[isClearable,setIsClearable]=useState(true)
  const[dateMessage,setDateMessage]=useState(false)
  const[errorMessage,setErrorMessage]=useState(false)
  const[deleteModal,setDeleteModal]=useState(false)
  const[deleteId,setDeleteId]=useState(null)
  const[tourEditModal,setTourEditModal]=useState(false)
  const[editdriverId,seteditDriverId]=useState(null)
  const[buttonShow,setButtonShow]=useState(false)
  const [isLoading, setIsLoading ] = useState(false);
  const[az,setAz]=useState([])
  const[nameFilter,setNameFilter]=useState([])
  const[mobileFilter,setMobileFilter]=useState([])
  const[toursDetail,setToursDetail]=useState(false)
  const[toursDetailsData,setToursDetailsData]=useState([])
  const [tour_info_Date, setTour_info_Date] = useState("");
  const [tourinfo_driver_Details, setTourinfo_driver_Details] = useState({});
  
  
  
  // console.log(driverIndividual,"driversss");

 

  // Edit Icons  start Fn,,,,
const handleChangesTourEditModal=(id)=>{
  setTourEditModal(!tourEditModal)
  seteditDriverId(id)
  
}

const updateTourDetails=async(id)=>{
  const payload={
    tour_id:editdriverId
  }
  try {
    const request=await axios.post(`${baseUrl}/tours/updateTourTrips`,payload);
    console.log(request);
    if(request.data.success){
      alert("Trips Reverted Successfully ✅ ")
      setTourEditModal(false)
      getToursData(params);
      
    }
    
  } catch (error) {
    console.error(error.message)
    alert("Someting error")
    
  }

}

// Edit Icons end Fn,,,,

  const driverReport = () => {
    setDriver(!driver);
    setDateMessage(false)
    setDownloadBtn(false)
    setReportDate(null)
    setNoResult(false)
  };
  const changeTourdata = () => {
    setTourdata(!tourdata);
    setValue(null)
    setDateMessage(false)
    setDownloadBtn(false)
    setTourdate(null)
    setTourdate1(null)
  };

  const getTourDetails=()=>{
    setToursDetail(true)

  }

  const openModal = () => {
    setBtn_view_modal(true);
  };

  const closeModal = () => {
    setBtn_view_modal(!btn_view_modal);
    setButtonShow(false)
    setTourStatus({})
    setIsLoading(false)
    // window.location.reload()
  };
  const changeButtonView = (index) => {
    openModal();
    console.log("tourData",tourData)
    console.log("tourData",index)
    console.log(tourData[index],"tourData[index]");
    setTourId(tourData[index].tour.id)
    console.log(tourData[index].tour);
    console.log(tourData[index].tourPoints);
    // const az=tourData[index].sequenceData;
    const tourDetails=tourData[index].sequenceData;
    console.log(tourDetails,"tourDetails");
    setTourDetails(tourDetails)
    let tourMap = [];
    let i = 0;
    for (let seqNum of tourData[index].sequenceData) {
      let isSamePoint = false;

      if (tourData[index].sequenceData[i - 1]) {
        if (
          tourMap[tourMap?.length - 1].transport_type == seqNum.transport_type &&
          tourMap[tourMap?.length - 1].location_address ==
            seqNum.location_address
        ) {
          isSamePoint = true;
        } else {
          isSamePoint = false;
        }
      }
      if (isSamePoint) {
        tourMap[tourMap?.length - 1].seqIds.push(seqNum.id);
      } else {
        let seqData = {
          ...seqNum,
          seqIds: [seqNum.id],
        };
        tourMap.push(seqData);
      }

      i++;
    }
    console.log("tourMap -: ",tourMap);
    setTourDetails(tourMap)
    console.log("Last id : ",tourMap[tourMap.length - 1].seqIds);

  };
  

  console.log("Tour Details,,",tourDetails);

// Selecting Reached & Completed...
  const handleStatusChange = (value, type, index) => {
    setSelectedIndex(index);
    setButtonShow(true)
    setView(true);
    setTourStatus((prevValue) => ({
      ...prevValue,
      [index]: value,
    }));
  };


  // console.log(tourStatus);
  // console.log(selectedIndex);
  // console.log(tourStatus[selectedIndex]);

  
  const getUniqueTourData=(data)=>{
    let tourMap = [];
          let i = 0;
          for (let seqNum of data) {
            let isSamePoint = false;

            if (data[i - 1]) {
              if (
                tourMap[tourMap?.length - 1].transport_type == seqNum.transport_type &&
                tourMap[tourMap?.length - 1].location_address ==
                  seqNum.location_address
              ) {
                isSamePoint = true;
              } else {
                isSamePoint = false;
              }
            }
            if (isSamePoint) {
              tourMap[tourMap?.length - 1].seqIds.push(seqNum.id);
            } else {
              let seqData = {
                ...seqNum,
                seqIds: [seqNum.id],
              };
              tourMap.push(seqData);
            }

            i++;
          }
          setTourDetails(tourMap)
          console.log("tourMap -: ",tourMap);

  }



  const tourStatusUpdate = async (elem, index) => {
    const tourStatusUpdate = {
      seqNum: elem.seqIds,
      status: tourStatus[index],
      is_from_manager: true,
    };
    console.log("payload ",tourStatusUpdate);
    
    try {
      const statusResponse = await axios.post(`${baseUrl}/tours/updateSequence`,tourStatusUpdate);
      let lastId = tourDetails[tourDetails.length - 1].id;
      console.log(tourId);
      console.log(lastId);

      if(statusResponse.data.success){
        // id:tourid
        const respo=await axios.post(`${baseUrl}/tours/toursLIst`,{id:tourId})
        const data=respo.data.data.tours[0].sequenceData;
        console.log("try part",data);
        getUniqueTourData(data)
        // setTourDetails(tourMap)
        // setTourDetails(data)
        setButtonShow(false)

      }
      if (statusResponse.data.success === true && lastId == elem.id && tourStatus[index] == "Completed"){
        console.log("Iam is herere");
        console.log(tourStatus[index]);
        console.log(lastId);
        console.log(elem.id);
        console.log(statusResponse.data.success === true && lastId == elem.id && tourStatus[index] === "Completed");
        const tourCompleteResp=await axios.post(`${baseUrl}/tours/completeTour`,{tour_id:tourId})
        console.log("tourCompleteResp success -",tourCompleteResp);
        setBtn_view_modal(false)
            toast.success("Tour Completed.✅",{
              className:"toast-success-message",
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            })
      

    }
      
    } catch (error) {
      console.log(error);
        const respo=await axios.post(`${baseUrl}/tours/toursLIst`,{id:tourId})
        const data=respo.data.data.tours[0].sequenceData;
        console.log("catch part",data);
        getUniqueTourData(data)

        // setTourDetails(data)
        setButtonShow(false)
      
    }
    getToursData(params);
  

  };

  // Pagination ....
  
  const [pageNumber, setPageNumber] = useState(0);
  const showDataPerPage = 10;
  const offset = pageNumber * showDataPerPage;
  const pageCount = Math.ceil(count / showDataPerPage);
  
  
  
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
   
  };



  //Initial page Loading Api

  const allDriverList = async () => {
    const response = await axios.post(
      `${baseUrl}/driver/getDrivers`,{limit:1000,offset:0}
    );
    const driverList = response.data.data.drivers;
    setDriverIndividual(driverList);
    const driversDetails=driverList.map((elem)=>({
      label:`${elem.name} - ${elem.mobile_number}`,
      value:elem.user_id
    }))
    const driversNameFilter=driverList.map((elem)=>({
      label:`${elem.name}`,
      value:elem.user_id
    }))
    const driversMobileFilter=driverList.map((elem)=>({
      label:`${elem.mobile_number}`,
      value:elem.user_id
    }))
    setdriversDetails(driversDetails)
    setNameFilter(driversNameFilter)
    setMobileFilter(driversMobileFilter)
  };
  console.log("nameFilter : ",nameFilter);
  console.log("mobileFilter : ",mobileFilter);



 
  

  const handleTourid = (e) => {
    let id = e.target.value;
    setPageNumber(0);
    setParams({...params,id:id})
    localStorage.setItem("tourId",id)
  };

//Selecting driver User id....
  const handleSelectedDriver=(selected)=>{
    console.log(selected,"selected")
    console.log(selected.value,"selected")
    setName(selected)
    setParams({...params,driver_id:selected.value})
    localStorage.setItem("tour_driverId",selected.value)
    localStorage.setItem("tour_driverObj",JSON.stringify(selected))

  }
  //Selecting By driver Mobile no ....
  const handleSelectedDrivermobile=(selected)=>{
    setMobieNo(selected)
    setParams({...params,driver_id:selected.value})
    localStorage.setItem("tour_driverId",selected.value)
    localStorage.setItem("tour_driver_MobObj",JSON.stringify(selected))
  }
  
//   Filter By Date Selected ....

const filter_tour_date=(date)=>{
    let selectedDate=moment(date).format("YYYY-MM-DD");
    setInitial_tour_date(selectedDate)
    setParams({...params,tour_date:selectedDate})
    localStorage.setItem("tourDate",selectedDate)
    
}



  const getData=(params)=>{
    getToursData({...params})
    getTourCount({...params})
  }

  const handleTourStatus=(e)=>{
    let tourStatus=e.target.value;
    setParams({
        ...params,
        status:tourStatus
    })
    localStorage.setItem("tourStatus",tourStatus)
  }
const handleTourCurrentStatus=(e)=>{
    let tourCurrentStatus=e.target.value;
    setParams({
        ...params,
        tour_status:tourCurrentStatus
    })
    localStorage.setItem("tourCurStatus",tourCurrentStatus)

}
  const getClear = () => {
    // window.location.reload();
    setLoading(true)
    localStorage.removeItem("tourId")
    localStorage.removeItem("tourStatus")
    localStorage.removeItem("tourCurStatus")
    localStorage.removeItem("tourDate")
    localStorage.removeItem("tour_driverId")
    localStorage.removeItem("tour_driverObj")
    localStorage.removeItem("tour_driver_MobObj")
    localStorage.removeItem("tourCount")
    setParams({...params,driver_id:"",id:"",status:"",tour_date:"",tour_status:""})
    getTourCount({...params,tour_date:moment().format("YYYY-MM-DD"),driver_id:"",id:"",status:"",tour_date:"",tour_status:"",limit:200,offset:0})
    getToursData({
      limit: 10,
      offset:0 ,
      driver_id:"",
      driver_mobile:"",
      id:"",
      status:"",
      tour_date:"" ,
      tour_status:"",
    });
    setLoading(false)
    
  };
  

  const getDailyDriversReport=async ()=>{
    const payload={start_date:moment(reportDate).format("YYYY-MM-DD")}
    if(payload.start_date=="Invalid date"){
      setDateMessage(true)
    }else{
      setDateMessage(false)
      try {
        const request=await axios.post(`${baseUrl}/location/driverReports`,payload)
        if(request.data.success){
          setNoResult(false)
          setDownloadBtn(true)
          const result=request.data.data.locations;
          setResult(result)

        }else{
          console.log(request);
          setNoResult(true)
        }
      
        
      } catch (error) {
        console.log(error.message);
        
      }


    }

  }

  // React select fn ...

  const handleSelectedOption=(selected)=>{
    setValue(selected)
    setDriverId(selected.value)
  }

  const getExportTourReport=async()=>{
    const payload={
      start_date:moment(tourdate).format("YYYY-MM-DD"),
      end_date:moment(tourdate1).format("YYYY-MM-DD"),
      driver_id:driverId,
      limit:1000
    }
    if(payload.start_date=="Invalid date"||payload.end_date=="Invalid date"||payload.driver_id==null){
      setDateMessage(true)
      setErrorMessage(false)

    }else{
      setDateMessage(false)
      try {
        const request=await axios.post(`${baseUrl}/booking/getBookingsDetails`,payload)
        console.log(request.data.success);
      if(request.data.success){
        setDownloadBtn(true)
        const result=request.data.data.bookings;
        setTourReport(result)
        

      }else{
        setErrorMessage(true)

      }
      
    } catch (error) {
      setErrorMessage(true)
      console.log(error);
      
    }
    }
  }

   // Delete Icon Fn.... 

   const handleDeleteModal=(id)=>{
    setDeleteModal(!deleteModal)
    setDeleteId(id)
}

// Delete Icons Fn,,,,
const deleteSelectedTour=async (id)=>{
    console.log(id,"delete id");
    try {
            const request=await axios.post(`${baseUrl}/tours/deleteTour/${id}`)
            if(request.data.success){
                getToursData(params) // Initial func...
                alert("Tour Deleted.")
                setDeleteModal(false)
                
            }
            
            } catch (error) {
                alert("Failed to Delete !")
                console.error(error.message);
            }

}
 
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `;

  //get tour Data Api call ...

    async function getToursData(params) {
      setLoading(true)
      const request = await fetch(
        `${baseUrl}/tours/toursList`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
          body: JSON.stringify({...params,limit:showDataPerPage,offset:offset}),
        }
      );
      const response = await request.json();
      const data = response.data.tours;
      const originalTourCount=data.filter((ele)=>ele.tour.tour_type != "Dummy" && ele.tour.tour_type != "dummy" )
      const totalTourCount = response.data.count;
      setTotalCount(totalTourCount);
      setTourData(data);
      setLoading(false)
      
    }

  // gettingTourCount Based on Todays Date....
  const driverDetails = {};

  const getTourCount=async(params)=>{
    setLoading(true)
    try {
      const countRequest=await axios.post(`${baseUrl}/tours/toursList`,{
        ...params,tour_date:params.tour_date ?params.tour_date:moment().format("YYYY-MM-DD"),
        driver_id:params.driver_id,
        driver_mobile:"",
        id:params.id,
        status:params.status,
        tour_status:params.tour_status,
        limit:200,
        offset:0
      })
      const resp=countRequest.data.data.tours;
      const tourCount=resp.filter((ele)=>ele.tour.tour_type != "Dummy" && ele.tour.tour_type != "dummy" )
      setOrg_Tour(tourCount.length)
      // Here we modified the Tour Details to show ...
      tourCount.forEach(entry => {
        const driverName = entry.truck.driver_name;
        const tourId = entry.tour.id;
        const driverMobile = entry.truck.driver_mobile;
        let tour_info_date=entry.tour.tour_date
        setTour_info_Date(tour_info_date)
        
        if (!driverDetails[driverName]) {
          driverDetails[driverName] = {
            name:driverName,
            count: 1,
            tourIds: [tourId],
            mobile:driverMobile
          };
        } else {
          driverDetails[driverName].count++;
          if (!driverDetails[driverName].tourIds.includes(tourId)) {
            driverDetails[driverName].tourIds.push(tourId);
          }
        }
      });
      

      console.log("tourCount",tourCount)
      let org_tour=tourCount.length;
      // setOrg_Tour(org_tour)
      // setToursDetailsData(tourCount)
      setLoading(false)
      setTourinfo_driver_Details(driverDetails)
    } catch (error) {
      console.log("Failed to Count the No of Tours ")
      
    }

  }

  
  console.log("tourDate",tour_info_Date)
  console.log("tourinfo_driver_Details",tourinfo_driver_Details)

 
  

  useEffect(() => {
    allDriverList();
    getTourCount({...params})
  }, []);
  useEffect(() => {
    getToursData(params);
  }, [offset,params.tour_status]);

console.log(tourCount)
  
            
  return (
    <div style={{ padding: "10px" }} id="tourContainer">
      <section className="searchBar-section" >
        {
           <TourCount tourCount={org_tour}  />
        }
        <div className="session-Top-Input">
          <Search
            className="searchIcon"
            style={{ position: "absolute", left: "260px",zIndex:100 }}
          />
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID , name , Mobile-no"
            style={{ width: "310px" }}
          />
        </div>
        <div className="vehicle-btns">
          <button className="btn-big" onClick={driverReport}>
            Daily Drivers Report
          </button>
          <button className="btn-big" onClick={changeTourdata}>
            Export Tour Data
          </button>
          {
            org_tour!=0 && (<button className="btn-big" onClick={getTourDetails}>
            Tour Info Details
          </button>)
          }
        </div>
      </section>

      <section id="DeleteModal">
      <Modal isOpen={deleteModal} size='sm' style={{marginTop:"5%"}} className="delete-modal-mobile ">
                <ModalHeader toggle={handleDeleteModal}style={{ border: "none" }} >
                </ModalHeader>
                <ModalBody>
                    <div id='deleteModalBody' >
                        <p>Are you sure you want to delete?</p>
                        <div className='confirm-cancel-button'>
                        <button onClick={()=>deleteSelectedTour(deleteId)}>Confirm</button>
                        <button onClick={()=>handleDeleteModal()}>Cancel</button>
                        </div>
                    </div>
        
                </ModalBody>
                </Modal>

      </section>
      <section id="EditModal">
      <Modal isOpen={tourEditModal} id="tour-edit-modal-mobile">
        <ModalHeader toggle={handleChangesTourEditModal} style={{border:"none"}}>
          <p>Tour Edit :</p>
        </ModalHeader>
        <ModalBody>
           <div id="tourEditModalBody">
           <p>Confirm Your Revert Trips</p>
            <div id="TourEditModalBodyBtn">
            <button className='tourEditModalBtn' onClick={updateTourDetails}>
              Confirm
            </button>
            <button className='tourEditModalBtn' onClick={()=>setTourEditModal(false)}>
              cancel
            </button>
            </div>
           </div>
        </ModalBody>
    </Modal>
        
        
        
      </section>
      
      {/*1.Daily Drivers Report Button Modal..  */}

      <Modal isOpen={driver} id="daily-drivers-modal-mobile">
        <ModalHeader toggle={driverReport} style={{ border: "none" }}>
          <span style={{ fontSize: "20px" }}>Filter</span>
        </ModalHeader>
        <ModalBody className="modal-body">
          <p>Choose Date :</p>
          <DatePicker
            selected={reportDate}
            onChange={(date) => setReportDate(date)}
            placeholderText="Choose Date"
            dateFormat="yyyy-MM-dd"
            className="datePicker"
          ></DatePicker>
          <div className="modalFilterBtn">
            <button className="btn-small" onClick={getDailyDriversReport}>Filter</button>
            {downloadBtn && <CSVLink
            className="btn-small"
            data={result}
            target="_blank"
            filename="Daily Report"
            >Download</CSVLink>}
            {dateMessage ?" Please Choose field":""}
            {noResult ? "No Records are Found":""}
          </div>
        </ModalBody>
      </Modal>

      {/* 2.Export Tour Button Modal..  */}  

      <div id="export-tour-modal">
        <Modal isOpen={tourdata} id="export-tour-modal-mobile">
          <ModalHeader toggle={changeTourdata} style={{ border: "none" }}>
            <p>Filter</p>
          </ModalHeader>
          <ModalBody className="modal-body">
            <div>
              <p>Driver Name :</p>
              <ReactSelect
              value={value}
              isClearable={isClearable}
              options={driversDetails}
              placeholder={"Select Driver Name.."}
              handleSelectedOption={handleSelectedOption}
              isMulti={false}
              />
              
            </div>
            <p style={{ marginTop: "15px" }}>Period of Time :</p>
            <div className="dateBox">
              <div>
                <DatePicker
                  selected={tourdate}
                  dateFormat="dd-MM-yyyy"
                  onChange={(date) => setTourdate(date)}
                  className="datePicker"
                  placeholderText="Choose Date"
                ></DatePicker>
              </div>
              <div>
                <DatePicker
                  selected={tourdate1}
                  dateFormat="dd-MM-yyyy"
                  className="datePicker"
                  onChange={(date) => setTourdate1(date)}
                  placeholderText="Choose Date"
                ></DatePicker>
              </div>
            </div>
            <div className="modalFilterBtn">
              <button className="btn-small" onClick={getExportTourReport}>Filter</button>
              {downloadBtn && <CSVLink
            className="btn-small"
            data={tourReport}
            target="_blank"
            filename="Tour Report"
            >Download</CSVLink>}
              {dateMessage ? "Please Choose Date":""}
              {errorMessage ? <span>No Records Found !</span>:""}
            </div>
          </ModalBody>
        </Modal>
      </div>

      {/* 3. ToursDetails Modal */}
      <div >
        <Modal isOpen={toursDetail} scrollable	
         id="TourInfo_Details_modal" >
          <ModalHeader style={{ border: "none" }} toggle={()=>setToursDetail(false)}>
            <p><u>Tour Info Details</u></p>
          </ModalHeader>
          
          <ModalBody className="modalBody">
            <p style={{fontWeight:500}}> Tour Date : {tour_info_Date}</p>
              <table>
              <thead >
                <tr>
                  <th>S.no</th>
                  <th>Driver Name</th>
                  <th>Mobile No</th>
                  <th>Tour Count</th>
                  <th>Tour Ids</th>
                </tr>
              </thead>
              <tbody>
                {
                  console.log(Object.keys(tourinfo_driver_Details),"-------")
                }
            
            {Object.keys(tourinfo_driver_Details)
              .map(driverName => ({
                driverName,
                ...tourinfo_driver_Details[driverName]
              }))
              .sort((a, b) => b.count - a.count) // Sort by count in descending order
              .map(({ driverName, count, tourIds, mobile }, index) => (
                <tr key={driverName}>
                  <td>{index + 1}</td>
                  <td>{driverName}</td>
                  <td>{mobile}</td>
                  <td>{count}</td>
                  <td>{tourIds.join(', ')}</td>
                </tr>
              ))}
          </tbody>
            </table>
          <p style={{color:"#30A46C",fontWeight:"bold",margin:"10px 10px 0px 160px"}}>Total Tour Counts: {Object.values(tourinfo_driver_Details).reduce((acc, curr) => acc + curr.count, 0)}</p>

          </ModalBody>
        </Modal>
      </div>

      <div style={{ backgroundColor: "green", width: "200px" }}></div>

      <section id="view-button-modal">
        <Modal isOpen={btn_view_modal} size="lg" id="view-button-modal-mobile" className="tab">
          <ModalHeader style={{ border: "none" }} toggle={closeModal}>
            <p style={{ position: "relative", top: "10px" }}>Tour Details :</p>
          </ModalHeader>
          <ModalBody>
            <p>
              <b>Tour ID : {tourId ? tourId : null}</b>
            </p>
            {tourDetails.map((elem, index) => (
              <div key={index}>
                <Table id="viewTourModal">
                  <thead>
                    <tr style={{ borderBottom:"none"}}>
                      <th>TRIP ID</th>
                      <th>TRIP LOCATION</th>
                      <th>LOCATION TYPE</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                      {/* <th></th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{elem.trip_id}</td>
                      <td>
                        <div>
                          <div>{elem.location_address}</div>
                          <div><span className="estimate-time">{elem.estimated_time}</span> - <span className={((!elem.completed_time && elem.estimated_time < moment().tz('Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss')) || (elem.completed_time && elem.estimated_time < elem.completed_time)) ? 'delay-time' : 'estimated-time'}>{elem.completed_time ? elem.completed_time : "--"}</span></div>
                        </div>
                      </td>
                      <td>{elem.transport_type}</td>
                      <td>{elem.status}</td>
                      <td style={{ textAlign:"center" }}>
                        <div style={{display:"flex",flexDirection:"row", gap:10}}>
                        <select
                          value={tourStatus[index] || ""}
                          onChange={(event) =>
                            handleStatusChange(
                              event.target.value,
                              elem.transport_type,
                              index
                            )
                          }        
                        >
                          <option value="" defaultValue>
                            Choose Type
                          </option>
                          <option value="Reached">Reached</option>
                          <option value="Completed">Completed</option>
                        </select>

                        {buttonShow ? <div style={{ display: "flex", gap: "3px"}}>
                          {view && selectedIndex === index && (
                            <button
                              // className={isLoading ? "button-disabled":"btn-small"}
                              // style={{backgroundColor:isLoading?"red":"green"}}
                              onClick={() => tourStatusUpdate(elem, index)}
                              className="btn-small"
                              // disabled={isLoading}
                            >
                                Submit
                            </button>

                          )}

                        </div>:""}
                        </div>
                       

                      </td>
                      {/* <td></td> */}
                    </tr>
                  </tbody>
                </Table>
                {selectedIndex === index && success && (
                  <span style={{ position: "relative", left: "500px" }}>
                    updated successfully.
                  </span>
                )}
              </div>
            ))}

            {tourDetails.length == 0 && (
              <p style={{ textAlign: "center" }}>No Trips....</p>
            )}
          </ModalBody>
        </Modal>
      </section>
      <ToastContainer 
      position="top-center"
      pauseOnHover={true}
      draggable={true}
      style={{color:"yellow"}}
       />

      <section className="booking-main-input bookingTourFilter" >
        <div className="inpBox-1 tours">
          <input type="text" onChange={handleTourid}  placeholder="Search Tour ID.." value={params.id} />
          <select onChange={(e)=>handleTourStatus(e)} value={params.status} className="customStyleSelect" >
            <option value="choose tour status">Choose tour status</option>
            <option value="Assigned">Assigned</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
          </select>
          <select onChange={(e)=>handleTourCurrentStatus(e)} value={params.tour_status} className="customStyleSelect">
            <option value="Choose booking status"  defaultValue>
              Choose Current status
            </option>
            <option value="Accepted">Accepted</option>
            <option value="Cancelled By Manager">Cancelled By Manager</option>
            <option value="Completed drop">Completed drop</option>
            <option value="Completed pickup">Completed pickup</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Created">Created</option>
            <option value="Fare">Fare</option>
            <option value="Pending">Pending</option>
            <option value="Reached drop">Reached drop</option>
            <option value="Reached pickup">Reached pickup</option>
            <option value="Tour Completed">Tour Completed</option>
            <option value="Tour Created">Tour Created</option>
            <option value="Trip Created">Trip Created</option>
          </select>

          <DatePicker
            value={params.tour_date}
            onChange={(date) => filter_tour_date(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Tour Date"
            id="tourDate"
          />
        </div>
        <div className="inpBox-2">
            
            <div className="nameFilter">
            
                <ReactSelect
              options={nameFilter}
              isMulti={false}
              handleSelectedOption={handleSelectedDriver}
              // value={name}
              value={localStorage.getItem("tour_driverObj")?JSON.parse(localStorage.getItem("tour_driverObj")):""}
              placeholder={"Driver name"}
              />
            </div>
            <div style={{width:"150px"}}>
              <ReactSelect
              options={mobileFilter}
              isMulti={false}
              handleSelectedOption={handleSelectedDrivermobile}
              // value={mobileNo}
              value={localStorage.getItem("tour_driver_MobObj")?JSON.parse(localStorage.getItem("tour_driver_MobObj")):""}
              placeholder={"Mobile No"}
              />
            </div>
        </div>
        <div className="bookingTourFilter-tourButtons">
        {/* onClick={()=>getData(params)} */}
          <button className="btn-big" 
          // getData(params)
          onClick={()=>{
            getToursData({...params})
            getTourCount({...params,driver_id:params.driver_id})
          }} 
          >
            Filter
          </button>
          <button className="btn-big" onClick={getClear}>
            Clear
          </button>
        </div>
      </section>

      <section>
        <Table responsive  style={{ marginTop: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid black", fontSize: "12px",  }}>
              <th className="xxx">VIEW TOUR</th>
              <th>EDIT</th>
              <th>DELETE</th>
              <th>ID</th>
              <th>STATUS</th>
              <th>CURRENT STATUS</th>
              <th>TOUR DATE</th>
              <th>DRIVER</th>
              <th>DRIVER MOBILE</th>
            </tr>
          </thead>
          <tbody>
            {
              // tourData.filter((elem)=>elem.tour.id.toString().includes(search.toString())
              // ||elem.truck.driver_name.toLowerCase().includes(search.toLowerCase())
              // ||elem.truck.driver_mobile.includes(search)
              // )
              // .slice(pagesVisited,pagesVisited+showDataPerPage)
              
              (Boolean(tourData.length) && !loading) && tourData.sort((a,b)=>new Date(a.tour_date)-new Date(b.tour_date)).map((item, index) => {
                return (
                <tr
                    key={index}
                    // style={{ borderBottom:item.tour.tour_type ? "1px solid lightgrey":"1px solid red" }}
                    className={item.tour.tour_type ? "check1" :"check2"}
                  >
                    <td style={{ maxWidth: "60px", cursor: "pointer" }}
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    >
                      <button
                        className="btn-big"
                        onClick={() => 
                          {
                            changeButtonView(index)
                            closeModal()
                          }
                        }
                      >
                        View
                      </button>
                    </td>
                    <td 
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    style={{ fontSize: "18px", cursor: "pointer" }}>
                      <BiEditAlt 
                      onClick={()=>handleChangesTourEditModal(item.tour.id)}
                      />
                    </td>
                    <td
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    style={{ fontSize: "18px", cursor: "pointer" }}>
                      <RiDeleteBin5Line 
                      className='deleteIcon'
                      onClick={()=>handleDeleteModal(item.tour.id)}
                      />
                    </td>
                    <td
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    >{item.tour.id}</td>
                    <td
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    >{item.tour.status}</td>
                    <td
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    >{item.tour.tour_status}</td>
                    <td
                    
                    className={item.tour.tour_type ? "check1" :"check2"}
                    >{item.tour.tour_date}</td>
                    <td
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    >{item.truck.driver_name}</td>
                    <td
                    className={item.tour.tour_type ? "check1" :"check2"}
                    
                    >{item.truck.driver_mobile}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
        {
         loading && <p style={{textAlign:"center",fontSize:"15px",color:"#30A46C"}}>Loading ...</p>
        }
        {
         (count == 0  && !loading) && <p style={{textAlign:"center",fontSize:"15px",color:"#30A46C"}}>No Records are Found.</p>
        }
      </section>
      

      {/* Pagination ... */}

      {Boolean(tourData.length) && <div style={{ marginBottom: "50px", position: "relative",left:"100px",marginTop:"20px" }}>
        <div className="paginationContainer">
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            // containerClassName={"pagination"}
            containerClassName={"paginationBtns"}
            previousLinkClassName={"previousBtn"}
            nextLinkClassName={"nextBtn"}
            disabledClassName={"paginationDisabled"}
            pageRangeDisplayed={5}
            activeClassName={"paginationActive"}
            // activeClassName={'active'}
          />
        </div>
        <p style={{ position: "absolute", left: "200px" }}>
          {pageNumber + 1} of {pageCount} pages
        </p>
      </div>}
    </div>
  );
};

export default Tours;