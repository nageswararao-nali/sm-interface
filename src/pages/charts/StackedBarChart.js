import React from 'react'
import { Bar,Pie } from 'react-chartjs-2';
// import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS,CategoryScale,LinearScale,BarElement,Tooltip,Title,Legend,ArcElement, plugins} from "chart.js"
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Title,Legend)


const StackedBarChart = ({resultofbookCount}) => {
    
   const data = {
        labels:resultofbookCount.map(item => item.company),
        datasets: [
          {
            label: 'Count',
            data: resultofbookCount.map(item => item.count),
            backgroundColor: resultofbookCount.map((_, index) => {
            const colors = [
              'rgba(255, 99, 132, 0.7)',   // red
              'rgba(54, 162, 235, 0.7)',   // blue
              'rgba(255, 206, 86, 0.7)',   // yellow
              'rgba(75, 192, 192, 0.7)',   // green
              'rgba(153, 102, 255, 0.7)',  // purple
              'rgba(255, 159, 64, 0.7)'    // orange
            ];
            return colors[index % colors.length]; // repeat colors if more bars
          })
          }
        ]
      };

    let options = {
      indexAxis:"y",
      datalabels: {
          display: false,
          clamp:true,
          color: 'black',
          font: {
              weight: 'bold'
          },
        
      },
      plugins:{
        legend:{
          labels:{
          usePointStyle: true, // replaces square with pointStyle
          pointStyle: 'triangle'
          }
        }
      }
    };
   
  return (
    <div style={{width:"450px",margin:"auto",padding:"20px 0px 40px"}}>
        <Pie options={options} data={data} plugins={[ChartDataLabels]}/>
    </div>
  )
}

export default StackedBarChart
