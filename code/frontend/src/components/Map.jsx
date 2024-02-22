import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Map(props) {
    let trip = props.trip;
    let itinerary = props.sharedState;

    const [hotel, setHotel] = useState("");
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (itinerary && activities.length == 0) {
            axios.post(`get-activities/`, {
                'country': trip.country,
                'city': trip.city,
                'activities': itinerary
            })
            .then((response) => {
                console.log(response.data);
                setActivities(response.data.activities);
            })
            .catch(err => console.log(err));
        }
    }, itinerary);

    useEffect(() => {
        if (trip && hotel.length == "") {
            axios.post(`get-hotel/`, {
                'country': trip.country,
                'city': trip.city,
                'hotel': trip.hotel
            })
            .then((response) => {
                console.log(response.data);
                setHotel(response.data);
            })
            .catch(err => console.log(err));
        }
    });

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

    const getMarkers = () => {
        console.log('activities', activities);
        return (
            activities.map((marker) => (
                <Marker position={[marker.latitude, marker.longitude]} icon={customIcon}>
                    <Popup>{marker.name}</Popup>
                </Marker>
            ))
        )
    }

    const getLat = () => {
        let total = hotel.lat;
        for (let a in activities) {
            total += activities[a].latitude;
        }
        return total / (hotel.lat + activities.length);
    }

    const getLong = () => {
        let total = hotel.long;
        for (let a in activities) {
            total += activities[a].longitude;
        }
        return total / (hotel.long + activities.length);
    }
    
    if (hotel && activities) {
        console.log('activities', activities);
        return (
            <MapContainer center={[hotel.lat/*getLat()*/, hotel.long/*getLong()*/]} zoom={15}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterCustomIcon}
                    >
                        <Marker position={[hotel.lat, hotel.long]} icon={customIcon}>
                            <Popup>{hotel.name}</Popup>
                        </Marker>
                        {getMarkers()}
                    </MarkerClusterGroup>
                </div>
            </MapContainer>
        );
    }
}