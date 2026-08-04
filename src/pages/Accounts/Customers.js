import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Search} from "react-bootstrap-icons";
import {BiEditAlt} from "react-icons/bi"
import{Table} from "reactstrap";
// import {cusData} from "../../dummyData/Accounts/customersData";
import{Modal,ModalHeader,ModalBody}from "reactstrap"
import Pagination from '../../Pagination';
import {baseUrl} from "../../api/apiConfig"
import ReactSelect from '../../ReactSelect';
// CSS...
import "../../styles/Accounts/customer.css";
import { MdClose } from "react-icons/md";

const Customers = () => {
  const[customerData,setCustomerData]=useState([]);
  const[total,setTotal]=useState(0);
  const[search,setSearch]=useState("")
  const[pageNumber,setPageNumber]=useState(0)
  const[cusModal,setCusModal]=useState(false)
  const[companyNameList,setCompanyNameList]=useState([])
  const[value,setValue]=useState(null)
  const[companyId,setCompanyId]=useState(null)
  const[isClearable,setIsClearable]=useState(true)
  const[cusId,setCusId]=useState(null)
  const [paginationShow, setPaginationShow] = useState(true);
  


  const handleChangesCusEditModal=(id)=>{
    setCusModal(!cusModal)
    setCusId(id)
    setValue(null)
  }

  const getAllCompaniesList=async()=>{
    try {
      const response=await axios.post(`${baseUrl}/users/getAllCompanies`,{limit:100,offset:0})
      if(response.data.success){
        const companiesList=response.data.data;
        const reArrangeList=companiesList.map((elem,index)=>({
          label:elem.company_name,
          value:elem.id
        }))
        setCompanyNameList(reArrangeList)
      }
      
    } catch (error) {
      
    }
  }

  const handleSelectedOption=(selected)=>{
        setValue(selected)
        setCompanyId(selected.value)
  }
  const updateCompanyName=async()=>{
    const payload={
      user_id:cusId,
      company_id:companyId
    }
   try {
    const response=await axios.post(`${baseUrl}/users/tagCutomerToCompany`,payload)
    if(response.data.success){
      alert("Tagged Successfully.✅")
      getCustomersData()
      setCusModal(false)
      
    }
    
   } catch (error) {
    console.error(error,error.message)
    alert("Failed changes ?")
    
   }
  }


  const handleChange=(e)=>{
    let value =e.target.value.trim()
    setSearch(value)
    if(value.length != 0){
      setPageNumber(0)
      getAllCustomersData();
    }
    if(value.length == 0){
      getClearData();
      setPageNumber(0)
    }
   
    // if(e.target.value.length >= 1){
    //   getAllCustomersData();
    // }
    // if(e.target.value.length === 0){
    //   getClearData();
    // } 
    // setPageNumber(0)

  }

  let showDataPerPage=10;
  let offset=showDataPerPage*pageNumber
  const handlePageChange=({selected})=>{
    setPageNumber(selected)
  }

  let pageCount=Math.ceil(total/showDataPerPage)
  let pagesVisited=pageNumber*showDataPerPage;
  

      // Api calling 
      const url=`${baseUrl}/users/getAllCustomers`;
      async function getCustomersData(){
        const response=await axios.post(url,{limit:showDataPerPage,offset:offset});
        console.log(response.data.data.customers);
        setCustomerData(response.data.data.customers);
        setTotal(response.data.data.count);
        let total_Customers=response.data.data.count
        localStorage.setItem("customersCount",total_Customers)
      }

      // getAllCustomersData...

      const getAllCustomersData=async ()=>{
        const response=await axios.post(url,{limit:total,offset:offset});
        setCustomerData(response.data.data.customers);
        setPaginationShow(false)
      }

      // getClearData....

      const getClearData=()=>{
        setSearch("")
        getCustomersData()
        setPaginationShow(true)
      }


      useEffect(()=>{
        getCustomersData()
  
      },[offset]);

      


  return (
    <div style={{padding: "10px" }}>
        <section className="searchBar-section">
        <div className="session-Top-Input" style={{position:"relative",display:"flex",gap:"10px"}}>
        <MdClose size={18} style={{position:"absolute",left:"420px",top:"10px",cursor:"pointer"}} onClick={()=>{
          getClearData()
          setPageNumber(0)
        }}/>
          <input  type="text" onChange={handleChange} value={search} placeholder="Search by ID, Cus name,Mobileno.." />
        </div>
      </section>

      <section id='customersEditModal'>
        <Modal isOpen={cusModal} id='customer-edit-modal-mobile'>
          <ModalHeader toggle={handleChangesCusEditModal}>
            <p>Company Tag:</p>
          </ModalHeader>
          <ModalBody>
            <div className='edit-modal-body'>
              <div style={{width:"250px"}}>
              <ReactSelect
              isMulti={false}
              placeholder={"Search or Choose Company"}
              value={value}
              // isClearable={isClearable}
              options={companyNameList}
              handleSelectedOption={handleSelectedOption}
            />
            </div>
            <div className='edit-modal-button'>
              <button onClick={updateCompanyName}>Submit</button>
              <button onClick={()=>setCusModal(false)}>Cancel</button>
            </div>
            </div>

          </ModalBody>
        </Modal>

      </section>

      <section style={{marginTop:"50px"}}>
          <Table>
            <thead>
              <tr style={{fontSize:"12px",borderBottom:"1px solid black"}}>
                <th>EDIT</th>
                <th>ID</th>
                <th>NAME</th>
                <th>MOBILE NUMBER</th>
                <th>COMPANY NAME</th>
                <th>COMPANY TYPE</th>
                <th>DEFAULT COMPANY <br/> NAME</th>
              </tr>
            </thead>
            <tbody>
              {
                customerData.filter((item)=>
                  item.id.toString().includes(search.trim())||  
                  item.name.toLowerCase().includes(search.toLowerCase())||
                  item.mobile.includes(search.toLowerCase())||
                  item.company_name?.includes(search.toLowerCase())
                 )
                .map((elem)=>{
                  return(
                    <tr key={elem.id} style={{borderBottom:"1px solid lightgrey"}}>
                      <td><BiEditAlt 
                      style={{fontSize:"18px",cursor:"pointer"}}
                      onClick={()=>{
                        handleChangesCusEditModal(elem.id)
                        getAllCompaniesList()
                      }}
                      /></td>
                      <td>{elem.id}</td>
                      <td>{elem.name}</td>
                      <td>{elem.mobile}</td>
                      <td>{elem.company_name}</td>
                      <td>{elem.company_type}</td>
                      <td>{elem.company == null ? "" : elem.company.company_name}</td>
                    </tr>
                  )
                })
              }
              
            </tbody>
          </Table>
      </section>

      <section id='customerPagination' style={{position:"relative",marginBottom:"30px",marginTop:"30px"}}>
        {
          paginationShow &&  <Pagination
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          paginationcontrol="pagenoCounts"
          pageNumber={pageNumber}/>
        }
              
      </section>

    </div>
  )
}

export default Customers;

{/* <div style={{ display:"flex"}}>
            <button className='btn-big' onClick={getAllCustomersData}>Select All</button>
            <button className='btn-big' style={{marginLeft:"-15px"}} onClick={getClearData}>Clear</button>
          </div> */}


