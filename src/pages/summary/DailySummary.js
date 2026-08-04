
import React,{useEffect, useState} from 'react';
import { Table, Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import { baseUrl } from '../../api/apiConfig';
import Pagination from '../../Pagination';
import { MdClose } from 'react-icons/md';

const DailySummary = () => {
  const [loading,setLoading]=useState(null)
  const [count,setTotalCount]=useState(null)
  const [summary,setSummary]=useState([])
  const [pageNumber,setPageNumber]=useState(0)
  const [message,setMessage]=useState("")
  const [search,setSearch]=useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [tourData, setTourData] = useState([])
  const [tourLoading, setTourLoading] = useState(false)
  const [tourError, setTourError] = useState("")
  const showDataPerPage=10;
  const handlePageChange=({selected})=>{
    setPageNumber(selected)
  }
  const offset=pageNumber*showDataPerPage;
  const pageCount=Math.ceil(count/showDataPerPage)
    const getDriversSummary=async()=>{
      try {
        setLoading(true)
        const response=await axios.post(`${baseUrl}/driver/getDriverSessionSummary`,{limit:10,offset:offset})
        const {success,data,message}=response.data
        if(success){
          setSummary(data.summary)
          setTotalCount(data.count)
          setMessage(message)
        }else{
          setMessage(response.data.error)
        }
      } catch (error) {
        setLoading(false)
        setMessage(error.response.data.error)
      }finally{
        setLoading(false)
      }
    }
  useEffect(()=>{
    getDriversSummary()
  },[offset])

  const handleClearSearch=()=>{
    setSearch("")
  }

  const handleViewTours = async (session_date, user_id) => {
    setModalOpen(true)
    setTourLoading(true)
    setTourError("")
    setTourData([])
    try {
      const response = await axios.post(`${baseUrl}/tours/getDriverToursByDate`, {
        calc_date: session_date,
        driver_id: user_id
      })
      const { success, data } = response.data
      if (success) {
        setTourData(data || [])
      } else {
        setTourError(response.data.error || "Failed to fetch tours")
      }
    } catch (error) {
      setTourError(error.response?.data?.error || "Error fetching tours")
    } finally {
      setTourLoading(false)
    }
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }
  return (
    <div style={{padding:"10px",marginTop:"30px"}}>
      {/* <section style={{marginBottom:"40px"}}>
        <div className='session-Top-Input' style={{position:"relative"}}>
        <MdClose size={18} style={{position:"absolute",left:"420px",top:"10px",cursor:"pointer"}} onClick={handleClearSearch} />
          <input type="text" placeholder='search by name..' value={search} onChange={(e)=>setSearch(e.target.value.trimStart())}/>
        </div>  
      </section> */}
       <section id='drivers_summaryTable'>
          <Table responsive >
            <thead>
              <tr style={{borderBottom:"2px solid grey"}}>
                <th>ID</th>
                <th>DRIVER NAME</th>
                <th>SESSION DATE</th>
                <th>SESSION ID'S</th>
                <th>DISTANCE</th>
                <th>TOTAL TIME</th>
                <th>REVENUE</th>
                <th>PAID</th>
                <th>TRUCKER PAYOUT</th>
                <th>REMARKS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {
                loading ? ( <tr>
                <td colSpan={10}>
                  <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p style={{ fontSize: "16px" }}>Loading....</p>
                  </div>
                </td>
              </tr>):summary.length > 0 ?
                  summary?.map((item)=>
                  <tr style={{borderBottom:"0.8px solid lightgrey"}}>
                    <td>{item.user_id}</td>
                    <td>{item.driver_name}</td>
                    <td>{item.session_date}</td>
                    <td>{item.session_ids}</td>
                    <td>{Math.round(item.total_distance)}</td>
                    <td>{item.total_time}</td>
                    <td>{item.total_revenue ? item.total_revenue :"-"}</td>
                    <td>{item.paid ? "YES":"NO"}</td>
                    <td>{item.fare ? item.fare :""}</td>
                    <td>{item.notes}</td>
                    <td>
                      <button
                        onClick={() => handleViewTours(item.session_date, item.user_id)}
                        style={{
                          padding: "5px 15px",
                          backgroundColor: "#30A46C",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        View
                      </button>
                    </td>
              </tr>) : 
              <tr><td colSpan={13} style={{textAlign:"center",color:"#30A46C"}}>{message}</td></tr>
              }
            </tbody>
          </Table>
       </section>

      <div className='pagination' style={{position:"relative",marginBottom:"30px",marginTop:"10px"}}>
        <div className='paginationContainer'>
        {Boolean(summary.length) && <Pagination pageCount={pageCount} handlePageChange={handlePageChange} pageNumber={pageNumber}/>}
        </div>
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Driver Tours</ModalHeader>
        <ModalBody>
          {tourLoading ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <p style={{ fontSize: "16px" }}>Loading....</p>
            </div>
          ) : tourError ? (
            <p style={{ color: "red", textAlign: "center" }}>{tourError}</p>
          ) : tourData.length > 0 ? (
            <Table responsive>
              <thead>
                <tr style={{ borderBottom: "2px solid grey" }}>
                  <th>DRIVER ID</th>
                  <th>TOUR ID</th>
                  <th>STATUS</th>
                  <th>TOUR STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tourData.map((tour, index) => (
                  <tr key={index} style={{ borderBottom: "0.8px solid lightgrey" }}>
                    <td>{tour.driver_id}</td>
                    <td>{tour.id}</td>
                    <td>{tour.status}</td>
                    <td>{tour.tour_status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p style={{ textAlign: "center", color: "#30A46C" }}>No tours found</p>
          )}
        </ModalBody>
      </Modal>
    </div>
  )
}

export default DailySummary