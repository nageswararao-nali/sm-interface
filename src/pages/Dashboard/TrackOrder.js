import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router'
import { baseUrl, getAuthHeader } from "../../api/apiConfig"
// import { MapContainer, TileLayer, , Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle2, Truck, Phone, Bike, MapPin, ChevronRight, TruckIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useJsApiLoader, GoogleMap, Marker,Polyline,DirectionsService,DirectionsRenderer } from "@react-google-maps/api";
import truckGif from "../../assets/images/truckMarker.gif"
import pickupIcon from "../../assets/images/truckIcon.png";
import dropOffIcon from "../../assets/images/delivered.jpg";
import dottedLine from "../../assets/images/dotted_line.png";
import ScrollDownIcon from "../../assets/images/scrollDownArrow.png";
import ScrollUpIcon from "../../assets/images/scrollUpArrow.png";
import GooglePlayIcon from "../../assets/images/googleplayButton.png";
import DownloadImg from "../../assets/images/downloadImgPerson.png";
import PhoneIcon from "../../assets/images/phoneIcon.png";
import ConfirmedIcon from "../../assets/images/confirmed.png";
import PickedUpIcon from "../../assets/images/pickedupIcon.png";
import IntransitIcon from "../../assets/images/intransit.png";
import Delivered from "../../assets/images/deliveredIcon.png";
import ConfirmedDisabled from "../../assets/images/confirmedDisabled.png";
import PickedUpDisabled from "../../assets/images/pickedupDisabled.png";
import IntransitDisabled from "../../assets/images/intransitDisabled.png";
import DeliveredDisabled from "../../assets/images/deliveredDisabled.png";
import twowheelerGif from "../../assets/images/2wheelerfinal.gif";
import threewheeler from "../../assets/images/3wheelerFinal.png";
import { Line } from "rc-progress";
import { FaMapMarkedAlt } from "react-icons/fa";
// Fix Leaflet's default icon imports in many bundlers
import L from "leaflet";
const trackAppName = 'GoodMove';
const DefaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const STATUS = [
  { key: "confirmed", label: "Confirmed" },
  { key: "picked", label: "Picked Up" },
  { key: "intransit", label: "Intransit" },
];

const order = {
  id: 3475,
  from: "Infinity Apartments by Urban Tree, Sundaresan Nagar, Porur Gardens Phase II, Krishna Industrial Estate, Porur, Tamil Nadu, India",
  to: "IIT MADRAS MAIN GATE (IN), IIT Madras In Gate Road, Indian Institute Of Technology, Chennai, Tamil Nadu, India",
  phone: "7337836543",
  vehicle: "Two wheeler",
  statusIndex: 1, // 0=Confirmed, 1=Picked Up, 2=Intransit
};

const chennaiCenter = [12.9899, 80.2379];

const GOOGLE_API_KEY = "AIzaSyBeoSc41NabP50zIM7bi2gMYTrolDSRmBA";

const TrackOrder = () => {
  const {id}=useParams()
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [coords, setCoords] = useState({ lat: 12.8996, lng: 80.0929 });
  const [zoom, setZoom] = useState(15);
  const [map, setMap] = useState(/** @type goodle.maps.map */ null);
  const [directions,setDirections]=useState(null)
  const [hideScrollDownIcon, setHideScrollDownIcon] = useState(false);
  const [maskedPhoneNumber, setmaskedPhoneNumber] = useState(false);

  const scrollUpRef = useRef(null);
  const scrollDownRef = useRef(null);
  // console.log("data...",data?.getBookingDetails.data.bookings[0])
  const origin = {
    lat:data?.getBookingDetails?.data?.bookings[0]?.pickup_lat || 0,
    lng:data?.getBookingDetails?.data?.bookings[0]?.pickup_long || 0};
  const destination = {
    lat:data?.getBookingDetails?.data?.bookings[0]?.dropoff_lat || 0,
    lng:data?.getBookingDetails?.data?.bookings[0]?.dropoff_long || 0};

  

  const getBookingsBySearch  = async(searchQuery)  => {
    const res = await fetch(baseUrl + "/booking/getBookings", {
      method: "POST",
      body: JSON.stringify(searchQuery),
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
    });
    return res.json();
  }
  const getTourDetails = async(tourId) => {
    // console.log(tourId, "----tid");
    const response = await fetch(baseUrl + "/tours/tourDetails", {
      method: "POST",
      body: JSON.stringify({ tourId }),
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
    });
  
    return response.json();
  }
  const getDriversList = async () => {
    // const res = await fetch("http://localhost:3001/driversDetails");
    // return res.json();
    const drivers = await fetch(baseUrl + "/driver/getDrivers", {
      method: "POST",
      body: JSON.stringify({
        limit: 1000,
        offset: 0,
      }),
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
    });
    return drivers.json();
  }
  const getVehiclesListForNextPage = async ( limit, offset ) => {
    const res = await fetch(baseUrl + "/trucks/getTrucks", {
      method: "POST",
      body: JSON.stringify({
        limit: limit,
        offset: offset,
      }),
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
    });
    return res.json();
    // const res = await fetch("http://localhost:3001/vehicleDetails");
    // return res.json();
  }
  const findDriverLocation = async (driver_id) => {
    // const res = await fetch("http://localhost:3001/driversDetails");
    // return res.json();
    const drivers = await fetch(baseUrl + "/location/getDriverLocation", {
      method: "POST",
      body: JSON.stringify({ driver_id }),
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
    });
    return drivers.json();
  }
  const onMapLoad = (map) => {
    // navigator?.geolocation.getCurrentPosition(
    //   ({ coords: { latitude: lat, longitude: lng } }) => {
    //     const pos = { lat, lng };
    //     console.log(pos, "-----pos");
    //     setCoords({ ...coords, lat: pos.lat, lng: pos.lng });
    //   }
    // );
    if (data?.getBookingDetails.data.bookings[0].tour_id === "") {
      return;
    }
    setCoords({
      ...coords,
      lat: data?.driverLatestLoc.latitude,
      lng: data?.driverLatestLoc.longitude,
     
    });
  };
  useEffect(() => {
  let intervalId;

  const fetchData = async () => {
    try {
      const bookingId = id;
      const getBookingDetails = await getBookingsBySearch({ id: bookingId });

      if (getBookingDetails.data.bookings[0].tour_id !== "") {
        const tourDetails = await getTourDetails(getBookingDetails.data.bookings[0].tour_id);
        const findBookingInSequenceData = tourDetails.data.sequenceData.filter(
          (d) => d.booking_id === +bookingId
        );

        const driverDetails = await getDriversList();
        const vehicles = await getVehiclesListForNextPage(1000, 0);
        const fetchVehicleType = driverDetails.data.drivers.filter(
          (d) => d.user_id === tourDetails.data.tour.driver_id
        );

        const vehicleType = vehicles.data.trucks.filter(
          (d) => d.id === fetchVehicleType[0].truck_id
        );

        // ✅ Fetch driver location first
        const result = await findDriverLocation(tourDetails.data.tour.driver_id);
        const driverLatestLoc = {
          latitude: result.data.latitude,
          longitude: result.data.longitude,
        };

        setCoords({
          lat: driverLatestLoc.latitude,
          lng: driverLatestLoc.longitude,
        });

        // ✅ Now safe to use in setData
        setData({
          tourDetails,
          bookingId,
          findBookingInSequenceData,
          getBookingDetails,
          driverDetails,
          vehicleType,
          fetchVehicleType,
          driverLatestLoc,
        });

        // ✅ Function to update location every minute
        const updateDriverLocation = async () => {
          try {
            const result = await findDriverLocation(tourDetails.data.tour.driver_id);
            const latestLoc = {
              latitude: result.data.latitude,
              longitude: result.data.longitude,
            };
            setCoords({
              lat: latestLoc.latitude,
              lng: latestLoc.longitude,
            });
            setData((prev) => ({
              ...prev,
              driverLatestLoc: latestLoc,
            }));
          } catch (err) {
            console.error("Error fetching driver location:", err);
          }
        };

        intervalId = setInterval(updateDriverLocation, 60000);

        const phoneNumber = tourDetails?.data.truck?.driver_mobile;
        setmaskedPhoneNumber(maskPhoneNumber(phoneNumber));
      } else {
        setData({ getBookingDetails });
      }
    } catch (err) {
      console.error("Error loading booking data", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  return () => clearInterval(intervalId);
  }, []);



    const maskPhoneNumber = (phoneNumber) => {
      // Extract the last four digits of the phone number
      const lastFourDigits = phoneNumber.substring(phoneNumber.length - 4);
  
      // Replace the remaining digits of the phone number with asterisks
      const maskedPhoneNumber = phoneNumber.replace(/.(?=.{4})/g, "*");
  
      // Combine the masked phone number with the last four digits
      return (
        maskedPhoneNumber.substring(0, 3) +
        maskedPhoneNumber.substring(3, 6) +
        maskedPhoneNumber.substring(6)
      );
    }


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>map is loading</div>;
  }
    // let maskedPhoneNumber;
    // if (tourDetails.tourDetails) {
    //   let phoneNumber = tourDetails.tourDetails.data.truck.driver_mobile;
  
    //   maskedPhoneNumber = maskPhoneNumber(phoneNumber);
    // }
  return (
    <>
    <div 
        className={`absolute border rounded bg-[#ffffff] drop-shadow-2xl opacity-100 w-full h-full lg:h-[790px] lg:w-[600px] lg:mx-[400px] ${
          data?.getBookingDetails.data.bookings[0].booking_status ===
            "Tour Completed" ||
          data?.getBookingDetails.data.bookings[0].booking_status ===
            "Created"
            ? "lg:w-[600px] lg:mx-[400px]"
            : "lg:w-[1200px] lg:mx-[110px]"
        }`}
        
        // className="absolute border rounded bg-[#ffffff] drop-shadow-2xl opacity-100 w-full h-full lg:h-[790px] lg:w-[600px] lg:mx-[400px]"
      >
        <div className="flex flex-col lg:flex-row ">
          {data?.getBookingDetails.data.bookings[0].booking_status !==
            "Tour Completed" ||
          data?.getBookingDetails.data.bookings[0].booking_status !==
            "Created" ||
          data?.getBookingDetails.data.bookings[0].booking_status !==
            "Tour Created" ||
          data?.getBookingDetails.data.bookings[0].booking_status !==
            "Trip Created" ? (
            <div className="w-full h-3/4 lg:h-full lg:w-1/2">
              <div
                className="absolute h-3/4 w-full lg:h-full lg:w-1/2 fixed"
                ref={scrollDownRef}
              >
                <GoogleMap
                  center={coords}
                  zoom={15}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  onLoad={(map) => setMap(map)}
                >
                  <div
                    // onClick={callToDriverFn}
                    className="ml-[190px] lg:ml-[440px] lg:mt-[70px] mt-[70px] lg:absolute absolute lg:w-[150px] w-[150px] h-[60px] lg:h-[60px] bg-[#F8FAF9] lg:bg-[#F8FAF9] cursor-pointer rounded"
                  >
                    <div className="lg:ml-[70px] ml-[70px] text-[16px] lg:text-[13px] lg:mt-[6px] mt-[6px] bg-[#F8FAF9] lg:bg-[#F8FAF9] ">
                      <p className="lg:w-[89px] pt-3 rounded w-[100px] -ml-[20px] lg:-ml-[20px]">
                        {" "}
                        {maskedPhoneNumber}
                      </p>
                    </div>

                    <div>
                      <img
                        className="lg:w-[40px] lg:h-[40px] lg:-mt-[26px] -mt-[27px] lg:mr-5 mr-5 ml-[10px] lg:ml-[10px] w-[35px] h-[35px]"
                        src={PhoneIcon}
                        alt="PhoneIcon"
                      />
                    </div>
                  </div>
                  {/* Driver Location mArker */}
                  <Marker
                    position={coords}
                    draggable={true}
                    onLoad={(map) => onMapLoad(map)}
                    icon={
                      data?.getBookingDetails.data.bookings[0]
                        .vehicle_type === "2wheeler"
                        ? twowheelerGif
                        : truckGif
                    }
                  ></Marker>
                  <Marker
                  position={origin}
                  icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "green",
                      fillOpacity: 1,
                      strokeWeight: 1,
                      strokeColor: "#fff",
                    }}>
                    </Marker>
                  <Marker
                  position={destination}
                  icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "red",
                      fillOpacity: 1,
                      strokeWeight: 1,
                      strokeColor: "#fff",
                    }}></Marker>
                        {!directions && (
                      <DirectionsService
                        options={{
                          origin,
                          destination,
                          waypoints:[{
                            location:coords,
                            stopover:true
                          }],
                          travelMode: window.google.maps.TravelMode.DRIVING,
                        }}
                        callback={(result, status) => {
                          if (status === "OK") {
                            console.log(result,"kkkkk")
                            setDirections(result);
                          } else {
                            console.error(`Error fetching directions: ${status}`);
                          }
                        }}
                      />)}
                      {directions && (
                    <DirectionsRenderer
                      options={{
                        directions,
                        polylineOptions: {
                          strokeColor: "#1E90FF",
                          strokeWeight: 5,
                        },
                        suppressMarkers: true, // we already added custom markers
                      }}
                    />
                  )}
                
                </GoogleMap>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="overflow-y-auto">
            <div
              className={`border rounded mb-5 mr-3 pt-2 pl-3 bg-[#F8FAF9] shadow-lg font-rubik font-normal w-full lg:mt-0 lg:w-[550px] lg:h-[740px] lg:mt-6 lg:ml-6 ${
                data?.getBookingDetails.data.bookings[0]
                  .booking_status === "Tour Completed" ||
                data?.getBookingDetails.data.bookings[0]
                  .booking_status === "Created" ||
                data?.getBookingDetails.data.bookings[0]
                  .booking_status === "Trip Created" ||
                data?.getBookingDetails.data.bookings[0]
                  .booking_status === "Tour Created"
                  ? "relative mt-[0px]"
                  : "absolute mt-[440px]"
              }`}
              // className="border rounded mb-5 mr-3 pt-2 pl-3 bg-[#F8FAF9] shadow-lg font-rubik font-normal w-full lg:mt-0 lg:w-[550px] lg:h-[740px] lg:mt-6 lg:ml-6 relative mt-[0px]"
              // className="absolute border rounded mb-5 mr-3 pt-2 pl-3 bg-[#F8FAF9] shadow-lg font-rubik font-normal w-full mt-[440px] lg:mt-0 lg:w-[550px] lg:h-[740px] lg:mt-6 lg:ml-6"
              ref={scrollUpRef}
            >
              {data?.getBookingDetails.data.bookings[0].booking_status ===
                "Tour Completed" ||
              data?.getBookingDetails.data.bookings[0].booking_status ===
                "Created" ||
              data?.getBookingDetails.data.bookings[0].booking_status ===
                "Trip Created" ||
              data?.getBookingDetails.data.bookings[0].booking_status ===
                "Tour Created" ? null : (
                <div>
                  {!hideScrollDownIcon ? (
                    <img
                      onClick={() => {
                        // handleClick();
                        setHideScrollDownIcon(true);
                      }}
                      className="animate-bounce lg:w-0 lg:h-0 w-[30px] h-[30px] ml-[280px]"
                      src={ScrollDownIcon}
                      style={{height:"40px",width:"40px"}}
                      alt="scrollIcon"
                    />
                  ) : (
                    <img
                      onClick={() => {
                        // handleScrollUpClick();
                        setHideScrollDownIcon(false);
                      }}
                      
                      className="animate-bounce lg:w-0 lg:h-0 w-[30px] h-[30px] ml-[280px]"
                      src={ScrollUpIcon}
                      style={{height:"40px",width:"40px"}}
                      alt="scrollIcon"
                    />
                  )}
                </div>
              )}

              <div className="mt-[30px] -ml-1 lg:mt-[30px] lg:ml-1">
                <Line
                  percent={`${
                    data?.getBookingDetails.data.bookings[0]
                      .booking_status === "Tour Completed"
                      ? 40
                      : data?.getBookingDetails.data.bookings[0]
                          .booking_status === "Trip Created" ||
                        data?.getBookingDetails.data.bookings[0]
                          .booking_status === "Tour Created" ||
                        data?.getBookingDetails.data.bookings[0]
                          .booking_status === "Created" ||
                        data?.getBookingDetails.data.bookings[0]
                          .booking_status === "Reached pickup"
                      ? 10
                      : data?.getBookingDetails.data.bookings[0]
                          .booking_status === "Completed pickup" ||
                        data?.getBookingDetails.data.bookings[0]
                          .booking_status === "Reached drop"
                      ? 20
                      : 0
                  }`}
                  strokeWidth={2}
                  strokeColor="#30A46C"
                  className="w-[320px] lg:w-[500px] ml-[6px] lg:ml-[10px]"
                  // transition="scale"
                  // strokeLinecap="round"
                />{" "}
                <div className="flex flex-col" style={{position:"relative"}}>
                  <div style={{position:"relative"}}>
                    {data?.getBookingDetails.data.bookings[0]
                      .booking_status === "Created" ||
                    data?.getBookingDetails.data.bookings[0]
                      .booking_status === "Tour Created" ||
                    data?.getBookingDetails.data.bookings[0]
                      .booking_status === "Reached pickup" ||
                    data?.getBookingDetails.data.bookings[0]
                      .booking_status === "Trip Created" ? (
                      <div className="flex flex-row" >
                        <img
                          src={ConfirmedIcon}
                          style={{height:"40px",width:"40px",position:"absolute",left:"10px"}}
                          alt="truckIcon..."
                          className="w-[31px] h-[33px] -mt-[20px] ml-[20px] lg:w-[38px] lg:h-[40px] lg:-mt-[25px] lg:ml-[29px]"
                        />
                        <img
                          src={PickedUpDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"120px"}}
                          alt="truckIcon..."
                          className="w-[30px] lg:w-[30px] lg:h-[29px] h-[29px] -mt-[17px] ml-[55px]"
                        />
                        <img
                          src={IntransitDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"230px"}}
                          alt="truckIcon..."
                          className="w-[36px] lg:w-[36px] lg:h-[31px] h-[31px] -mt-[20px] ml-[55px]"
                        />
                        <img
                          src={DeliveredDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"340px"}}
                          alt="truckIcon..."
                          className="w-[34px] h-[35px] lg:w-[40px] lg:h-[41px] lg:-mt-[26px] lg:ml-[100px] -mt-[22px] ml-[55px]"
                        />
                      </div>
                    ) : data?.getBookingDetails.data.bookings[0]
                        .booking_status === "Completed pickup" ||
                      data?.getBookingDetails.data.bookings[0]
                        .booking_status === "Reached drop" ? (
                      <div className="flex flex-row">
                        <img
                          src={ConfirmedIcon}
                          style={{height:"40px",width:"40px",position:"absolute",left:"10px"}}
                          alt="truckIcon..."
                          className="w-[31px] h-[33px] -mt-[20px] ml-[20px] lg:w-[38px] lg:h-[40px] lg:-mt-[25px] lg:ml-[29px]"
                        />
                        <img
                          src={PickedUpIcon}
                          style={{height:"40px",width:"40px",position:"absolute",left:"120px"}}
                          alt="truckIcon..."
                          className="w-[30px] h-[29px] -mt-[18px] ml-[55px] lg:w-[37px] lg:h-[36px] lg:-mt-[23px] lg:ml-[100px]"
                        />
                        <img
                          src={IntransitIcon}
                          style={{height:"40px",width:"40px",position:"absolute",left:"230px"}}
                          alt="truckIcon..."
                          className="w-[37px] h-[33px] -mt-[19px] ml-[55px] lg:w-[45px] lg:h-[40px] lg:-mt-[25px] lg:ml-[100px]"
                        />
                        <img
                          src={DeliveredDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"340px"}}
                          alt="truckIcon..."
                          className="w-[34px] h-[35px] lg:w-[40px] lg:h-[41px] lg:-mt-[26px] lg:ml-[100px] -mt-[22px] ml-[55px]"
                        />
                      </div>
                    ) : data?.getBookingDetails.data.bookings[0]
                        .booking_status === "Tour Completed" ||
                      data?.getBookingDetails.data.bookings[0]
                        .booking_status === "Completed drop" ? (
                      <div className="flex flex-row" >
                        <img
                          src={ConfirmedIcon}
                          style={{height:"40px",width:"40px",position:"absolute",left:"10px"}}
                          alt="truckIcon..."
                          className="w-[31px] h-[33px] -mt-[20px] ml-[20px] lg:w-[38px] lg:h-[40px] lg:-mt-[25px] lg:ml-[29px]"
                        />
                        <img
                          src={PickedUpIcon}
                          style={{height:"40px",width:"40px",position:"absolute",left:"120px"}}
                          alt="truckIcon..."
                          className="w-[30px] h-[29px] -mt-[18px] ml-[55px] lg:w-[37px] lg:h-[36px] lg:-mt-[23px] lg:ml-[100px]"
                        />
                        <img
                          src={IntransitIcon}
                          style={{height:"40px",width:"40px",position:"absolute",left:"230px"}}
                          alt="truckIcon..."
                          className="w-[37px] h-[33px] -mt-[19px] ml-[55px] lg:w-[45px] lg:h-[40px] lg:-mt-[25px] lg:ml-[100px]"
                        />
                        <img
                          src={Delivered}
                          style={{height:"40px",width:"40px",position:"absolute",left:"340px"}}
                          alt="truckIcon..."
                          className="w-[33px] h-[33px] -mt-[20px] ml-[55px] lg:w-[41px] lg:h-[41px] lg:-mt-[26px] lg:ml-[100px]"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-row" >
                        <img
                          src={ConfirmedDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"10px"}}
                          alt="truckIcon..."
                          className="w-[31px] h-[32px] lg:w-[38px] lg:h-[38px] lg:-mt-[22px] lg:ml-[29px] -mt-[20px] ml-[20px]"
                        />
                        <img
                          src={PickedUpDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"120px"}}
                          alt="truckIcon..."
                          className="w-[31px] h-[29px] lg:w-[37px] lg:h-[34px] lg:-mt-[22px] lg:ml-[100px] -mt-[17px] ml-[55px]"
                        />
                        <img
                          src={IntransitDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"230px"}}
                          alt="truckIcon..."
                          className="w-[36px] h-[34px] lg:w-[42px] lg:h-[39px] lg:-mt-[24px] lg:ml-[100px] -mt-[20px] ml-[55px]"
                        />
                        <img
                          src={DeliveredDisabled}
                          style={{height:"40px",width:"40px",position:"absolute",left:"340px"}}
                          alt="truckIcon..."
                          className="w-[34px] h-[35px] lg:w-[40px] lg:h-[41px] lg:-mt-[26px] lg:ml-[100px] -mt-[22px] ml-[55px]"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row" style={{position:"relative"}}>
                    <div className="text-slate-800 text-[12px] font-normal mr-10 lg:mr-[80px] lg:ml-5"
                    style={{position:"absolute",top:"40px"}}
                    >
                      Confirmed
                    </div>
                    <div className="text-slate-800 text-[12px] font-normal mr-10 lg:mr-[90px]"
                    style={{position:"absolute",top:"40px",left:"110px"}}>
                      Picked Up
                    </div>
                    <div className="text-slate-800 text-[12px] font-normal mr-10 lg:mr-[94px]"
                    style={{position:"absolute",top:"40px",left:"220px"}}>
                      Intransit
                    </div>
                    <div className="text-slate-800 text-[12px] font-normal"
                    style={{position:"absolute",top:"40px",left:"320px"}}>
                      Delivered
                    </div>
                  </div>
                </div>
              </div>
              {data?.getBookingDetails.data.bookings[0].booking_status ===
                "Created" ||
              data?.getBookingDetails.data.bookings[0].booking_status ===
                "Trip Created" ? (
                <div className="p-2 ml-5  mt-5 rounded lg:w-1/2 w-4/5 text-[13px] font-normal bg-emerald-100  bg-emerald-100">
                  <div>Will assign driver shortly!</div>
                </div>
              ) : data?.tourDetails?.data.tour.status === "Accepted" &&
                data?.getBookingDetails.data.bookings[0]
                  .booking_status !== "Completed pickup" &&
                data?.getBookingDetails.data.bookings[0]
                  .booking_status !== "Reached drop" ? (
                <div className="p-2 ml-5  mt-5 rounded lg:w-1/2 w-4/5 text-[13px] font-normal bg-emerald-100  bg-emerald-100">
                  <div>Driver will pick up goods shortly!</div>
                </div>
              ) : null}

              <div style={{padding:"10px"}}>
                <div className="ml-5 text-slate-400 text-[20px] font-bold mt-6 " style={{marginTop:"70px"}}>
                  Order Details:
                </div>
                <div className="ml-5 border border-slate-300  rounded mt-3 lg:pr-3" style={{padding:"5px"}}>
                  <div className="text-[14px] p-2 mb-5" style={{paddingBottom:"1px",borderTop:"2px solid grey"}}>
                    Booking Id:{" "}
                    {data?.getBookingDetails.data.bookings[0].id}
                  </div>
                  <div className="flex flex-row" style={{position:"relative"}}>
                    <div
                      style={{
                        width: 20,
                        height: 10,
                        marginLeft: 10,
                      }}
                    >
                      <img width={'25'} height={'auto'} src={pickupIcon} alt="truckIcon..." />
                    </div>
                    <div className="absolute ml-100 -mt-2 text-[12px] text-slate-600 lg:w-[800px] w-[230px]"
                    style={{marginLeft:"40px",position:"absolute",top:"5px"}}
                    >
                      {/* {data?.tourDetails.findBookingInSequenceData[0]
                        .transport_type === "pickup"
                        ? data?.tourDetails.findBookingInSequenceData[0]
                            .location_address
                        : data?.tourDetails.findBookingInSequenceData[1]
                            .location_address} */}
                      {
                        data?.getBookingDetails.data.bookings[0]
                          .pickup_location
                      }
                    </div>
                  </div>

                  <div>
                    <img
                      style={{ width: 40, height: 140 }}
                      src={dottedLine}
                      alt="lineIcon..."
                    />
                  </div>
                  <div className="flex flex-row" style={{position: "relative"}}>
                    <div
                      style={{
                        marginLeft: 10,
                        position: "relative",
                        marginBottom: 10,
                        marginTop: 10,
                      }}
                      className="lg:w-[20px] lg:h-[10px] w-[30px] h-[17px]"
                    >
                      <img width={'25'} src={dropOffIcon} alt="deliverIcon..." />
                    </div>
                    <div
                      className="ml-2 -mt-4 text-[14px] text-slate-600 mb-4 lg:mt-2"
                      style={{ width: 420,position:"absolute",left:"40px",bottom:"-25px" }}
                    >
                      {
                        data?.getBookingDetails.data.bookings[0]
                          .dropoff_location
                      }
                    </div>
                  </div>
                </div>

                <div className="flex flex-row ml-5 mt-5" style={{margin:"3px"}}>
                  {data?.getBookingDetails.data.bookings[0]
                    .vehicle_type === "2wheeler" ? (
                    <img
                      style={{ width: 55, height: 50, marginTop: -4 }}
                      src={twowheelerGif}
                      alt="truckIcon..."
                    />
                  ) : data?.getBookingDetails.data.bookings[0]
                      .vehicle_type === "3wheeler" ? (
                    <img
                      style={{ width: 35, height: 31 }}
                      src={threewheeler}
                      alt="truckIcon..."
                    />
                  ) : (
                    <img src={truckGif} alt="truckIcon..." />
                  )}

                  <div
                    className={`flex flex-col ml-2 text-[12px] ${
                      trackAppName === "goodmove" ? "mt-1" : "mt-2"
                    }`}
                  >
                    <div>
                      {data?.getBookingDetails.data.bookings[0]
                        .vehicle_type === "2wheeler"
                        ? "Two wheeler"
                        : data?.getBookingDetails.data.bookings[0]
                            .vehicle_type === "3wheeler"
                        ? "Three wheeler"
                        : "Four wheeler"}
                    </div>
                    {trackAppName === "goodmove" ? (
                      <div className="text-slate-500">
                        {data?.tourDetails.data?.tourDetails.data.truck.driver_name}
                      </div>
                    ) : null}{" "}
                  </div>
                </div>

                <div className="ml-7 text-slate-400 text-[16px] font-medium mt-4" style={{padding:"5px",borderTop:"2px solid grey"}}>
                  Order Placed By
                </div>
                <div className="ml-5 border border-slate-300  rounded mt-3 text-[14px] font-normal p-2 mb-5" style={{padding:'5px'}}>
                  {
                    data?.getBookingDetails.data.bookings[0]
                      .receiver_contact
                  }
                </div>
                <div className="bg-emerald-50 shadow-lg border rounded mb-4 flex flex-row" style={{padding:"20px"}}>
                  <div>
                      <div className="text-[16px] lg:mb-3">
                      Discover how easy logistics management can be.
                    </div>
                      <div className="text-[16px]  text-slate-400">
                        Booking, live tracking, contacts, invoices—all in your
                        pocket. Download the GoodMove app to get started.
                      </div>
                      <a href="https://play.google.com/store/apps/details?id=com.ngrao.GoodMove">
                    <img
                      className="lg:w-[80px] lg:h-[25px] lg:mt-4 w-[80px] h-[45px] mt-2"
                      src={GooglePlayIcon}
                      alt="GooglePlayIcon"
                      style={{paddingTop:"20px",width:"100px",height:"50px"}}
                    />
                  </a>
                  </div>
                    <img
                        style={{width:"100px", height:"100px"}}
                        src={DownloadImg}
                        alt="DownloadImg"
                      />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
      
    </>
  );
}

export default TrackOrder