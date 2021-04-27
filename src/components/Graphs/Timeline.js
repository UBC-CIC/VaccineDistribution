// Link to refer - https://reactjsexample.com/modern-timeline-component-for-react/

import React from "react"
import {Chrono} from "react-chrono";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";

let items = [{
    title: "1 Jan 2021",
    cardTitle: "Manufacturer_A",
    cardSubtitle: "Vaccine Manufacturer",
    media: {
        type: "IMAGE",
        source: {
            url: require("assets/img/Dashboard/CovidVaccine.jpg")
        }
    }
}, {
    title: "3 Jan 2021",
    cardTitle: "Carrier_A",
    cardSubtitle: "Supply Chain Logistics",
    media: {
        type: "IMAGE",
        source: {
            url: require("assets/img/Dashboard/SupplyTruck.png")
        }
    }
},
    {
        title: "5 Jan 2021",
        cardTitle: "Airport_A",
        cardSubtitle: "Airport Authority of [Country]",
        media: {
            type: "IMAGE",
            source: {
                url: require("assets/img/Dashboard/AirportLogo.png")
            }
        }
    },
    {
        title: "6 Jan 2021",
        cardTitle: "Carrier_B",
        cardSubtitle: "Supply Chain Logistics",
        media: {
            type: "IMAGE",
            source: {
                url: require("assets/img/Dashboard/SupplyTruck.png")
            }
        }
    },
    {
        title: "7 Jan 2021",
        cardTitle: "Hospital",
        cardSubtitle: "Vaccine Distributor",
        media: {
            type: "IMAGE",
            source: {
                url: require("assets/img/Dashboard/HospitalLogo.png")
            }
        }
    }];

class Timeline extends React.Component {
render(){
    return (
        <Card className="shadow">
            <CardHeader className="border-0">
                <Row className="align-items-center">
                    <Col>
                        <h3 className="mb-0">Vaccine Container Timeline</h3>
                        <hr/>

                    </Col>
                </Row>
            </CardHeader>
            <CardBody>

                <div>
                    <Chrono items={items}
                            mode="VERTICAL_ALTERNATING"
                    />
                </div>

            </CardBody>

        </Card>

    );
  }
}
export default Timeline;