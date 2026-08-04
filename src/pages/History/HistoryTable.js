import React,{useState,useEffect} from 'react';
import axios from "axios";
import Layout from '../../components/Layout';
import { Table,Modal,ModalHeader,ModalBody,ModalFooter, Button } from 'reactstrap';
// CSS..
import "../../styles/History/historyTable.css";
import DatePicker from "react-datepicker";
import SearchableDropdown from '../../searchableDropdown';

import ReactSelect from '../../ReactSelect';
import Pagination from '../../Pagination';
import moment from 'moment';
import {CSVLink} from "react-csv"
import { baseUrl } from '../../api/apiConfig';



const HistoryTable = () => {
  const [loading, setLoading] = useState(true);
  const[tableData,setTableData]=useState([]);
  const[driverList,setDriverList]=useState([])
  const[params,setParams]=useState({
    driver_id:0,
    limit:10,
    offset:0
  })
  const[totalCount,setTotalCount]=useState("")
  const[pageNumber,setPageNumber]=useState(0)
  const[search,setSearch]=useState("")
  const[open,setOpen]=useState(false);
  const[history_sdate,setHistory_sdate]=useState(null)
  const[history_edate,setHistory_edate]=useState(null)
  const[showDownloadBtn,setShowDownloadBtn]=useState(false)
  const[downloadedData,setDownloadedData]=useState([])
  const[showNotification,setShowNotification]=useState(false)
  const[history_modal_drivState,setHistory_modal_drivState]=useState()
  const[value,setValue]=useState(null)

  const modalOpen=()=>{
    setOpen(!open)
    setHistory_sdate("")
    setHistory_edate("")
    setShowNotification(false) // for downloade message information
    setShowDownloadBtn(false) // for hideDownload Button
  }
  // const data=[
  //   {value:"281",label:"venkat-8778620133"},
  //   {value:"260",label:"Prakash-9789460828"},
  //   {value:"003",label:"Suby-9605432304"},
  //   {value:"004",label:"Suby-9605432304"},
  //   {value:"005",label:"Suby-9605432304"}
  // ];

  const handleSearch=(e)=>{
    setSearch(e.target.value)

  }

  const handleSelectedOption=(selected)=>{
    console.log(selected);
    setValue(selected)
    setParams({...params,driver_id:selected.value})

  }

  const handleClear=()=>{
    setValue(null);
    historyData()
    // window.location.reload();
   
  }    

  const showDataPerPage = 10;
  const offset = pageNumber * showDataPerPage;
  const pageCount = Math.ceil(totalCount / showDataPerPage);
  const handlePageChange=({selected})=>{
    setPageNumber(selected)
    setLoading(true)

  }
  
  // Api calling ..
console.log(params);



const getAllDriversList = async () => {
  const request = await axios.post(
    `${baseUrl}/driver/getDrivers`,
    { limit: 1000, offset: 0 }
  );
  const driversList = request.data.data.drivers;
  // console.log(driversList);
  const driverDetail = driversList.map((item) => ({
    label: `${item.name}-${item.mobile_number}`,
    value: item.user_id,
  }));
  // console.log(driverDetail);
  setDriverList(driverDetail);
};
console.log(driverList);

const url=`${baseUrl}/location/getDriverLocations`
  const historyData=async (params)=>{
    // console.log(params);
    const response = await axios.post(url,{...params,limit:showDataPerPage,offset:offset});
    setTableData(response.data.data.locations);
    
    setTotalCount(response.data.data.count)
    setLoading(false)

  }
  useEffect(()=>{
    getAllDriversList()
  },[])
  useEffect(()=>{
    historyData(params)
  },[offset,params])
  // console.log(tableData);

  const getDate=()=>{
    console.log("I am calledd--");
    passingDate()
    
  }
  const passingDate=async()=>{
    let startDate=moment(history_sdate).format("YYYY-MM-DD")
    let endDate=moment(history_edate).format("YYYY-MM-DD")
    const payload={
      start_date:startDate,
      end_date:endDate,
      driver_id:params.driver_id
    }
    console.log(payload);
    // calling api
    const response=await axios.post(`${baseUrl}/location/getDriverLocationsDetails`,payload)
    console.log(response,"from DriverHistory");
    if(response.data.success){
      setShowDownloadBtn(true)
      // console.log(response.data.data.locations);
      const data=response.data.data.locations;
      console.log(data);
      setDownloadedData(data)
    }else{
      setShowDownloadBtn(false)
      console.log("something Error ?");

    }
  }

  const showNotifications=()=>{
    setShowNotification(true)
  }
  


  return (
    <div style={{padding:"10px"}} >
          <div className='history-tab-container'>
            <div className='history-tab-Input'>
                  <button onClick={modalOpen} className='btn-big'>Export History Data</button>
                  <button className='btn-big' onClick={handleClear}>CLEAR</button>
                  
            </div>
            <div style={{width:"300px",position:"relative",top:"10px"}}>
                <ReactSelect
                value={value}
                options={driverList}
                isMulti={false}
                handleSelectedOption={handleSelectedOption}/>
              </div>
            <section>
              
            {/* <SearchableDropdown state={history_modal_drivState} setState={setHistory_modal_drivState} data={data} /> */}
            </section>
        </div> 

        <Modal isOpen={open} toggle={modalOpen} id='export-history-modal-mobile' >
                <ModalHeader toggle={modalOpen} style={{border:"none"}}>Filter</ModalHeader>
                <ModalBody className='modalBody'>
                  <p>Period of Time :</p>
                  <div style={{display:"flex"}} className='dateInputs'>
                    <DatePicker
                    selected={history_sdate}
                    onChange={(date)=>setHistory_sdate(date)}
                    dateFormat="yyyy-MM-dd"
                    className='datePicker'
                    placeholderText='Start Date'
                    />
                    <DatePicker
                    selected={history_edate}
                    onChange={(date)=>setHistory_edate(date)}
                    dateFormat="yyyy-MM-dd"
                    className='datePicker'
                    placeholderText='End Date'
                    />
                  </div>
                  <div className='modalFilterBtn'>
                        <button className='btn-small' onClick={getDate}>Filter</button>
                        {showDownloadBtn && <CSVLink
                        data={downloadedData}
                        onClick={showNotifications}
                        filename={"Booking.csv"}
                        target={"_blank"}
                        className='btn-small'>Download</CSVLink>}
                    </div>
                    {showNotification && <span style={{color:"green"}}>Downloded Successfully.</span>}
                </ModalBody>
                
        </Modal>

       {
        loading ? (
          <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p style={{ fontSize: "16px" }}>Loading....</p>
        </div>
        ) :(
           <section>
          <Table id='historyTable'>
            <thead>
              <tr style={{borderBottom:"1px solid black"}}>
                <th><pre>ID</pre><input type="text" placeholder='Filter' onChange={handleSearch}/></th>
                <th><pre>TOUR ID</pre><input type="text" placeholder='Filter' /></th>
                <th><pre>SESSION ID</pre><input type="text" placeholder='Filter' /></th>
                <th><pre>TRACK TIME</pre><input type="text" placeholder='Filter' /></th>
                <th><pre>LATITUDE</pre><input type="text" placeholder='Filter' /></th>
                <th><pre>LONGITUDE</pre><input type="text" placeholder='Filter' onChange={handleSearch} /></th>
              </tr>
            </thead>
            <tbody>
              {
                tableData.filter((item)=>
                item.id.toString().includes(search)||item.longitude.toString().includes(search)).map((item,id,index)=>{
                  return(
                    <>
                    <tr key={index} style={{borderBottom:"0.8px solid lightgrey",textAlign:"left"}}>
                      <td>{item.id}</td>
                      <td>{item.tour_id}</td>
                      <td>{item.session_id}</td>
                      <td>{item.loc_time}</td>
                      <td>{item.latitude}</td>
                      <td>{item.longitude}</td>
                    </tr>
                    </>
                  )
                })
              }
            </tbody>
            <tfoot></tfoot>
          </Table>
          </section>
        )
       }

        <section style={{position:"relative",marginBottom:"30px",marginTop:"10px"}}>
        <Pagination
          handlePageChange={handlePageChange}
          pageNumber={pageNumber}
          pageCount={pageCount}/>
        </section>
        
    </div>
  )
}

export default HistoryTable