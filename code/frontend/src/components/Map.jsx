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

    // Fetchs the activities from currently selected itinerary
    useEffect(() => {
        if (itinerary) {
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

    // Fetches the hotel from the currently selected trip
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

    // Creates custom icon for the markers
    const customIcon = new Icon({
        iconUrl: require("./icons/placeholder.png"),
        iconSize: [48, 48] // size of the icon
    });

    // Handles number of markers in close proximity
    const createClusterCustomIcon = function (cluster) {
        return new divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: point(33, 33, true)
        });
    };

    // Maps the activities to markers
    const getMarkers = (a) => {
        return (
            a.map((marker) => (
                <Marker key={marker.place_id} position={[marker.latitude, marker.longitude]} icon={customIcon}>
                    <Popup>{marker.name}    <img
                        style={{height: '30px', width: '30px', borderRadius: '15px', objectFit: 'cover'}}
                        src={`data:image/jpeg;base64,${marker.image_data}`}
                        alt={marker.name}
                    /></Popup>
                </Marker>
            ))
        )
    }

    // Gets the average latitude of the hotel and activities to pintpoint center of map
    const getLat = () => {
        let total = hotel.lat;
        for (let a in activities) {
            total += activities[a].latitude;
        }
        return total / (hotel.lat + activities.length);
    }

    // Gets the average longitude of the hotel and activities to pintpoint center of map
    const getLong = () => {
        let total = hotel.long;
        for (let a in activities) {
            total += activities[a].longitude;
        }
        return total / (hotel.long + activities.length);
    }
    
    if (hotel) {
        if (activities.length > 0) {
            // Generates map with markers
            return (
                // Creates map
                <MapContainer center={[getLat(), getLong()]} zoom={13}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        {/* Inserts map backdrop */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* Creates markers */}
                        <MarkerClusterGroup
                            chunkedLoading
                            iconCreateFunction={createClusterCustomIcon}
                        >
                            <Marker position={[hotel.lat, hotel.long]} icon={customIcon}>
                                <Popup>{hotel.name}</Popup>
                            </Marker>
                            {getMarkers(activities)}
                        </MarkerClusterGroup>
                    </div>
                </MapContainer>
            );
        }
        // Generates default map if no activities were found
        return (
            <MapContainer center={[hotel.lat, hotel.long]} zoom={13}>
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
                    </MarkerClusterGroup>
                </div>
            </MapContainer>
        );
    }
}