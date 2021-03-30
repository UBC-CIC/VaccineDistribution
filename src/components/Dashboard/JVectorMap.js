import React from "react";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

let mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

let vaccineMarkers=[
  {
    latLng: [40.75052980052932, -73.97242325988212],
    name: "Pfizer, New York"
  },
  {
    latLng: [42.36351390899485, -71.09083347702314],
    name: "Moderna, Cambridge"
  },
  {
    latLng: [52.17521957926609, 0.13412011301399862],
    name: "Oxford-AstraZeneca, Cambridge"
  },
  {
    latLng: [17.666823436136603, 78.60148782606427],
    name: "Covaxin, Telangana"
  },
  {
    latLng: [18.50193884218938, 73.93147018189785],
    name: "Covisheild, Pune"
  },
  {
    latLng: [39.98065994927534, 116.42416445543645],
    name: "BBIBP-CorV, Beijing"
  },
  {
    latLng: [55.801525446601346, 37.45749764253089],
    name: "Sputnik V, Moscow"
  }
]

class Jvectormap extends React.Component {
  render() {
    return (
      /*
      <>
      <div style={{width: 500, height: 500}}>
      <VectorMap map={'us_aea'}
                 backgroundColor="#3b96ce"
                 ref="map"
                 containerStyle={{
                     width: '100%',
                     height: '500px'
                 }}
                 containerClassName="map"
      />
  </div>
  </>
     */
       
       <div style={{width: 500, height: 500}}>
        <VectorMap
          containerClassName="vector-map"
          containerStyle={{
            width: "70%",
            height: "500px"
          }}
          map={"world_mill"}
          zoomOnScroll={true}
          scaleColors={["#f00", "#0071A4"]}
          normalizeFunction="polynomial"
          hoverOpacity={0.7}
          hoverColor={false}
          backgroundColor="transparent"
          regionStyle={{
            initial: {
              fill: "#e9ecef",
              "fill-opacity": 0.8,
              stroke: "none",
              "stroke-width": 0,
              "stroke-opacity": 1
            },
            hover: {
              fill: "#dee2e6",
              "fill-opacity": 0.8,
              cursor: "pointer"
            },
            selected: {
              fill: "yellow"
            },
            selectedHover: {}
          }}
          markerStyle={{
            initial: {
              fill: "#fb6340",
              "stroke-width": 0
            },
            hover: {
              fill: "#11cdef",
              "stroke-width": 0
            }
          }}
          markers={[
            {
              latLng: [40.75052980052932, -73.97242325988212],
              name: "Pfizer, New York"
            },
            {
              latLng: [42.36351390899485, -71.09083347702314],
              name: "Moderna, Cambridge"
            },
            {
              latLng: [52.17521957926609, 0.13412011301399862],
              name: "Oxford-AstraZeneca, Cambridge"
            },
            {
              latLng: [17.666823436136603, 78.60148782606427],
              name: "Covaxin, Telangana"
            },
            {
              latLng: [18.50193884218938, 73.93147018189785],
              name: "Covisheild, Pune"
            },
            {
              latLng: [39.98065994927534, 116.42416445543645],
              name: "BBIBP-CorV, Beijing"
            },
            {
              latLng: [55.801525446601346, 37.45749764253089],
              name: "Sputnik V, Moscow"
            }
          ]}
          series={{
            regions: [
              {
                values: mapData,
                scale: ["#ced4da", "#adb5bd"],
                normalizeFunction: "polynomial"
              }
            ]
          }}
        />
       </div>
 
 
    );
  }
}

export default Jvectormap;