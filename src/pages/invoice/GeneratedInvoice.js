import React, { useEffect, useState } from 'react';
import  DatePicker  from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// CSS...
import "../../styles/invoice/generateInvoice.css"
import moment from 'moment';
import { Table } from 'reactstrap';
import Pagination from "../../Pagination";
import axios from 'axios';
import { baseUrl } from '../../api/apiConfig';
import {BiEditAlt} from "react-icons/bi";
import { IoMdDownload } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import InvoiceEditModal from '../../components/editModals/InvoiceEditModal';

const GeneratedInvoice = () => {
  const[startDate,setStartDate]=useState()
  const[endDate,setEndDate]=useState()
  const[invoiceData,setInvoiceData]=useState([])
  const[downloadInvoice,setDownloadInvoice]=useState([])
  const[filterInvoice,setFilterInvoice]=useState({from_date:"",to_date:""})
  const[pageNumber,setPageNumber]=useState(0) 
  const[totalCount,setTotalCount]=useState(0)
  const[invoiceModal,setInvoiceModal]=useState(false)
  const[editObj,setEditObj]=useState(null)
  const[search,setSearch]=useState("")

  const closeInvoiceModal=()=>{
    setInvoiceModal(false)
  }

  const handleStartDate=(date)=>{
    let start_date=moment(date).format("YYYY-MM-DD")
    setStartDate(date)
    setFilterInvoice({...filterInvoice,from_date:start_date})
  }
  const handleEndDate=(date)=>{
    let end_date=moment(date).format("YYYY-MM-DD")
    setEndDate(date)
    setFilterInvoice({...filterInvoice,to_date:end_date})
  }

  const downloadInvoices=async()=>{
    try {
      const request=await axios.post(`${baseUrl}/booking/downloadInvoiceFiles`,filterInvoice)
      if(request.data.success && request.data.data.length){
        const reqResult=request.data.data
        reqResult.forEach(async (invoice, index) => {
                setTimeout(() => {
                    window.location.href = invoice.invoice_file;
                }, index * 2000)
            })

        // setDownloadInvoice(reqResult)
      }
      
    } catch (error) {
      console.log(error)
      
    }

  }
  // if(invoicesRes.success && invoicesRes.data.length) {
  //   invoicesRes.data.forEach(async (invoice: any, index: number) => {
  //       setTimeout(() => {
  //           window.location.href = invoice.invoice_file;
  //       }, index * 2000)
  //   })
  // }
  let showDataPerPage=10;
  const handlePageChange=({selected})=>{
    setPageNumber(selected)
  }
  let offset=showDataPerPage*pageNumber
  let pageCount=Math.ceil(totalCount/showDataPerPage)

  const getAllInvoices=async()=>{
    try {
      const request=await axios.post(`${baseUrl}/booking/getInvoices`,{limit:showDataPerPage,offset:offset})
      // console.log(request);
      if(request.data.success){
        // console.log(request.data.data.invoices);
        const reqResult=request.data.data.invoices
        setInvoiceData(reqResult)
        let totalCount=request.data.data.count;
        setTotalCount(totalCount)
      }
      
      
    } catch (error) {
      console.log(error);
      
      
    }
  }
  const getSearch=(e)=>{
    let textValue=e.target.value.trim().toLowerCase()
    setSearch(textValue)
  }
    
  
  // console.log(invoiceData)
  useEffect(()=>{
    getAllInvoices()
  },[offset])
  return (
    <div id='generateInvoice-Container'>
        <section id='inputsSection'>
          
            
          <input type="text" placeholder='Search..' className='search' />
          
          <div className='dateInputs'>
            <DatePicker
            selected={startDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date)=>{
              handleStartDate(date)
            }}
            placeholderText='start Date'
            />
            <DatePicker
            selected={endDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date)=>handleEndDate(date)}
            placeholderText='end Date'
            />
          </div>
          <button className='btn-small' onClick={downloadInvoices}>
            <IoMdDownload size={16}/> {""}
            Download Invoices
            </button>
          
        </section>
        <InvoiceEditModal
        isopen={invoiceModal}
        editObj={editObj}
        toggle={closeInvoiceModal}
        initialFunction={getAllInvoices}
    />
        <section id='TableSection'>
          <Table responsive>
            <thead>
              <tr>
                <th>EDIT</th>
                <th>ID</th>
                <th>INVOICE NUMBER</th>
                <th>INVOICE DATE</th>
                <th>COMPANY NAME</th>
                <th>INVOICE FILE</th>
                <th>TRIP FILE</th>
                <th>WAITING TRIP FILE</th>
                <th>INVOICE AMOUNT</th>
                <th>PAID AMOUNT</th>
                <th>PART AMOUNT</th>
                <th>STATUS</th>
                <th>COMMENTS</th>
              </tr>
            </thead>
            <tbody>
              {
                invoiceData.map((elem,index)=>{
                  return(
                    <tr key={index}>
                      <td><BiEditAlt style={{cursor:"pointer"}} size={18} onClick={()=>{
                        setInvoiceModal(true)
                        setEditObj(elem)
                      }}/></td>
                      <td>{elem.id}</td>
                      <td>{elem.invoice_number}</td>
                      <td>{elem.invoice_date}</td>
                      <td>{elem.company_name}</td>
                      <td><a href={elem.invoice_file} target='_blank'> {elem.invoice_date}.pdf</a></td>
                      <td><a href={elem.trip_file} target='_blank'>{elem.invoice_date}_tripsheet.pdf</a></td>
                      <td><a href={elem.waiting_trip_file} target='_blank'>{elem.invoice_date}_tripsheetWaiting.pdf</a></td>
                      <td>{elem.invoice_amount}</td>
                      <td>{elem.paid_amount}</td>
                      <td>{elem.part_amount}</td>
                      <td>{elem.payment_status}</td>
                      <td>{elem.comments}</td>
                    </tr>
                  )
                })
              }
            </tbody>

          </Table>

        </section  >
        <section style={{position:"relative",marginBottom:"30px",marginTop:"5px",paddingBottom:"10px"}}>
          <div className="paginationContainer" style={{position:'absolute'}}>
                <div className="paginationBtnInput">
                <Pagination
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
                pageCount={pageCount}
                />
                </div>
              </div>
      </section>
    </div>
  )
}

export default GeneratedInvoice

