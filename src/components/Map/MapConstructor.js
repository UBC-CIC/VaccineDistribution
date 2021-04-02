import amplifyConfig from "../../aws-exports";
import {Signer} from "@aws-amplify/core";
import {Auth} from "aws-amplify";
import mapboxgl from "mapbox-gl";
let credentials;
const mapName = process.env.REACT_APP_MAP_NAME;

//Effects: request to load map resource from amazon location service
function transformRequest(url, resourceType) {
    if (resourceType === "Style" && !url.includes("://")) {
        // resolve to an AWS URL
        url = `https://maps.geo.${amplifyConfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
    }
    if (url.includes("amazonaws.com")) {
        // only sign AWS requests (with the signature as part of the query string)
        return {
            url: Signer.signUrl(url, {
                access_key: credentials.accessKeyId,
                secret_key: credentials.secretAccessKey,
                session_token: credentials.sessionToken,
            }),
        };
    }
    // Don't sign
    return { url: url || "" };
}

class MapConstructor {
    //create a map instance, then return it
    async constructMap(container) {
        credentials = await Auth.currentCredentials();
        let map = new mapboxgl.Map({
            container: container,
            style: mapName,
            transformRequest,
        });
        return map
    }
    //create a map instance with center location, then return it
    async constructMapWithCenter(container, center) {
        credentials = await Auth.currentCredentials();
        let map = new mapboxgl.Map({
            container: container,
            center: center,
            zoom: 10,
            style: mapName,
            transformRequest,
        });
        return map
    }
}

export default MapConstructor