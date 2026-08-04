import React, { useState,useEffect} from 'react';
import "../../styles/History/historyTable.css";
import DatePicker from "react-datepicker";
import axios from 'axios';
// Gmap..
import{DirectionsRenderer, DirectionsService, GoogleMap,Marker,useJsApiLoader,useLoadScript} from "@react-google-maps/api";
import ReactSelect from '../../ReactSelect';
import moment from 'moment';
import { FaLocationArrow } from "react-icons/fa";
import { baseUrl } from '../../api/apiConfig';





const libraries=["places",""];

const TrackMap = () => {
  const [coords, setCoords] = useState({ lat: 12.9815, lng: 80.242 });
  const [driverList,setDriverList]=useState([])
  const[locationData,setLocationData]=useState([])
  const[driverLoc,setDriverLoc]=useState({})
  const[driverLocationData,setDriverLocationData]=useState([])
  const[startDate,setStartDate]=useState(null)
  const[driverId,setDriverId]=useState(null)
  const[resData,setResData]=useState([])
  const[value,setValue]=useState(null)
  const[zoom,setZoom]=useState(15)
  const[loading,setLoading]=useState(false)

  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA"
  const { isLoaded } = useLoadScript(
    { 
      id: "google-map-script",
      googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
      libraries:libraries
    }
    );
// cal
const getAllDriversList = async () => {
  const request = await axios.post(
    `${baseUrl}/driver/getDrivers`,
    { limit: 1000, offset: 0 }
  );
  const driversList = request.data.data.drivers;
  // console.log(driversList);
  const driverDetail = driversList.map((item) => ({
    label: `${item.name}-${item.mobile_number}`,
    value: item.user_id,
  }));
  // console.log(driverDetail);
  setDriverList(driverDetail);
};
const trackAllDriverLocation=async ()=>{
  const response=await axios.post(`${baseUrl}/location/getDriversLocations`,
  { limit: 100, offset: 0 })
  // console.log(response,"response from track location")
  if(response.data.success){
    console.log("response.data.data.locations",response.data.data.locations);
    setLocationData(response.data.data.locations)
    
  }else{
    console.log("Something Error ?");
  }


}

//  selected Driver fn..
const selectedDriver=async(selected)=>{
  console.log(selected);
  console.log(selected.label);
  console.log(selected.value);
  setDriverId(selected.value)
  setValue(selected)
  const driverLocData=locationData.filter((locData)=>{
    return locData.user_id == selected.value
  })
  console.log(driverLocData);
  if(driverLocData){
    setDriverLoc(driverLocData)
  }

  const historyResult=await axios.post(`${baseUrl}/location/getDriversLocations`,{
    limit:20000,offset:0,driver_id:selected.value
  })
  console.log(historyResult,"historyResult");
  if(historyResult.data.success){
    setDriverLocationData(historyResult.data.data.locations)
  }

}

// sending date 

const filterLocationsByDate=async()=>{
  let selectedDate=moment(startDate).format("YYYY-MM-DD")
  console.log(selectedDate,driverId);
  const payload={
        loc_date:selectedDate,
        driver_id:driverId,
        limit:2000,
        offset:0
  }
  setLoading(true)
  const response=await axios.post(`${baseUrl}/location/getDriverLocationsByDate`,payload)
  console.log(response,'filterLocationsByDate');

  if(response.data.success){
    // console.log(response.data.data.locations);
    const driverLocs=response.data.data.locations;
    const points=driverLocs.map((elem)=>{
      return({latitude:elem.latitude,longitude:elem.longitude})
    })
    console.log(points,"points");
    console.log(points.length,"length");

    if(points.length){

      let pointsLength=points.length;
      console.log(pointsLength,"pointsLength");
      const wayPoints=points.map((data,index)=>{
        return({location:new window.google.maps.LatLng(data.latitude,data.longitude)})
      })
      console.log(wayPoints,"waypoints");
      const directionService=new window.google.maps.DirectionsService()
      console.log(wayPoints.length,"waypoints.length"); // correct

      if(wayPoints.length>=25){
        let routeResponses=[];
        const pointsSize=25;
        for(let i=0;i<(wayPoints.length);i+=pointsSize){
            const chunkPoints = wayPoints.slice(i, i + pointsSize);
            const originalPoints = points.slice(i, i + pointsSize);
            console.log(chunkPoints,"chunkPoints");
            console.log(originalPoints,"originalPoints");
            const result=await directionService.route({
              origin:{
                lat:originalPoints[0].latitude,
                lng:originalPoints[0].longitude
              },
              destination:{
                lat:originalPoints[originalPoints.length-1].latitude,
                lng:originalPoints[originalPoints.length-1].longitude
              },
              travelMode:window.google.maps.TravelMode.DRIVING,
              waypoints:chunkPoints.slice(0,chunkPoints.length-2)
            },(result,status)=>{
              if(status == "OK"){
                console.log(result);
                console.log(result.routes[0].legs[0].distance.text/1000);
                // console.log(result.legs[0].duration.value);
              }else{
                console.log("Error to calculate Distance");
              }
            }
            )
            routeResponses.push(result)
          }
        console.log(routeResponses,"routeResponses"); 
        setResData(routeResponses) 
        setLoading(false)

      }else{
        console.log(points);
        console.log(points.length);
        let routeResponses=[];
        let pointsLength=points.length;
        let result=await directionService.route({
          origin:{lat:points[pointsLength-1].latitude,lng:points[pointsLength-1].longitude},
          destination:{lat:points[0].latitude,lng:points[0].longitude},
          travelMode: window.google.maps.TravelMode.DRIVING,
          waypoints:wayPoints.slice(0,wayPoints.length-1)
        })
        console.log(result);
        routeResponses.push(result)
        console.log(routeResponses);
        setResData(routeResponses)
        setLoading(false)

      }

    }

  }

}




    useEffect(()=>{
      getAllDriversList()
      trackAllDriverLocation()

    },[])

    const onMapLoad=(map)=>{
      console.log("map",map);
      navigator?.geolocation.getCurrentPosition(({coords:{latitude:lat,longitude:lng}})=>{
        const pos={lat,lng};
        console.log(pos,"pos");
        setCoords({...coords,lat:pos.lat,lng:pos.lng})

      })

    }
    const clearSearch=()=>{
      setValue(null)
      setStartDate(null)
      // setCoords({ lat: 120.9815, lng: 80.242 })
      // trackAllDriverLocation()
      window.location.reload()
    }

    if (!isLoaded) {
      return <div>Loading...</div>
  
    }
    
    console.log(resData,"res data")

  return (

    <div style={{ padding: "10px" }}>
      <section style={{}}>
        <div style={{display:"flex",gap:"20px"}}>
          <div style={{width:"300px"}}>
              <ReactSelect
              value={value}
            options={driverList}
            handleSelectedOption={selectedDriver}
            isMulti={false}
            />
          </div>
          <div>
          <DatePicker
                    selected={startDate}
                    onChange={(date)=>{
                      setStartDate(date)
                      // filterLocationsByDate(date)
                    }}
                    dateFormat="yyyy-MM-dd"
                    className='datePicker'
                    placeholderText='Choose Date'
                    />
          </div>
          <div style={{display:"flex",gap:"10px"}}> 
          <button className='btn-small' onClick={filterLocationsByDate}> <FaLocationArrow/> Get routes </button>
          <button className='btn-small' onClick={clearSearch} >CLEAR</button>
          </div>
          
            {
              loading && <p>Loading...</p> 
            }        
        </div>
                  
      </section>

      <div style={{marginTop:"10px", width:"100%", height:"630px"}}>
        <GoogleMap
        center={coords}
        zoom={zoom}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          <Marker
          position={coords}
          draggable={true}
          onLoad={(map)=>onMapLoad(map)}
          >
          </Marker>
          {resData && resData?.map((pnts,index)=>(
            <DirectionsRenderer
            key={index}
            directions={pnts}
            options={{
              polylineOptions:{
                strokeOpacity: 0.5,
                strokeColor: "#FF0000",
              }
            }}
            />
          ))}
        </GoogleMap>
       
      </div>

    </div>
  )
}

export default TrackMap