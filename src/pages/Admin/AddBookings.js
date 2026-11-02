import React, { useEffect, useState ,useRef} from "react";
import "../../styles/Admin/Addbook.css";
import axios from "axios";
import { BiSolidMap } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io"
import { RxCrossCircled } from "react-icons/rx";
import {AiFillDelete } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import SearchableDropdown from "../../searchableDropdown";
import { Table, Modal, ModalHeader, ModalBody,Card,CardBody,CardFooter, CardText } from "reactstrap";
import { ShopLocationForm } from "../Accounts/Shops";
import { useNavigate,NavLink } from "react-router-dom";
// import DatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import{ Link  } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from "../../api/apiConfig";
import AddressEdit from "../../components/editModals/AddressEdit";
import "react-datepicker/dist/react-datepicker.css";

//Mappp,,
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  LoadScript,
  Autocomplete,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import Home from "./HomePage";
import MultiDeleteBtn from "../../MultiDeleteBtn";

const libraries=["places"];

const AddBookings = () => {
  return <NewAddBookings />;
};

const NewAddBookings = () => {
  const navigate=useNavigate()
  const[index,setIndex]=useState("")
  const[search,setSearch]=useState("")
  const [options, setOptions] = useState([]);
  const [customer_id, setCustomer_id] = useState("");
  const[customerMobileNo,setCustomerMobileNo]=useState("")
  const[pickup_Address,setPick_Address]=useState([]); // for Saved address of cus
  const[dropoff_Address,setDropoff_Address]=useState([]) // saved address of cus
  

  const[check,setCheck]=useState(true)
  const[check1,setCheck1]=useState(false)

  const [optionsList, setOptionsList] = useState("");
  const [comm_weight, setComm_weight] = useState("");
  const [pickup_address, setPickup_address] = useState("");
  // const [pickup_time, setPickup_time] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [pickup_time, setPickup_time] = useState(new Date());
  const [dropoff_address, setDropoff_address] = useState("");
  const [dropoff_time, setDropoff_time] = useState("");
  const [add_info, setAdd_info] = useState("");
  // for Modal..
  const [pick_loca, setPick_loca] = useState(false);
  const [drop_loca, setDrop_loca] = useState(false);
  /// map,
  const sourceRef = useRef();
  const multiSourceRef=useRef()
  const destinationRef = useRef();
  const multiDestinationRef = useRef();
  const [source, setSource] = useState("");
  const [multiSource,setMultiSource] = useState("");
  const [destination,setDestination] = useState();
  const [multiDestination,setMultiDestination] = useState("");
// 12.8996 80.0929 
  const [coords, setCoords] = useState({ lat:12.8996, lng:80.0929});
  const [city,setCity]=useState("")
  const [dropcity,setDropCity]=useState("")
  const[addressState,setAddressState]=useState("")
  const[dropaddressState,setDropAddressState]=useState("")
  const[country,setCountry]=useState("")
  const[dropcountry,setDropCountry]=useState("")
  const[pincode,setPincode]=useState("")
  const[droppincode,setDropPincode]=useState("")
  const[receiverContact,setReceiverContact]=useState("")
  const[dropreceiverContact,setDropReceiverContact]=useState("")
  const[receiverName,setReceiverName]=useState("")
  const[dropreceiverName,setDropReceiverName]=useState("")
  const[pickupAddress,setPickupAddress]=useState({})
  const[dropoffAddress,setDropoffAddress]=useState({})
  const [map, setMap] = useState(/** @type google.maps.map */ null);
  const [editAddress,setEditAddress]=useState(false)
  const[editData,setEditData]=useState(null)
  const[loading,setLoading]=useState()
  const[fareLoading,setFareLoading]=useState()

  const[fareModal,setFareModal]=useState(false)
  const[paymentModal,setPaymentModal]=useState(false)
  const[multiPickupButton,setMultiPickupButton]=useState(false)
  const[multiDropButton,setMultiDropButton]=useState(false)
  const[showInputs,setShowInputs]=useState(false)
  const[fareObj,setFareObj]=useState()
  const[trip_type,setTrip_type]=useState("")
  // Delivery speed selection removed from the form - every booking is now Vivegam.
  const booking_type = true
  // const [totalFare, setTotalFare] = useState(0)

  
  const[newpickupAddressArr,setNewPickupAddressArr]=useState([]) // Pickup Arrays
  const[inputCount,setInputCount]=useState(1)
  const[pick_Address_object,setPick_Address_object]=useState({})
  const[drop_Address_object,setDrop_Address_object]=useState({})

  const[pickupAddressArr,setPickupAddressArr]=useState([]) // Pickup Arrays
  const[dropAddressArr,setDropAddressArr]=useState([]) // Drop Arrays 
  const[multi_pick_loca,setMultiPick_loca]=useState(false)
  const[multi_drop_loca,setMultiDrop_loca]=useState(false)

  // multiDeleted
  const[selectedIds,setSelectedIds]=useState([])
  
  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA"
  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
    // nonce:"",
    libraries
    // libraries:["places"], // Add the "places" library
  });
  

  

  const handleMarkerMove=async(coords,index)=>{
    console.log(coords,"handleMarkerMove",index);
    const{lat,lng}=coords;
    try {
      const resp=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${YOUR_GOOGLE_MAPS_API_KEY}`)
      const data=await resp.json()
      console.log(data,"data");
      let address=data.results[0].formatted_address;
      address=address.replace(/^.*?,\s/, '')
        if(trip_type === "multipickup" && index >= 0 ){
          console.log(trip_type,index,"multi check")
          // setSource(address);
          setMultiSource(address)
        }else{
          setSource(address)
          console.log(trip_type)

        }
        console.log(multiSource,source,"value")
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


  const handleMarkerMoveDestination=async(coords,index)=>{
    console.log(coords,"handleMarkerMoveDestination",index);
    const{lat,lng}=coords;
    try {
      const resp=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${YOUR_GOOGLE_MAPS_API_KEY}`)
      const data=await resp.json()
      console.log(data,"data");
      let address=data.results[0].formatted_address;
      address=address.replace(/^.*?,\s/, '')
      console.log(address)
      

      // setDestination(address);
      if(trip_type === "multidrop" && index >= 0 ){
        console.log("first")
        console.log(trip_type,index,"multi check")
        // setSource(address);
        setMultiDestination(address)

      }else{
        // setDestination(address)
        // setMultiDestination(address)
        // setDestination(address)
        setDestination(address)
        console.log(trip_type)

      }
      

      if (data.results.length > 0) {
        // const location = data.results[0].geometry.location;
        // setCoords({ lat: location.lat, lng: location.lng });
      
        const addressComponents = data.results[0].address_components;
        // Find city, state, and country
        let city, state, country;

        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
            setDropCity(city)
          } else if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
            setDropAddressState(state)
          } else if (component.types.includes("country")) {
            country = component.long_name;
            setDropCountry(country)
          }
        }
        const postalCodeComponent = addressComponents.find(
          (component) => component.types.includes('postal_code')
        );
      
        if (postalCodeComponent) {
          const postalCode = postalCodeComponent.short_name;
          setDropPincode(postalCode)
        } else {
          console.log('Postal code not found.');
        }
      } else {
        console.log('No results found');
      }
    } catch (error) {
      
    }

  }
  // useEffect(()=>{
  //   handleMarkerMoveDestination(coords,index)
  // },[coords])
  
  


  

  // **** PickupAddress conversion...

  const addAddress=()=>{
    let source=sourceRef.current.value;
    // setAddAddressPayload({...addAddressPayload,address:source})
    setSource(source);
    convertGeocode(source)
}

const addMultiAddress=()=>{
  let source=multiSourceRef.current.value;
  console.log(source,"multi")
    setMultiSource(source);
    convertGeocode(source)

}
  async function convertGeocode(address){
    console.log("address :-",address);
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
          console.log(data);
          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setCoords({ lat: location.lat, lng: location.lng });
          
            const addressComponents = data.results[0].address_components;
            // Find city, state, and country
            let city, state, country;

            for (const component of addressComponents) {
              if (component.types.includes("locality")) {
                city = component.long_name;
                // setAddAddressPayload({...addAddressPayload,city:city})
                setCity(city)
              } else if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
                setAddressState(state)
                // setAddAddressPayload({...addAddressPayload,state:state})
              } else if (component.types.includes("country")) {
                country = component.long_name;
                setCountry(country)
                // setAddAddressPayload({...addAddressPayload,country:country})
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
              // setAddAddressPayload({...addAddressPayload,pincode:postalCode})
              // console.log('Postal Code:', postalCode);
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


const addDestinationAddress=()=>{
  // console.log(destinationRef)
  // console.log(destinationRef.current)
  // console.log(destinationRef.current.value)

  let destination=destinationRef.current.value;
  setDestination(destinationRef.current.value)
  convertDestinationGeocode(destinationRef.current.value)

}
const addMultiDestinationAddress=()=>{
  let destination=multiDestinationRef.current.value;
  setMultiDestination(destination)
  convertDestinationGeocode(destination)

}
  async function convertDestinationGeocode(address){
    console.log(address)
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
            let city, state, country;

            for (const component of addressComponents) {
              if (component.types.includes("locality")) {
                city = component.long_name;
                setDropCity(city)
              } else if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
                setDropAddressState(state)
              } else if (component.types.includes("country")) {
                country = component.long_name;
                setDropCountry(country)
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
              setDropPincode(postalCode)
              // console.log('Postal Code:', postalCode);
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
  
// Closing cross Icon pickup Modal...
  
const changePickup = () => {
    setSource("")
    setSearch("")
    setCity("")
    setAddressState("")
    setCountry("")
    setPincode("")
    setReceiverContact("")
    setReceiverName("")
    setPick_loca(!pick_loca)
    setCoords({ lat:12.8996, lng:80.0929})
    setSelectedIds([])
    
  };
  const changeMultiPickup=()=>{
    setMultiPick_loca(!multi_pick_loca)
    setSearch("")
    setMultiSource("")
    setCity("")
    setAddressState("")
    setCountry("")
    setPincode("")
    setReceiverContact("")
    setReceiverName("")
    setCoords({ lat:12.8996, lng:80.0929})

  }
  

  // For Closing DropoffLocation Modal...
  const changeDropoff = () => {
    setDrop_loca(!drop_loca);
    setDestination("")
    setSearch("")
    setDropCity("")
    setDropAddressState("")
    setDropCountry("")
    setDropPincode("")
    setDropReceiverContact("")
    setDropReceiverName("")
    setCoords({ lat:12.8996, lng:80.0929})
  };

  // For Closing Multi-DropoffLocation Modal...

  const changeMultiDrop=()=>{
    setMultiDrop_loca(!multi_drop_loca)
    setSearch("")
    setDropCity("")
    setDropAddressState("")
    setDropCountry("")
    setDropPincode("")
    setDropReceiverContact("")
    setDropReceiverName("")
    setMultiDestination("")
    setCoords({ lat:12.8996, lng:80.0929})

  }
  

  

  

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.data.color,
      padding: state.data.padding,
      margin: state.data.margin,
    }),
  };

  // step-1 : get All users List from Api 

  const url = `${baseUrl}/users/getRegularCustomers`;
  const getAllUsersDetails = async (url) => {
    let userList = await axios.post(url, {offset:0,limit:600,"is_regular":true});
    userList = userList.data.data.customers;
    let getdataFromapi = userList.filter(item=>item.company && item.company.is_regular === true).map((item) => ({
      label: item.name + "-" + item.company_name + "-" + item.mobile,
      value: item.id,
    }));
    setOptions(getdataFromapi);
  };
  console.log("options ",options)
      

  
  // step-2 : selecting customers and unique id 

  const getSelectedOption = (selectedOption) => {
    setOptionsList(selectedOption);
    setCustomer_id(selectedOption.value);
    // setAddAddressPayload({...addAddressPayload,customer_id:selectedOption.value})
    const inputString=selectedOption.label;
    const phoneNoRegex=/\d{10}/
    const phoneNoMatch=inputString.match(phoneNoRegex)  
    console.log(phoneNoMatch);  
    if(phoneNoMatch){
      let mobile=phoneNoMatch[0];
      setCustomerMobileNo(mobile)
      // setAddAddressPayload({...addAddressPayload,mobile:mobile})
      console.log("mobile No from Selection ",mobile);
    }else{
      console.log("MObile no not matched ?");

    }
    
  };

  // Getting saved address for individual customer....

  const checking = async (customer_id) => {
    try {
      if (customer_id !== "") {
        const getAllAddress = await axios.post(
          `${baseUrl}/users/getAddress`,
          {
            customer_id: customer_id,
          }
        );
        setPick_Address(getAllAddress.data.data.Pickup_address)
        setDropoff_Address(getAllAddress.data.data.Dropoff_address)
      }
    } catch (error) {
      console.log(error);
    }
  };

  // deleteMultipleAddresses from Saved AddressList of the Customer..

  const deleteMultipleAddresses=async()=>{
    const payload={
      address_ids:selectedIds
    }
    try {
      const response=await axios.post(`${baseUrl}/users/deleteAddresses`,payload)
      if(response.data.success){
        alert("Deleted Successfully.")
        checking(customer_id)
        setSelectedIds([])
      }
      
    } catch (error) {
      alert("Failed to Delete ?")
      console.error(error.error)
      console.error(error.message)
      
    }
    
  }
  
  

  const handlePickupTime=(date)=>{
    console.log(date)
    setPickup_time(date)
  }
  console.log(moment(pickup_time).format("YYYY-MM-DD HH:mm:ss"),"pickuptimemmm")
  
  const handleDropoffTime=(date)=>{
    let x1=date;
    let y1=moment(x1).format("YYYY-MM-DD HH:mm:ss")
    setDropoff_time(y1)
  }
  




  const addBookingObj = {
    customer_id: customer_id,
    commodity_weight: comm_weight,
    return_weight:"",
    commodity_type: 1,
    commodity_whole_volume: 1,
    volume_unit: 35,
    commodity_length: "",
    length_unit: 37,
    weight_unit: 12,
    commodity_breadth: "",
    breadth_unit: 37,
    commodity_height: "",
    height_unit: 37,
    assign_tour_status: 0,
    other_commodity_name: "",
    isReturn_trip:"",
    time_interval: 3,
    estimated_fare:"",
    booking_for:"pickup",
    vehicle_type:"4wheeler",
    trip_type:trip_type,
    is_vivegam:booking_type,
    loading_charge_applicable:false,
    unloading_charge_applicable:false,
    both_loading_unloading_charge_applicable:false,
    time_interval: 3,
    instruction: add_info,
    packaging_type: 1,
    loading_charge: "",
    // waiting_charge:"",
    toll_charge:"",
    // pickup:pickupAddressArr,
    pickup:[pick_Address_object,...pickupAddressArr],
    drop:[drop_Address_object,...dropAddressArr],
    estimate_fare_info:"",
    additional_fare:"",
    additional_fare_comments:"",
    is_regular:"",
    // totalFare:totalFare,
    // is_having_loading_charges: click,
  };
  

  const addNewBookings = async (addBookingObj,event) => {
    event.preventDefault();
    setFareLoading(true)
    console.log("addBookingObj",addBookingObj);

    const fareObjPayload={
      
      loading_charge_applicable:addBookingObj.loading_charge_applicable,
      unloading_charge_applicable:addBookingObj.unloading_charge_applicable,
      both_loading_unloading_charge_applicable:addBookingObj.both_loading_unloading_charge_applicable,
      customer_id:addBookingObj.customer_id,
      // booking_for:"pickup",
      trip_type:addBookingObj.trip_type,
      // vehicle_type:"2wheeler",
      is_vivegam:addBookingObj.is_vivegam,
      weight:addBookingObj.commodity_weight,
      return_weight:addBookingObj.return_weight,
      // weight_unit:12,
      pickup_address:addBookingObj.pickup.map((ele)=>(
        {
          lat:ele.pickup_lat,
          long:ele.pickup_long
        }
      )),
      drop_address:addBookingObj.drop.map((ele)=>(
        {
          lat:ele.dropoff_lat,
          long:ele.dropoff_long
        }
      )),
      
    }
    

    try {
      const response=await axios.post(
            `${baseUrl}/location/getMultiBookingFare`,fareObjPayload);
            console.log(response)
            console.log(response.data.success,"success")
            if(response.data.success){
              console.log(response.data.data)
              setFareObj(response.data.data)
              setFareLoading(false)
              setFareModal(true)
            }
      
    } catch (error) {
      console.log("error :",error)
      
    }
      

    

  };

  // Selecting Addrss From Modal

  const addingPickupAddress=(elem)=>{
    console.log("Slected from  saved Array :",elem);

    setPick_Address_object({
      pickup_city:elem.city,
      pickup_country:elem.country,
      pickup_flexible_time:"",
      pickup_lat:elem.latitude,
      pickup_location:elem.address,
      pickup_long:elem.longitude,
      pickup_pincode:elem.pincode,
      pickup_receiver_contact:elem.receiver_contact ,
      pickup_receiver_name:elem.receiver_name,
      pickup_state:elem.state,
      pickup_time:moment(pickup_time).format("YYYY-MM-DD HH:mm:ss"),
      pickuptime_flexiblity_status:"Fixed"
    })
    setPick_loca(false)
    setSearch("")


  }

 
 

  const addingDropoffAddress=(elem)=>{
    setDrop_Address_object({
      dropoff_city:elem.city,
      dropoff_country:elem.country,
      dropoff_flexible_time:"",
      dropoff_lat:elem.latitude,
      dropoff_location:elem.address,
      dropoff_long:elem.longitude,
      dropoff_pincode:elem.pincode,
      dropoff_receiver_contact:elem.receiver_contact,
      dropoff_receiver_name:elem.receiver_name,
      dropoff_state:elem.state ,
      dropoff_time:booking_type ? moment(pickup_time).add(6,"hours").format("YYYY-MM-DD HH:mm:ss") :
       moment(pickup_time).add(2,"hours").format("YYYY-MM-DD HH:mm:ss"),
      dropofftime_flexiblity_status: "Fixed",
    })
    // setDropoffAddress({...dropoffAddress,
    //   address:elem.address,
    // receiver_name:elem.receiver_name,
    // receiver_contact:elem.receiver_contact,
    // id:elem.id,
    // latitude:elem.latitude,
    // longitude:elem.longitude,
    // city:elem.city,
    // state:elem.state,
    // country:elem.country,
    // pincode:elem.pincode
    
    // })

    // setDropoff_address(address)
    setDrop_loca(false)
    setSearch("")

  }

  const changeView=()=>{
    // setCheck(!check)
    setCheck1(false)
    setCheck(!check)
    
  }

  const changeViews=()=>{
    setCheck(false)
    setCheck1(!check1)
  }

  useEffect(() => {
    getAllUsersDetails(url);
    checking(customer_id);
  }, [optionsList]);

  

  const addingSourceAddressFromMap=async(e)=>{
    e.preventDefault();
    const addAddressPayload={
    customer_id:customer_id,
    address:source,
    city:city,
    state:addressState,
    country:country,
    pincode:pincode,
    latitude:coords.lat,
    longitude:coords.lng,
    receiver_name:receiverName,
    receiver_contact:receiverContact,
    mobile:customerMobileNo,
    address_type:"Pickup"
    }
    
    
    const request=await axios.post(`${baseUrl}/users/addAddress`,addAddressPayload)
    if(request.data.success==true){
      const responseObj=request.data.data;
      console.log(responseObj,"responseObj")

      const pickupAddress={
        pickup_city:responseObj.city,
        pickup_country:responseObj.country,
        pickup_flexible_time:"",
        pickup_lat:responseObj.latitude,
        pickup_location:responseObj.address,
        pickup_long:responseObj.longitude,
        pickup_pincode:responseObj.pincode,
        pickup_receiver_contact:responseObj.receiver_contact,
        pickup_receiver_name:responseObj.receiver_name,
        pickup_state:responseObj.state,
        // pickup_time:moment().format("YYYY-MM-DD HH:mm:ss"),
        // pickup_time:pickup_time ? pickup_time :moment().format("YYYY-MM-DD HH:mm:ss"),
        pickup_time:moment(pickup_time).format("YYYY-MM-DD HH:mm:ss"),
        pickuptime_flexiblity_status:"Fixed",
        pickup_flexible_time:"",

      }
      console.log(pickupAddress,"pickupAddress")
      
      setPick_Address_object(pickupAddress);
      setSource("")
      setCity("")
      setAddressState("")
      setCountry("")
      setPincode("")
      setReceiverContact("")
      setReceiverName("")
      setPick_loca(false)

    }else{
      console.log("something wrong ? Your Address not saved in List .! ");
    }
    
  }
  


  const addingMultiSourceAddressFromMap=async(e)=>{
    console.log("Selected Index from Map :",index)
    e.preventDefault();
    const addAddressPayload={
      customer_id:customer_id,
      address:multiSource,
      city:city,
      state:addressState,
      country:country,
      pincode:pincode,
      latitude:coords.lat,
      longitude:coords.lng,
      receiver_name:receiverName,
      receiver_contact:receiverContact,
      mobile:customerMobileNo,
      address_type:"Pickup"
      }
      const request=await axios.post(`${baseUrl}/users/addAddress`,addAddressPayload)
    if(request.data.success==true){
      const responseObj=request.data.data;
      const addMultiAddressPayload={
        pickup_city:responseObj.city,
        pickup_country:responseObj.country,
        pickup_flexible_time:"",
        pickup_lat:responseObj.latitude,
        pickup_location:responseObj.address,
        pickup_long:responseObj.longitude,
        pickup_pincode:responseObj.pincode,
        pickup_receiver_contact:responseObj.receiver_contact,
        pickup_receiver_name:responseObj.receiver_name,
        pickup_state:responseObj.state,
        // pickup_time:moment().format("YYYY-MM-DD HH:mm:ss"),
        // pickup_time:pickup_time ? pickup_time :moment().format("YYYY-MM-DD HH:mm:ss"),
        pickup_time:moment(pickup_time).format("YYYY-MM-DD HH:mm:ss") ,
        pickuptime_flexiblity_status:"Fixed",
        pickup_flexible_time:"",
        }
      setPickupAddressArr((prevPickupAddressArr)=>{
        const updatedArr=[...prevPickupAddressArr]
        updatedArr[index]=addMultiAddressPayload
        return updatedArr
      })
      setMultiSource("")
      setCity("")
      setAddressState("")
      setCountry("")
      setPincode("")
      setReceiverContact("")
      setReceiverName("")
      setMultiPick_loca(false)
      
    }else{
      console.log("something wrong ? Your Address not saved in List .! ");
    }

  }
  
  // While Selecting Address from Saved  List ..

  const  addingMultiPickupAddress=(elem)=>{
    console.log(elem,index,"=====")
    const addAdress={
      pickup_city:elem.city,
      pickup_country:elem.country,
      pickup_flexible_time:"",
      pickup_lat:elem.latitude,
      pickup_location:elem.address,
      pickup_long:elem.longitude,
      pickup_pincode:elem.pincode,
      pickup_receiver_contact:elem.receiver_contact,
      pickup_receiver_name:elem.receiver_name,
      pickup_state:elem.state,
      // pickup_time:moment().format("YYYY-MM-DD HH:mm:ss"),
      // pickup_time:pickup_time ? pickup_time :moment().format("YYYY-MM-DD HH:mm:ss"),
      pickup_time:moment(pickup_time).format("YYYY-MM-DD HH:mm:ss") ,
      pickuptime_flexiblity_status:"Fixed"
    }

    setPickupAddressArr((prevPickupAddressArr)=>{
      const updatedArr=[...prevPickupAddressArr]
      updatedArr[index]=addAdress
      return updatedArr
    })
    setMultiPick_loca(false)

  }   
    
  
  
  

  const addingDestinationAddressFromMap=async(e)=>{
    e.preventDefault()
    const sendToSave={
      customer_id:customer_id,
      address:destination,
      city:dropcity,
      state:dropaddressState,
      country:dropcountry,
      pincode:droppincode,
      latitude:coords.lat,
      longitude:coords.lng,
      receiver_name:dropreceiverName,
      receiver_contact:dropreceiverContact,
      mobile:customerMobileNo,
      address_type:"Pickup"
    }
    const request=await axios.post(`${baseUrl}/users/addAddress`,sendToSave)
    if(request.data.success==true){
      const respObj=request.data.data;
      const addDestinationAddressPayload={
        dropoff_city:respObj.city,
        dropoff_country:respObj.country,
        dropoff_flexible_time:"",
        dropoff_lat:respObj.latitude,
        dropoff_location:respObj.address,
        dropoff_long:respObj.longitude,
        dropoff_pincode:respObj.pincode,
        dropoff_receiver_contact:respObj.receiver_contact,
        dropoff_receiver_name:respObj.receiver_name,
        // dropoff_address_id:while selecting saved address from list
        dropoff_state:respObj.state ,
        dropoff_time:booking_type  ? moment(pickup_time).add(6,"hours").format("YYYY-MM-DD HH:mm:ss") :
         moment(pickup_time).add(2,"hours").format("YYYY-MM-DD HH:mm:ss"),
        dropofftime_flexiblity_status: "Fixed",
      }
      console.log(addDestinationAddressPayload)
      setDrop_Address_object(addDestinationAddressPayload)
      setDestination("")
      setDropCity("")
      setDropAddressState("")
      setDropCountry("")
      setDropPincode("")
      setDropReceiverContact("")
      setDropReceiverName("")
      setDrop_loca(false)

    }else{
      console.log("something wrong ? ");
    }

  }
  console.log(drop_Address_object,"drop_Address_object")
  

  const addingMultiDestinationAddressFromMap=async(e)=>{
    e.preventDefault();
    console.log("Selected index By Map : ",index)
    const sendToSave={
      customer_id:customer_id,
      address:multiDestination,
      city:dropcity,
      state:dropaddressState,
      country:dropcountry,
      pincode:droppincode,
      latitude:coords.lat,
      longitude:coords.lng,
      receiver_name:dropreceiverName,
      receiver_contact:dropreceiverContact,
      mobile:customerMobileNo,
      address_type:"Pickup"
    }
    const request=await axios.post(`${baseUrl}/users/addAddress`,sendToSave)
    if(request.data.success==true){
      const respObj=request.data.data;
      const addMultiDestinationAddressPayload={
        dropoff_city:respObj.city,
        dropoff_country:respObj.country,
        dropoff_flexible_time:"",
        dropoff_lat:respObj.latitude,
        dropoff_location:respObj.address,
        dropoff_long:respObj.longitude,
        dropoff_pincode:respObj.pincode,
        dropoff_receiver_contact:respObj.receiver_contact,
        dropoff_receiver_name:respObj.receiver_name,
        // dropoff_address_id:while selecting saved address from list
        dropoff_state:respObj.state ,
        dropoff_time:booking_type ? moment(pickup_time).add(6,"hours").format("YYYY-MM-DD HH:mm:ss") :
         moment(pickup_time).add(2,"hours").format("YYYY-MM-DD HH:mm:ss"),
        dropofftime_flexiblity_status: "Fixed",
        
        }
        console.log("addMultiDestinationAddressPayload :",addMultiDestinationAddressPayload)
        setDropAddressArr(prevDropAddressArr => {
          const updatedDropAddressArr = [...prevDropAddressArr]; // Create a copy of the original array
          updatedDropAddressArr[index] = addMultiDestinationAddressPayload; // Update the value at the specified index
          return updatedDropAddressArr; // Return the updated array to set the new state
        });
        setMultiDestination("")
        setDropCity("")
        setDropAddressState("")
        setDropCountry("")
        setDropPincode("")
        setDropReceiverContact("")
        setDropReceiverName("")
        setMultiDrop_loca(false)


    }else{
      console.log("Your Address is Not Saved in List ?")

    }


  }

    // While Selecting Address from Saved  List ..

  const addingMultiDropoffAddress=(elem)=>{
    // e.preventDefault()
    console.log(index)
    console.log("I am from MOdal :",elem)
    const selectedAddress={
      dropoff_city:elem.city,
      dropoff_country:elem.country,
      dropoff_flexible_time:"",
      dropoff_lat:elem.latitude,
      dropoff_location:elem.address,
      dropoff_long:elem.longitude,
      dropoff_pincode:elem.pincode,
      dropoff_receiver_contact:elem.receiver_contact,
      dropoff_receiver_name:elem.receiver_name,
      dropoff_state:elem.state ,
      dropoff_time:booking_type ? moment(pickup_time).add(6,"hours").format("YYYY-MM-DD HH:mm:ss") :
       moment(pickup_time).add(2,"hours").format("YYYY-MM-DD HH:mm:ss"),
      dropofftime_flexiblity_status: "Fixed",
    }
    setDropAddressArr(prevDropAddressArr => {
      const updatedDropAddressArr = [...prevDropAddressArr]; // Create a copy of the original array
      updatedDropAddressArr[index] = selectedAddress; // Update the value at the specified index
      return updatedDropAddressArr; // Return the updated array to set the new state
    });
    setMultiDrop_loca(false)
    setSearch("")

  }
  
 
  
  

  

  const handleSourceAddress=(e)=>{
    let value=e.target.value;
    setSource(value)
    if(value === ""){
      setCity("")
      setAddressState("")
      setCountry("")
      setPincode("")
      setCoords({lat:"",lng:""}) // while doing some error coming here..

    }
  }

  const handleMultiSourceAddress=(e)=>{
    let value=e.target.value;
    setMultiSource(value)
    if(value === ""){
      setCity("")
      setAddressState("")
      setCountry("")
      setPincode("")
      setCoords({lat:"",lng:""}) // while doing some error coming here..

    }
  }
  

  const handleDestinationAddress=(e)=>{
    e.preventDefault()
    let value=e.target.value;
    console.log("Type ",value)
    setDestination(value)
    // if(value === ""){
    //   setDropCity("")
    //   setDropAddressState("")
    //   setDropCountry("")
    //   setDropPincode("")
      
    //   // setCoords({lat:"",lng:""}) 

    // }

  }
  const handleMultiDestinationAddress=(e)=>{
    let value=e.target.value;
    setMultiDestination(value)
    if(value === ""){
      setCity("")
      setAddressState("")
      setCountry("")
      setPincode("")
      // setCoords({lat:"",lng:""}) 

    }
  }

  // For DeleteSelectedSaveAddress from Modal
  const DeleteSelectedSaveAddress=async(id)=>{
    console.log(id);
    try {
      const resp=await axios.post(`${baseUrl}/users/deleteAddress/${id}`)
      if(resp.data.success){
        alert("Address Deleted Successfully.✅")
        checking(customer_id)
      }
      
    } catch (error) {
      console.error(error);
      alert("Failed to Delete ?")
      
    }
  }

  const customStyle = {
    
    option: (provided, state) => ({
      ...provided,
      padding:"5px",
      margin:"5px",
      backgroundColor: state.isSelected ? 'green' : 'white',
      color: state.isSelected ? 'white' : 'black',
      ':hover': {
        backgroundColor: 'green',
        color:"white",
        
      },
    }),
  };
  
  

  const handleEditAddress=(item)=>{
    setEditAddress(true)
    setEditData(item)

  }

// choose Trip Types by Radio Buttons..

  const handleChooseTravelType=(e)=>{
    let travelType=e.target.value;
    setTrip_type(travelType)
    if(travelType == "multipickup"){
      setMultiPickupButton(true)
      setMultiDropButton(false)
      setDropAddressArr([])

    }else if(travelType == "multidrop"){
      setMultiDropButton(true)
      setMultiPickupButton(false)
      setPickupAddressArr([])


    }
    else{
      setMultiPickupButton(false)
      setMultiDropButton(false)
      setDropAddressArr([])
      setPickupAddressArr([])

    }

  }

  // Showing MutiPickup Button
  const showingMultiPickupAddress = (e) => {
    e.preventDefault();
    if(pickupAddressArr.length < 5){
      setPickupAddressArr([...pickupAddressArr,{pickup_location:""}])
     
    }
  };

// Showing MutiDrop Button
  const showingMultiDropAddress=(e)=>{
    e.preventDefault();
    if(dropAddressArr.length<5){
      setDropAddressArr([...dropAddressArr,{dropoff_location:""}])
    }

  }

  useEffect(() => {
    console.log(dropAddressArr, "Updated Drop Address Arr");
    setDropAddressArr(dropAddressArr)
  }, [dropAddressArr]);
  useEffect(() => {
    setPickupAddressArr(pickupAddressArr)
    console.log(pickupAddressArr, "Updated pickupAddressArr Address Arr");
  }, [pickupAddressArr]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handlePickupTime();
  //   }, 60000); 

  //   return () => clearInterval(interval);
  // }, []);

  // For Removing Input Boxes ...

  const removePickupAddress=(e,index)=>{
    e.preventDefault();
    console.log(index)
    const newAddresses = [...pickupAddressArr];
    
      newAddresses.splice(index, 1);
      setPickupAddressArr(newAddresses);

  }



  const removeDropAddress=(e,index)=>{
    e.preventDefault()
    const newAddress=[...dropAddressArr]
    newAddress.splice(index,1)
    setDropAddressArr(newAddress)

  }
  
  console.log("dropAddressArr :",dropAddressArr)
  
  
  
  
  const handleInputChange = (index, value) => {
    const newAddresses = [...pickupAddressArr];
    newAddresses[index] = value;
    // setPickupAddressArr(newAddresses);
  };
  
  const clearInputSet = (index,e) => {
    e.preventDefault()
    const newAddresses = [...pickupAddressArr];
    newAddresses.splice(index, 1);
    // setPickupAddressArr(newAddresses);
  };

  
  
  
  
  

  

  const bookingAcceptance=async()=>{
    setLoading(true)
    const book_accept_payload={
      ...addBookingObj,
      additional_fare:fareObj.additional_fare,
      additional_fare_comments:fareObj.additional_fare_comments,
      estimate_fare_info:fareObj.estimate_fare_info,
      is_regular:fareObj.is_regular,
      loading_charge:fareObj.loading_charge,
      toll_charge:fareObj.toll_charge,
      estimated_fare:fareObj.total_fare,
      payment_type:"",
      payment_made_by:"",
      // payment_type:"COD",
      // payment_made_by:"other_party_pay",
      total_fare:Math.round(parseInt(fareObj.additional_fare?fareObj.additional_fare:0) +parseInt(fareObj.loading_charge?fareObj.loading_charge:0)+parseInt(fareObj.total_fare?fareObj.total_fare:0)
      +parseInt(fareObj.toll_charges?fareObj.toll_charges:0))
      // return_weight:fareObj.return_weight
    }
    console.log("book_accept_payload ",book_accept_payload)
    
    
    try {
      const response=await axios.post(`${baseUrl}/booking/addMultiBooking`,book_accept_payload)
      console.log("Response from bookingAcceptance ",response.data.success)
      if(response.data.success){
        setLoading(false)
        toast.success("Booking Added Successfully",{
          className:"toast-success-message",
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
        });
        setTimeout(()=>{
          setFareModal(false)
         navigate("/dashboard/tours/bookings")
        },1000)
      }
      
      
    } catch (error) {
      toast.error("Failed to Bookings", {
            position: "top-center",
            className:"toast-error-message",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
      console.log(error,"response from Boking Axcept Error")
      
    }
 
  }

  const printingMultiId=(itemId)=>{
    console.log(itemId)
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(itemId)) {
        return prevSelectedIds.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedIds, itemId];
      }
    })
  }

  console.log("newMultiId",selectedIds)
  
  
  const [startDate, setStartDate] = useState(new Date());


  return (
    <div style={{ padding: "5px", margin: "5px" }} id="add-Bookings-Container">
      {/* Fare Modal & Payment Choose Modal.... */}
      <Modal isOpen={fareModal} id="Fare-Modal">
        <ModalHeader toggle={()=>setFareModal(false)}>
          <span>Fare Split Details:</span>
        </ModalHeader>
        <ModalBody className="modal-body">
          <table id="fareTable">
            {/* <tr className="fares"><td>FARES</td><td>Rs.</td></tr> */}
          <tr><td>Estimated  Fare :</td><td>{fareObj?.total_fare }</td></tr>
          <tr>
            { addBookingObj.loading_charge_applicable ? (
              <>
                <td>Loading Charge :</td>
                <td>{fareObj?.loading_charge}</td>
              </>
            ) : addBookingObj.unloading_charge_applicable ? (
              <>
                <td>UnLoading Charge :</td>
                <td>{fareObj?.loading_charge}</td>
              </>
            ) :addBookingObj.both_loading_unloading_charge_applicable ? (
              <>
                <td>Loading & UnLoading Charge :</td>
                <td>{fareObj?.loading_charge}</td>
              </>
            ) : null}
          </tr>
          <tr><td>Toll Charge :</td><td>{fareObj?.toll_charge }</td></tr>
          <tr><td>Pending Balance :</td><td>{fareObj?.additional_fare }</td></tr>
          <tr className="fares"><td>TOTAL AMOUNT </td><td> Rs. {Math.round(fareObj?.additional_fare +fareObj?.total_fare+fareObj?.loading_charge+fareObj?.toll_charge  )}</td></tr>
          </table>
          <button onClick={bookingAcceptance}>
          {loading ? <div className="loading-addBook-spinner-container">
                            <div className="loading-addBook-spinner"></div>
                            </div>:"CONFIRM"}
            
            </button>

        </ModalBody>
      </Modal>
      <Modal isOpen={paymentModal}>
        <ModalHeader toggle={()=>setPaymentModal(false)}>
          <p>Payment Options</p>

        </ModalHeader>
        <ModalBody>

          choose payment type :
          COD
          Online

        </ModalBody>
      </Modal>

      <div className="addbookform-Div">
        <p style={{ fontWeight: "bold" }}>Add Bookings :</p>
        <div
          className="select-Div"
          style={{
            width: "550px",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "green",
            borderRadius: "5px",
          }}
        >
          <Select
            // options={data}
            options={options}
            value={optionsList}
            styles={customStyle}
            classNamePrefix="mySelect"
            // onChange={(selectedOption)=>setAdd_book_state(selectedOption)}
            onChange={getSelectedOption}
            isSearchable
            noOptionsMessage={() => "No Search Found..."}
            placeholder="Select or Search... "
          />
        </div>

        {/* ADD BOOKINGS - FORM */}

        <form
          className="addbookforms"
          
        >
          
          <label style={{padding:"10px 0px 0px 0px"}}><b >Trip Type :</b></label>
            <div className="radio-Container">
              <div className="column">
              <input type="radio" name="Choose" id="oneway" value="oneway" onChange={handleChooseTravelType}/>
              <label htmlFor="oneway">OneWay</label>
              </div>

                <div className="column">
                <input type="radio" name="Choose" id="multiPickup" value="multipickup" onChange={handleChooseTravelType} />
                <label htmlFor="multiPickup">Multi Pick-up</label>
                <input type="radio" name="Choose" id="multiDrop" value="multidrop" onChange={handleChooseTravelType} />
                <label htmlFor="multiDrop">Multi Drop</label>
                </div>
            </div>


          <label htmlFor="commodity"><b>Commodity Weight :</b></label>
          <input
            type="number"
            placeholder="Enter Commodity Weight"
            id="commodity"
            value={comm_weight}
            autoComplete="off"
            min={0}
            onChange={(e) => setComm_weight(e.target.value)}
          />

          <label htmlFor="time"><b>Earliest Pick-up Time :</b></label>
              <DatePicker
          selected={pickup_time}
          onChange={(date) => setPickup_time(date)}
          timeInputLabel="Time:"
          dateFormat="yyyy-MM-dd hh:mm:ss"
          showTimeSelect
          // showTimeInput
        />
          
             <div>
              <label htmlFor="pickup">{trip_type=="multipickup"? <b>Pickup Location - 1 :</b>:<b>Pickup Location :</b>}</label>
              <div className="pickup-Div">
                  <input
                    type="text"
                    // placeholder="Choose Pickup Location"
                    placeholder={trip_type=="multipickup"?"Pickup Location - 1":"Pickup Location"}
                    id="pickup"
                    autoComplete="off"
                    // value={source}
                    value={pick_Address_object.pickup_location}
                    onChange={(e)=>setPickupAddress({...pickupAddress,address:e.target.value})}
                  />
                
                  <BiSolidMap
                    size={40}
                    className="mapIcon"
                    color="green"
                    onClick={changePickup}
                    style={{ cursor: "pointer" }}
                  />
              </div>
            </div>
            
            {
            multiPickupButton && <>
            {
              pickupAddressArr && pickupAddressArr.map((ele,index)=>(<div className="multi" key={index}>
                <label htmlFor=""><b>Pickup Location - {index+2} :{index== 4 ? <span>(Max {pickupAddressArr.length} Allowed)</span> :""}</b></label>
                <div className="content">
                  <input type="text" value={ele.pickup_location} placeholder={`Choose Pickup Location -${index+2}`} />
                  <BiSolidMap
                      size={40}
                      className="mapIcon"
                      color="green"
                      onClick={()=>{
                        changeMultiPickup()
                        setIndex(index)
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  {/* <button onClick={(e)=>removePickupAddress(e,index)}>Remove</button> */}
                  <RxCrossCircled onClick={(e)=>removePickupAddress(e,index)} 
                  className="cancelIcon"
                  size={23}/>
                </div>
              </div>))
            }
            {
              pickupAddressArr.length <5 && (
              <button className="add_pick_drop_button" onClick={(e)=>showingMultiPickupAddress(e)}>
                Add Pickup <IoMdAddCircleOutline  size={20}/> 
                </button>)
            }
            {/* {
              pickupAddressArr.length <5 && (<IoMdAddCircleOutline 
                className="add_icon"  
                onClick={(e)=>showingMultiPickupAddress(e)} size={30}/>)
            } */}
            
            
            </>
            }


          <label htmlFor="location"><b>Dropoff Location {trip_type=="multidrop"? - 1 :""} :</b></label>
          <div className="pickup-Div">
          <input
                type="text"
                placeholder=
                {trip_type=="multidrop"?"Choose Dropoff Location - 1":"Choose Dropoff Location"}
                id="location"
                autoComplete="off"
                // value={dropoffAddress.address}
                value={drop_Address_object.dropoff_location}
                onChange={(e)=>setDropoffAddress({...dropoffAddress,address:e.target.value})}
                
              />
              <BiSolidMap
                size={40}
                className="mapIcon"
                onClick={changeDropoff}
                color="green"
                style={{ cursor: "pointer" }}
              />
          </div>
          {
            multiDropButton && (
              <>
              {dropAddressArr && dropAddressArr.map((ele,index)=>(
                  <div key={index} className="multi" >
                    <label htmlFor={`multiDrop-${index}`}><b>Dropoff Location -{index+2} :{index== 4 ? <span>(Max {dropAddressArr.length} Allowed)</span> :""}</b></label>
                    <div className="content">
                      <input id={`multiDrop-${index}`} key={`multiDrop-${index}`}autoComplete="off"
                      value={ele.dropoff_location}
                      type="text" placeholder={`Choose Dropoff Location -${index+2}`}/>
                      <BiSolidMap
                      size={40}
                      className="mapIcon"
                      color="green"
                      onClick={()=>{
                        changeMultiDrop()
                        setIndex(index)
                      }}
                      style={{ cursor: "pointer" }}
                    />
                      {/* <button onClick={(e)=>removeDropAddress(e,index)}>Delete</button> */}
                      <RxCrossCircled 
                      size={23}
                      className="cancelIcon"
                      onClick={(e)=>removeDropAddress(e,index)}/>
                    </div>
                  </div>
                ))
              }
              
              {  dropAddressArr.length < 5 && <button 
              className="add_pick_drop_button"
              onClick={(e)=>showingMultiDropAddress(e)}>
                Add Drop <IoMdAddCircleOutline  size={20}/>
              </button>}              
              </>
            )
           }

          
          
          <label htmlFor="info"><b>Additional Information :</b></label>
          <input
            type="text"
            placeholder="Enter Additional Information "
            autoComplete="off"
            id="info"
            value={add_info}
            onChange={(e) => setAdd_info(e.target.value)}
          />

          <div className="addbook-Btn">
              <button type="button" style={{border:"none",padding:"8px"}}
                onClick={(event) => addNewBookings(addBookingObj,event)}>
                 {fareLoading ? <div className="loading-addBook-spinner-container">
                            <div className="loading-addBook-spinner"></div>
                            </div>:"GET FARE"} 
              </button>
              
            <div >
            <ToastContainer position="top-center" style={{width:"350px",textAlign:"center"}}/>
            </div>
          </div>
        </form>

            

      </div>
      {/* Modals */}
      <section id="pickup-location-modal">
        <Modal isOpen={pick_loca} size="xl" scrollable id="pickup-location-modal-mobile">
          <ModalHeader toggle={changePickup} style={{ border: "none" }}>
            <p style={{ textAlign: "center" }}>Choose Pickup Location :</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link onClick={changeView} className={check?"class1":"class2"}>Address List</Link>
              <Link onClick={changeViews} className={check?"class2":"class1"} >Map</Link>
            </div>
            <div>
              <MultiDeleteBtn selectedIds={selectedIds} deleteMultipleAddresses={deleteMultipleAddresses}/>
            </div>
            {/* <div>
                    {
                      Boolean(selectedIds.length) && <button 
                      className="card-btn-pickup" 
                      style={{position:"relative",left:"260px",top:"30px", width:"140px"}}
                      onClick={deleteMultipleAddresses}
                      >Multi-Delete</button>
                    }
            </div> */}
          </ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", gap: "8px",flexDirection:"column"}}>
                        
              {check && 
              <>              
              <div style={{ flex: 1.2,border:"1px solid lightgrey",padding:"3px" }}>
                <div className="searchInput">
                <input style={{padding:"3px",width:"36%"}} placeholder="Search Address.." type="text"  value={search} onChange={(e)=>setSearch(e.target.value)}/>
                </div>
                <div style={{display:"flex"}}>
                    <div style={{flex:0.8}} id="p">
                  {
                    
                    pickup_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                      <Card key={index} className="my-2 card" color="dark"
                      outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                        <CardBody>
                          <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                          
                          <div>
                            <p>Latitude:<span>{item.latitude}</span></p>
                            <p>Longitude:<span>{item.longitude}</span></p>
                          </div>
                        </CardBody>
                        <CardFooter>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete </button></div>
                            <div style={{display:"flex"}} className="cardFooter">
                              <button className="card-btn-pickup" onClick={()=>addingPickupAddress(item)}>Select</button>
                            </div>
                            <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>
                            </div>

                        </CardFooter>
                      </Card>
                      
                    ))
                  }
                  {
                    
                    dropoff_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                      <Card key={index} className="my-2 card" color="dark"
                      outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                        <CardBody>
                        <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                          
                          <div>
                            <p>Latitude:<span>{item.latitude}</span></p>
                            <p>Longitude:<span>{item.longitude}</span></p>
                          </div>
                        </CardBody>
                        <CardFooter>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete</button></div>
                            <div style={{display:"flex"}} className="cardFooter">
                              <button className="card-btn-pickup" onClick={()=>addingPickupAddress(item)}>Select</button>
                            </div>
                            <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>

                            </div>

                        </CardFooter>
                      </Card>
                      
                    ))
                  }
                    </div>
                    {/* MultiDelete Button.... */}
                    
                    {/* editAddress,setEditAddress */}
                    {
                      editAddress && 
                      <div style={{flex:1}} id="0">
                        <span style={{fontSize:"18px"}}>Edit :</span>
                      <AddressEdit editData={editData} checking={checking} id={customer_id} setEditAddress={setEditAddress}/>
                    </div>
                    }

                </div>
                
                
              
              </div>
              </>
              
              }
              
            </div>
            
            {
                check1 && 
                <div style={{display:"flex",gap:"5px"}}>
                  <div style={{flex:2,border:"1px solid grey"}} className="mapContainer">
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
                    // center={{lat:12.896,lng:80.2425}}
                  >
                    <Marker
                      draggable={true}
                      // onLoad={(map) => onMapLoad(map)}
                      onDragEnd={(e) => {
                        setCoords({
                          ...coords,
                          lat: e.latLng?.lat(),
                          lng: e.latLng?.lng(),
                        });
                        handleMarkerMove(coords)
                      }}
                      position={coords}
                    ></Marker>
                        
                  </GoogleMap>

                      <div className="address-selection">
                        <Autocomplete>
                        {/* (e)=>setSource(e.target.value) */}
                        <input type="text" ref={sourceRef} value={source} onChange={handleSourceAddress} 
                        placeholder="Search Your Location..." />
                      </Autocomplete>
                      <button className="btn-small" onClick={addAddress}>ADD</button>
                      </div>
                  </div>

                  <div style={{flex:2}} >
                    <span style={{color:"red"}}>Required fields.{""}<b style={{fontWeight:"bold"}}>*</b></span>
                  <form className='shopform' onSubmit={addingSourceAddressFromMap}>
                    <label htmlFor="address">Address *  :</label>
                    <input type="text" placeholder='Enter Address' value={source}
                    autoComplete="nope" 
                    onChange={(e)=>setSource(e.target.value)}  id='address' name='address' />
                    <label htmlFor="city">City * :</label>
                    <input type="text" placeholder='City'  value={city} 
                    autoComplete="nope"
                    onChange={(e)=>setCity(e.target.value)} id='city' name='city' />
                    <label htmlFor="state">State * :</label>
                    <input type="text" placeholder='State' value={addressState}
                    autoComplete="nope" 
                    onChange={(e)=>setAddressState(e.target.value)} id='state' name='state' />
                    <label htmlFor="country">Country * :</label>
                    <input type="text" placeholder='Country'value={country} 
                    autoComplete="nope"
                    onChange={(e)=>setCountry(e.target.value)} id='country' name='country' />
                    <label htmlFor="pincode">Pincode * :</label>
                    <input type="text" placeholder='Enter Pincode' value={pincode} onChange={(e)=>setPincode(e.target.value)} id='pincode' name='pincode' />
                    <label htmlFor="lattitude">Lattitude * :</label>
                    {/* 12.8996 80.0929 */}
                    <input type="text" placeholder='Lattitude' value={coords.lat == 12.8996 ? "":coords.lat} 
                    onChange={(e)=>(setCoords({...coords,lat:e.target.value}))} id='lattitude' name='lattitude' />
                    <label htmlFor="longitude">Longitude * :</label>
                    <input type="text" placeholder='Longitude' value={coords.lng == 80.0929 ? "":coords.lng}
                    onChange={(e)=>(setCoords({...coords,lng:e.target.value}))} id='longitude' name='longitude' />
                    <label htmlFor="receiver name">Receiver Name * :</label>
                    <input type="text" placeholder='Enter Receiver name' value={receiverName} autoComplete="nope" onChange={(e)=>setReceiverName(e.target.value)} id='receiver name' name='receiver name' />
                    <label htmlFor="receiver contact">Receiver Contact * :</label>
                    <input type="text" maxLength={10} placeholder='Enter Receiver contact' autoComplete="off" value={receiverContact} onChange={(e)=>setReceiverContact(e.target.value)} id='receiver contact' name='receiver contact' />
                    <button type='submit' className='btn-small'>ADD</button>
                  </form>
                  
                  </div>

              </div>
              }
          </ModalBody>
        </Modal>
      </section>

      <section id="multiPickup-Location-Modal">
        <Modal isOpen={multi_pick_loca} size="xl" scrollable >
          <ModalHeader toggle={changeMultiPickup} style={{border:"none"}}>
          <p style={{ textAlign: "center" }}>Choose Pickup Location :</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link onClick={changeView} className={check?"class1":"class2"}>Address List</Link>
              <Link onClick={changeViews} className={check?"class2":"class1"} >Map</Link>
            </div>
            <div>
              <MultiDeleteBtn selectedIds={selectedIds} deleteMultipleAddresses={deleteMultipleAddresses}/>
            </div>
          </ModalHeader>
            <ModalBody>
            <div style={{ display: "flex", gap: "8px"}}>

                {check && 
                <>

                <div style={{ flex: 1.2,border:"1px solid lightgrey",padding:"3px" }}>
                  <div className="searchInput">
                  <input style={{padding:"3px",width:"36%"}} placeholder="Search Address.." type="text"  value={search} onChange={(e)=>setSearch(e.target.value)}/>
                  </div>
                  <div style={{display:"flex"}}>
                      <div style={{flex:0.8}} id="p">
                    {
                      
                      pickup_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                        <Card key={index} className="my-2 card" color="dark"
                        outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                          <CardBody>
                          <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                            <div>
                              <p>Latitude:<span>{item.latitude}</span></p>
                              <p>Longitude:<span>{item.longitude}</span></p>
                            </div>
                          </CardBody>
                          <CardFooter>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                              <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete </button></div>
                              <div style={{display:"flex"}} className="cardFooter">
                                <button className="card-btn-pickup" onClick={()=>addingMultiPickupAddress(item)}>Select</button>
                              </div>
                              <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>
                              </div>

                          </CardFooter>
                        </Card>
                        
                      ))
                    }
                    {
                      
                      dropoff_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                        <Card key={index} className="my-2 card" color="dark"
                        outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                          <CardBody>
                          <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                            <div>
                              <p>Latitude:<span>{item.latitude}</span></p>
                              <p>Longitude:<span>{item.longitude}</span></p>
                            </div>
                          </CardBody>
                          <CardFooter>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete</button></div>
                              <div style={{display:"flex"}} className="cardFooter">
                                <button className="card-btn-pickup" onClick={()=>addingPickupAddress(item)}>Select</button>
                              </div>
                              <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>

                              </div>

                          </CardFooter>
                        </Card>
                        
                      ))
                    }
                      </div>
                      {/* editAddress,setEditAddress */}
                      {
                        editAddress && 
                        <div style={{flex:1}} id="0">
                          <span style={{fontSize:"18px"}}>Edit :</span>
                        <AddressEdit editData={editData} checking={checking} id={customer_id} setEditAddress={setEditAddress}/>
                      </div>
                      }

                  </div>
                  
                </div>
                </>
                }

              </div>

              {
                check1 && 
                <div style={{display:"flex",gap:"5px"}}>
                  <div style={{flex:2,border:"1px solid grey"}} className="mapContainer">
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
                      // onLoad={(map) => onMapLoad(map)}
                      onDragEnd={(e) => {
                        setCoords({
                          ...coords,
                          lat: e.latLng?.lat(),
                          lng: e.latLng?.lng(),
                        });
                        handleMarkerMove(coords,index)
                      }}
                      position={coords}
                    ></Marker>
                        
                  </GoogleMap>

                      <div className="address-selection">
                        <Autocomplete>
                        {/* (e)=>setSource(e.target.value) */}
                        <input type="text" ref={multiSourceRef} value={multiSource} onChange={handleMultiSourceAddress} 
                        placeholder="Search Your Location.." />
                      </Autocomplete>
                      <button className="btn-small" onClick={addMultiAddress}>ADD</button>
                      </div>
                  </div>

                  <div style={{flex:2}} >
                  <span style={{color:"red"}}>Required fields.{""}<b style={{fontWeight:"bold"}}>*</b></span>
                  <form className='shopform' onSubmit={addingMultiSourceAddressFromMap}>
                    <label htmlFor="address">Address * :</label>
                    <input type="text" placeholder='Enter Address' value={multiSource}
                    autoComplete="nope" 
                    onChange={(e)=>setSource(e.target.value)}  id='address' name='address' />
                    <label htmlFor="city">City * :</label>
                    <input type="text" placeholder='City'  value={city} 
                    autoComplete="nope"
                    onChange={(e)=>setCity(e.target.value)} id='city' name='city' />
                    <label htmlFor="state">State * :</label>
                    <input type="text" placeholder='State' value={addressState}
                    autoComplete="nope" 
                    onChange={(e)=>setAddressState(e.target.value)} id='state' name='state' />
                    <label htmlFor="country">Country *:</label>
                    <input type="text" placeholder='Country'value={country} 
                    autoComplete="nope"
                    onChange={(e)=>setCountry(e.target.value)} id='country' name='country' />
                    <label htmlFor="pincode">Pincode * :</label>
                    <input type="text" placeholder='Enter Pincode' value={pincode} onChange={(e)=>setPincode(e.target.value)} id='pincode' name='pincode' />
                    <label htmlFor="lattitude">Lattitude * :</label>
                    <input type="text" placeholder='Lattitude' value={coords.lat == 12.8996 ? "":coords.lat} 
                    onChange={(e)=>(setCoords({...coords,lat:e.target.value}))} id='lattitude' name='lattitude' />
                    <label htmlFor="longitude">Longitude * :</label>
                    <input type="text" placeholder='Longitude' value={coords.lng == 80.0929 ? "":coords.lng}
                    onChange={(e)=>(setCoords({...coords,lng:e.target.value}))} id='longitude' name='longitude' />
                    <label htmlFor="receiver name">Receiver Name * :</label>
                    <input type="text" placeholder='Enter Receiver name' value={receiverName} autoComplete="nope" onChange={(e)=>setReceiverName(e.target.value)} id='receiver name' name='receiver name' />
                    <label htmlFor="receiver contact">Receiver Contact *:</label>
                    <input type="text" maxLength={10} placeholder='Enter Receiver contact' autoComplete="off" value={receiverContact} onChange={(e)=>setReceiverContact(e.target.value)} id='receiver contact' name='receiver contact' />
                    <button type='submit' className='btn-small'>ADD</button>
                  </form>
                  
                  </div>

              </div>
              }
              
            </ModalBody>
        </Modal>

      </section>


      <section id="dropoff-location-modal">
        <Modal isOpen={drop_loca} size="xl" scrollable id="dropoff-location-modal-mobile">
          <ModalHeader toggle={changeDropoff} style={{ border: "none" }}>
            <p style={{ textAlign: "center" }}>Choose Dropoff Location :</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link onClick={changeView} className={check?"class1":"class2"}>Address List</Link>
              <Link onClick={changeViews} className={check?"class2":"class1"} >Map</Link>
            </div>
            <div>
              <MultiDeleteBtn selectedIds={selectedIds} deleteMultipleAddresses={deleteMultipleAddresses}/>
            </div>
          </ModalHeader>
          <ModalBody>
          <div style={{ display: "flex", gap: "8px" }}>
              {check && 
              <div style={{ flex: 1.2 ,border:"1px solid lightgrey",padding:"3px"}}>
                <div className="searchInput">
                <input style={{padding:"3px",width:"36%"}} placeholder="Search Address.." type="text"  value={search} onChange={(e)=>setSearch(e.target.value)}/>
                </div>
                <div style={{display:"flex"}}>
                    <div style={{flex:0.8}}>
                    {
                  pickup_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                    <Card key={index} className="my-2 card" color="dark"
                    outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                      <CardBody>
                      <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                        <div>
                          <p>Latitude:<span>{item.latitude}</span></p>
                          <p>Longitude:<span>{item.longitude}</span></p>
                        </div>
                      </CardBody>
                      <CardFooter>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete</button></div>
                          <div style={{display:"flex"}} className="cardFooter">
                            <button className="card-btn-pickup" onClick={()=>addingDropoffAddress(item)}>select</button>
                          </div>
                          <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>
                          </div>

                      </CardFooter>
                    </Card>
                    
                  ))
                }
                {
                  dropoff_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                    <Card key={index} className="my-2 card" color="dark"
                    outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                      <CardBody>
                      <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                        <div>
                          <p>Latitude:<span>{item.latitude}</span></p>
                          <p>Longitude:<span>{item.longitude}</span></p>
                        </div>
                      </CardBody>
                      <CardFooter>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete</button></div>
                          <div style={{display:"flex"}} className="cardFooter">
                            <button className="card-btn-pickup" onClick={()=>addingDropoffAddress(item)}>select</button>
                          </div>
                          <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>
                          </div>

                      </CardFooter>
                    </Card>
                    
                  ))
                }
                    </div>
                    {
                      
                      editAddress && 
                      <div style={{flex:1}} id="0">
                        <span style={{fontSize:"18px"}}>Edit :</span>
                      <AddressEdit editData={editData} checking={checking} id={customer_id} setEditAddress={setEditAddress}/>
                    </div>

                    }
                </div>
              
                
              
              </div>
              }
          </div>

              {
                check1 && 
                <div style={{display:"flex",gap:"5px"}}>
                  <div style={{flex:2,border:"1px solid grey"}} className="mapContainer">
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
                      // onLoad={(map) => onMapLoad(map)}
                      onDragEnd={(e) => {
                        setCoords({
                          ...coords,
                          lat: e.latLng?.lat(),
                          lng: e.latLng?.lng(),
                        });
                        handleMarkerMoveDestination(coords)
                      }}
                      position={coords}
                    ></Marker>
                        
                  </GoogleMap>

                      <div className="address-selection">
                        <Autocomplete>
                        <input type="text" ref={destinationRef} value={destination} onChange={handleDestinationAddress}  
                        placeholder="Search Your Location.." />
                      </Autocomplete>
                      <button className="btn-small" onClick={addDestinationAddress}>ADD</button>
                      </div>
                  </div>

                  <div style={{flex:2}} >
                  <span style={{color:"red"}}>Required fields.{""}<b style={{fontWeight:"bold"}}>*</b></span>
                  <form className='shopform' onSubmit={addingDestinationAddressFromMap}>
                    <label htmlFor="address">Address * :</label>
                    <input type="text" placeholder='Enter Address' value={destination}
                    autoComplete="nope"
                    onChange={(e)=>setDestination(e.target.value)}  id='address' name='address' />
                    <label htmlFor="city">City * :</label>
                    <input type="text" placeholder='Enter City' value={dropcity}
                    autoComplete="nope"
                    onChange={(e)=>setDropCity(e.target.value)} id='city' name='city' />
                    <label htmlFor="state">State * :</label>
                    <input type="text" placeholder='Enter State' value={dropaddressState}
                    autoComplete="nope" 
                    onChange={(e)=>setDropAddressState(e.target.value)} id='state' name='state' />
                    <label htmlFor="country">Country * :</label>
                    <input type="text" placeholder='Enter Country'value={dropcountry}
                    autoComplete="nope"
                    onChange={(e)=>setDropCountry(e.target.value)} id='country' name='country' />
                    <label htmlFor="pincode">Pincode * :</label>
                    <input type="text" placeholder='Enter Pincode' value={droppincode} 
                    onChange={(e)=>setDropPincode(e.target.value)} id='pincode' name='pincode' />
                    <label htmlFor="lattitude">Lattitude * :</label>
                    <input type="text" placeholder='Enter Lattitude' value={coords.lat==12.8996 ? "":coords.lat} 
                    onChange={(e)=>setCoords({...coords,lat:e.target.value})} id='lattitude' name='lattitude' />
                    <label htmlFor="longitude">Longitude * :</label>
                    <input type="text" placeholder='Enter Longitude' value={coords.lng == 80.0929 ? "":coords.lng}
                    onChange={(e)=>setCoords({...coords,lng:e.target.value})} id='longitude' name='longitude' />
                    <label htmlFor="receiver name">Receiver Name * :</label>
                    <input type="text" placeholder='Enter Receiver name' value={dropreceiverName} autoComplete="nope" 
                    onChange={(e)=>setDropReceiverName(e.target.value)} id='receiver name' name='receiver name' />
                    <label htmlFor="receiver contact">Receiver Contact * :</label>
                    <input type="text" maxLength={10} placeholder='Enter Receiver contact' autoComplete="off" value={dropreceiverContact} 
                    onChange={(e)=>setDropReceiverContact(e.target.value)} id='receiver contact' name='receiver contact' />
                    <button type='submit' className='btn-small'>ADD</button>
                  </form>
                  
                  </div>
              </div>
              }
            
          </ModalBody>
        </Modal>
      </section>

      <section id="multiDrop-Location-Modal">
        <Modal isOpen={multi_drop_loca} size="xl" scrollable>
          <ModalHeader toggle={changeMultiDrop}>
          <p style={{ textAlign: "center" }}>Choose Dropoff Location :</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link onClick={changeView} className={check?"class1":"class2"}>Address List</Link>
              <Link onClick={changeViews} className={check?"class2":"class1"} >Map</Link>
            </div>
            <div>
              <MultiDeleteBtn selectedIds={selectedIds} deleteMultipleAddresses={deleteMultipleAddresses}/>
            </div>
          </ModalHeader>
          <ModalBody>
              <div style={{ display: "flex", gap: "8px" }}>
                  {check && 
                  <div style={{ flex: 1.2 ,border:"1px solid lightgrey",padding:"3px"}}>
                    <div className="searchInput">
                    <input style={{padding:"3px",width:"36%"}} placeholder="Search Address.." type="text"  value={search} onChange={(e)=>setSearch(e.target.value)}/>
                    </div>
                    <div style={{display:"flex"}}>
                        <div style={{flex:0.8}}>
                        {
                      pickup_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                        <Card key={index} className="my-2 card" color="dark"
                        outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                          <CardBody>
                          <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                            <div>
                              <p>Latitude:<span>{item.latitude}</span></p>
                              <p>Longitude:<span>{item.longitude}</span></p>
                            </div>
                          </CardBody>
                          <CardFooter>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete</button></div>
                              <div style={{display:"flex"}} className="cardFooter">
                                <button className="card-btn-pickup" onClick={()=>addingMultiDropoffAddress(item)}>select</button>
                              </div>
                              <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>
                              </div>

                          </CardFooter>
                        </Card>
                        
                      ))
                    }
                    {
                      dropoff_Address.filter((item)=>item.address.toLowerCase().includes(search.toLocaleLowerCase().trim())).map((item,index)=>(
                        <Card key={index} className="my-2 card" color="dark"
                        outline style={{width:"25rem",border:"0.7px solid lightgray"}}>
                          <CardBody>
                          <div style={{display:"flex",justifyContent:"space-between",gap:"15px"}}>
                          <CardText>{item.address}</CardText>
                          <span><input type="checkbox" key={item.id} checked={selectedIds.includes(item.id)} onChange={()=>{
                            printingMultiId(item.id)
                          }} /></span>
                          </div>
                            <div>
                              <p>Latitude:<span>{item.latitude}</span></p>
                              <p>Longitude:<span>{item.longitude}</span></p>
                            </div>
                          </CardBody>
                          <CardFooter>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <div><button className="card-btn-pickup" onClick={()=>DeleteSelectedSaveAddress(item.id)}>Delete</button></div>
                              <div style={{display:"flex"}} className="cardFooter">
                                <button className="card-btn-pickup" onClick={()=>addingDropoffAddress(item)}>select</button>
                              </div>
                              <div><button className="card-btn-pickup" onClick={()=>handleEditAddress(item)}>Edit</button></div>
                              </div>

                          </CardFooter>
                        </Card>
                        
                      ))
                    }
                        </div>
                        {
                          
                          editAddress && 
                          <div style={{flex:1}} id="0">
                            <span style={{fontSize:"18px"}}>Edit :</span>
                          <AddressEdit editData={editData} checking={checking} id={customer_id} setEditAddress={setEditAddress}/>
                        </div>

                        }
                    </div>
                  
                    
                  
                  </div>
                  }
              </div>

              {
                check1 && 
                <div style={{display:"flex",gap:"5px"}}>
                  <div style={{flex:2,border:"1px solid grey"}} className="mapContainer">
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
                      // onLoad={(map) => onMapLoad(map)}
                      onDragEnd={(e) => {
                        setCoords({
                          ...coords,
                          lat: e.latLng?.lat(),
                          lng: e.latLng?.lng(),
                        });
                        handleMarkerMoveDestination(coords,index)
                      }}
                      position={coords}
                    ></Marker>
                        
                  </GoogleMap>

                      <div className="address-selection">
                        <Autocomplete>
                        <input type="text" ref={multiDestinationRef} value={multiDestination} onChange={handleMultiDestinationAddress}  
                        placeholder="Search Your Location.." />
                      </Autocomplete>
                      <button className="btn-small" onClick={addMultiDestinationAddress}>ADD</button>
                      </div>
                  </div>

                  <div style={{flex:2}} >
                  <span style={{color:"red"}}>Required fields.{""}<b style={{fontWeight:"bold"}}>*</b></span>
                  <form className='shopform' onSubmit={addingMultiDestinationAddressFromMap}>
                    <label htmlFor="address">Address * :</label>
                    <input type="text" placeholder='Enter Address' value={multiDestination}
                    autoComplete="nope"
                    onChange={(e)=>setDestination(e.target.value)}  id='address' name='address' />
                    <label htmlFor="city">City * :</label>
                    <input type="text" placeholder='Enter City' value={dropcity}
                    autoComplete="nope"
                    onChange={(e)=>setDropCity(e.target.value)} id='city' name='city' />
                    <label htmlFor="state">State * :</label>
                    <input type="text" placeholder='Enter State' value={dropaddressState}
                    autoComplete="nope" 
                    onChange={(e)=>setDropAddressState(e.target.value)} id='state' name='state' />
                    <label htmlFor="country">Country * :</label>
                    <input type="text" placeholder='Enter Country'value={dropcountry}
                    autoComplete="nope"
                    onChange={(e)=>setDropCountry(e.target.value)} id='country' name='country' />
                    <label htmlFor="pincode">Pincode * :</label>
                    <input type="text" placeholder='Enter Pincode' value={droppincode} 
                    onChange={(e)=>setDropPincode(e.target.value)} id='pincode' name='pincode' />
                    <label htmlFor="lattitude">Lattitude * :</label>
                    <input type="text" placeholder='Enter Lattitude' value={coords.lat==12.8996 ?"":coords.lat} 
                    onChange={(e)=>setCoords({...coords,lat:e.target.value})} id='lattitude' name='lattitude' />
                    <label htmlFor="longitude">Longitude * :</label>
                    <input type="text" placeholder='Enter Longitude' value={coords.lng == 80.0929 ?"":coords.lng}
                    onChange={(e)=>setCoords({...coords,lng:e.target.value})} id='longitude' name='longitude' />
                    <label htmlFor="receiver name">Receiver Name * :</label>
                    <input type="text" placeholder='Enter Receiver name' value={dropreceiverName} autoComplete="nope" 
                    onChange={(e)=>setDropReceiverName(e.target.value)} id='receiver name' name='receiver name' />
                    <label htmlFor="receiver contact">Receiver Contact * :</label>
                    <input type="text" maxLength={10} placeholder='Enter Receiver contact' autoComplete="off" value={dropreceiverContact} 
                    onChange={(e)=>setDropReceiverContact(e.target.value)} id='receiver contact' name='receiver contact' />
                    <button type='submit' className='btn-small'>ADD</button>
                  </form>
                  
                  </div>
              </div>
              }

          </ModalBody>
        </Modal>
      </section>
    </div>
  );
};

export default AddBookings;

{/* <span style={{color:"red"}}>Required fields.<b style={{fontSize:"18px"}}>*</b></span> */}






