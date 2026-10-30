import { myScore } from '@/app/api/app';
import { useStore } from '@/app/global/DataProvider';
import {
    Chart as ChartJs,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    RadialLinearScale
  } from 'chart.js'
import { useEffect, useState } from 'react';
  import { Radar } from 'react-chartjs-2';

  ChartJs.register(LineElement,
    PointElement,
    Tooltip,
    Legend,
    RadialLinearScale)
    // ChartJs.defaults.font.

const RadarChart = ({resize,scoreData}) => {
  const sub = scoreData && scoreData.map((i)=> i.sub);
  const rightAns = scoreData && scoreData.map((i)=> i.rightAns || 0);
  const wrongAns = scoreData && scoreData.map((i)=> i.wrongAns || 0);
    const chartData = {
        labels: sub,
        datasets: [{
          label: 'Your currect answer',
          data: rightAns,
          fill: true,
          pointRadius:5,
          backgroundColor:"Yes",
          hoverBackgroundColor:'Yes',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }
        ,
        {
          label: 'Your incurrect answer',
          data: wrongAns || 0,
          fill: true,
          pointRadius:5,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'red',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: 'red',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }
      ]
      };
    
      
      const options_0 = {
        scale: {
          ticks: { beginAtZero: true }
        }
      };
      const options = {
        scales: {
          r: {
            pointLabels: {
              font: {
                size: 10, // Change this value to customize the label font size
              },
              color:"black"
            },
          },
        },
      };
  return (
    <div className='w-full flex justify-center items-center'>
       {
        scoreData ?  <div className="w-full">
          {
            resize <= 240 && (<Radar data={chartData} options={options_0} />)
          }
          {
            resize > 240 && (<Radar data={chartData} options={options} />)
          }
        </div> : "Loading..."
       }
    </div>
  );
};

export default RadarChart;
