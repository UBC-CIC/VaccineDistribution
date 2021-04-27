/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {Component} from 'react'
//import awsExports from "../../aws-exports";
import {Line} from "react-chartjs-2";


// reactstrap components
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
// core components
//Amplify.configure(awsExports)
// core components
import {chartExample3, chartOptions, parseOptions} from "components/Graphs/Chart";

// node.js library that concatenates classes (strings)
// javascipt plugin for creating charts
import Chart from "chart.js";
import Timeline from 'components/Graphs/Timeline';
import Header from "../components/Headers/Header";
import IoTTable from "../components/Tables/IoTTable";

//import Graphs from "./../../components/Graphs/Graphs";

class ViewIOT extends Component {

    async componentWillMount() {

        console.log(this.chartReference)

        if (window.Chart) {
          parseOptions(Chart, chartOptions());
        }
        
      }

  render() {
    return (
      <>
          <Header title={"View IOT"}/>
        {/* Page content */}
       <IoTTable/>
          <Container className="mt-8">

          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-default">
            <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Temperature chart</h3>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
             <div className="chart">

                    
               <Line ref="chart"
                 data={chartExample3.data}
                 id="chart-sales"
                 className="chart-canvas"
                 options={chartExample3.options}
                 
               />
               </div>
            </CardBody>
            </Card>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="8">
       
            <Timeline/>
            
            </Col>
            </Row>
           {/*}
    <Graphs sensorId="1" />
    <Graphs sensorId="2" x-ticks="20" />
    <Graphs sensorId="3" x-ticks="20"/>
    */}
          </Container>
       
      </>
    );
  }
}

export default (ViewIOT) ;