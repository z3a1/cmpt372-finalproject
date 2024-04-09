import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faChevronUp, faChevronDown, faEye } from '@fortawesome/free-solid-svg-icons'

const lockIcon = (
    <FontAwesomeIcon 
        icon={faLock}
        size="2xl"
    />
);

const unlockIcon = (
    <FontAwesomeIcon 
        icon={faUnlock}
        size="2xl"
    />
);

const chevronUpIcon = (
    <FontAwesomeIcon 
        icon={faChevronUp}
        size="sm"
    />
)

const chevronDownIcon = (
    <FontAwesomeIcon 
        icon={faChevronDown}
        size="sm"
    />
)

const eyeIcon = (
    <FontAwesomeIcon 
        icon={faEye}
    />
)

export { lockIcon, unlockIcon, chevronDownIcon, chevronUpIcon, eyeIcon }