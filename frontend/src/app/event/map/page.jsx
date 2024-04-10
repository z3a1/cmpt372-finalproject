'use client'

import { useLoadScript } from '@react-google-maps/api';
import { Loader } from '@mantine/core';
import Map from './components/map';

export default function Maps() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        language: 'en'
    });

    return (
        <>
            {!isLoaded && <Loader />}
            {isLoaded && <Map />}
        </>
    );
};
