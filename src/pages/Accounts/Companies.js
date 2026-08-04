import React, { useEffect, useState } from 'react';
import { Search} from "react-bootstrap-icons";
import{Table,Modal,ModalHeader,ModalBody} from "reactstrap";
import "../../styles/Accounts/companies.css";
import {MdAdd} from "react-icons/md";
import {BiEditAlt} from "react-icons/bi";
import axios from 'axios';
import Pagination from '../../Pagination';
import { baseUrl } from '../../api/apiConfig';
import ReactSelect from '../../ReactSelect';
import makeAnimated from 'react-select/animated';
import { MdClose } from "react-icons/md";



const Companies = () => {
  const[comData,setComData]=useState([])
  const[options,setOptions]=useState([])
  const[compModal,setCompModal]=useState(false);
  const[sortOrder,setSortOrder]=useState(null);
  const[search,setSearch]=useState("")
  const[pageNumber,setPageNumber]=useState(0)
  const [paginationShow, setPaginationShow] = useState(true);
  // payloads valueee
  const[company_name,setCompany_name]=useState("")   
  const[company_type,setCompany_type]=useState("")   
  const[users,setUsers]=useState("")
  const[is_active,setIs_active]=useState(null)
  const[waiting_charge_type,setWaiting_charge_type]=useState(0)
  const[name,setName]=useState("")
  const[mobile,setMobile]=useState("")
  const[email,setEmail]=useState("")
  const[address,setAddres]=useState("");
  const[gst,setGst]=useState(0);
  const[billing_cycle,setBilling_cycle]=useState("")
  const[discount_on_waiting_charges,setDiscount_on_waiting_charges]=useState(0)
  const[dead_miles_price,setDead_miles_price]=useState("")

  const[compEditModal,setCompEditModal]=useState(false)
  const[editData,setEditData]=useState(null)
  const[assignedCustomers,setAssignedCustomers]=useState([])
  const[value,setValue]=useState(null)
  const[names,setNames]=useState([])
  const [bapid,setbapId]=useState('')


const animatedComponents = makeAnimated()

  const openCompEditModal=(item)=>{
    console.log(item);
    
    let ids = item.users?.split(',').map(function(user) {
      return user.replace('#', '');
    }).filter(function(user) {
      return user !== '';
    });          
    const getcustomersByid=async(ids)=>{
      try {
        const data=await axios.post(`${baseUrl}/users/getCustomersByIds`,{customerIds:ids})
        let names=data.data.data;
        names=names.map((item)=>({
          label:item.name,
          value:`${item.id}`
        }))
        // setNames(names);
        setValue(names);
        
      } catch (error) {
        
      }

    }
    getcustomersByid(ids)
    setCompEditModal(!compEditModal)
    setEditData(item)  
  
  }
  useEffect(()=>{
    setEditData(editData)
  },[editData])

  const getAssignedCustomers=async ()=>{
    try {
        const resp=await axios.post(`${baseUrl}/users/getUnAssignedCustomers`);
        if(resp.data.success){
          const data=resp.data.data;
          const reData=data.map((item)=>
            ({
              label:item.name,
              value:`${item.id}`
            })
          )
          setAssignedCustomers(reData)
        }
        
      } catch (error) {
        console.error(error)
      }
  }

  const handleSelectedOption=(selected)=>{
    let reSelected=selected[0]
    setValue(selected)
    setEditData({...editData,users:`${selected.value}`})
    let multicompaniesSelection=selected.map((item)=>`#${item.value}`).join(",")
    setUsers(multicompaniesSelection)
    
  }
  const handleSelectedOption1=(selected)=>{
    setValue(selected)
    setEditData({...editData,users:`${selected.value}`})
    let multicompaniesSelection=selected.map((item)=>`#${item.value}`).join(",")
    setUsers(multicompaniesSelection)
    // setUsers(multicompaniesSelection)
  }


  const addcompanyPayload={
    additional_pickup_charge:150,
    address:address,
    billing_cycle:billing_cycle,
    company_name:company_name,
    dead_miles_price:dead_miles_price,
    discount_on_waiting_charges:discount_on_waiting_charges,
    email:email,
    extra_charge_percentage:0,
    gst:gst,
    is_active:is_active,
    min_base_fare:150,
    mobile:mobile,
    name:name,
    return_percentage:80,
    return_percentage_value:0.9,
    users:users,
    waiting_charge_type:waiting_charge_type,
    bap_id:bapid
  }
  
  
// users:company_type == "GOODMOVE" ? users+"," : "",
// users:users+"," ,

  const sendData=async(e)=>{
    e.preventDefault();
    let newEditedData={
      ...editData,
      users:addcompanyPayload.users ? addcompanyPayload.users+"," : editData.users
    }
    console.log("newEditedData..",newEditedData)
    try {
      const resp=await axios.post(`${baseUrl}/users/addCustomerCompany`,newEditedData);
      if(resp.data.success){
        alert("Changes Saved. ✅")
        setCompEditModal(false)
        getCompaniesData()
      }
      
    } catch (error) {
      console.error(error)
      alert("Failed to Add Company ?")
    }
  }

  const cancelSaveChanges=()=>{
    setCompEditModal(false)
  }
  

  
  const handleBillingCycleSelection=(e)=>{
    setBilling_cycle(e.target.value)
  }

  const handleActiveStatusSelection=(e)=>{
    e.target.value ==="YES"?setIs_active(true):setIs_active(false)

  }
  // Add Companies function ... 
  
  const handleAddingNewCompany=async(e)=>{
    e.preventDefault();
    const reqObject ={
      ...addcompanyPayload,
      users:company_type == "GOODMOVE" ? users +"," : "",
    }
      try {
        const addRequest=await axios.post(`${baseUrl}/users/addCustomerCompany`,reqObject)
        if(addRequest.data.success){
          setCompModal(false)
          getCompaniesData()
          alert("New Company Added.")
          setCompany_type("")
        }
      } catch (error) {
        console.log(error);
        alert("Failed to Add Company ?")
      }
  }
// Closed Add companies Modal ..
  const changecompModal=()=>{
    setCompModal(!compModal)
    setCompany_name("")
    setAddres("")
    setBilling_cycle("")
    setDead_miles_price("")
    setDiscount_on_waiting_charges(0)
    setEmail("")
    setGst("")
    setIs_active(null)
    setMobile("")
    setName("")
    setUsers("")
    setWaiting_charge_type("")
    setValue("")
    setCompany_type("")

  }

// FILTER BY COMPANY NAME ....
  const handleCompaniesSorting=(event)=>{
    setSortOrder(event.target.value);

  }
  const copiedData=[...comData]
  if(sortOrder === "ascending"){
     copiedData.sort((a,b)=>{
      return a.company_name.toLowerCase().localeCompare(b.company_name.toLowerCase())
    })
    

  }else if(sortOrder === "descending"){
    copiedData.sort((a,b)=>{
      return b.company_name.localeCompare(a.company_name)
    })

  }

    const handleChange=(e)=>{
      let value=e.target.value.trim()
      setSearch(value)
      if(value.length !=0){
        setPageNumber(0)
        setPaginationShow(false)
      }
      if(value.length ==0){
        setPaginationShow(true)
        setPageNumber(0)
      }
      // else{
      //   setPaginationShow(true)
      // }
      
    }
    
    const handlePageChange=({selected})=>{
      console.log("selected ",selected);
      setPageNumber(selected)
    }
    let showDataPerPage=10;
    let pageCount=Math.ceil(comData.length/showDataPerPage)
    let pagesVisited=pageNumber*showDataPerPage;
    let offset=pageNumber*showDataPerPage;

  // console.log(copiedData);
        // Api calling 
        const url=`${baseUrl}/users/getAllCompanies`;
        async function getCompaniesData(){
          const response=await axios.post(url,{limit:500,offset:0});
          setComData(response.data.data);
        }

        useEffect(()=>{
          getCompaniesData()
    
        },[]);

  return (
    <div style={{padding: "10px" }}>
      <section className="searchBar-section">
        <div className="session-Top-Input" style={{position:"relative"}}>
        <MdClose size={18} style={{position:"absolute",left:"420px",top:"10px",cursor:"pointer"}} onClick={()=>{
          getCompaniesData()
          setSearch("")
          setPageNumber(0)
          setPaginationShow(true)
        }}/>
          <input  type="text" onChange={handleChange} value={search} placeholder="Search by Comp name.." />
        </div>
        <div className="vehicle-btns">
          <button className="btn-big" 
            onClick={()=>{
              setCompModal(true)
              getAssignedCustomers()}}>
              <MdAdd  size={23}/> Add Company</button>
        </div>
      </section>

      <section className='companyModal'>
        <Modal isOpen={compModal} id='addCompany-modal'>
          <ModalHeader style={{border:"none"}} toggle={changecompModal}>
            <p style={{position:'relative', top:"10px"}}>Add New Company :</p>
          </ModalHeader>
          <ModalBody>
            <form className='addcompany-form' onSubmit={handleAddingNewCompany}>
              <label htmlFor="company type">Company Type :</label>
              <select name="company type" id="company type" style={{border:"1px solid"}}
              onChange={(e)=>{
                setCompany_type(e.target.value)
                }}>
                <option value="" >Choose company type</option>
                <option value="ONDC">ONDC</option>
                <option value="GOODMOVE">Goodmove</option>
              </select>
              <label htmlFor="company name">Company Name :</label>
              <input type="text" name='company name' id='company name' autoComplete='off'
              onChange={(e)=>setCompany_name(e.target.value)} placeholder='Enter company name' />
              {
                company_type == "GOODMOVE" && <>
                <label htmlFor="users">Users</label>
                <ReactSelect
                value={value}
                options={assignedCustomers}
                handleSelectedOption={handleSelectedOption}
                isMulti={true}
                // isMulti
                onChange={""}
              />
                </>
              }
              {
                company_type == "ONDC" && <>
                  <label htmlFor="bap_id" style={{marginTop:"15px"}}>Bap Id:</label>
              <input type="text" name='bap_id' id='bap_id' autoComplete='off'
              onChange={(e)=>setbapId(e.target.value)} placeholder='Enter bap_id' />
                </>
              }
               
              {/* <input type="text" name='users' id='users' onChange={(e)=>setUsers(e.target.value)} placeholder='Users' /> */}
              <label htmlFor="active status" style={{marginTop:"6px"}}>Active Status :</label>
              <select name="active status" id="active status" style={{border:"1px solid"}} onChange={handleActiveStatusSelection}>
                <option value="choose status" selected>Choose status</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
              <label htmlFor="waiting charge">Waiting Charge Type :</label>
              <select name="" id="" style={{border:"1px solid"}} onChange={(e)=>setWaiting_charge_type(e.target.value)}>
               <option value="choose " selected>Choose </option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
              </select>
              {/* <input type="text" name='waiting charge' id='waiting charge' placeholder='Waiting Charge Type' /> */}
              <label htmlFor="name">Name :</label>
              <input type="text" name='name' autoComplete='off' id='name'onChange={(e)=>setName(e.target.value)} placeholder='Enter name' />
              <label htmlFor="mobile">Mobile :</label>
              <input type="text" name='mobile' autoComplete='off' id='mobile'onChange={(e)=>setMobile(e.target.value)} placeholder='Enter mobile no' />
              <label htmlFor="email">Email :</label>
              <input type="text" name='email'  id='email'onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your valid Email id' />
              <label htmlFor="address">Address :</label>
              <input type="text" name='address' autoComplete='new-password' id='address' onChange={(e)=>setAddres(e.target.value)} placeholder='Enter address' />
              <label htmlFor="gst">GST :</label>
              <input type="text" name='gst' autoComplete='off' id='gst'onChange={(e)=>setGst(e.target.value)}placeholder='Enter GST No or Nil' />
              <label htmlFor="billing cycle">Billing Cycle :</label>
              <select name="billing cycle" id="billing cycle" style={{border:"1px solid"}} onChange={handleBillingCycleSelection}>
                <option value="Choose Cycle" selected>Choose Cycle</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="BiMonthly">BiMonthly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <label htmlFor="discount">Discount on Waiting Charges :</label>
              <input type="text" name='discount' autoComplete='off' id='discount'onChange={(e)=>setDiscount_on_waiting_charges(e.target.value)} 
              placeholder='waiting charge discount' />
              <label htmlFor="discount">Dead Miles Price :</label>
              <input type="text" name='Dead Miles Price' autoComplete='off' id='Dead Miles Price'onChange={(e)=>setDead_miles_price(e.target.value)} 
              placeholder='waiting charge discount' />

              <div style={{display:"flex",gap:"15px"}}>
              <button type='submit' className='btn-small'>ADD</button>
              <button type='reset' className='btn-small'>Clear</button>
              </div>

            </form>

          </ModalBody>
        </Modal>
      </section>
     

      <section id='company-edit-modal'>
        <Modal isOpen={compEditModal} id='companies-edit-modal-mobile'>
          <ModalHeader toggle={openCompEditModal} className='companies-edit-modal-mobileHeader'> 
            <span>Company Details Edit :</span>
          </ModalHeader>
          <ModalBody className='modalBody'>
            <form action="#" className='edit-company-form' style={{display:"flex",flexDirection:"column"}} onSubmit={sendData}>
              <label htmlFor="">Company Name :</label>
              <input type="text" value={editData?.company_name} 
              onChange={(e)=>setEditData({...editData,company_name:e.target.value})} />
              {
                editData?.users && <>
              <label htmlFor="">Users :</label>
              <ReactSelect
              value={value}
              // value={ff.map((item)=>item.name)}
              // value={value}
              isMulti={true}
              options={assignedCustomers}
              handleSelectedOption={handleSelectedOption1}
              onChange={(e)=>setEditData({...editData,users:e.target.value})}
              />
               </>
              }
               {editData?.bap_id && <>
                <label htmlFor="">Bap Id :</label>
                <input type="text" value={editData?.bap_id} 
                onChange={(e)=>setEditData({...editData,bap_id:e.target.value})} />
                </>}
                
              <label htmlFor="">Active Status :</label>
              <select name="" id="" value={editData?.is_active?"YES":"NO"} onChange={(e)=>setEditData({...editData,is_active:e.target.value=="YES"?true:false})}>
                {/* <option value="">{editData?.is_active == true ?"YES":"NO"}</option> */}
                <option value="YES" className='options'>YES</option>
                <option value="NO" className='options'>NO</option>
              </select>
              <label htmlFor="">Waiting Charge Type :</label>
              <select name="" id="" value={editData?.waiting_charge_type} onChange={(e)=>setEditData({...editData,waiting_charge_type:e.target.value})}>
                <option value="#">Choose eny one</option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
              </select>
              <label htmlFor="">Name :</label>
              <input type="text" value={editData?.name} 
              onChange={(e)=>setEditData({...editData,name:e.target.value})} />
              <label htmlFor="">Mobile :</label>
              <input type="text" value={editData?.mobile} 
              onChange={(e)=>setEditData({...editData,mobile:e.target.value})} />
              <label htmlFor="">Email :</label>
              <input type="text" value={editData?.email} 
              onChange={(e)=>setEditData({...editData,email:e.target.value})} />
              <label htmlFor="">Address :</label>
              <input type="text" value={editData?.address} 
              onChange={(e)=>setEditData({...editData,address:e.target.value})} />
              <label htmlFor="">GST :</label>
              <input type="text" value={editData?.gst} 
              onChange={(e)=>setEditData({...editData,gst:e.target.value})} />
              <label htmlFor="">Billing Cycle :</label>
              <select name="" id="" value={editData?.billing_cycle=="Daily"?"Daily":editData?.billing_cycle=="Weekly"?"Weekly":
              editData?.billing_cycle=="Bimonthly"?"Bimonthly":"Monthly"}
              onChange={(e)=>setEditData({...editData,billing_cycle:e.target.value})}
              >
                <option value="#">Choose</option>
                <option value="Daily" >Daily</option>
                <option value="Weekly" >Weekly</option>
                <option value="Bimonthly" >Bimonthly</option>
                <option value="Monthly" >Monthly</option>
              </select>
              {/* <input type="text" value={editData?.billing_cycle} 
              onChange={(e)=>setEditData({...editData,billing_cycle:e.target.value})} /> */}
              <label htmlFor="">Discount on Waiting Charges :</label>
              <input type="text" value={editData?.discount_on_waiting_charges} 
              onChange={(e)=>setEditData({...editData,discount_on_waiting_charges:e.target.value})}/>
              <label htmlFor="">Dead Miles Price :</label>
              <input type="text" value={editData?.dead_miles_price} 
              onChange={(e)=>setEditData({...editData,dead_miles_price:e.target.value})}/>
              <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>
              <button type='submit' className='btn-small'>SAVE</button>
              <button type='reset' onClick={cancelSaveChanges} className='btn-small'>CANCEL</button>
              </div>
            </form>

          </ModalBody>
        </Modal>

      </section>

      <section style={{marginTop:"50px"}}>
          <Table responsive>
            <thead>
              <tr style={{fontSize:"12px",borderBottom:"1px solid black"}}>
                <th>EDIT</th>
                <th>ID</th>
                <th>COMPANY NAME</th>
                <th>USER</th>
                <th>ACTIVE STATUS</th>
                <th>WAITING CHARGE TYPE</th>
                <th>NAME</th>
                <th>MOBILE</th>
                <th>EMAIL</th>
                <th>ADDRESS</th>
                <th>GST</th>
                <th>BILLING CYCLE</th>
                <th>DISCOUNT ON WAITING CHARGES</th>
                <th>DEAD MILES PRICE</th>
                
              </tr>
            </thead>
            <tbody>
              { copiedData.filter((item)=>
              item.company_name.toLowerCase().includes(search.toLowerCase())
              ).slice(pagesVisited,pagesVisited+showDataPerPage)
              .map((item,index,array)=>{
                return(
                  <tr key={item.id} style={{borderBottom:"1px solid lightgrey"}}>
                    <td><BiEditAlt 
                    onClick={()=>
                      {openCompEditModal(item);
                      getAssignedCustomers()}
                    }
                    style={{fontSize:"18px",cursor:"pointer"}}/></td>
                    <td>{item.id}</td>
                    <td>{item.company_name}</td>
                    <td>{item.users == "," ? "-" : item.users}</td>
                    <td>{item.is_active ? "Yes": "No"}</td>
                    <td>{item.waiting_charge_type}</td>
                    <td>{item.name}</td>
                    <td>{item.mobile}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{item.gst}</td>
                    <td>{item.billing_cycle}</td>
                    <td>{item.discount_on_waiting_charges}</td>
                    <td>{item.dead_miles_price}</td>
                  </tr>
                )
              })}
              
            </tbody>
          </Table>
      </section>
      <section id='companiesPagination' style={{position:"relative",marginBottom:"30px",marginTop:"10px",padding:"10px"}}>
        {
          paginationShow && <Pagination
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          pageNumber={pageNumber}/>
        }
        
      </section>

    </div>
  )
}


export default Companies

// SORT BY COMPANY...

        // <div id='company-selection'>
        //   <select name="companySorting" value={sortOrder} id="sortOrder" onChange={handleCompaniesSorting}>
        //     <option value="#">Sort By Comp Name</option>
        //     <option value="ascending">A-Z</option>
        //     <option value="descending">Z-A</option>
        //   </select>

        // </div>

