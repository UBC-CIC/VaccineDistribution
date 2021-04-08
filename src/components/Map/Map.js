import React, {Component} from "react";
import MapConstructor from "./MapConstructor";
import '../../assets/css/map.css'
import mapboxgl from 'mapbox-gl'
let mapConstructor = new MapConstructor()
let map;


class Map extends Component{
    constructor(props) {
        super(props);
        this.mapContainer = React.createRef();

    }
    async componentDidMount() {
        map = await mapConstructor.constructMap(this.mapContainer.current)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        let {markers} = this.props
        if(markers){
            for(let i=0;i<markers.length;i++){
                var el = document.createElement('div');
                el.className = 'marker fas fa-map-marker-alt fa-3x';
                new mapboxgl.Marker(el)
                    .setLngLat([markers[i].latLng[1],markers[i].latLng[0]])
                    .setPopup(new mapboxgl.Popup().setHTML(markers[i].name))
                    .addTo(map);

            }

        }
    }
    render() {
        return(
            <div ref = {this.mapContainer} className = "mapContainer"/>
        )
    }
}

export default Map