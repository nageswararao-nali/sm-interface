import React,{useState,useEffect} from 'react'
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { baseUrl } from '../../api/apiConfig';
import Loading from '../../components/Loading';
import axios from 'axios';
import moment from 'moment';
import { Chart as ChartJS,CategoryScale,LinearScale,BarElement,Tooltip,Title,Legend} from "chart.js"
// import { Data } from '@react-google-maps/api';
ChartJS.register(CategoryScale,LinearScale,BarElement,Tooltip,Title,Legend)



const options = {
    indexAxis:"y",
    scales: {
      x: { 
        stacked: true ,
        ticks: {
          beginAtZero: true ,
          stepSize:10
        }
      },
      y: { 
        stacked: true,
        ticks: {
          beginAtZero: true ,
          stepSize:15,
          autoSkip: false,    
          maxRotation: 45,     
          minRotation: 0,
        }
      }
    },
     plugins: {
    datalabels: {
      color: 'black', // 🔵 Change to any color (hex, rgb, named)
      font: {
        weight: 'bold',
        size: 13
      },
      anchor: 'center',
      align: 'center',
    }
  }
  };

const StackedBarChartDrivers = ({result,collectTodayTours,collectTodayTrips,collectTotalDistance}) => {
   let a=result.sort((a,b)=>a.driver_name.localeCompare(b.driver_name));
  const [sessionData,setSessionData]=useState()
  const [loading,setLoading]=useState(false)

    // session Api calling..
      const getSessionData =async ()=>{
          try {
            setLoading(true)
              const resp=await axios.post(`${baseUrl}/driver/getAllSessions`,{
              limit:200,offset:0
              });
              const {success,data}=resp.data
              if(success){
                  setSessionData(data.sessionList)
              }
          } catch (error) {
              console.log("getSessionData api fn error:",error)
          }finally{
            setLoading(false)
          }
      }
      let todaySessionData=[]
      let totalTours=''
      let totalTrips=''
      let totalDistance=''
      if(sessionData?.length >0){
        todaySessionData = sessionData.filter((item,index)=>{
          return moment(item.session_start_time).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY");
        })
        
        todaySessionData =todaySessionData?.filter(session =>
        result.some(summary => summary.driver_name === session.driver_name)
        );
        todaySessionData.sort((a,b)=>a.driver_name.localeCompare(b.driver_name))
        totalTours=todaySessionData.reduce((initial,obj)=>{return initial + obj.no_tours},0)
        collectTodayTours(totalTours)
        totalTrips=todaySessionData.reduce((initial,obj)=>{return initial + obj.no_trips},0)
        collectTodayTrips(totalTrips)
        totalDistance=todaySessionData.reduce((initial,obj)=>{return initial + obj.total_distance},0)
        collectTotalDistance(totalDistance)
      }

      useEffect(()=>{
        getSessionData()
      },[])


        const data ={
        labels:todaySessionData.sort((a,b)=>a.driver_name.localeCompare(b.driver_name)).map((obj)=>obj.driver_name),
        datasets:[{
            label:"Bookingscount",
            data:result.map((obj)=>obj.count),
            backgroundColor:'rgba(54, 162, 235, 0.5)'
          },
          {
            label:"Tours",
            data:sessionData ? todaySessionData.map((obj)=>obj.no_tours) :[],
            backgroundColor:'#3674B5'
          },
          {
            label:"Trips",
            data:sessionData ? todaySessionData.map((obj)=>obj.no_trips) :[],
            backgroundColor:'#F5F0CD'
          },
          {
            label:"Km",
            data:sessionData ? todaySessionData.map((obj)=>obj.total_distance) :[],
            backgroundColor:todaySessionData.map((obj)=>obj.session_end_time ? '#E6521F':'#578FCA')
          },
        ]
      }


  return (
    <div style={{paddingBottom:"20px"}}>
      {
        todaySessionData.length ?
        <Bar options={options} data={data} plugins={[ChartDataLabels]}/> :
        <Loading/>
      }
    </div>
  )
}

export default StackedBarChartDrivers


