import React, { useState } from 'react';
import "../../styles/Admin/Invoice.css";
import axios from 'axios';
import { baseUrl } from '../../api/apiConfig';

const Invoice = () => {
  const[file,setFile]=useState("")
  const[selected,setSelected]=useState("")
  const options = ["General", "Bulk"];


  const getOptionValue=(e)=>{
    setFile(e.target.files[0])
  }
  const handleUploadClick=async()=>{
     if(!file){
      alert("Choose some files..")
      return
     }
      else if(selected === "General"){
      let data=new FormData()
      data.append("file",file)
      const response=await axios.post(`${baseUrl}/admin/invoice`,data)
    }else if(selected === "Bulk")
      {
        let data= new FormData();
        data.append("file",file)
        const response=await axios.post(`${baseUrl}/admin/bulk-invoice`,data)
      }

  }




  return (
    <div style={{margin:"8px",padding:"20px",width:"710px",boxShadow:" 0 0 5px 2px rgba(0, 0, 0, 0.2)"}}>
      
      <p style={{fontWeight:"bold"}}>Invoice Generation :</p>

      <p>Invoice Type :</p>

      <div className='select'>
        <select onChange={(e)=>setSelected(e.target.value)}>
        <option value={selected} >Select</option>
          {
            options.map((opt,index)=><option value={opt} key={index}>{opt}</option>)
          }
            
        </select>
      </div>

      <p>Invoice Details File :</p>
      <form>
        <input type="file" accept=".xlsx" style={{marginBottom:"30px"}} onChange={getOptionValue} />
      </form>
      <button type='button' className='btn-small' onClick={handleUploadClick}>Upload</button>
    </div>
  )
}


export default Invoice