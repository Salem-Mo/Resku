import React, { useEffect, useState } from 'react';
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import Cookies from "js-cookie";

import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { ServerUrl } from '@/utils/constants';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FsZW1tb2hhbWVkIiwiYSI6ImNtMHdoaHlwYTAxdnkybHM1Y2djdHVidnAifQ.BFxnRx6AF4vGKAOyUcjbFQ';

const MapComponent = () => {
    const [viewState, setViewState] = useState({
        longitude: 30,
        latitude: 31.184,
        zoom: 8,
        bearing: 0,
        pitch: 0
    });

    const [pins, setPins] = useState([]);
    const [userCountry, setUserCountry] = useState(null);
    const [hoveredPin, setHoveredPin] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const currentPlaceId = null;

    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get(`${ServerUrl}/api/pins`);
                console.log("frontend connected to backend");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, []);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { longitude, latitude } = position.coords;

                setViewState((prevState) => ({
                    ...prevState,
                    longitude,
                    latitude,
                }));
                setUserLocation({ longitude, latitude });

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();

                    if (data.address && data.address.country) {
                        setUserCountry(data.address.country);
                    }
                } catch (error) {
                    console.error("Error fetching country:", error);
                }
            },
            (error) => {
                console.error("Error getting live location:", error);
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    useEffect(() => {
        if (userCountry) {
            console.log("User's country:", userCountry);
            Cookies.set('LocationCountry', userCountry);
        }
    }, [userCountry]);

    const handleMarkerClick = (id, lat, long) => {
        console.log("Marker clicked:", id);
    };

    return (
            <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ width: '400px', height: '290px' ,overflow: 'hidden' ,position: 'relative'}}
                mapStyle="mapbox://styles/salemmohamed/cm1b66oxs02cm01pi68mw1xwi"
            >
                {/* <NavigationControl className="custom-navigation" /> */}

                {userLocation && (
                    <Marker
                        longitude={userLocation.longitude}
                        latitude={userLocation.latitude}
                        anchor="center"
                    >
                        <div className="green-marker"></div>
                    </Marker>
                )}

                {pins.map((p, index) => (
                    p && p.lat && p.long ? (
                        <React.Fragment key={index}>
                            <Marker
                                className='marker'
                                latitude={p.lat}
                                longitude={p.long}
                                anchor="center"
                            >
                                <LocationOnIcon
                                    onMouseEnter={() => setHoveredPin(p)}
                                    onMouseLeave={() => setHoveredPin(null)}
                                    onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                                    style={{
                                        fontSize: 30,
                                        color: p.type === "report"
                                            ? 'red'
                                            : p.type === "request"
                                                ? "blue"
                                                : "black"
                                    }}
                                />
                            </Marker>

                            {hoveredPin && (hoveredPin._id === p._id && hoveredPin._id !== currentPlaceId) && (
                                <Popup
                                    latitude={p.lat}
                                    longitude={p.long}
                                    closeButton={false}
                                    closeOnClick={false}
                                    offset={25}
                                >
                                    <div>
                                        <h4 style={{ fontWeight: 'bolder', fontSize: '16px' }}>{p.title}</h4>
                                    </div>
                                </Popup>
                            )}
                        </React.Fragment>
                    ) : null
                ))}
            </Map>
    );
};

export default MapComponent;
