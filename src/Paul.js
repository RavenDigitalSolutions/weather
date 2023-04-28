import { useState } from 'react';
import axios from "axios";
import React, { PureComponent } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';

export default function HomePage() {
  
  const [tdata, settdata] = useState([]);
  const [chartData, setchartData] = useState([]);
  function domywork(rData){
    
    let content = [];
    let renderLineChart = [];
    for (let j = 1; j <= 12; j++) {
      let tempChart = [];
      let monthName = getMonthName(j);
      content.push(<tr><th><h3 key={monthName} className="{monthName}">{monthName}</h3></th><th>Feels Like Max</th></tr>);
      let theKeys = Object.keys(rData.months[j]);
      let theRow = [];
      theKeys.forEach((a) => {
        let abbr = rData.cities[a].substring(0, 3);
        let canadaPos = rData.cities[a].toUpperCase().indexOf("CANADA");
        let shorterName = rData.cities[a].substring(0, canadaPos);
        let tempCasted = Number(rData.months[j][a]);
        tempChart.push({name: abbr, temp: tempCasted});
        theRow.push(<tr><td>{shorterName}</td><td>{rData.months[j][a]}</td></tr>);
      });
      content.push(<>{theRow}</>);

      renderLineChart[j] = (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={tempChart}
          margin={{
            top: 30,
            right: 30,
            left: 0,
            bottom: 50,
          }}
        >
          <XAxis dataKey="name" label={{ value: monthName, position: "outsideBottom", dy: 30, fill: '#008'}} style={{fontFamily: 'Helvetica ',}}/>
          <YAxis type="number" domain={[-12, 28]} width={50} tickCount={10}/>
            <ReferenceLine y={0} stroke="#000" />
          <Tooltip />
          <Bar dataKey="temp" fill="#880000" >
            <LabelList dataKey="temp" position="top" fill='#008'/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      );
      setchartData(renderLineChart);
      renderLineChart.forEach((cvalue, ckey) => {
      });
    }
    settdata(content);
    return content;
  }
  function getData(){
      const config = {
        method: 'GET',
        url: 'https://rweather.ravenisle.com/get_averages.php',
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
      };
          axios.request (config)
            .then(response => {
              const rData = response.data;
              domywork(rData);
            })
            .catch(error => {
              console.log(error);
            })
  }

  return (
    <div><button onClick={() => getData()}>Get Data</button>
    <div className='wrapper monthly_wrapper'>
      <table><tbody>{tdata}</tbody></table>
    </div>
    <div className='chart_wrapper'>
      {chartData}
    </div>
    </div>
  );
}
function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}
const box = document.getElementById('trial-header-29279');
box.remove();
