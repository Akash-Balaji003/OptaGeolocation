import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BottomNav from '../components/BottomNav';

type MapScreenProps = NativeStackScreenProps<RootStackParamList, 'maps'>;

const MapScreen = ({ navigation }: MapScreenProps) => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        requestLocationPermission();
        
        const watchId = Geolocation.watchPosition(
            position => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setError(null);
            },
            error => {
                console.log(error);
                setError("Failed to get location. Make sure location services are enabled.");
            },
            { enableHighAccuracy: true, distanceFilter: 10 }
        );
    
        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    setError("Location permission denied");
                }
            } else {
                getCurrentLocation();
            }
        } catch (err) {
            console.warn(err);
            setError("Failed to request location permission");
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setError(null); // Clear any previous errors
            },
            error => {
                console.log(error);
                setError("Failed to get current location. Make sure location services are enabled.");
            },
            { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 }
        );
    };

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0077B6" />
                <Text>Loading map...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={location}
                    title="Your order will be delivered here"
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    errorText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'red',
    },
});

export default MapScreen;
