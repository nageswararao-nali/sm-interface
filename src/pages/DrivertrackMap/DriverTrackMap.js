import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../api/apiConfig';
import notourImg from "../../images/9554711_pin_maps_map_navigation_gps_icon (1).png";
import dropPoint from "../../images/placeholder.png";
import truck from "../../images/icons8-previous-location.gif";
import Layout from '../../components/Layout';
import { MapContainer, TileLayer, Marker, Polyline, Popup} from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useParams } from 'react-router';
// Accordian 
import {Accordion,AccordionItem,AccordionHeader,AccordionBody} from "reactstrap"
import moment from 'moment';
import { IoMdClose } from "react-icons/io";
import "../DrivertrackMap/drivertrackMap.css"


const DriverTrackMap = () => {
  const navigate=useNavigate()
  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA"
  const {id}=useParams()
  const[tour_status,setTour_status]=useState("")
  const[tourObj,setTourObj]=useState(null)
  const[coordinates,setCoordinates]=useState([])
  //** toure lat and long */
  const[routeCoordinates,setRouteCoordinates]=useState([]);
  const[wayPoints,setWayPoints]=useState([]);
  const[tour_Id,setTourId]=useState("")
  
  const[tourData,setTourData]=useState([])
  //** driver lat and long */
  const initialDriverLOcation={ lat: 13.1143, lng: 80.1548 }
  const[newDriverLocation,setNewDriverLocation]=useState([]);
  const[driverDetails,setDriverDetails]=useState({})
  const[driver_curr_Addr,setDriver_curr_Addr]=useState("")
  const[open,setOpen]=useState("0")
  const[show,setShow]=useState(false)

  const [driverPosition, setDriverPosition] = useState({ lat: 13.1143, lng: 80.1548 });
  const [polylineColor, setPolylineColor] = useState('blue');
  const [newidea,setNewidea]=useState([])


  const toggle=(id)=>{
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }

  }
 

  
  // icons ...
  const customIcon = new L.Icon({
    iconUrl: notourImg, // Replace with your icon path
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'custom-leaflet-icon'
  });
  
  const driverIcon = new L.Icon({
    iconUrl: truck, // Replace with your icon path
    iconSize: [35, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const droppoint = new L.Icon({
    iconUrl: dropPoint, // Replace with your icon path
    iconSize: [15, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const legalIcon = new L.Icon ({
    iconUrl : 'https://cvimg1.cardekho.com/p/630x420/in/man/cla-31300-evo-8x4/man-cla-31300-evo-8x4.jpg',
    iconSize : [35,35], 
    iconAnchor : [22,94], 
    popupAnchor : [-3, -76] 
  
  })
  const createCustomIcon=(sequenceNumber, baseIcon)=>{
    return L.divIcon({
      html: `<div style="position: relative; display: inline-block;">
               <img src="${baseIcon}" style="width: 20px; height: 30px; "/>
               <div style="position: absolute; top: -15px; left: 7px; color: black; font-size: 16px; font-weight: bold;">${sequenceNumber}</div>
             </div>`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }

  // Trackking api call....
  const getting_Routes_of_Tour=async(newCoordinates)=>{

    try {
      const coordinatesString = newCoordinates.map(coord => `${coord?.lng},${coord?.lat}`).join(';');
      const url = `http://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`;
      const response = await axios.get(url);
      console.log("response..",response)
      const waypoints=response.data.waypoints;
      console.log("waypoints..",waypoints)
      setWayPoints(waypoints)
      if (response.data.routes && response.data.routes.length > 0) {
        const coords = response.data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
        setRouteCoordinates(coords);

        if (coords.length > 0) {
          // setCoords({ lat: coords[0]?.lat, lng: coords[0]?.lng });
        }
      } else {
        console.error('Unexpected response structure:', response.data);
      }
      
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }

  const convertLatLng_Address=async(lat,lng)=>{
    try {
      const resp=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${YOUR_GOOGLE_MAPS_API_KEY}`)
      const data=await resp.json()
      let address=data.results[0].formatted_address;
      address=address.replace(/^.*?,\s/, '')
      setDriver_curr_Addr(address)
       
    } catch (error) {
      console.error(error.messsage,"cannot convert Address ?")
    }

  }

  // to Calculate Distance between Points....
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
function calculateTotalDistance(points) {
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
      const { lat: lat1, lng: lon1 } = points[i];
      const { lat: lat2, lng: lon2 } = points[i + 1];
      totalDistance += haversine(lat1, lon1, lat2, lon2);
  }
  return totalDistance;
}
  
  // toursCall
  const trackingDriverLocation=async(uniqueDriver_Id)=>{
    // getting current lat and lng of an driver...
    try {
      const location_response=await axios.post(`${baseUrl}/location/getDriverLocations`,{
        driver_id:uniqueDriver_Id,limit:100,offset:0})
        if(location_response.data.success){
          console.log("location_response")
          console.log(location_response)
          const result=location_response.data.data.locations;
          const {tour_id,latitude,longitude,loc_time}=result[0]
          setTourId(tour_id)
          console.log("result")
          console.log(result)
          console.log("in tracking driver location .......", tour_Id)
          const newLatandLng = {
            lat: latitude,
            lng: longitude,
            tracking_time:loc_time
          }
          // setNewDriverLocation(newDriverLocation=>[...newDriverLocation,newLatandLng])          
          setNewDriverLocation(result)          
          // passing tourid get toursData...
          if(tour_id){
            const tour_response=await axios.post(`${baseUrl}/tours/toursLIst`,{id:tour_id})
            let tourObj=tour_response.data.data.tours[0]?.tour;
            setTourObj(tourObj)
            let tour_status=tour_response.data.data.tours[0]?.tour.tour_status;
            console.log("tourObj",tourObj)
            console.log("tour_status..",tour_status)
            setTour_status(tour_status)
            let tour_travel_driver=tour_response.data.data.tours[0]?.truck
            setDriverDetails(tour_travel_driver)
            let tour_travel=tour_response.data.data.tours[0].sequenceData

            let tourMap = [];
            let i = 0;
            for (let seqNum of tour_travel) {
              let isSamePoint = false;

              if (tour_travel[i - 1]) {
                if (
                  tourMap[tourMap?.length - 1].transport_type == seqNum.transport_type &&
                  tourMap[tourMap?.length - 1].location_address ==
                    seqNum.location_address
                ) {
                  isSamePoint = true;
                } else {
                  isSamePoint = false;
                }
              }
              if (isSamePoint) {
                tourMap[tourMap?.length - 1].seqIds.push(seqNum.id);
              } else {
                let seqData = {
                  ...seqNum,
                  seqIds: [seqNum.id],
                };
                tourMap.push(seqData);
              }

              i++;
            }
            console.log("tourMap",tourMap)
            setTourData(tourMap)
          

            // Tours points...

            const points=tourMap.map((item)=>({
              lng: item.location.coordinates[0],
              lat: item.location.coordinates[1],
              reached_time:item.updated_at,
              complete_time:item.updated_at
            }))
            console.log("points..",points)
            const uniqueCoordinates = points.filter((coordinate, index, self) => {
              // Check if the index of the first occurrence of this coordinate is the same as the current index
              return index === self.findIndex((c) => (
                c.lat === coordinate.lat && c.lng === coordinate.lng
              ));
            });
            const totalDistance=calculateTotalDistance(uniqueCoordinates)

            const newCoordinates = tourMap.map((item) => ({
              tour_id:item.tour_id,
              lng: item.location.coordinates[0],
              lat: item.location.coordinates[1],
              transport_type:item.transport_type,
              status:item.status,
              sequence_number:item.sequence_number,
              location_address:item.location_address,
              updated_at:item.updated_at,
            }));
            setCoordinates(newCoordinates);
            getting_Routes_of_Tour(newCoordinates)
            setShow(true)

            // if(tourObj.tour_status ){
            //   alert(`Your Tour Status ${tourObj.tour_status} `)
            // }
          }else{
            alert("No Live Tour on Driver ?")
            navigate(-1)
          }  
        }
    } catch (error) {
      console.error(error.message)
      
    }
  
  
  }


  const current_position_driver= async(uniqueDriver_Id)=>{
    try {
      const response = await axios.post(
        `${baseUrl}/location/getDriverLocations`,
        {
          driver_id: uniqueDriver_Id,
          limit: 2500,
          offset: 0,
        }
      );
      let respResult = response.data.data.locations;
      console.log("tour_Id tour_Id")
      console.log(tour_Id)
      console.log("respResult")
      console.log(respResult)
      let newLatandLng
      if(tour_Id) {
        respResult=respResult.filter((obj)=>obj.tour_id == tour_Id)
        console.log("respResult..",respResult)
         newLatandLng = {
          lat: respResult[0]?.latitude,
          lng: respResult[0]?.longitude
        }
      } else {
         newLatandLng = {
          lat: respResult[0]?.latitude,
          lng: respResult[0]?.longitude
        }
      }
      
      console.log("newLatandLng")
      console.log(newLatandLng)
        convertLatLng_Address(newLatandLng.lat,newLatandLng.lng)
        setNewDriverLocation(newDriverLocation=>[...newDriverLocation,newLatandLng])
        setDriverPosition({
          lat: respResult[0]?.latitude,
          lng: respResult[0]?.longitude,
          tracking_time:respResult[0]?.loc_time
        })
        setNewidea(respResult)
        

      
    } catch (error) {
      console.error(error);
      console.log(error.message);
    }
  }

  const thresholdLat = newDriverLocation[0]?.lat;
  const thresholdLng = newDriverLocation[0]?.lng; 
  // const thresholdLat = newDriverLocation[newDriverLocation.length-1]?.lat; 
  // const thresholdLng = newDriverLocation[newDriverLocation.length-1]?.lng; 

  // Split routeCoordinates into segments based on crossing the threshold

  const segments = [];
  let currentSegment = [];
    for (let i = 0; i < routeCoordinates.length; i++) {
      currentSegment.push(routeCoordinates[i]);
      if (
        (i < routeCoordinates.length - 1 && routeCoordinates[i].lat < thresholdLat && routeCoordinates[i + 1].lat >= thresholdLat) ||
        (i < routeCoordinates.length - 1 && routeCoordinates[i].lng < thresholdLng && routeCoordinates[i + 1].lng >= thresholdLng)
      ) {
        segments.push(currentSegment);
        currentSegment = [routeCoordinates[i + 1]];
      }
    }
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }


const getStatusColor = (status) => {
  const statusColors = {
    Completed: '#90EE90',
    Reached: 'orange',
    Default: '#c9c5c5' 
  };

  return statusColors[status] || statusColors.Default;
};




  useEffect(()=>{
    trackingDriverLocation(id)
    current_position_driver(id)

    const intervalId=setInterval(()=>{current_position_driver(id)},3*60*1000)
    return ()=>clearInterval(intervalId)
  },[id,driverPosition.lat,tourObj?.tour_status])



  
{segments.map((segment, index) => {
    const color = (segment[0]?.lat <= thresholdLat || segment[0]?.lng <= thresholdLng) ? 'red' : 'blue';
    return (
      <Polyline
        key={index}
        positions={segment}
        color={color}
        weight={3}
      />
    );
  })}



  
console.log(segments,"segments...")
console.log(newidea,"newidea...")

  
  return (
    <div id='mapContainer'>
    
      <div className='map_leftContent'>
        <MapContainer center={{ lat: 13.0843, lng: 80.2705 }} 
        zoom={10} style={{height:"1200px", width: '100%' }}>
        
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {segments.map((segment, index) => {
            console.log("color checkkkk",(segment[0]?.lat || segment[segment[0].length-1]?.lat ) <= thresholdLat || (segment[0]?.lng || segment[segment[0].length-1]?.lng ) <= thresholdLng ? 'red' : 'blue');
            return (
              <Polyline
                key={index}
                positions={segments}
                // style={{color:"red"}}
                color='#30A46C'
                // color={(segment[0]?.lat || segment[segment[0].length-1]?.lat ) <= driverPosition?.lat || (segment[0]?.lng || segment[segment[0].length-1]?.lng ) <= driverPosition?.lng ? 'red' : 'blue'}
                // color={getSegmentColor(segment)}
                // color={segment[0]?.lat >= driverPosition?.lat || segment[0]?.lng >= driverPosition?.lng ? 'red' : 'blue'} 
                weight={3}
              />
            );
          })}

          
          <MarkerClusterGroup>
          {coordinates?.map((loc, index) => {
                  let icon = customIcon;
                  if (index === 0) {
                    icon = driverIcon;
                  } else if (index === coordinates.length - 1) {
                    icon = dropPoint;
                  }
                  const customIconWithNumber = createCustomIcon(index+1,(loc.status && (loc.status == "Reached" || "Completed") ? notourImg :dropPoint));
                  if (loc?.lat && loc?.lng) {
                    return (
                          <Marker key={index} position={[loc?.lat, loc?.lng]} icon={customIconWithNumber} >
                        <Popup>
                          <div>
                            <Accordion open={open} toggle={toggle}>
                              <AccordionItem>
                                <AccordionHeader style={{Border:"none"}} targetId={index}>{loc?.location_address?.slice(0,20)}...</AccordionHeader>
                                <AccordionBody accordionId={index}>
                                <span><b>Type</b>: {loc.transport_type}</span> <br />
                                <span><b>Status</b>: {loc.status || "yet to update"}</span> <br />
                                {loc.updated_at && (
                                  <span><b>Time</b>: {moment(loc.updated_at).format("YYYY-MM-DD HH:mm:ss")}</span>
                                )}
                                {loc.updated_at && <br />}
                                <br />
                                {loc?.location_address}
                                </AccordionBody>
                              </AccordionItem>
                            </Accordion>
                          </div>
                          
                        </Popup>
                        
                      </Marker>
                      
                    );
                  } else {
                    console.warn(`Invalid coordinates for marker at index ${index}:`, loc);
                    return null;
                  }
                })}
          </MarkerClusterGroup>
          
          {newDriverLocation.length > 0 && (
            <Marker
              position={{
                lat: driverPosition?.lat,
                lng: driverPosition?.lng,
              }}
              icon={driverIcon}
              draggable={true}
              onClick={() => alert("ok")}
          >
            <Popup>
              <span><u>Driver Location :</u></span> <br />
              <span>{driverDetails?.driver_name}</span> <br />
              <span>{driverDetails?.driver_mobile}</span> <br />
              <span>{driverPosition?.lat}</span> <br />
              <span>{driverPosition?.lng}</span> <br />
              <span>{driverPosition?.tracking_time}</span> <br /> <br />
              <span>{driver_curr_Addr}</span>
            </Popup>
            </Marker>
            
            
          )} 
          {
            Array.isArray(newidea) && newidea.map((loc, index) => (
              <Marker
                key={index}
                position={{ lat: loc?.latitude, lng: loc?.longitude }}
                icon={droppoint}
              >
                <Popup>
                  <span><b>Point {index + 1}</b></span><br />
                  {loc?.loc_time && (
                    <span><b>Time:</b> {moment(loc.loc_time).format("YYYY-MM-DD HH:mm:ss")}</span>
                  )}
                </Popup>
              </Marker>
            ))
          }

          
          
        </MapContainer>
      </div>

        {/*Left AddressDetails  Bar...  */}
        
        <div className='map_rightContent'>
          {
            show ? (
              <div className="timeline">
                <IoMdClose onClick={()=>setShow(false)} size={25} 
                style={{position:"relative",left:"90%",cursor:"pointer",bottom:"20px"}}/>
                <span>Tour ID : {tour_Id}</span> <br />
                {/* <span>Tour Time : {tourObj.accept_time}</span> <br /> */}
                {/* <span>{tourObj.tour_status}</span> */}
                <span>{/*tourObj.tour_status == "Tour Completed" && alert("Tour Completed !")*/}</span>
                {tourData.map((trip, index) => (
                    <div key={trip.id} className="timeline-item">
                      {/* <div className="timeline-marker"></div> */}
                      <div
                        className="timeline-marker"
                        style={{ backgroundColor: getStatusColor(trip.status) }}
                      ></div>
                      <div className="timeline-content">
                        <p className="description">Point-{index+1} : {trip.transport_type}</p>
                        <p className="coordinates">Status : {trip.status}</p> 
                        
                        {
                          trip.status === "Reached" || trip.status === "Completed" && trip.updated_at ? (
                            <>
                              <p >
                                {moment(trip.updated_at).format('YYYY-MM-DD  hh:mm:ss')}
                              </p>
                              <br />
                            </>
                          ) : null
                        }
                        <div className="date">{trip.location_address}</div>
                      </div>
                      {index < tourData.length - 1 && <div style={{ backgroundColor: getStatusColor(trip.status) }} className="timeline-connector"></div>}
                    </div>
                  ))}
              </div>
              )  : <div>
                <p style={{paddingTop:"100px",textAlign:"center"}}>Loading...</p>
              </div>
            
             
          }
        
        </div>

    
    </div>
      
  
  );
  
}

export default DriverTrackMap;