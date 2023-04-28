import { useState } from 'react';
import axios from "axios";
import React, { PureComponent, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';

export default function HomePage() {

  const [tdata, settdata] = useState([]);
  const [chartData, setchartData] = useState([]);
  function domywork(rData){
    let content = [];
    let renderLineChart = [];
    document.getElementById("wrapper").style.opacity = "1";
    document.getElementById("theGraphs").style.opacity = "1";
    for (let j = 1; j <= 12; j++) {
      let tempChart = [];
      let monthName = getMonthName(j);
      content.push(<tr>
                   <th><h3 key={monthName} className="{monthName}">{monthName}</h3></th>
                   <th>Feels Like<br />Max</th>
                   <th>Feels Like<br />Min</th>
                   <th>Hi Temp</th>
                   <th>Low Temp</th>
                   <th>Wind</th>
                   <th>Humidity</th>
                   </tr>);
      let theKeys = Object.keys(rData.months[j]);
      let theRow = [];
      theKeys.forEach((a) => {
        let abbr = rData.cities[a].substring(0, 3);
        let canadaPos = rData.cities[a].toUpperCase().indexOf("CANADA");
        let shorterName = rData.cities[a].substring(0, canadaPos);
        shorterName = shorterName.replace("Ontario", "On");
        shorterName = shorterName.replace("Bc", "BC");
        shorterName = shorterName.replace("Nova Scotia", "NS");
        let tempCasted = Number(rData.months[j][a].feelslikemax);
        tempChart.push({name: abbr, temp: tempCasted});
        theRow.push(<tr>
                    <td>{shorterName}</td>
                    <td className="flmax">{rData.months[j][a].feelslikemax}</td>
                    <td className="flmin">{rData.months[j][a].feelslikemin}</td>
                    <td>{rData.months[j][a].tempmax}</td>
                    <td>{rData.months[j][a].tempmin}</td>
                    <td>{rData.months[j][a].windspeed}</td>
                    <td>{rData.months[j][a].humidity}</td>
                  </tr>);
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
          <XAxis dataKey="name" label={{ value: monthName, position: "outsideBottom", dy: 30, fill: '#2670AF'}} style={{fontFamily: 'Helvetica ',}}/>
          <YAxis type="number" domain={[-12, 28]} width={50} tickCount={10}/>
            <ReferenceLine y={0} stroke="#000" />
          <Tooltip />
          <Bar dataKey="temp" fill="#880000" >
            <LabelList dataKey="temp" position="top" fill='#2670AF'/>
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
            });
  }
    useEffect(() => {
      document.getElementById("getButton").style.boxShadow  = "2px 2px 30px 8px #fff";
    }, []);
  return (
    <div><button id="getButton" onClick={() => getData()}>Calculate Monthy Averaves</button>
    <div id='wrapper'>
    <h2>Monthly Average Data</h2>
    <a href="#theGraphs" id="graphsLink"><button>Cool Graphs &#x2B07;</button></a>
      <table><tbody>{tdata}</tbody></table>
      
    </div>
    
    <div className='chart_wrapper' id="theGraphs">
      <h2>Feels Like Max Monthly Graphs</h2>
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

