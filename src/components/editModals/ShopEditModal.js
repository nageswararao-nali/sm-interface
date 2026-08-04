import React, { useEffect,useState } from 'react'
import{Modal,ModalBody,ModalHeader} from "reactstrap";
import "./shopEdit.css";
import axios from 'axios';
import { baseUrl } from '../../api/apiConfig';


const ShopEditModal = ({isOpen,toggle,editObj,shop}) => {
    // const{isOpen,toggle,editObj}=props;
  const[editedData,setEditedData]=useState({})
  const[payload,setPayload]=useState({
    address:"",
    contact_number:"",
    latitude:"",
    longitude:"",
    shop_name:"",
    shop_type:""
  })
    
    useEffect(()=>{
        setPayload(editObj)
    },[editObj])

    const saveChanges=async(e)=>{
        e.preventDefault();
            try {
                // const request=await axios.post(`https://test-api.goodmove.in/api/shop/updateShop/${editObj.id}`,payload)
                const request=await axios.post(`${baseUrl}/shop/updateShop/${editObj.id}`,payload)
                if(request.data.success){
                    toggle()
                    alert("Your Changes Saved.")
                    shop()
                }
                
            } catch (error) {
                console.log(error);
                
            }
    }
  return (
    <div id='shopEditContainer'>
        <Modal isOpen={isOpen} id='shop-edit-modal-mobile'>
            <ModalHeader toggle={toggle}>
                <span>Shop Edit :</span>
            </ModalHeader>
            <ModalBody>
                <form action="#" onSubmit={saveChanges} id='shopEditForm'>
                <label htmlFor="">Shop Name :</label>
                <input type="text" value={payload?.shop_name} onChange={(e)=>setPayload({...payload,shop_name:e.target.value})} />
                <label htmlFor="">Shop Type :</label>
                <input type="text" value={payload?.shop_type} onChange={(e)=>setPayload({...payload,shop_type:e.target.value})} />
                <label htmlFor="">Mobile :</label>
                <input type="text" value={payload?.contact_number} onChange={(e)=>setPayload({...payload,contact_number:e.target.value})}  />
                <label htmlFor="">Address :</label>
                <input type="text" value={payload?.address} onChange={(e)=>setPayload({...payload,address:e.target.value})} />
                <label htmlFor="">Latitude :</label>
                <input type="text" value={payload?.latitude} onChange={(e)=>setPayload({...payload,latitude:e.target.value})}  />
                <label htmlFor="">Longitude :</label>
                <input type="text" value={payload?.longitude} onChange={(e)=>setPayload({...payload,longitude:e.target.value})}  />
                <div style={{display:"flex",gap:"5px"}}>
                <button className='btn-small' type='submit'>SAVE</button>
                <button className='btn-small' onClick={()=>toggle()} type='button'>CANCEL</button>
                </div>
                </form>

            </ModalBody>
        </Modal>

    </div>
  )
}

export default ShopEditModal