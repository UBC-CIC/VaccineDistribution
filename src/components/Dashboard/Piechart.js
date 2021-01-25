import React from "react";
 // javascipt plugin for creating charts
 import Chart from "chart.js";
 // react plugin used to create charts
 import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
 // reactstrap components
 import { Card, CardHeader, CardBody } from "reactstrap";
 // core components
 import {
   // global options for the charts
   chartOptions,
   // function that adds the global options to our charts
   parseOptions,
   chartExample6
 } from "variables/charts.js";

 class Charts extends React.Component {
   componentWillMount() {
     if (window.Chart) {
       parseOptions(Chart, chartOptions());
     }
   }
   render() {
     return (
       <>
         <Card>
           <CardHeader>
             <h5 className="h3 mb-0">Pie chart</h5>
           </CardHeader>
           <CardBody>
             <div className="chart">
               <Pie
                 data={chartExample6.data}
                 options={chartExample6.options}
                 className="chart-canvas"
                 id="chart-pie"
               />
             </div>
           </CardBody>
         </Card>
       </>
     );
   }
 }

 export default Charts;