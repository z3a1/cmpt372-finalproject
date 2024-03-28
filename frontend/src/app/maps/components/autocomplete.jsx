import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from "react-cool-onclickoutside";
import autocompleteStyle from "./autocomplete.module.css"

export default function PlacesAutocomplete({ setMapCenter, setSelectedCoordinates, setSelectedPlaceName, processSelectedAddress }) {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions
    } = usePlacesAutocomplete({
        debounce: 300
    });

    const handleSelect = ({ description }) => () => {
        // When the user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({ address: description })
            .then((results) => {
                const { lat, lng } = getLatLng(results[0]);
                console.log("📍 Coordinates: ", description, { lat, lng });
                setMapCenter({lat, lng})
                setSelectedCoordinates({lat, lng})
                setSelectedPlaceName(description)
                processSelectedAddress(lat, lng)
            });
    };

    const renderSuggestions = () => data.map((suggestion) => {
        const { place_id, structured_formatting: { main_text, secondary_text } } = suggestion;
        return (
            <li 
                key={place_id} 
                onClick={handleSelect(suggestion)}
                className={autocompleteStyle["list-item"]}
                role="option"
            >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
            </li>
        );
    });

    // Dismiss suggestions on click outside
    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInputChange = (e) => {
        setValue(e.target.value)
    }

    return (
        <div className={autocompleteStyle.container}>
            <div className={autocompleteStyle.autocomplete} ref={ref}>
                <input
                    className={autocompleteStyle.input}
                    value={value}
                    onChange={handleInputChange}
                    disabled={!ready}
                    placeholder="Where are you going?"
                    type="text"
                    role="combobox"
                    aria-controls="ex-list-box"
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-expanded={status === "OK"}
                />
                {status === "OK" && (
                    <ul
                        id="ex-list-box"
                        className={autocompleteStyle["list-box"]}
                        role="listbox"
                    >
                        {renderSuggestions()}
                    </ul>
                )}
            </div>
        </div>
    );
}