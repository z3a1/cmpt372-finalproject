'use client'
import { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import mapStyle from "./map.module.css"
import PlacesAutocomplete from './components/autocomplete';

// Constants
const STARTING_LOCATION = { lat: 49.21, lng: -122.96 };

export default function Places() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        language: 'en'
    });

    if (!isLoaded) return <div>Loading...</div>;
    return <Map />
};

function Map() {
    // Selected user location
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [selectedPlaceName, setSelectedPlaceName] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Selected nearby places
    const [nearbyPlaces, setNearbyPlaces] = useState([]);

    // Selected marker
    const [selectedMarker, setSelectedMarker] = useState(false);

    const processPlaceName = async (e) => {
        if (e.placeId) {
            // Get specific place name
            await axios.get(process.env.SERVER_URL + `/maps/api/places/marker/search?placeId=${e.placeId}`)
                .then(res => {
                    console.log(res.data.displayName.text)
                    setSelectedPlaceName(res.data.displayName.text)
                })
                .catch(error => console.error(error));
        } else {
            setSelectedPlaceName(`Via Coordinates (${e.latLng.lat()}, ${e.latLng.lng()})`)
        }
    }

    const processSelectedAddress = async (lat, lng) => {
        await axios.get(process.env.SERVER_URL + `/maps/api/places/selected/address?lat=${lat}&lng=${lng}`)
            .then(res => {
                console.log(res.data)
                console.log(res.data.results[0].formatted_address)
                setSelectedAddress(res.data.results[0].formatted_address)
            })
            .catch(error => console.error(error));
    }

    const handleCoordinateSelection = async (lat, lng, isMarker) => {
        setSelectedCoordinates({lat, lng})
        setSelectedMarker(isMarker)
        processSelectedAddress(lat, lng)
    }

    const handleMapClick = async (e) => {
        handleCoordinateSelection(e.latLng.lat(), e.latLng.lng(), false)
        processPlaceName(e)
    }

    const handleMarkerSingleClick = async (e, pName) => {
        handleCoordinateSelection(e.latLng.lat(), e.latLng.lng(), true)
        setSelectedPlaceName(pName) // TODO: asynchronous call messes up name selection (race condition)
    }

    // TODO: API Call fails on fast access -- May need retry or debounce
    const handleMarkerDoubleClick = async () => {
        console.log("Getting nearby places...", selectedCoordinates.lat, selectedCoordinates.lng)
        // On click spawn nearby places around a given radius
        await axios.get(process.env.SERVER_URL + `/maps/api/places/nearby/search?lat=${selectedCoordinates.lat}&lng=${selectedCoordinates.lng}`)
            .then(res => {
                console.log(res.data)
                setNearbyPlaces(res.data)
            })
            .catch(error => console.error(error));
    }

    return (
        <>
            <div className={mapStyle.placesContainer}>
                <PlacesAutocomplete setSelectedCoordinates={setSelectedCoordinates} setSelectedPlaceName={setSelectedPlaceName} />
            </div>
            <GoogleMap
                zoom={12}
                center={STARTING_LOCATION}
                mapContainerClassName={mapStyle.mapContainer}
                onClick={handleMapClick}
            >
                {/* Load selected marker and info window */}
                {selectedCoordinates && (
                    <Marker
                        position={selectedCoordinates}
                        title={selectedPlaceName}
                        onClick={(e) => handleMarkerSingleClick(e, selectedPlaceName)}
                        onDblClick={handleMarkerDoubleClick}
                    >
                        {selectedMarker && (
                            <InfoWindow
                                position={selectedCoordinates}
                            >
                                <div>
                                    <h4>{selectedPlaceName}</h4>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                )}

                {/* Load Nearby Places */}
                {nearbyPlaces.map((place, index) => (
                    <Marker
                        key={index}
                        position={{ lat: place.geometry.location.lat, lng: place.geometry.location.lng }}
                        title={place.name}
                        onClick={(e) => handleMarkerSingleClick(e, place.name)}
                    />                        
                ))}
            </GoogleMap>
            <div className={mapStyle.mapCaptionContainer}>
                <h3>📍 Selected Location:</h3>
                <p>{selectedPlaceName}</p>
            </div>
        </>
    )
};
