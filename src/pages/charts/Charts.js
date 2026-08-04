import React, { useState,useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';
import Layout from '../../components/Layout';
import "../charts/charts.css";
import StackedBarChart from './StackedBarChart';
import StackedBarChartDrivers from './SessionChart';
import bookings from '../../images/booking.png'
import driver from '../../images/license.png'
import tour from '../../images/route.png'
import revenue from '../../images/revenue.png'
import customers from "../../images/people.png"
import { baseUrl } from '../../api/apiConfig';
import Loading from '../../components/Loading';



const Charts = () => {

    const [bookData, setBookData] = useState([]);
    const [loading,setLoading]=useState(false)
    const [bookingsCount,setBookingsCount]=useState(0)
    const [today_totalTours,setToday_totalTours]=useState(0)
    const [today_totalTrips,setToday_totalTrips]=useState(0)
    const [today_totalDistance,setToday_totalDistance]=useState(0)

    const getTodayBookings = async()=>{
        try {
            setLoading(true)
            const resp=await axios.post(`${baseUrl}/booking/getTodayBookings`,{
            limit:3000,offset:0
            });
            
            console.log("response",resp);
            if(resp.data.success){
            const data=resp.data.data.bookings;
            setBookData(data)
            setBookingsCount(resp.data.data.count)
            // setLoading(true)
            }
        } catch (error) {
            console.log(`getTodayBookings api Error in chartjs : ${error}`)
        }finally{
            setLoading(false)
        }
    }
    

    const collectTodayTours=(data)=>{
        setToday_totalTours(data)
    }
    const collectTodayTrips=(data)=>{
        setToday_totalTrips(data)
    }
    const collectTotalDistance=(data)=>{
        setToday_totalDistance(data)
    }
    
    useEffect(()=>{
        getTodayBookings()
    },[])
    // 1.To print the company names and their respective booking counts:
    const companyBookingCount = {};
    bookData.forEach(booking => {
    const company = booking.company_name || "Unknown Company";
    if (companyBookingCount[company]) {
        companyBookingCount[company]++;
    } else {
        companyBookingCount[company] = 1;
    }
    });
    
    for (const [company, count] of Object.entries(companyBookingCount)) {
    console.log(`${company}: ${count}`);
    }
    const resultofbookCount = Object.entries(companyBookingCount).map(([company, count]) => ({
    company,
    count,
    }));

    // 2.Finding individual booking count of an driver
    const driverStats = {};
    bookData.forEach((booking) => {
    const driver = booking.driver_name || "ZUnassigned";

    // Extract distance from estimate_fare_info
    let distance = 0;
    const match = booking.estimate_fare_info?.match(/distance:\s*(\d+)/);
    if (match) {
    distance = parseFloat(match[1]);
    }

    if (!driverStats[driver]) {
    driverStats[driver] = {
    driver_name: driver,
    count: 0,
    distance: 0,
    };
    }

    driverStats[driver].count += 1;
    driverStats[driver].distance += distance;
    });

    const result = Object.values(driverStats);
   
    // localStorage.getItem("bookingCount")
    // localStorage.getItem("driversCount")
    // localStorage.getItem("tourCount")
    // localStorage.getItem("tourCount")
    const todayDetails=[
        {name:"Bookings",count:bookingsCount,icon:bookings},
        {name:"Drivers",count:result.filter((obj)=>obj.driver_name !== "ZUnassigned").length,icon:driver},
        {name:"Tours",count:today_totalTours,icon:tour},
        {name:"Trips",count:today_totalTrips,icon:tour},
        {name:"Distance",count:today_totalDistance,icon:revenue},
    ]
    const totalDetails=[
        {name:"Customers",count:localStorage.getItem("customersCount"),icon:customers},
        {name:"Drivers",count:localStorage.getItem("totalDrivers"),icon:driver},
        {name:"Bookings",count:localStorage.getItem("totalBookings"),icon:bookings},
    ]
  return (
    <div>
        <Layout>
           {
            loading ? 
            <p style={{textAlign:"center",color:"#30A46C",padding:"10px"}}>Loading...</p> : 
            <div id='chartContainer'>
                <h3>Dashboard</h3>
                <div className='chartContainer-Content'>
                    <div className='today-Details'>
                        <div>
                            <h5>Today</h5>
                            <small style={{paddingBottom:"5px"}}>Last update-{moment().format('DD-MM-YYYY hh:mm A')}</small>
                        </div>
                        <div className='box'>
                        {
                            todayDetails.map((elem,index)=>(
                            <div key={index} className='iconBox-Container'>
                                <div className='iconBox'>
                                    <p>{elem.name}</p>
                                    <p><img style={{width:"30px"}} src={elem.icon} alt="icons" /></p>
                                </div>
                               <div className='iconBox-Count'> 
                                <p>{elem.count ? elem.count : <small style={{fontSize:"12px"}}>Loading...</small>}</p>
                                </div>
                            </div>
                            ))
                        }
                        </div>
                    <hr className='custom-hr' />
                {/*  Dailywise Bookingcount */}
                    {/* <div style={{display:"flex",justifyContent:"space-around",gap:10}}>
                        <div style={{width:"650px"}}>
                            <BarChart bookingsCount={bookingsCount}/>
                        </div>
                    </div> */}
                    <div>
                        <StackedBarChart resultofbookCount={resultofbookCount}/>
                    </div>
                    <div>
                    <StackedBarChartDrivers result={result} 
                    collectTodayTours={collectTodayTours}
                    collectTodayTrips={collectTodayTrips}
                    collectTotalDistance={collectTotalDistance}
                    />
                    </div>
                    
                    </div>
                    <div class="vertical-line"></div>

                    <div className='overall'>
                        <div><h5>Total</h5></div>
                        <div className='box'>
                        {
                            totalDetails.map((elem,index)=>(
                            <div key={index} className='overallBox-Cont' >
                                <div>
                                    <p style={{fontSize:"14px"}}>{elem.name}</p>
                                    <img style={{height:"20px"}} src={elem.icon} alt="icons" />
                                </div>
                                <p style={{fontSize:"20px"}}>{elem.count}</p>
                            </div>
                            ))
                        }
                        </div>
                       
                    </div>

                </div>
            </div>
           }
        </Layout>
    </div>
  )
}

export default Charts