import React, { useState, useEffect } from 'react';

const YourCountry = () => {
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const [userCountry, setUserCountry] = useState(null); // State to store the country

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { longitude, latitude } = position.coords;
                setUserLocation({ longitude, latitude });

                // Reverse geocoding API query
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();

                    if (data.address && data.address.country) {
                        setUserCountry(data.address.country); // Store the country
                    }
                } catch (error) {
                    console.error("Error fetching country:", error);
                }
            },
            (error) => {
                console.error("Error getting live location:", error);
            }
        );

        // Clean up the watch position when the component unmounts
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // You can now use userCountry in your OpenStreetMap API query
    useEffect(() => {
        if (userCountry) {
            // Use the userCountry in your OpenStreetMap API query
            console.log("User's country:", userCountry);
            // Example OpenStreetMap API query
            // Example: fetch hospitals in the user's country
        }
    }, [userCountry]);

    return (
        <div>
            <h1>Your Location</h1>
            <p>Latitude: {userLocation.latitude}</p>
            <p>Longitude: {userLocation.longitude}</p>
            <p>Country: {userCountry}</p>
        </div>
    );
};

export default YourCountry;
