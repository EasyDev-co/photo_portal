import { YMaps, Map } from '@pbe/react-yandex-maps';

const LocationMap = ({width}) => {
    return (
        <YMaps>
            <Map width={width} defaultState={{ center: [55.75, 37.57], zoom: 9 }} />
        </YMaps>

    );
}

export default LocationMap;