import React, { useEffect, useState, useRef } from "react";
import "../../styles/LiveLocation/liveLocation.css";
import Layout from "../../components/Layout";
import {useNavigate} from "react-router-dom"
// Google map,,,;
import SearchableDropdown from "../../searchableDropdown";
import ReactSelect from "../../ReactSelect";
import moment from "moment";
import { baseUrl } from "../../api/apiConfig";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CiMapPin } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import notourImg from "../../images/9554711_pin_maps_map_navigation_gps_icon (1).png";
import pickup from "../../images/delivery.png";
import location from "../../images/location.png";
// import { MapContainer, TileLayer,Marker, Polyline, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DriverTrackMap from "../DrivertrackMap/DriverTrackMap";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  useLoadScript,
  LoadScript,
  InfoWindow,
  MarkerClusterer,
  // Polyline
} from "@react-google-maps/api";

const libraries = ["places", "geometry"];







const LiveLocation = () => {
  const navigate=useNavigate()
  const mapRef = useRef(null);
  const [coords, setCoords] = useState({ lat: 13.1143, lng: 80.1548 });
  const [zoom, setZoom] = useState(15);
  const [driver, setDriver] = useState();
  const [driverList, setDriverList] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [shownLocationsData, setShownLocationsData] = useState([]);
  const [liveDriversList, setLiveDriversList] = useState([]);
  const [driverLoc, setDriverLoc] = useState({});
  const [activeMarker, setActiveMarker] = useState(null);
  const[activeAddress,setActiveAddress]=useState(null)
  const [searchDrivername,setSearchDrivername]=useState("")

  const [value, setValue] = useState(null);
  const [isClearable, setIsClearable] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [driversModal, setDriversModal] = useState(false);
  const[sequenceData,setSequenceData]=useState([])
  const[newDriverLocation,setNewDriverLocation]=useState()
  const [path1, setPath1] = useState([]);
  const [crossedPath, setCrossedPath] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const[trackMap,setTrackMap]=useState(false)
  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA";
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
    libraries,
  });


  
  const createIcon = (url, size) => ({
    url,
    scaledSize: new window.google.maps.Size(size.width, size.height),
  });

  async function getDriversData() {
    const response = await axios.post(`${baseUrl}/driver/getDrivers`, {
      limit: 100,
      offset: 0,
    });
    setDriverList(response.data.data.drivers);
    const modifyArray = response.data.data.drivers;
    const driversName = modifyArray.map((elem) => {
      return {
        label: `${elem?.name} - ${elem?.mobile_number}`,
        value: `${elem?.user_id}`,
      };
    });
    setSelectedData(driversName);
  }

  const TrackAllDriversLocation = async () => {
    const request = await axios.post(
      `${baseUrl}/location/getDriversLocations`,
      { limit: 100, offset: 0 }
    );
    console.log(request);
    if (request.data.success) {
      setLocationData(request.data.data.locations); // storing Array value
      const liveDrivers = request.data.data.locations;
      // storing Array value -setLiveDriversList
      const availableDrivers = liveDrivers.map((elem) => elem.driverData);
      setLiveDriversList(availableDrivers);
      setShownLocationsData(request.data.data.locations);
    }
  };


  const selectedDriver = async (selected) => {
    setValue(selected);
    // TrackIndividualDriverLocation(selected.value);
  };

// Finding Indivual Driver Location..
const TrackIndividualDriverLocation = async (val) => {
  setLoading(true)
  setTrackMap(true)

  setInterval(async()=>{
    try {
      const response = await axios.post(
        `${baseUrl}/location/getDriverLocations`,
        {
          driver_id: val,
          limit: 100,
          offset: 0,
        }
      );
      const respResult = response.data.data.locations;
      console.log("rrrr",respResult[0])
      const newLatandLng={
        lat:respResult[0]?.latitude,
        lng:respResult[0]?.longitude
      }
      setNewDriverLocation(newLatandLng)
      
      
      
    } catch (error) {
      console.error(error)
      console.log(error.message);
      
    }
    
  },10*1000);

  // Initial calling...

  const fetchRoute = async (path) => {
    console.log(path,"paftfff")

    try {
      const coordinatesString = path.map(coord => `${coord?.lng},${coord?.lat}`).join(';');
      const url = `http://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`;
      
      const response = await axios.get(url);
      console.log(response,"responseee")

      if (response.data.routes && response.data.routes.length > 0) {
        const coords = response.data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
        setRouteCoordinates(coords);
        if (coords.length > 0) {
          setCoords({ lat: coords[0]?.lat, lng: coords[0]?.lng });
        }
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }

  }

  try {
    const response = await axios.post(`${baseUrl}/location/getDriverLocations`,
      {
        driver_id: val,
        limit: 100,
        offset: 0,
      });
    const respResult = response.data.data.locations;
    const initialDriverId=respResult[0].user_id;
    const individualObj = locationData.filter((elem) => {
      return elem.user_id == initialDriverId;
    });

    // Getting All the tours and filter that Driver Tour...

    const res=await axios.post(`${baseUrl}/tours/toursList`,{id:individualObj[0].tour_id})
    const result=res.data.data.tours;
    const sequenceData=res.data.data.tours[0].sequenceData
    const newCoordinates = sequenceData.map((item)=>({
      lng:item.location.coordinates[0],
      lat:item.location.coordinates[1],
    }))
    const newData=individualObj.concat(sequenceData)
    setSequenceData(sequenceData)
    setDriverLoc(individualObj);
    setShownLocationsData(individualObj);
    setLoading(false)
    setShowDetails(true);
    fetchRoute(newCoordinates);
  } catch (error) {
    console.log("Something Error ?");
  }


};
  




  const handleActiveMarker = (index) => {
    if (index == activeMarker) {
      return;
    }
    setActiveMarker(index);
  };
  const handleClearSearch = () => {
    setShownLocationsData(locationData);
    setCoords({ lat: 12.9815, lng: 80.218 });
    setZoom(10);
    setDriverLoc({});
    setValue(null);
    setShowDetails(false);
    setSearchDrivername("")
  };
  useEffect(() => {
    getDriversData();
    TrackAllDriversLocation();
    // recall Drivers api every 2mins...
    const intevalId=setInterval(()=>{
      TrackAllDriversLocation()
      // setSearchDrivername("")
    },120000)
    return ()=>clearInterval(intevalId)

  }, []);

  

 


  // 1).........
  const onLoad = (map) => {
    const markers = shownLocationsData.map(
      (location) =>
        new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
        })
    );

    new MarkerClusterer({ map, markers });
  };

  // Converting Lat Lng into Address format ,...
  const convertAddress=async(lat,lng)=>{
    console.log(lat,lng)
    // alert(lng)
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${YOUR_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setActiveAddress(data.results[0].formatted_address);
        console.log("NKK",data.results[0].formatted_address)
      } else {
        setActiveAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setActiveAddress("Error fetching address");
    }

  }

  // Prepare the path array from shownLocationsData
  
  
  const path = sequenceData.map((item)=>({
    lng:item.location.coordinates[0],
    lat:item.location.coordinates[1],
    transport_type:item.transport_type ? item.transport_type :"DN",
    location_address:item.location_address && item.location_address,
    transport_type:item.transport_type ? item.transport_type :item.driverData.name
    // status:item.status ? item.status :"",
  }))
  console.log(path)
  
  const pathBefore = [];
  const pathAfter = [];

  path.forEach(point => {
    let splitLat=80.3456
    if (point?.lat <= splitLat) {
      pathBefore.push(point);
    } else {
      pathAfter.push(point);
    }
  });

  
 

  const polylineOptionsBefore = {
    strokeColor: 'green',
    strokeOpacity: 1.0,
    strokeWeight: 2
  };

  const polylineOptionsAfter = {
    strokeColor: 'red',
    strokeOpacity: 1.0,
    strokeWeight: 2
  };


  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  const customIcon = new L.Icon({
    iconUrl: notourImg, // Replace with your icon path
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const driverIcon = new L.Icon({
    iconUrl: location, // Replace with your icon path
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const search_individual_driverLocation=(e)=>{
    let value=e.target.value.toLowerCase().trim()
    setSearchDrivername(value)
    if(value){
      const nameResult=shownLocationsData?.filter(item=>item.driverData?.name.toLowerCase().includes(value))
      setShownLocationsData(nameResult)
    }

  }


  




  return (
    <div>
      <Modal isOpen={driversModal} id="liveDriverTables" scrollable>
        <ModalHeader toggle={() => setDriversModal(false)}>
          <p>Live Drivers :</p>
        </ModalHeader>
        <ModalBody className="modalBody">
          <p>
            <u>List Of Available Drivers :</u>
          </p>
          {Boolean(shownLocationsData.length) && (
            <div className="liveDrivers">
              <table>
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Name</th>
                    <th>Mobile No</th>
                    <th>Status</th>
                  </tr>
                </thead>
                {shownLocationsData
                  .sort((a, b) =>
                    a.driverData?.name.localeCompare(b.driverData?.name)
                  )
                  .map((elem, index) => (
                    <tbody key={index}>
                      <tr
                        className={
                          elem.tour_id && elem?.tourData ? "" : "no_TourDrivers"
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{elem.driverData?.name}</td>
                        <td>{elem.driverData?.mobile_number}</td>
                        <td>
                          {elem?.tour_id && elem?.tourData ? "On Tour" : ""}
                        </td>
                      </tr>
                    </tbody>
                  ))}
              </table>
            </div>
          )}
        </ModalBody>
      </Modal>      
      <Layout>
        <div
          style={{ marginTop: "70px", padding: "10px" }}
          className="mapContainer liveLocation"
        >
          <div className="reactSelect">
            <div className="selection">
              <ReactSelect
                value={value}
                handleSelectedOption={selectedDriver}
                options={selectedData}
                isMulti={false}
              />
            </div>
            <button className="btn-big location_Button"  onClick={()=>{
              // TrackIndividualDriverLocation(value.value)
              navigate(`/dashboard/liveLocation/drivertrackMap/${value.value}`)
            }
            }>
              Location
            </button>
            <input id="drivername_search_input" placeholder="search Drivername..." 
            value={searchDrivername}
            autoComplete="off"
            onChange={search_individual_driverLocation}/>
            
            <button className="btn-big clear_Button"  style={{marginLeft:"-20px"}} onClick={handleClearSearch}>
              CLEAR
            </button>
            <button className="btn-big" onClick={() => setDriversModal(true)}>
              Live Drivers
            </button>
            {loading && <p>Loading...</p>}
          </div>

          <div >
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "650px" }}
              center={coords}
              zoom={10}
            >
              <MarkerClusterer>
                {(clusterer) =>
                  shownLocationsData.map((loc, index) => (
                    <Marker
                      key={index}
                      position={{
                        lat: parseFloat(loc?.latitude),
                        lng: parseFloat(loc?.longitude),
                      }}
                      options={{
                        icon: loc.tour_id ? "" : notourImg,
                      }}
                      onClick={() => 
                        {
                          handleActiveMarker(index)
                        convertAddress(loc?.latitude,loc?.longitude)
                        }
                      }
                      // onMouseOver={() => {
                      //   handleActiveMarker(index)
                      //   convertAddress(loc?.latitude,loc?.longitude)
                      // }}
                      clusterer={clusterer}
                    >
                      {activeMarker === index && (
                          <InfoWindow
                            position={{
                              lat: parseFloat(loc?.latitude),
                              lng: parseFloat(loc?.longitude),
                            }}
                          onCloseClick={() => setActiveMarker(null)}
                        >
                          {loc?.driverData ? (
                            <div className="driver_Location_Details" >
                              <span >{loc?.driverData?.name}</span>
                              <span>{loc?.driverData?.mobile_number}</span> 
                              <span>
                                {moment(loc?.created_at).format(
                                  "YYYY/MM/DD HH:mm:ss"
                                )}
                              </span> <br />
                              {/* <span>{Boolean(loc?.tour_id) && activeAddress}</span> */}
                              <span>{activeAddress}</span>
                            </div>
                          ) : (
                            <>NA</>
                          )}
                          </InfoWindow>
                      )}
                    </Marker>
                  ))
                }
              </MarkerClusterer>
            </GoogleMap>
          </div>
     
            

           

          <div id="detailsShow">
            {showDetails ? (
              <div>
                {driverLoc.map((elem,index) => (
                  <div key={index} className="driverSection">
                    <span>Driver Name : {elem.driverData?.name}</span>
                    <span>
                      Driver Mobile : {elem.driverData?.mobile_number}
                    </span>
                    <span>
                      Owner Name : {elem.driverData?.truck_owner_name}
                    </span>
                    <span>
                      Last Tracking Time :{" "}
                      {moment(elem.driverData?.last_tracked_at).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            {showDetails ? (
              <>
                {driverLoc.map(
                  (elem) =>
                    elem.tourData?.id && (
                      <div className="tourSection">
                        <span>Tour Id : {elem.tourData?.id}</span>
                        <span>Date : {elem.tourData?.tour_date}</span>
                        <span>Time : {elem.tourData?.tour_time}</span>
                        <span>Status : {elem.tourData?.status}</span>
                      </div>
                    )
                )}
              </>
            ) : (
              ""
            )}
          </div>
        
        </div>
      
      </Layout>
    </div>
  );
};
export default LiveLocation;






