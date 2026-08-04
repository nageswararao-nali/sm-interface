import React,{useEffect,useState} from 'react'
import axios from 'axios';
import moment from 'moment';
import { Table } from 'reactstrap';
import Pagination from '../../Pagination';
import { baseUrl } from '../../api/apiConfig';

const Transaction = () => {
  const [loading,setLoading]=useState(false)
  const [trans_details,setTrans_details]=useState([])
  const [count,setTotalCount]=useState(null)
  const [message,setMessage]=useState('')
  const [pageNumber,setPageNumber]=useState(0)
  const showDataPerPage=10;
  const offset=pageNumber*showDataPerPage;
  const pageCount=Math.ceil(count/showDataPerPage)
  const handlePageChange=({selected})=>{
    setPageNumber(selected)
  }


    const getAll_TransctionDetails=async()=>{
      try {
        setLoading(true)
        const resp_data=await axios.post(`${baseUrl}/driver/getDriverTransactions`,{
          limit:showDataPerPage,offset:offset
        })
        const {success,data,message}=resp_data.data
        setTrans_details(data.transactions)
        setTotalCount(data.count)
      } catch (error) {
        setMessage(error.response.data.error)
        console.log(error,error.message)
      }finally{
        setLoading(false)
        
      }
    }
    console.log("trans_details..",trans_details)

    useEffect(()=>{
      getAll_TransctionDetails()
    },[offset])

  return (
    <div style={{padding:"10px",marginTop:"30px"}}>
      <section id='drivers_summaryTable'>
          <Table responsive >
            <thead>
              <tr style={{borderBottom:"2px solid grey"}}>
                <th>USER ID</th>
                <th>DRIVER NAME</th>
                <th>TRANS DATE</th>
                <th>TRANSACTION TIME</th>
                <th>TRANS TYPE</th>
                <th>AMOUNT</th>
                <th>REMARKS</th>
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
              </tr>):trans_details.length > 0 ?
                  trans_details?.map((item)=>
                  <tr style={{borderBottom:"0.8px solid lightgrey"}}>
                     <td>{item.user_id}</td>
                    <td>{item.driver_name}</td>
                    <td>{item.transaction_date}</td>
                    <td>{moment(item.transaction_date_time).format('YYYY-MM-DD, h:mm:ss A')}</td>
                    <td>{item.transaction_type}</td>
                    <td>{item.amount}</td>
                    <td>{item.notes}</td>
              </tr>) : 
              <tr><td colSpan={13} style={{textAlign:"center",color:"#30A46C"}}>{message}</td></tr>
              }
            </tbody>
          </Table>
       </section>
       <div className='pagination transaction_pagination' style={{position:"relative",marginBottom:"30px",marginTop:"10px"}}>
        <div className='paginationContainer'>
        {Boolean(trans_details.length) && <Pagination pageCount={pageCount} handlePageChange={handlePageChange} pageNumber={pageNumber}/>}
        </div>     
      </div> 
    </div>
  )
}

export default Transaction