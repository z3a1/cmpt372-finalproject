import { useRouter } from 'next/navigation'
import selectionStyle from './selection.module.css'
import axios from 'axios';

export default function Selection({ selectedPlaceName, selectedAddress }) {
    const router = useRouter();

    // Send place info to event page
    const handleSubmit = async () => {
        if (!selectedPlaceName) {
            alert('⚠️ Please select a place on the map')
        } else {
            router.push(`/event?placeName=${selectedPlaceName}&address=${selectedAddress}`)
        }
    }

    return (
        <div className={selectionStyle.container}>
            <div className={selectionStyle.locationInfo}>
                <h3>📍 Selected Location:</h3>
                <p>{selectedPlaceName}</p>
            </div>
            <button className={selectionStyle.continueButton} onClick={handleSubmit}>
                Proceed ✅
            </button>
        </div>
    )
}