
import {GoogleMap,useLoadScript,DirectionsRenderer,Polyline,Marker, InfoWindow} from "@react-google-maps/api"
import { useState,useEffect,useMemo } from "react";
import { baseUrl } from "../../api/apiConfig";
import axios from "axios";
import DatePicker from "react-datepicker";
import ReactSelect from '../../ReactSelect';
import moment from 'moment';


const libraries=["places",""];
let gpszData=[
  // 13.122067	80.120186	2026-03-04 00:18:55
  {latitude:"13.122067",longitude:"80.120186",loc_time:"2026-03-04 10:10:08"},
  {latitude:"13.10747",longitude:"80.16885",loc_time:"2026-03-02 09:41:31"},
  {latitude:"13.108711",longitude:"80.16898",loc_time:"2026-03-02 10:03:33"},
  {latitude:"13.11188",longitude:"80.17801",loc_time:"2026-03-02 10:11:33"},
  {latitude:"13.111883",longitude:"80.17803",loc_time:"2026-03-02 10:21:33"},
  {latitude:"13.107314",longitude:"80.1689",loc_time:"2026-03-02 10:31:33"},
  {latitude:"13.106966",longitude:"80.16711",loc_time:"2026-03-02 10:41:33"},
  {latitude:"13.107272",longitude:"80.168465",loc_time:"2026-03-02 10:51:33"},
  {latitude:"13.107524",longitude:"80.16886",loc_time:"2026-03-02 11:00:33"},
  {latitude:"13.107496",longitude:"80.16886",loc_time:"2026-03-02 11:10:33"},
];

const Analysis = () => {
    const [coords, setCoords] = useState({ lat: 12.9815, lng: 80.242 });
    const [rawData,setRawData] = useState([]);
    const [gpsData,setGpsdata] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [driverList,setDriverList]=useState([])
    const[driverId,setDriverId]=useState(null)
    const[value,setValue]=useState(null)
    const[startDate,setStartDate]=useState(null)
    const[loading,setLoading]=useState(false)
    
  
  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA"
  const {isLoaded }=useLoadScript({
     id: "google-map-script",
      googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
      libraries:libraries
  })
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
  const selectedDriver = async(selected)=>{
    setValue(selected)
    setDriverId(selected.value)
  }
  const fetchingGPSData = async () => {
      const payload = {
        loc_date: moment(startDate).format("YYYY-MM-DD"),
        driver_id:driverId,
        limit: 2000,
        offset: 0
      };
    try {
      setLoading(true)
      const response = await axios.post(`${baseUrl}/location/getDriverLocationsByDate`, payload);
      const rawData = response.data.data.locations;
      setRawData(rawData)
      console.log("rawData..",rawData)
      const timeBasedFilterData = rawData.filter((data)=>{
        const date = new Date(data.loc_time)
        const hours = date.getHours()
        return hours >= 9 && hours < 10;
      })
      console.log("hours..",timeBasedFilterData)

      // 1. Sort/Reverse first if needed
      const sortedData = rawData.reverse();

      // 2. Filter for the 10-minute gaps immediately
      const filtered = filterGpsData(sortedData);

      // 3. Set the state with the CLEAN data
      console.log("filtered..",filtered)
      setGpsdata(filtered);
      setLoading(false)
      // filtered[0]
      setCoords({lat:filtered[0].latitude,lng:filtered[0].longitude})
      
    } catch (error) {
      console.error("Error fetching GPS data:", error);
    }
  };

  // Update your filter function to handle the logic properly
  const filterGpsData = (data) => {
    if (!data || data.length === 0) return [];

    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const filtered = [];
    
    // Start with the first point
    filtered.push(data[0]);
    let lastKeptTime = new Date(data[0].loc_time).getTime();

    for (let i = 1; i < data.length; i++) {
      const currentTime = new Date(data[i].loc_time).getTime();

      // Only keep points that are at least 10 mins apart
      if (currentTime - lastKeptTime >= TEN_MINUTES_MS) {
        filtered.push(data[i]);
        lastKeptTime = currentTime; 
      }
    }
    return filtered;
  };
  
  useEffect(()=>{
    getAllDriversList()
  },[])

  const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Result in Kilometers
  };
  const totalDistance = useMemo(() => {
  let total = 0;

  for (let i = 0; i < gpsData.length - 1; i++) {
    const point1 = gpsData[i];
    const point2 = gpsData[i + 1];

    const d = getDistance(
      parseFloat(point1.latitude),
      parseFloat(point1.longitude),
      parseFloat(point2.latitude),
      parseFloat(point2.longitude)
    );

    total += d;
  }

  return total.toFixed(2); // Returns a string like "15.45"
  }, [gpsData]);
  if(!isLoaded)return <div>Loading Maps..</div>

  const path = gpsData?.map(loc => ({
    lat: parseFloat(loc.latitude),
    lng: parseFloat(loc.longitude),
    loc_time:loc.loc_time
  }));

  
    const calculateSegments = () => {
    return gpsData.map((loc, i) => {
      if (i === 0) return null; // Skip the first one
      
      const prev = gpsData[i - 1];
      
      // Simply call the math function
      const dist = getDistance(
        parseFloat(prev.latitude), 
        parseFloat(prev.longitude),
        parseFloat(loc.latitude), 
        parseFloat(loc.longitude)
      );
      // 2. Calculate Time Difference
      const currentTime = new Date(loc.loc_time);
      const previousTime = new Date(prev.loc_time);
      
      // Difference in milliseconds
      const diffInMs = currentTime - previousTime; 
      
      // Convert to Minutes and Seconds
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;

      return {
        from: i,
        to: i + 1,
        distance: dist.toFixed(2) + " km",
        duration: `${minutes} min`,
        rawSeconds: diffInSeconds
      };
    }).filter(Boolean);
    };

  const segments = calculateSegments();

  // const filterGpsData = (data) => {
  // if (!data || data.length === 0) return [];

  // const TEN_MINUTES_MS = 10 * 60 * 1000;
  // const filtered = [];
  
  // // Start with the first data point
  // let lastKeptTime = new Date(data[0].loc_time).getTime();
  // filtered.push(data[0]);

  // for (let i = 1; i < data.length; i++) {
  //   const currentTime = new Date(data[i].loc_time).getTime();

  //   // Check if the gap since the last kept point is 10 mins or more
  //   if (currentTime - lastKeptTime >= TEN_MINUTES_MS) {
  //     filtered.push(data[i]);
  //     lastKeptTime = currentTime; // Update the reference time
  //   }
  // }
  // console.log("filtered..",filtered)
  // return filtered;
  //  };

  // const filteredPoints = filterGpsData(gpsData).map(point => ({
  // lat: Number(point.latitude),
  // lng: Number(point.longitude),
  // time:point.loc_time
  // }));

  const handleMarkerClick = async (point, index) => {
    console.log("point..",point)
  // 1. Show the InfoWindow immediately with the basic data
  setSelectedMarker({ ...point, index, address: "Loading address..." });

  try {
    // 2. Fetch the address from Google Maps
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { 
      lat: parseFloat(point.lat), 
      lng: parseFloat(point.lng),
      loc_time:point.loc_time
    };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results[0]) {
        // 3. Update the state with the real address
        setSelectedMarker(prev => ({
          ...prev,
          address: results[0].formatted_address
        }));
      } else {
        setSelectedMarker(prev => ({ ...prev, address: "Address not found" }));
      }
    });
  } catch (error) {
    setSelectedMarker(prev => ({ ...prev, address: "Error fetching address" }));
  }
 };
console.log("segments.. ",segments)
// {from: 25, to: 26, distance: '0.45 km'}
  
  return (
    <>
    <div style={{padding:"10px"}}>
     <div style={{display:"flex",gap:"5px"}}>
        <div style={{width:"300px",height:"25px",backgroundColor:"red",paddingBottom:"0px"}}>
        <ReactSelect
          value={value}
          options={driverList}
          handleSelectedOption={selectedDriver}
          isMulti={false}
          />
        </div>
        <div style={{padding:"3px"}}>
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
          <div style={{padding:"3px"}}>
            <button className='btn-small' onClick={fetchingGPSData}> Get routes </button>
          </div>
        {loading && <span>Loading..</span> }
     </div>
      {/* 3.from and to time */}
    </div>
    <div style={{display:"flex",gap:"20px",padding:"2px"}}>
      <div style={{marginTop:"10px", width:"100%",minHeight:"630px"}}>
        <GoogleMap
          center={coords}
          zoom={13}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          <Polyline
          path={path}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            geodesic: true,
          }}
        />
        {path.map((coords, index) => {
          const isFirst = index === 0;
          const isLast = index === path.length - 1;

          // Define the marker color based on position
          let markerColor = "blue"; // Default
          if (isFirst) markerColor = "green";
          if (isLast) markerColor = "red";

          return (
            <Marker
              key={index}
              position={coords}
              // onClick={() => setSelectedMarker({ ...gpsData[index], index })}
              onClick={() => handleMarkerClick(coords, index)}
              label={{
                text: (index + 1).toString(),
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              icon={{
                // Using a standard Google Marker with dynamic colors
                url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`,
              }}
              title={gpsData[index].loc_time}
              // title={isFirst ? "Start Point" : isLast ? "End Point" : `Stop ${index + 1}`}
            />
          );
          // <Marker 
          //   key={index} 
          //   position={coords} 
          //   title={gpsData[index].loc_time} // Shows time on hover
          // />
        })}
        {selectedMarker && (
      <InfoWindow
        position={{ 
          lat: Number(selectedMarker.latitude), 
          lng: Number(selectedMarker.longitude) 
        }}
        onCloseClick={() => setSelectedMarker(null)} // Clear state to close
      >
        <div style={{ color: '#000', padding: '5px',width:"200px" }}>
          <h4 style={{ margin: '0 0 5px 0' }}>Point Details</h4>
          <strong>Point #{selectedMarker.index + 1}</strong>
          <p><strong>Time:</strong> {selectedMarker.loc_time}</p>
          <p><strong>Lat:</strong> {selectedMarker.lat}</p>
          <p><strong>Lng:</strong> {selectedMarker.lng}</p>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#4285F4' }}>
            {selectedMarker.address}
          </p>
        </div>
      </InfoWindow>
    )}
      
      
          </GoogleMap>

          
        
      </div>
      <div style={{paddingTop:"5px"}}>
        <span>Start time: {rawData[0]?.loc_time.split(' ')[1]}</span> <br />
        <span>End time : {rawData[rawData.length -1]?.loc_time.split(' ')[1]}</span>
        <hr />
        {/* <p>Total Distance :{totalDistance}</p> */}
        {segments.map((s, index) => (
          <div key={index}>Point {s.from} to {s.to}: {s.distance} - {s.duration}
          </div>
        ))}
        
      </div>
    </div>
    </>
  )
}

export default Analysis