'use client'

import { useLoadScript } from '@react-google-maps/api';
import { Loader } from '@mantine/core';
import Map from './components/map';

export default function Maps() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCpBPMtC5bqLctASD__Hth5ru00ns3aRdM",
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
