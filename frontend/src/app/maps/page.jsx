'use client'
import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import styles from "./maps.module.css"

// TODO: Autocomplete search box for map
// import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
// import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
// import '@reach/combobox/styles.css';
// Combobox alternative
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import { ClickAwayListener, Grid, Typography } from '@mui/material';

// Constants
const LOCAL_BACKEND_URL = "http://localhost:8080/maps"; // TODO: Remove later
const STARTING_LOCATION = { lat: 49.21, lng: -122.96 };

export default function Places() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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
            await axios.get(LOCAL_BACKEND_URL + `/api/places/marker/search?placeId=${e.placeId}`)
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
        await axios.get(LOCAL_BACKEND_URL + `/api/places/selected/address?lat=${lat}&lng=${lng}`)
            .then(res => {
                console.log(res.data.results[0].formatted_address)
                setSelectedAddress(res.data.results[0].formatted_address)
            })
            .catch(error => console.error(error));
    }

    // Send post request of selected place name to backend
    const processPlaceNameToServer = async () => {
        await axios.post(LOCAL_BACKEND_URL + '/api/places/selected', {
            placeName: selectedPlaceName
        })
    }

    // Change place name in backend everytime selectedPlaceName changes
    useEffect(() => {
        processPlaceNameToServer()
    }, [selectedPlaceName])

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
        await axios.get(LOCAL_BACKEND_URL + `/api/places/nearby/search?lat=${selectedCoordinates.lat}&lng=${selectedCoordinates.lng}`)
            .then(res => {
                console.log(res.data)
                setNearbyPlaces(res.data)
            })
            .catch(error => console.error(error));
    }

    return (
        <>
            {/* <div className={styles.placesContainer}>
                <PlacesAutocomplete setSelectedCoordinates={setSelectedCoordinates} setSelectedPlaceName={setSelectedPlaceName} />
            </div> */}
            <GoogleMap
                zoom={12}
                center={STARTING_LOCATION}
                mapContainerClassName={styles.mapContainer}
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
            <div className={styles.mapCaptionContainer}>
                <h3>📍 Selected Location:</h3>
                <p>{selectedPlaceName}</p>
            </div>
        </>
    )
};


// TODO: Autocomplete search box

// const PlacesAutocomplete = ({ setSelectedCoordinates, setSelectedPlaceName }) => {
//     const {
//         ready,
//         value,
//         setValue,
//         suggestions: {status, data},
//         clearSuggestions
//     } = usePlacesAutocomplete();
    
//     const handleSelect = async (address) => {
//         setValue(address, false);
//         clearSuggestions();

//         // Render out a marker at inputted location
//         const results = await getGeocode({address});
//         console.log(results)
//         const {lat, lng} = await getLatLng(results[0]);
//         setSelectedCoordinates({lat, lng})
//         setSelectedPlaceName(address)
//     }
    
//     // const options = data.map(({place_id, description}))

//     return (
//         <Autocomplete
//             id="combo-box-demo"
//             options={data}
//             sx={{ width: 400 }}
//             getOptionLabel={(option) =>
//                 typeof option === 'string' ? option : option.description
//             }
//             filterOptions={(x) => x}
//             Autocomplete
//             onChange={e => setValue(e.target.value)}
//             renderInput={params => (
//                 <TextField 
//                     {...params}
//                     label="Place"
//                     variant='outlined'
//                 />
//             )}
//             value={data.find(x => x.description === value)}
//             renderOption={option => {
//                 // const matches =
//                 //   option.structured_formatting.main_text_matched_substrings;
//                 // const parts = parse(
//                 //   option.structured_formatting.main_text,
//                 //   matches.map(match => [match.offset, match.offset + match.length])
//                 // );
      
//                 return (
//                   <Grid
//                     container
//                     alignItems="center"
//                     onClick={() => handleSelect(option)}>
//                     <Grid item>
//                       <LocationOnIcon />
//                     </Grid>
//                     {/* <Grid item xs>
//                       {parts.map((part, index) => (
//                         <span
//                           key={index}
//                           style={{ fontWeight: part.highlight ? 700 : 400 }}>
//                           {part.text}
//                         </span>
//                       ))}
//                     </Grid> */}
//                   </Grid>
//                 );
//               }}

//             // renderInput={(params) => <TextField {...params} label="Place" />}
//             // onInputChange={(event, newValue) => setValue(newValue)}
//         />

//         // Bare minimum
//         // <div>
//         //     <input
//         //         value={value} 
//         //         onChange={e => setValue(e.target.value)} 
//         //         disabled={!ready}
//         //         className={styles.comboboxInput} 
//         //         placeholder='Search an address' 
//         //     />
//         // </div>


//         // <Combobox onSelect={handleSelect}>
//         //     <ComboboxInput
//         //         value={value} 
//         //         onChange={e => setValue(e.target.value)} 
//         //         disabled={!ready}
//         //         className="combobox-input" 
//         //         placeholder='Search an address' 
//         //     />
//         //     <ComboboxPopover>
//         //         <ComboboxList>
//         //             {status === "OK" && data.map(({place_id, description}) => 
//         //                 <ComboboxOption key={place_id} value={description} />
//         //             )}
//         //         </ComboboxList>
//         //     </ComboboxPopover>
//         // </Combobox>
//     )
// };
