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
// reactstrap components
import {Col, Container, Row} from "reactstrap";
// core components
import {chartOptions, parseOptions} from "components/Graphs/Chart";

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
          <Container className="mt-4">

              <Row className="mt-5">
                  <Col className="mb-5 ml-6" xl="5">
                      <Timeline/>
                  </Col>
              </Row>
          </Container>
       
      </>
    );
  }
}

export default (ViewIOT) ;