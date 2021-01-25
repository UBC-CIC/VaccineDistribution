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
              latLng: [41.9, 12.45],
              name: "Vatican City"
            },
            {
              latLng: [43.73, 7.41],
              name: "Monaco"
            },
            {
              latLng: [35.88, 14.5],
              name: "Malta"
            },
            {
              latLng: [1.3, 103.8],
              name: "Singapore"
            },
            {
              latLng: [1.46, 173.03],
              name: "Kiribati"
            },
            {
              latLng: [-21.13, -175.2],
              name: "Tonga"
            },
            {
              latLng: [15.3, -61.38],
              name: "Dominica"
            },
            {
              latLng: [-20.2, 57.5],
              name: "Mauritius"
            },
            {
              latLng: [26.02, 50.55],
              name: "Bahrain"
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