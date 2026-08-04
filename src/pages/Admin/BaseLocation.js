import React,{useState,useRef, useEffect} from 'react';
import "../../styles/Admin/Baselocation.css";
import {BiSolidMap} from "react-icons/bi";
import{Modal,ModalHeader,ModalBody} from "reactstrap";
import ReactSelect from '../../ReactSelect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


// map 
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { baseUrl } from '../../api/apiConfig';

const libraries=["places"];


const BaseLocation = () => {

  const[driversList,setDriversList]=useState([])
  const[driverId,setDriverId]=useState("")
  const[value,setValue]=useState(null)
  const[base_loca_state,setBase_loca_state]=useState();
  const[choose_loca,setChoose_loca]=useState(false);
  const [coords, setCoords] = useState({ lat: 12.8996, lng: 80.0929 });
  const addressRef=useRef()
  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA"
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
    libraries
  });
  const [selectedAddress, setSelectedAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });
  const[baseAddress,setBaseAddress]=useState("")
  
  

  const changeChoose_loca=()=>{
    setChoose_loca(!choose_loca)
    setCoords({ lat: 12.8996, lng: 80.0929 })
    setSelectedAddress({
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      latitude: "",
      longitude: "",
      })
      setBaseAddress("")
  }
  const getAddressFromMap=()=>{
    let address=addressRef.current.value;
    setBaseAddress(address)
    // console.log(address,"address from Button ");
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
          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setCoords({ lat: location.lat, lng: location.lng });
          
            const addressComponents = data.results[0].address_components;
            // Find city, state, and country
            let city, state, country,postalCode;
  
            for (const component of addressComponents) {
              if (component.types.includes("locality")) {
                city = component.long_name;
                
              } else if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
                
              } else if (component.types.includes("country")) {
                country = component.long_name;
                
              }
            }
            
            // Find the postal code (types includes 'postal_code')
            const postalCodeComponent = addressComponents.find(
              (component) => component.types.includes('postal_code')
            );
          
            if (postalCodeComponent) {
               postalCode = postalCodeComponent.short_name;
              

              
            } else {
              console.log('Postal code not found.');
            }
            setSelectedAddress({
              ...selectedAddress,
              address:address,
              city:city,
              state:state,
              country:country,
              pincode:postalCode,
              latitude:location.lat,
              longitude:location.lng
            })

          
          } else {
            console.log('No results found');
          }
          
    } catch (error) {
        console.log(error);
        
    }
    
  
  }
  const handleMarkerMove=async(coords)=>{
    console.log(coords,"handleMarkerMove");
    const{lat,lng}=coords;
    try {
      const resp=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${YOUR_GOOGLE_MAPS_API_KEY}`)
      const data=await resp.json()
      console.log(data,"data");
      let address=data.results[0].formatted_address;
      address=address.replace(/^.*?,\s/, '')
      setBaseAddress(address)
      if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        // Find city, state, and country
        let city, state, country,postalCode;

        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (component.types.includes("country")) {
            country = component.long_name;
          }
        }
        const postalCodeComponent = addressComponents.find(
          (component) => component.types.includes('postal_code')
        );
      
        if (postalCodeComponent) {
           postalCode = postalCodeComponent.short_name;
        } else {
          console.log('Postal code not found.');
        }
        setSelectedAddress({
          ...selectedAddress,
          address:address,
          city:city,
          state:state,
          country:country,
          pincode:postalCode,
          latitude:lat,
          longitude:lng
        })

      } else {
        console.log('No results found');
      }
    } catch (error) {
      
    }

  }

  console.log("handlemoo",selectedAddress);
  

  const sendValue=(e)=>{
    e.preventDefault();
    setChoose_loca(false)
  }
  const clearField=()=>{
    setSelectedAddress({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
    })
  }


  
  const getDriversList=async()=>{
    try {
    const request=await axios.post(`${baseUrl}/driver/getDrivers`,{limit:100,offset:0})
    if(request.data.success){
      const list=request.data.data.drivers
       const options=list.map((elem)=>
      ( {label:`${elem.name}-${elem.mobile_number}`,value:`${elem.user_id}`})
      )
      setDriversList(options)

    }
    } 
    catch (error) {
      console.log("Failed to fetch data",error);
      
    }finally{

    }

  }
  const handleSelectedOption=(selected)=>{
    setValue(selected)
    setDriverId(selected.value)
  }
  const addBaseLocationDriver=async()=>{
    const payload={
      unique_id: driverId,
      address: selectedAddress.address,
      city: selectedAddress.city,
      state: selectedAddress.state,
      country: selectedAddress.country,
      zip_code: selectedAddress.pincode,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
    }
    
    try {
      const request=await axios.post(`${baseUrl}/admin/addBaseLocation`,payload)
      console.log(request.data.message);
      if(request.data.success){
        toast.success("Base Location Changed.",{
          position: "top-center",
          className:"toast-success-message",
          theme:"light"
        })
        setSelectedAddress({
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          latitude: "",
          longitude: "",
          })
        
        setValue(null)

      }else{
        toast.error(request.data.message,{
        position: "top-center",
        className:"toast-error-message",
        theme:"light",
       closeOnClick:true
      })
    }
      
    } catch (error) {
      console.log("Error ",error);
      
    }

  }



  useEffect(()=>{getDriversList()},[])

  if (!isLoaded) {
    return <div>map is loading</div>;
  }
  return (
    <div style={{padding:"5px",margin:"5px"}} id='BaseLocation-Container'>
      
      <div className='baseLocationform-Div'>
        <p style={{fontWeight:"bold"}}>Add BaseLocation :</p>
        <label htmlFor='driver'>Choose Driver :</label>
        <div style={{width:"50%",marginBottom:"10px",backgroundColor:"green",padding:"5px",borderRadius:"5px"}} className='driverSelect'>
          <ReactSelect
          value={value}
          isMulti={false}
          placeholder={"Select or Search"}
          options={driversList}
          handleSelectedOption={handleSelectedOption}
          />
        </div>
          <form className='baseLocationforms'>
          <label htmlFor='address'>Address:</label>
            <div className='pickup-Div'>
                <div>
                  <input type="text" placeholder='Enter Address'
                  value={selectedAddress.address}
                  onChange={(e)=>setSelectedAddress({...selectedAddress,address:e.target.value})}
                  autoComplete='nope'
                  id='address'/>
                </div>
                <div className=''>
                  <BiSolidMap size={45} color='green' onClick={changeChoose_loca} 
                  className='mapIcon'/>
                </div>

            </div>
            <label htmlFor='city'>City :</label>
            <input type="text" placeholder='Enter City' 
              onChange={(e)=>setSelectedAddress({...selectedAddress,city:e.target.value})}
            value={selectedAddress.city}
            autoComplete='nope'
            id='city'/>
            <label htmlFor='state'>State :</label>
            <input type="text" placeholder='Enter state'
            onChange={(e)=>setSelectedAddress({...selectedAddress,state:e.target.value})}
            value={selectedAddress.state}
            autoComplete='nope'
            id='state'/>
            <label htmlFor='country'>Country:</label>
            <input type="text" placeholder='Enter country'
            autoComplete='nope'
            onChange={(e)=>setSelectedAddress({...selectedAddress,country:e.target.value})}
            value={selectedAddress.country}
            id='country'/>
            <label htmlFor='pincode'>Pincode:</label>
            <input type="text" placeholder='Enter Pincode'
            autoComplete='nope'
            onChange={(e)=>setSelectedAddress({...selectedAddress,pincode:e.target.value})}
            value={selectedAddress.pincode}
            id='pincode'/>
            <label htmlFor='lattitude'>Lattitude:</label>
            <input type="text" placeholder='Enter lattitude'
            autoComplete='nope'
            onChange={(e)=>setSelectedAddress({...selectedAddress,latitude:e.target.value})}
            value={selectedAddress.latitude}
            id='lattitude'/>
            <label htmlFor='longitude'>Longitude:</label>
            <input type="text" placeholder='Enter longitude'
            autoComplete='nope'
            onChange={(e)=>setSelectedAddress({...selectedAddress,longitude:e.target.value})}
            value={selectedAddress.longitude}
             id='longitude'/>
             <ToastContainer/>
            
            <button className='baselocation-Btn' type='button' onClick={addBaseLocationDriver}>SAVE</button>
          </form>
      </div>

      <section id='baselocation_Modal'>
        <Modal isOpen={choose_loca} size='xl' id='baselocation_Modal'>
          <ModalHeader style={{border:"none"}} toggle={changeChoose_loca}>
            <p>Choose BaseLocation:</p>
          </ModalHeader>
          <ModalBody>
            <div style={{display:"flex",gap:"8px"}}>

                    <div style={{flex:2}}>
                    <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "650px" }}
                    zoom={15}
                    options={{
                    zoomControl:false,
                    streetViewControl:false,
                    mapTypeControl:false,
                    fullscreenControl:false
                  }}
                  center={coords}
                  >
                    <Marker
                      draggable={true}
                      center={coords}
                      onDragEnd={(e)=>{
                        setCoords({
                          ...coords,
                          lat: e.latLng?.lat(),
                          lng: e.latLng?.lng(),
                        })
                        handleMarkerMove(coords)
                      }}
                      position={coords}
                    >
                    </Marker>
                  </GoogleMap>
                  <div className="address-selection shop">
                        <Autocomplete>
                        <input type="text" ref={addressRef} value={baseAddress} onChange={(e)=>setBaseAddress(e.target.value)}
                        placeholder="Search Your Location.." />
                        {/* addressRef */}
                      </Autocomplete>
                      <button className="btn-small" onClick={getAddressFromMap} >ADD</button>
                      {/* getShopAddressFromMap */}
                  </div>
                    
                    </div>

                    {/* RightSide Form */}
                    <div style={{flex:2,border:"1px solid grey"}}>
                    <form className='shopform' onSubmit={sendValue}
                      >
                        <label htmlFor="address">Address :</label>
                        <input type="text" placeholder='Enter Address' value={selectedAddress.address}
                        onChange={(e)=>setSelectedAddress({...selectedAddress,address:e.target.value})}
                          id='address' name='address' />
                        <label htmlFor="city">City :</label>
                        <input type="text" placeholder='Enter City'value={selectedAddress.city}
                        onChange={(e)=>setSelectedAddress({...selectedAddress,city:e.target.value})}
                          id='city' name='city' />
                        <label htmlFor="state">State :</label>
                        <input type="text" placeholder='Enter State' value={selectedAddress.state}
                        onChange={(e)=>setSelectedAddress({...selectedAddress,state:e.target.value})}
                        id='state' name='state' />
                        <label htmlFor="country">Country:</label>
                        <input type="text" placeholder='Enter Country' value={selectedAddress.country}
                        onChange={(e)=>setSelectedAddress({...selectedAddress,country:e.target.value})}
                        id='country' name='country' />
                        <label htmlFor="pincode">Pincode :</label>
                        <input type="text" placeholder='Enter Pincode' value={selectedAddress.pincode}
                        onChange={(e)=>setSelectedAddress({...selectedAddress,pincode:e.target.value})}
                        id='pincode' name='pincode' />
                        <label htmlFor="lattitude">Lattitude :</label>
                        <input type="text" placeholder='Enter Lattitude' value={selectedAddress.latitude}
                        onChange={(e)=>setSelectedAddress({...selectedAddress,latitude:e.target.value})}
                        id='lattitude' name='lattitude' />
                        <label htmlFor="longitude">Longitude :</label>
                        <input type="text" placeholder='Enter Longitude' value={selectedAddress.longitude} 
                        onChange={(e)=>setSelectedAddress({...selectedAddress,longitude:e.target.value})}
                        id='longitude' name='longitude' />
                        <div style={{display:"flex",gap:"10px"}}>
                        <button type='submit' className='btn-small'>ADD</button>
                        <button type='button' onClick={clearField} className='btn-small'>CLEAR</button>
                        </div>
                      </form>
                    </div>
          </div>
          </ModalBody>
        </Modal>
      </section>

    </div>
    
  )
}

export default BaseLocation