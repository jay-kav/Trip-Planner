import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function Map(props) {
    let trip = props.trip;

    const [itineraries, setItineraries] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (itineraries.length == 0) {
            axios.get(`api/itineraries/?trip_id=${trip.id}`)
           .then((response) => {
                console.log(response);
                setItineraries(response.data);
            })
           .catch(err => console.log(err))
        }
        if (activities.length == 0 && itineraries.length > 0) {
            axios.post(`get-activities/`, {
                'activities': itineraries[localStorage.getItem('index')].activities,
                'country': trip.country,
                'city': trip.city,
            })
           .then((response) => {
                console.log(response);
                setActivities(response.data);
            })
           .catch(err => console.log(err))
        }
    });

    const getMarkers = () => {
        {activities.map((marker) => (
            <Marker position={[marker.longitude, marker.latitude]} icon={customIcon}>
                <Popup>{marker.name}</Popup>
            </Marker>
        ))}
    }

    const customIcon = new Icon({
        iconUrl: require("./icons/placeholder.png"),
        iconSize: [38, 38] // size of the icon
    });

    const createClusterCustomIcon = function (cluster) {
        return new divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: point(33, 33, true)
        });
    };

    // Functions to handle cycling through itineraries
    const goToPreviousItinerary = () => {
        localStorage.setItem('index', prevIndex => (prevIndex === 0 ? itineraries.length - 1 : prevIndex - 1));
    };
    
    const goToNextItinerary = () => {
        localStorage.setItem('index', prevIndex => (prevIndex === itineraries.length - 1 ? 0 : prevIndex + 1));
    };
    
    return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13}>
        {itineraries.length > 0 && <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <ArrowBackIosRoundedIcon disa sx={{marginRight: '8px'}} onClick={goToPreviousItinerary}/>
            <div>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                >
                    {getMarkers()}
                </MarkerClusterGroup>
            </div>
            <ArrowForwardIosRoundedIcon sx={{marginLeft: '8px'}} onClick={goToNextItinerary}/>
        </div>}
    </MapContainer>
  );
}
