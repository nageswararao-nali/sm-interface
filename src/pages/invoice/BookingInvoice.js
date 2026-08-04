import React, { useEffect, useState } from 'react';
import "../../styles/invoice/invoiceBill.css"
import { baseUrl } from '../../api/apiConfig';
import axios from 'axios';
import ReactSelect from 'react-select';
import  DatePicker  from 'react-datepicker';
import { Table } from 'reactstrap';
import Pagination from '../../Pagination';
import moment from 'moment/moment';

const BookingInvoice = () => {
  const[billingCycle,setBillingCycle]=useState({bCycle:"",limit:500,offset:0})
  const[filterPayload,setFilterPayload]=useState({company_id:"",from_date:"",to_date:""})
  const[companies,setCompanies]=useState([])
  const[data,setData]=useState([])
  const[value,setValue]=useState()
  const[startDate,setStartDate]=useState()
  const[endDate,setEndDate]=useState()
  const[pageNumber,setPageNumber]=useState(0) 
  const[totalCount,setTotalCount]=useState(null)
  const[loading,setLoading]=useState(false)
  const[isGetInv_Disabled,setIsGetInv_Disabled]=useState(false)
  const[isTourInv_Disabled,setIsTourInv_Disabled]=useState(false)
  const[error,setError]=useState(null);
  const[compID, setCompID] = useState("")
  // For ONDC purpose
  const [company_type,setCompany_Type]=useState("GOODMOVE")
  const [bapid,setbapId]=useState('')
  //

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '300px',  // Set the width
      maxHeight:"150px" ,// Set the height
      overflow:"scroll",
      scrollbarColor:"pink"
    }),
    menu: (provided) => ({
      ...provided,
      width: '300px',  // Set the width of the dropdown menu
    }),
    
  };
  

  const getBillingType=(e)=>{
    setBillingCycle({...billingCycle,bCycle:e.target.value})
  }

  const getCompaniesBybillingCycle=async()=>{
      try {
        const request=await axios.post(`${baseUrl}/users/getAllCompanies`,billingCycle)
        if(request.data.success){
          let listofCompanies=request.data.data;
          listofCompanies=listofCompanies.map((elem)=> 
            ({
              label:elem.company_name,value:elem.id
            })
          )
          setCompanies(listofCompanies)
        }
        
      } catch (error) {
        console.log(error);
        
      }

  }

  // Companies Selection...
  const handleSelectedOption=(selected)=>{
    setValue(selected)
    let companiesIds=selected;
    let companyId=companiesIds.map((elem)=>elem.value)
    console.log(companyId);
    setFilterPayload({
      ...filterPayload,
      company_id:companyId
    })

  }
  // Start Date ...

  const handleStartDate=(date)=>{
    setStartDate(date)
    let start_date=moment(date).format("YYYY-MM-DD")
    setFilterPayload({...filterPayload,from_date: start_date })
    
  }
  const handleEndDate=(date)=>{
    setEndDate(date)
    let end_date=moment(date).format("YYYY-MM-DD")
    setFilterPayload({...filterPayload,to_date:end_date})
    
  }

  const getClearData=()=>{
    window.location.reload()
  }

  

  let showDataPerPage=10;
  const handlePageChange=({selected})=>{
    setPageNumber(selected)
  }
  let offset=showDataPerPage*pageNumber
  let pageCount=Math.ceil(totalCount/showDataPerPage)

  const getInvoiceByCompany=async()=>{
    setLoading(true)
    setError(null);
    try {
      setCompID(filterPayload.company_id);
      const response=await axios.post(`${baseUrl}/booking/getInvoiceBookingsByCompanyId`,
          {
            company_id:filterPayload.company_id,
            from_date:startDate ?filterPayload.from_date : "",
            to_date:endDate ? filterPayload.to_date : "",
            limit:showDataPerPage,
            offset: filterPayload.company_id === compID ? offset : 0,
            }
              );
              // setCompID(filterPayload.company_id);
              if(filterPayload.company_id != compID){
                setPageNumber(0)
              }
      if(response.data.success){
        const respResult=response.data.data.bookings;
        setData(respResult)
        const totalCount=response.data.data.count;
        setTotalCount(totalCount)
        // setStartDate("")
        // setEndDate("")
      }else{
        setError(response.data.message)
      }
    } catch (error) {
      setError(error?.response?.data?.message)
      console.log(error.response.data.message);
      
      
    }finally{
      setLoading(false)
    }
  }
  console.log("Result of Array return value :",totalCount)
  

  const getGenerateInvoice=async()=>{
    try {
      const response=await axios.post(`${baseUrl}/booking/generateInvoiceByCompanyId`,filterPayload)
      console.log("getGenerateInvoice :",response.data)
      if(response.data.success){
        setIsGetInv_Disabled(true)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getTourInvoice=async()=>{
    try {
      const response=await axios.post(`${baseUrl}/booking/generateCompanyInvoiceByTour`,filterPayload)
      console.log("getTourInvoice :",response)
      if(response.data.success){
        setIsTourInv_Disabled(true)
      }
    } catch (error) {
      console.log(error);
      
    }

  }
  // For ONDC...

    const handle_bapid_Change=(e)=>{
      const lines = e.target.value
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");
      setbapId(lines)
    }

    const getInvoiceFor_ONDC = async()=>{
      const reqObj ={
        bap_id :bapid,
        from_date:filterPayload.from_date,
        to_date : filterPayload.to_date
      }
      try {
        const response = await axios.post(`${baseUrl}/booking/getInvoiceBookingsByBapId`,reqObj)
        const {success,data,message} = response.data
        setData(data.bookings)
        setTotalCount(data.count)
        // setbapId('')
        // setStartDate('')
        // setEndDate('')
        // setFilterPayload({...filterPayload,from_date: '',to_date :""})
        
      } catch (error) {
        console.log("Error in  getInvoiceFor_ONDC..",error.message)
      }
    }
    const genearteInvoiceFor_ONDC = async()=>{
      const reqObj ={
        bap_id :bapid,
        from_date:filterPayload.from_date,
        to_date : filterPayload.to_date
      }
      try {
        const response = await axios.post(`${baseUrl}/booking/generateInvoiceByBapId`,reqObj)
        const {success,data,message} = response.data
        if(Object.keys(data).length === 0){
          setTotalCount(0)
        }
        // setbapId('')
        // setStartDate('')
        // setEndDate('')
        // setFilterPayload({...filterPayload,from_date: '',to_date :""})
        
      } catch (error) {
        console.log("Error in getInvoiceFor_ONDC..",error.message)
      }
    }
    //     
 
  useEffect(()=>{
    if (filterPayload.company_id.length) {
      getInvoiceByCompany();
    }
  },[offset])

  useEffect(()=>{
    getCompaniesBybillingCycle()
  },[billingCycle?.bCycle])
  
  
  return (
    <div id='bookingInvoice-Container'>
      <section className='inputSection'>
        <select onChange={(e)=>{
          setCompany_Type(e.target.value)
          setStartDate('')
          setEndDate('')
          setFilterPayload({...filterPayload,from_date: '',to_date :""})
          setbapId('')
          setValue('')
          setCompID('')
        }}>
          <option value="GOODMOVE" selected>GoodMove</option>
          <option value="ONDC">ONDC</option>
        </select>
        {company_type == "GOODMOVE" && <>
          <select onChange={getBillingType}>
          <option value="" selected>Select Billing Cycle</option>
          <option value="Monthly">Monthly</option>
          <option value="Bimonthly">Bimonthly</option>
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
        </select>

        <div>
          <ReactSelect
          options={companies}
          isMulti={true}
          onChange={handleSelectedOption}
          value={value}
          placeholder="Select Companies.."
          menuPortalTarget={document.body}
          styles={customStyles}
        />
        </div>

          <div className='dateInputs'>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  handleStartDate(date)
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Start Date"
                
              />
            <DatePicker 
            selected={endDate}
            onChange={(date)=>handleEndDate(date)}
            dateFormat="yyyy-MM-dd"  
            placeholderText='End Date' />
          </div>
          {/* Buttons... */}
          <div className='buttonsInput'>
            <button className='btn-small'  onClick={getInvoiceByCompany}>Filter</button>
            <button className='btn-small' onClick={getClearData}>Clear</button>
            <button className={`btn-small ${ isGetInv_Disabled ? 'invoices_btn_disabled' : 'invoices_btn'}`} disabled={isGetInv_Disabled} onClick={getGenerateInvoice}>Get Invoice</button>
            <button className={isTourInv_Disabled ? 'btn_small_disabled':'btn-small'} disabled={isTourInv_Disabled} onClick={getTourInvoice}>Tour Invoice</button>
          </div>
        </>}

        {company_type == "ONDC" &&<>
              <textarea type="text" placeholder='Enter bap_id' id="bap_id" 
              value={bapid}
                onChange={handle_bapid_Change}/>
              <div className='dateInputs'>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  handleStartDate(date)
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Start Date"
                
              />
            <DatePicker 
            selected={endDate}
            onChange={(date)=>handleEndDate(date)}
            dateFormat="yyyy-MM-dd"  
            placeholderText='End Date' />
          </div>
          <div className='buttonsInput'>
            <button className='btn-small' onClick={getClearData}>Clear</button>
            <button className='btn-small' onClick={getInvoiceFor_ONDC}>Get Invoice</button>
            <button className='btn-small' onClick={genearteInvoiceFor_ONDC}>Generate Invoice</button>
          </div>
        </>}
      </section>
     
    
      <section id='InvoiceTable'>
        <Table responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>TOUR ID</th>
              <th>TYPE</th>
              <th>CUSTOMER NAME</th>
              <th>PICKUP LOCATION</th>
              <th>CREATED AT</th>
              <th>DROPOFF LOCATION</th>
              <th>WEIGHT</th>
              <th>STATUS</th>
              <th>DRIVER NAME</th>
              <th>TOUR STATUS</th>
              <th>REACHED PICKUP TIME</th>
              <th>PICKEDUP GOODS TIME</th>
              <th>REACHED DROPOFF TIME</th>
              <th>GOODS DELEIVERED TIME</th>
              <th>FARE</th>
              <th>WAITING CHARGE</th>
              <th>DATE ENTRIES</th>
              <th>VIVEGAM</th>
              <th>ADDITIONAL INFO</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={20}>
                  <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p style={{ fontSize: "16px" }}>Loading....</p>
                  </div>
                </td>
              </tr>
            ) : error ?(
              <tr>
                <td colSpan={20} style={{ textAlign: 'center',color:"red",fontSize:"16px" }}>
                  Failed to Get Data !
                </td>
              </tr>
            ):
            (
              totalCount === 0 ? (
                <tr>
                  <td colSpan={20} style={{ textAlign: 'center',color:"#30A46C",fontSize:"16px" }}>
                    No Records are Found...
                  </td>
                </tr>
              ) : (
                data.map((elem) => (
                  <tr key={elem.id}>
                    <td>{elem.id}</td>
                    <td>{elem.tour_id}</td>
                    <td>{elem.booking_type}</td>
                    <td>{elem.customer_name}</td>
                    <td>{elem.pickup_location}</td>
                    <td>{moment(elem.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>{elem.dropoff_location}</td>
                    <td>{elem.commodity_weight}</td>
                    <td>{elem.status}</td>
                    <td>{elem.driver_name}</td>
                    <td>{elem.booking_status}</td>
                    <td>{elem.reached_pickup ? "Yes" : "No"}</td>
                    <td>{elem.completed_pickup ? "Yes" : "No"}</td>
                    <td>{elem.reached_drop ? "Yes" : "No"}</td>
                    <td>{elem.completed_drop ? "Yes" : "No"}</td>
                    <td>{elem.fare}</td>
                    <td>{elem.waiting_charge}</td>
                    <td>{elem.is_manager_entered ? "INVALID" : "VALID"}</td>
                    <td>{elem.is_vivegam ? "YES" : "NO"}</td>
                    <td>{elem.instruction}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
          
        </Table>

      </section>
      {/* Pagination.... */}
      {totalCount && !error ? <section style={{paddingBottom:"40px"}}>
          <div className="paginationContainer" style={{position:'absolute',marginLeft:"250px"}}>
                <Pagination
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
                pageCount={pageCount}/>
              </div>
      </section>:""}
      
    </div>
  )
}

export default BookingInvoice