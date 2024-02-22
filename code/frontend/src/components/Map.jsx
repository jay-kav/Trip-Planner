import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Map(props) {
    let trip = props.trip;

    const [itineraries, setItineraries] = useState([]);
    const [hotel, setHotel] = useState("");
    let markers = [];

    console.log('markers', markers);

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
    }, trip);

    useEffect(() => {
        if (trip && itineraries.length == 0) {
            axios.get(`api/itineraries/?trip_id=${trip.id}`)
           .then((response) => {
                console.log(response);
                setItineraries(response.data);
            })
           .catch(err => console.log(err))
        }
    });

    useEffect(() => {
        if (itineraries.length > 0) {
            for (let i = 0; i < itineraries.length; i++) {
                console.log('itinerary', itineraries[i]);
                axios.post(`get-activities/`, {
                    'country': trip.country,
                    'city': trip.city,
                    'activities': itineraries[i].activities
                })
                .then((response) => {
                    console.log('activities', response.data);
                    markers.push(response.data);
                    console.log('markers', markers);
                })
                .catch(err => console.log(err));
            }
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
        console.log('index', parseInt(sessionStorage.getItem('currentItineraryIndex')));
        if (markers[parseInt(sessionStorage.getItem('currentItineraryIndex'))]) {
            return (
                markers[parseInt(sessionStorage.getItem('currentItineraryIndex'))].activities.map((marker) => (
                    <Marker position={[marker.longitude, marker.latitude]} icon={customIcon}>
                        <Popup>{marker.name}</Popup>
                    </Marker>
                ))
            )
        }
    }
    
    if (hotel) {
        return (
            <MapContainer center={[hotel.lat, hotel.long]} zoom={12}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterCustomIcon}
                    >
                        {getMarkers()}
                    </MarkerClusterGroup>
                </div>
            </MapContainer>
        );
    }
}
