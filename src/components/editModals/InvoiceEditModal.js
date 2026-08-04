import React, { useEffect, useState } from 'react';
import{Modal,ModalBody,ModalHeader} from "reactstrap"
import { baseUrl } from '../../api/apiConfig';
import axios from 'axios';

const InvoiceEditModal = (props) => {
    const{isopen,editObj,toggle,initialFunction}=props;
    const[editedObj,setEditedObj]=useState()
    const saveChanges=async(e)=>{
        e.preventDefault();
        console.log(editedObj)
        try {
            const request=await axios.post(`${baseUrl}/booking/updateInvoiceData`,editedObj)
            console.log(request)
            if(request.data.success){
                alert("Updated Successfully.")
                initialFunction()
                toggle()
            }

            
        } catch (error) {
            console.log(error)
            
        }
        
    }
    useEffect(()=>{
        setEditedObj(editObj)
    },[editObj])
  return (
    <div>
        <Modal isOpen={isopen} id='invoiceEditModal'>
            <ModalHeader toggle={toggle}>
                <span>EDIT INVOICE :</span>
            </ModalHeader>
            <ModalBody className='modalBody'>
                <form onSubmit={saveChanges} className='modal_form'>
                    <label htmlFor="">Customer Paid Amount :</label>
                    <input type="text" 
                    value={editedObj?.paid_amount || ""}
                    onChange={(e)=>setEditedObj({...editObj,paid_amount:Number(e.target.value)})}
                    placeholder='customer paid amount'
                    />
                    <label htmlFor="">Payment Status :</label>
                    <select value={editedObj?.payment_status} 
                    onChange={(e)=>setEditedObj({...editedObj,payment_status:e.target.value})}>
                          <option className='options'>Choose Status</option>
                          <option className='options'value="Pending">Pending</option>
                          <option className='options'value="Part Payment">Part Payment</option>
                          <option className='options'value="Completed">Completed</option>
                    </select>
                    {
                        editedObj?.payment_status == "Part Payment" && 
                        <>
                    <label htmlFor="">Part Payment :</label>

                        <input type="text" placeholder='part amount' 
                        value={editedObj?.part_amount || ""}
                        onChange={(e)=>setEditedObj({...editedObj,part_amount:Number(e.target.value)})}
                        />
                        </>
                    }
                    <label htmlFor="">Comments :</label>
                    <input type="text" 
                    value={editedObj?.comments}
                    onChange={(e)=>setEditedObj({...editedObj,comments:e.target.value})}
                    placeholder='comments'
                      />
                      
                      <div className='buttons'>
                      <button className='btn-small' type='submit' >Save</button>
                      <button className='btn-small' type='button' onClick={()=>toggle()} >Cancel</button>
                      </div>
                </form>
                
            </ModalBody>
        </Modal>
    </div>
  )
}

export default InvoiceEditModal