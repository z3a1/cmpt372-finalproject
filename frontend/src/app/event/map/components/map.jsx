import { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import mapStyle from "./map.module.css"
import PlacesAutocomplete from './autocomplete';
import Selection from './selection';

const STARTING_LOCATION = { lat: 49.21, lng: -122.96 }; // Metro Vancouver Area

export default function Map() {
    // Selected user location
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [selectedPlaceName, setSelectedPlaceName] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Selected nearby places
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [areNearbyPlacesLoaded, setAreNearbyPlacesLoaded] = useState(false);

    // Selected marker
    const [selectedMarker, setSelectedMarker] = useState(false);

    // For autocomplete search centering
    const [mapCenter, setMapCenter] = useState(STARTING_LOCATION);

    const processPlaceName = async (e) => {
        if (e.placeId) {
            // Get specific place name
            await axios.get(process.env.SERVER_URL + `/maps/api/places/marker/search?placeId=${e.placeId}`)
                .then(res => {
                    console.log(res.data.displayName.text)
                    setSelectedPlaceName(res.data.displayName.text)
                })
                .catch(error => console.error("Error processing selected place name: ",
                    process.env.SERVER_URL + `/maps/api/places/marker/search?placeId=${e.placeId}`,
                    error)
                );
        } else {
            setSelectedPlaceName(`Via Coordinates (${e.latLng.lat()}, ${e.latLng.lng()})`)
        }
    }

    const processSelectedAddress = async (lat, lng) => {
        await axios.get(process.env.SERVER_URL + `/maps/api/places/selected/address?lat=${lat}&lng=${lng}`)
            .then(res => {
                // Get the first result
                console.log(res.data.results[0])
                console.log(res.data.results[0].formatted_address)
                setSelectedAddress(res.data.results[0].formatted_address)
            })
            .catch(error => console.error("Error processing selected address: ", error));
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

    // On click spawn nearby places around a given radius
    const handleMarkerDoubleClick = async () => {
        setAreNearbyPlacesLoaded(false)
        console.log("Getting nearby places...", selectedCoordinates.lat, selectedCoordinates.lng)
        await axios.get(process.env.SERVER_URL + `/maps/api/places/nearby/search?lat=${selectedCoordinates.lat}&lng=${selectedCoordinates.lng}`)
            .then(res => {
                console.log(res.data)
                setNearbyPlaces(res.data)
                setNearbyPlacesLoaded(true)
            })
            .catch(error => console.error("Error processing nearby search: ", error))
    }

    return (
        <>
            <div className={mapStyle.mainContainer}>
                <div className={mapStyle.leftContent}>
                    <div className={mapStyle.placesContainer}>
                        <PlacesAutocomplete 
                            setMapCenter={setMapCenter}
                            setSelectedCoordinates={setSelectedCoordinates} 
                            setSelectedPlaceName={setSelectedPlaceName}
                            processSelectedAddress={processSelectedAddress}
                        />
                    </div>
                    <GoogleMap
                        zoom={12}
                        center={mapCenter}
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
                        {areNearbyPlacesLoaded && nearbyPlaces.map((place, index) => (
                            <Marker
                                key={index}
                                position={{ lat: place.geometry.location.lat, lng: place.geometry.location.lng }}
                                title={place.name}
                                onClick={(e) => handleMarkerSingleClick(e, place.name)}
                            />                        
                        ))}
                    </GoogleMap>
                </div>
                <Selection selectedPlaceName={selectedPlaceName} selectedAddress={selectedAddress} />
            </div>
        </>
    )
}