import { useEffect, useState, useRef } from 'react';
import { Map as MapLibreMap, NavigationControl, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        if (!mapLoaded) return;
        const map = new MapLibreMap({
            container: 'map',
            style: 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json',
            center: [0, 0],
            zoom: 1 
        });

        map.addControl(new NavigationControl());

        map.on('load', () => {
            mapRef.current = map;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentLocation([longitude, latitude]);

                        new Marker()
                            .setLngLat([longitude, latitude])
                            .addTo(map);

                        map.setCenter([longitude, latitude]);
                        map.setZoom(15);
                    },
                    (error) => {
                        console.error("Error getting current location:", error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        });

    }, [mapLoaded]);

    const handleCurrentLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    mapRef.current.flyTo({
                        center: [longitude, latitude],
                        zoom: 15,
                        essential: true
                    });
                },
                (error) => {
                    console.error("Error getting current location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <div id="map" style={{ width: "100vw", height: "100vh", overflow: "hidden" }} ref={() => setMapLoaded(true)}></div>

            <button 
                onClick={handleCurrentLocationClick} 
                style={{
                    position: 'absolute',
                    bottom: '100px',
                    right: '10px',
                    zIndex: 1,
                    border: '0px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px'
                }} >
                <i className="fi fi-sr-location-crosshairs" style={{ fontSize: '25px' }}></i>
            </button>

            <button
                onClick={()=>{
                    window.location.href='https://github.com/sarthakroy2002'
                }}

                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    zIndex: 1,
                    border: '0px',
                    borderRadius: '10%',
                    padding: '5px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} >
                @sarthakroy2002
            </button>
        </div>
    );
}