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
import React, {Component, useEffect, useState } from 'react'
import Amplify, { API, container, graphqlOperation } from 'aws-amplify'
import { listContainers } from '../../graphql/queries';
//import awsExports from "../../aws-exports";

import { Line, Bar } from "react-chartjs-2";


// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    NavItem,
    NavLink,
    Nav,
    Progress,
    Table,
    Container,
    Row,
    Col
  } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { withAuthenticator } from '@aws-amplify/ui-react';
import VaccineTable from "components/Tables/VaccineTable.js";
//Amplify.configure(awsExports)

// core components
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2,
    chartExample3,
    chartExample4
  } from "variables/charts";

  // node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
import Timeline from 'components/Dashboard/Timeline';
import GeneralHeader from "../../components/Headers/GeneralHeader";
//import Chart from "./../../components/Chart/Chart";

class ViewIOT extends Component {

    async componentWillMount(){
       
        console.log(this.chartReference)
        
        if (window.Chart) {
          parseOptions(Chart, chartOptions());
        }
        
      }

  render() {
    return (
      <>
        <GeneralHeader title={"View IOT"} />
        {/* Page content */}
       
        
        <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-default">
            <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Temperature chart</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
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
    <Chart sensorId="1" />
    <Chart sensorId="2" x-ticks="20" />
    <Chart sensorId="3" x-ticks="20"/>
    */}
       
      </>
    );
  }
}

export default withAuthenticator(ViewIOT) ;