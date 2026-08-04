import React, { useState,useEffect,useRef } from 'react';
import { Search} from "react-bootstrap-icons";
import{BiEditAlt} from "react-icons/bi"
import {RiDeleteBin5Line} from "react-icons/ri";
import ShopEditModal from '../../components/editModals/ShopEditModal';

import{Table,Modal,ModalHeader,ModalBody} from "reactstrap";
import "../../styles/Accounts/shop.css";
import {BiSolidMap} from "react-icons/bi"
import {MdAdd} from "react-icons/md";
import Pagination from '../../Pagination';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// map 
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { baseUrl } from '../../api/apiConfig';

const libraries=["places"];

const Shops = () => {
  const[shopData,setShopData]=useState([]);
  const[total,setTotal]=useState(0)
  const[shopModal,setShopModal]=useState(false)
  const[chooseShop,setChooseShop]=useState(false)
  const[qrModal,setQrModal]=useState(false)
  const[qrObj,setQrObj]=useState()
  const[search,setSearch]=useState("")
  const[pageNumber,setPageNumber]=useState(0)
  const [map, setMap] = useState(/** @type google.maps.map */ null);
  
// map
const[city,setCity]=useState("")
const[addressState,setAddressState]=useState("")
const[country,setCountry]=useState("")
const[pincode,setPincode]=useState("")
const [coords, setCoords] = useState({ lat: 12.8996, lng: 80.0929 });
const addressRef=useRef()
const[shopAddress,setShopAddress]=useState("")
const[receiverName,setReceiverName]=useState("")
const[receiverContact,setReceiverContact]=useState("")
const [selectedAddress, setSelectedAddress] = useState({
  address: "",
  address_type: "Pickup",
  city: "",
  country: "",
  latitude: 0,
  longitude: 0,
  pincode: "",
  receiver_contact: "",
  receiver_name: "",
  state: "",
});

const[addShop,setAddShop]=useState({
  contact_number:"",
  shop_name: "",
  latitude:"",
  longitude: "",
  address:"",
  shop_type: "",
})
const[shopEdit,setShopEdit]=useState(false)
const[editObj,setEditObj]=useState({})
const[deleteModal,setDeleteModal]=useState(false)
const[deleteId,setDeleteId]=useState(null)
const [paginationShow, setPaginationShow] = useState(true);

  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA"
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
    libraries
    // libraries:["places"], // Add the "places" library
  });

  const handleShopEditModal=(item)=>{
    setShopEdit(!shopEdit)
    setEditObj(item)

  }
  const handleDeleteModal=(id)=>{
    setDeleteModal(!deleteModal)
    setDeleteId(id)
  } 
  const deleteSelectedTour=async()=>{
    try {
      const request=await axios.post(`${baseUrl}/shop/deleteShop/${deleteId}`)
      if(request.data.success){
        setDeleteModal(false)
        alert("Deleted Successfully ✅")
        getShopsData()
      }
      
    } catch (error) {
      console.log(error);
      alert("Failed to Delete ?")
      
    }
    
  }

  const getShopAddressFromMap=()=>{
    let address=addressRef.current.value;
    console.log(address);
    setShopAddress(address)
    convertGeocode(address)
    
  }
  async function convertGeocode(address){
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA`
          );
          
          if (!response.ok) {
            throw new Error(`Geocoding request failed with status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data,"dtaa");
          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setCoords({ lat: location.lat, lng: location.lng });
          
            const addressComponents = data.results[0].address_components;
            // Find city, state, and country
            let city, state, country;
  
            for (const component of addressComponents) {
              if (component.types.includes("locality")) {
                city = component.long_name;
                setCity(city)
                // setSelectedAddress({...selectedAddress,city:city})
              } else if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
                setAddressState(state)
                // setSelectedAddress({...selectedAddress,state:state})
              } else if (component.types.includes("country")) {
                country = component.long_name;
                setCountry(country)
                // setSelectedAddress({...selectedAddress,country:country})
              }
            }
            // console.log(city);
            // console.log(state);
            // console.log(country);
          
            // Find the postal code (types includes 'postal_code')
            const postalCodeComponent = addressComponents.find(
              (component) => component.types.includes('postal_code')
            );
          
            if (postalCodeComponent) {
              const postalCode = postalCodeComponent.short_name;
              setPincode(postalCode)
              // setSelectedAddress({...selectedAddress,pincode:pincode})

              
            } else {
              console.log('Postal code not found.');
            }
          } else {
            console.log('No results found');
          }
          
    } catch (error) {
        console.log(error);
        
    }
    
  
  }

  

  const addingShopAddressFromMap=(e)=>{
    e.preventDefault()
    setSelectedAddress({
      ...selectedAddress,
      address:shopAddress,
      address_type: "Pickup",
      city:city,
      country:country,
      latitude: coords.lat,
      longitude: coords.lng,
      pincode: pincode,
      receiver_contact:receiverContact,
      receiver_name:receiverName,
      state:addressState,

    })
    setAddShop({...addShop,
      latitude:coords.lat,
      longitude: coords.lng,
      address:shopAddress})
      setChooseShop(false)

  }

  console.log("selectedAddress :",selectedAddress);
// For QR Modal
const handleChangeQrModal=(item)=>{
  setQrModal(!qrModal)
  setQrObj(item)

}

// Tis is  for ShopMOdal ...
  const changeShopModal=()=>{
    setShopModal(!shopModal)
    setSelectedAddress(selectedAddress.address="")
    setSelectedAddress(selectedAddress.lat="")
    setSelectedAddress(selectedAddress.lng="")
  }
  const handleChange=(e)=>{
    let value = e.target.value.trim().toLowerCase()
    setSearch(value)
    if(value.length !=0){
      setPaginationShow(false)
      setPageNumber(0)
    }else{
      setPaginationShow(true)
      setPageNumber(0)
    }
  }

  // Shopoda Map close ... for Clear All fields
  const changeChooseShop=()=>{
    setChooseShop(!chooseShop)
    setShopAddress("")
    setCity("")
    setAddressState("")
    setCountry("")
    setPincode("")
    // setCoords({lat:"",lng:""})
    setReceiverContact("")
    setReceiverName("")
  }

  let showDataPerPage=10;
  let pageCount=Math.ceil(total/showDataPerPage)
  const handlePageChange=({selected})=>{
    setPageNumber(selected)
  }
  let pagesVisited=pageNumber*showDataPerPage
  let offset=pageNumber*showDataPerPage

    // Api calling 
    const url=`${baseUrl}/shop/getShops`;
    async function getShopsData(){
      const response=await axios.post(url,{});
      setShopData(response.data.data.items);
      setTotal(response.data.data.count)
    }

    // Add New Shop data Details ....

    const handleShopFormSubmit=async(e)=>{
      e.preventDefault();
      console.log("addShop : ",addShop);
      try {
        const request= await axios.post(`${baseUrl}/shop/addShop`,addShop)
        console.log(request);
        if(request.data.success){
          alert("Shop Added !")
          setShopModal(false)
          setSelectedAddress(selectedAddress.address="")
          setCoords({ lat: 12.8996, lng: 80.0929 })
          getShopsData()
        }
        
      } catch (error) {
        console.log(error);
        
      }

    }

    const handleClearField=(fieldName)=>{
      setAddShop((prevData)=>({...prevData,[fieldName]:""}))
    }

    //  Marker getting Address function 

    const handleMarkerMoveAddress=async (coords)=>{
      console.log("handleMarkerMove : ",coords);
      const{lat,lng}=coords;
      try {
        const resp=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${YOUR_GOOGLE_MAPS_API_KEY}`)
        const data=await resp.json()
        console.log(data,"data");
        let address=data.results[0].formatted_address;
        address=address.replace(/^.*?,\s/, '')
        setShopAddress(address);
        if (data.results.length > 0) {
          // const location = data.results[0].geometry.location;
          // setCoords({ lat: location.lat, lng: location.lng });
        
          const addressComponents = data.results[0].address_components;
          // Find city, state, and country
          let city, state, country;
  
          for (const component of addressComponents) {
            if (component.types.includes("locality")) {
              city = component.long_name;
              setCity(city)
            } else if (component.types.includes("administrative_area_level_1")) {
              state = component.long_name;
              setAddressState(state)
            } else if (component.types.includes("country")) {
              country = component.long_name;
              setCountry(country)
            }
          }
          const postalCodeComponent = addressComponents.find(
            (component) => component.types.includes('postal_code')
          );
        
          if (postalCodeComponent) {
            const postalCode = postalCodeComponent.short_name;
            setPincode(postalCode)
          } else {
            console.log('Postal code not found.');
          }
        } else {
          console.log('No results found');
        }
      } catch (error) {
        
      }
  
    }


    useEffect(()=>{
      getShopsData()
    },[]);
    
    

  return (
    <div style={{padding: "10px" }}>
        <section className="searchBar-section">
        <div className="session-Top-Input" style={{position:"relative"}}>
          <Search  size={15} className="searchIcon" style={{position:"absolute",left:"430px"}}/>
          <input onChange={handleChange}  type="text" placeholder="Search by shop name , type or contact no" />
        </div>
        <div className="vehicle-btns">
          <button className="btn-big" onClick={changeShopModal}><MdAdd color="white" size={23}/> Add Shop</button>
          
        </div>
      </section>

        <Modal isOpen={shopModal} size='md'id='shop-modal'>
          <ModalHeader toggle={changeShopModal} style={{border:"none"}}>
            <p style={{position:"relative", top:"15px"}}>Add Shop </p>
          </ModalHeader>
          <ModalBody className='modal-body'>
            <form className='shopform' onSubmit={handleShopFormSubmit}>
              <label htmlFor="shop name">Shop Name :</label>
              <input type="text" id='shop name' name='shop name' placeholder='Shop name' 
              onChange={(e)=>{setAddShop({...addShop,shop_name:e.target.value})}}/>
              
              <label htmlFor="shop type">Shop Type :</label>
              <input type="text" id='shop type' name='shop type' placeholder='Shop type'
              onChange={(e)=>{setAddShop({...addShop,shop_type:e.target.value})}} />
              <label htmlFor="mobile">Mobile :</label>
              <input type="text" id='mobile' name='mobile' placeholder='+91' maxLength={10}
              onChange={(e)=>{setAddShop({...addShop,contact_number:e.target.value})}} />
              <label htmlFor="address">Address :</label>
              <div style={{display:'flex',width:"550px",gap:"10px"}}>
                <div style={{width:"400px"}} className='inputAndMap'>
                
                <input style={{width:"100%"}} type="text" id='address' name='address' placeholder='address'
                // onChange={(e)=>{setAddShop({...addShop,address:e.target.value})}} 
                value={selectedAddress.address}
                />
                </div>
                <div style={{position:"relative",bottom:"15px",cursor:"pointer"}} className='mapIcon'>
                  <BiSolidMap size={50} color='green' onClick={changeChooseShop}  className='mapIconLogo'/>
                </div>
              </div>
              <label htmlFor="lattitude">Lattitude :</label>
              <input type="text" id='lattitude' name='lattitude' placeholder='Enter lattitude'
              // onChange={(e)=>{setAddShop({...addShop,latitude:e.target.value})}}
              value={selectedAddress.latitude}
               />
              <label htmlFor="longitude">Longitude :</label>
              <input type="text" id='longitude' name='longitude' placeholder='Enter longitude'
              // onChange={(e)=>{setAddShop({...addShop,longitude:e.target.value})}}
              value={selectedAddress.longitude}
              />
              <div style={{display:"flex",gap:"20px"}}>
              <button type='submit' className='btn-small'>ADD</button>
              <button type='reset' className='btn-small'>Clear</button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <section id='choose_Location_Map'>
            <Modal isOpen={chooseShop} size='xl' id='choose_Location_Map-mobile'>
              <ModalHeader toggle={changeChooseShop} style={{border:"none"}}>
                <p style={{position:"relative", top:"15px"}}><u>Choose Shop Location :</u></p>
              </ModalHeader>
              <ModalBody>
                <div style={{display:"flex",gap:"8px"}}>
                  <div style={{flex:1}}>

                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "650px" }}
                    zoom={15}
                    options={{
                    zoomControl:false,
                    streetViewControl:false,
                    mapTypeControl:false,
                    fullscreenControl:false
                  }}
                  onLoad={(map) => setMap(map)}
                  center={coords}
                  >
                    <Marker
                      draggable={true}
                      // center={coords}
                      onDragEnd={(e)=>{
                        
                        setCoords({
                          ...coords,
                          lat: e.latLng?.lat(),
                          lng: e.latLng?.lng(),
                        })
                        handleMarkerMoveAddress(coords)
                        
                      }}
                      
                      position={coords}
                    >
                    </Marker>
                  </GoogleMap>
                  <div className="address-selection changes">
                        <Autocomplete>
                        <input type="text" ref={addressRef} value={shopAddress}
                        onChange={(e)=>setShopAddress(e.target.value)}
                         placeholder="Search Your Location.." />
                      </Autocomplete>
                      <button className="btn-small" onClick={getShopAddressFromMap}>ADD</button>
                  </div>

                  </div>
                  <div style={{flex:1,border:"1px solid grey"}}>
                  {/* onSubmit={addingAddressFromMap} */}
                  <form className='shopform' 
                  onSubmit={addingShopAddressFromMap}
                  >
                    <label htmlFor="address">Address :</label>
                    <input type="text" placeholder='Enter Address' value={shopAddress}  id='address' name='address' />
                    <label htmlFor="city">City :</label>
                    <input type="text" placeholder='Enter City' value={city} id='city' name='city' />
                    <label htmlFor="state">State :</label>
                    <input type="text" placeholder='Enter State' value={addressState} id='state' name='state' />
                    <label htmlFor="country">Country:</label>
                    <input type="text" placeholder='Enter Country' value={country} id='country' name='country' />
                    <label htmlFor="pincode">Pincode :</label>
                    <input type="text" placeholder='Enter Pincode' value={pincode}  id='pincode' name='pincode' />
                    <label htmlFor="lattitude">Lattitude :</label>
                    <input type="text" placeholder='Enter Lattitude' value={coords.lat} onChange={(e)=>setCoords({...coords,lat:e.target.value})}  id='lattitude' name='lattitude' />
                    <label htmlFor="longitude">Longitude :</label>
                    <input type="text" placeholder='Enter Longitude' value={coords.lng} onChange={(e)=>setCoords({...coords,lng:e.target.value})} id='longitude' name='longitude' />
                    <label htmlFor="receiver name">Receiver Name :</label>
                    <input type="text" placeholder='Enter Receiver name' autoComplete='off' value={receiverName} onChange={(e)=>setReceiverName(e.target.value)} id='receiver name' name='receiver name' />
                    <label htmlFor="receiver contact">Receiver Contact:</label>
                    <input type="text" maxLength={10} placeholder='Enter Receiver contact'autoComplete='off' value={receiverContact} onChange={(e)=>setReceiverContact(e.target.value)} id='receiver contact' name='receiver contact' />
                    <button type='submit' className='btn-small'>ADD</button>
                  </form>
                  </div>
                </div>
              </ModalBody>

            </Modal>
        </section>


        <section id='QR CODE Scan Modal'>
          <Modal isOpen={qrModal} id='QR-code-modal-mobile'>
            <ModalHeader toggle={handleChangeQrModal} style={{marginLeft:"160px",border:"none"}}>
              <span style={{fontSize:"18px"}}>Scan QR Code </span>
            </ModalHeader>
            <ModalBody style={{margin:"auto"}}>
              <img src={qrObj?.qr_url} alt="QR CODE" width={200} height={200} />

            </ModalBody>
          </Modal>
        </section>
        <ShopEditModal
            isOpen={shopEdit}
            toggle={handleShopEditModal}
            editObj={editObj}
            shop={getShopsData}

        />
        <section id="DeleteModal">
          
      <Modal isOpen={deleteModal} size='sm' style={{marginTop:"5%"}} className='delete-modal-mobile'>
                <ModalHeader toggle={handleDeleteModal}style={{ border: "none" }} >
                </ModalHeader>
                <ModalBody>
                    <div id='deleteModalBody' >
                        <p>Are you sure you want to delete?</p>
                        <div className='confirm-cancel-button'>
                        <button onClick={deleteSelectedTour}>Confirm</button>
                        <button onClick={handleDeleteModal}>Cancel</button>
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
                <th>DELETE</th>
                <th>ID</th>
                <th>SHOP NAME</th>
                <th>SHOP TYPE</th>
                <th>CONTACT NO</th>
                <th>LATITUDE</th>
                <th>LONGITUDE</th>
                <th>ADDRESS</th>
                <th>QR CODE</th>
              </tr>
            </thead>
            <tbody>
              {
                shopData.filter((item)=>
                item.shop_name.toLowerCase().includes(search.toLowerCase())||
                item.shop_type.toLowerCase().includes(search.toLowerCase())||
                String(item.contact_number).includes(search)
                ).slice(pagesVisited,pagesVisited+showDataPerPage).map((item)=>{
                  return(
                    <tr key={item.id} style={{borderBottom:"1px solid lightgrey"}}>
                        <td><BiEditAlt style={{ fontSize: "18px", cursor: "pointer" }} onClick={
                          (event)=>{
                            event.stopPropagation();
                            handleShopEditModal(item)
                          }
                          }/></td>
                        <td><RiDeleteBin5Line className='deleteIcon' size={18} onClick={()=>handleDeleteModal(item.id)}/></td>
                        <td>{item.id}</td>
                        <td style={{maxWidth:"100px"}}>{item.shop_name}</td>
                        <td style={{maxWidth:"100px"}}>{item.shop_type}</td>
                        <td>{item.contact_number}</td>
                        <td>{item.latitude}</td>
                        <td>{item.longitude}</td>
                        <td style={{maxWidth:"200px"}}>{item.address}</td>
                        <td style={{cursor:"pointer"}}><img onClick={()=>handleChangeQrModal(item)} src={item?.qr_url} 
                            alt="QR CODE" width={40} height={40} />
                        </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
      </section>

      <section id='shopPagination' style={{position:"relative",marginBottom:"30px",marginTop:"10px",padding:"10px"}}>
        {paginationShow && <Pagination
        pageCount={pageCount}
        handlePageChange={handlePageChange}
        pageNumber={pageNumber}/>}

      </section>

    </div>
  )
}

// formPickAdd={formPickAdd} setFormPickAdd={setFormPickAdd}
const ShopLocationForm=()=>{
  const[receiverContact,setReceiverContact]=useState("")
  const[receiverName,setReceiverName]=useState("")
  // const address = selectedAddress.address;

  const addingAddressFromMap=async(e)=>{
    e.preventDefault();
    
  }

  return(
    <>
      <form className='shopform'
       onSubmit={addingAddressFromMap}
       >
        <label htmlFor="address">Address :</label>
        <input type="text" placeholder='Enter Address'  id='address' name='address' />
        <label htmlFor="city">City :</label>
        <input type="text" placeholder='Enter City'  id='city' name='city' />
        <label htmlFor="state">State :</label>
        <input type="text" placeholder='Enter State' id='state' name='state' />
        <label htmlFor="country">Country:</label>
        <input type="text" placeholder='Enter Country' id='country' name='country' />
        <label htmlFor="pincode">Pincode :</label>
        <input type="text" placeholder='Enter Pincode'  id='pincode' name='pincode' />
        <label htmlFor="lattitude">Lattitude :</label>
        <input type="text" placeholder='Enter Lattitude'  id='lattitude' name='lattitude' />
        <label htmlFor="longitude">Longitude :</label>
        <input type="text" placeholder='Enter Longitude'  id='longitude' name='longitude' />
        <label htmlFor="receiver name">Receiver Name :</label>
        <input type="text" placeholder='Enter Receiver name'  id='receiver name' name='receiver name' />
        <label htmlFor="receiver contact">Receiver Contact:</label>
        <input type="text" maxLength={10} placeholder='Enter Receiver contact'  id='receiver contact' name='receiver contact' />
        <button type='submit' className='btn-small'>ADD</button>
      </form>
    </>
  )
}

export {Shops,ShopLocationForm}