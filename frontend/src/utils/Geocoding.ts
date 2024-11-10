import Geocoding from 'react-native-geocoding';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCnz1DBxEONzbN_FkISgo_LmKKwneOeQZs'; // Replace with your API key

Geocoding.init(GOOGLE_MAPS_API_KEY);

export const getFromGeolocation = async (latitude: number, longitude: number) => {
    try {
        const response = await Geocoding.from(latitude, longitude);
        if (response.results.length > 0) {
            return response.results[0].formatted_address;
        }
        return 'Address not found';
    } catch (error) {
        console.error(error);
        throw new Error('Unable to fetch address');
    }
};
