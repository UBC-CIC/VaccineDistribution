// Link to refer - https://reactjsexample.com/modern-timeline-component-for-react/

import React from "react"
import { Chrono } from "react-chrono";
  let items = [{
    title: "1 Jan 2021",
    cardTitle: "Pfizer",
    cardSubtitle:"Vaccine Manufacturer",
    media: {
      type: "IMAGE",
      source: {
        url: require("assets/img/Dashboard/CovidVaccine.jpg")
      }
    }
  },{
      title: "3 Jan 2021",
      cardTitle: "Fedex",
      cardSubtitle:"Supplychain Logistics",
      media: {
        type: "IMAGE",
        source: {
          url: require("assets/img/Dashboard/SupplyTruck.png")
        }
      }
    },
    {
        title: "5 Jan 2021",
        cardTitle: "Vancouver Airport",
        cardSubtitle:"Airport Authority of Canada",
        media: {
          type: "IMAGE",
          source: {
            url: require("assets/img/Dashboard/AirportLogo.png")
          }
        }
      },
      {
        title: "6 Jan 2021",
        cardTitle: "Fedex",
        cardSubtitle:"Supplychain Logistics",
        media: {
          type: "IMAGE",
          source: {
            url: require("assets/img/Dashboard/SupplyTruck.png")
          }
        }
      },
      {
        title: "7 Jan 2021",
        cardTitle: "Vancouver General Hospital",
        cardSubtitle:"Vaccine distributer",
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
      <div style={{ width: "500px", height: "900px" }}>
        <Chrono items={items} 
        mode="VERTICAL_ALTERNATING"
        />
      </div>
    );
  }
}
export default Timeline;