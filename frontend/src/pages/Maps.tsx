import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { getFromGeolocation } from '../utils/Geocoding';
import { debounce } from 'lodash';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/AuthContext';

type MapScreenProps = NativeStackScreenProps<RootStackParamList, 'maps'>;

const MapScreen = ({ navigation }: MapScreenProps) => {

    const { user_id } = useAuth();

    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [mainLocation, setMainLocation] = useState<string>('');
    const [subLocation, setSubLocation] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [lastAddressRequest, setLastAddressRequest] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isExtended, setIsExtended] = useState<boolean>(false);

    const [houseNumber, setHouseNumber] = useState('');
    const [apartmentDetails, setApartmentDetails] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null); // State to track the selected icon

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
                setError('Failed to get location. Make sure location services are enabled.');
            },
            { enableHighAccuracy: true, distanceFilter: 10 }
        );

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    useEffect(() => {
        if (location) {
            fetchAddress(location.latitude, location.longitude);
        }
    }, [location]);

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    setError('Location permission denied');
                }
            } else {
                getCurrentLocation();
            }
        } catch (err) {
            console.warn(err);
            setError('Failed to request location permission');
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setError(null);
            },
            error => {
                console.log(error);
                setError('Failed to get current location. Make sure location services are enabled.');
            },
            { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 }
        );
    };

    const fetchAddress = async (latitude: number, longitude: number) => {
        if (
            lastAddressRequest &&
            (Math.abs(lastAddressRequest.latitude - latitude) < 0.0001 && Math.abs(lastAddressRequest.longitude - longitude) < 0.0001)
        ) {
            return;
        }

        try {
            const address = await getFromGeolocation(latitude, longitude);

            // Split main location name from rest of address
            const [main, ...rest] = address.split(', ');
            setMainLocation(main || '');
            setSubLocation(rest.join(', ') || '');

            setLastAddressRequest({ latitude, longitude });
        } catch (error) {
            setError('Failed to fetch address');
        }
    };

    const debouncedFetchAddress = useCallback(
        debounce((latitude: number, longitude: number) => fetchAddress(latitude, longitude), 1000),
        []
    );

    const onMarkerDragEnd = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
        debouncedFetchAddress(latitude, longitude);
    };

    const handleSelectPress = () => {
        setIsExtended(!isExtended);
    };

    const handleIconPress = (iconName: string) => {
        setSelectedIcon(iconName);
    };

    const isIconSelected = (iconName: string) => selectedIcon === iconName;

    const handleSaveAndContinue = async () => {
        const fullAddress = `${houseNumber}, ${apartmentDetails}, ${mainLocation}, ${subLocation}`;
        const addressData = {
            user_id: user_id,
            address: fullAddress,
            tag: selectedIcon,  // e.g., "home", "work", etc.
        };
    
        try {
            const response = await fetch('https://hchjn6x7-8000.inc1.devtunnels.ms/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addressData),
            });
            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                Alert.alert("Address has been added successfully")
                navigation.navigate("home")
                // Handle successful response, e.g., navigation or notification
            } else {
                console.error(result.detail);
            }
        } catch (error) {
            console.error('Error sending address:', error);
        }
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
                showsUserLocation={true}
                onRegionChangeComplete={(region) => setLocation({ latitude: region.latitude, longitude: region.longitude })}
            >
                <Marker
                    coordinate={location}
                    draggable
                    onDragEnd={onMarkerDragEnd}
                    title="Your order will be delivered here"
                />
            </MapView>

            {/* Bottom view to show address */}
            <View style={[styles.bottomView, isExtended ? styles.extendedBottomView : {}]}>
                <Text style={[styles.addressText, { fontSize: 14, color: 'grey', marginBottom: 10, marginLeft: 3 }]}>
                    Select Your Delivery Location
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom:5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Entypo name="location-pin" size={24} color="black" />
                        <Text style={styles.mainLocationText}>{mainLocation || 'Fetching address...'}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ backgroundColor: 'green', borderRadius: 10, height: 25, width: 60, justifyContent: 'center' }}
                        onPress={handleSelectPress}
                    >
                        <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>{isExtended ? 'CLOSE' : 'SELECT'}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.subLocationText, { marginLeft: 3 }]}>{subLocation}</Text>

                {isExtended && (
                    <ScrollView style={{ marginTop: 20 }}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>HOUSE / FLAT / BLOCK NO.</Text>
                            <TextInput
                                value={houseNumber}
                                onChangeText={setHouseNumber}
                                placeholder="Enter house/flat/block no."
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>APARTMENT / ROAD / AREA</Text>
                            <TextInput
                                value={apartmentDetails}
                                onChangeText={setApartmentDetails}
                                placeholder="Enter apartment/road/area"
                                style={styles.textInput}
                            />
                        </View>
                        
                        <View style={styles.saveAsContainer}>
                            <Text style={styles.saveAsLabel}>SAVE AS</Text>
                            <View style={styles.iconRow}>
                                <TouchableOpacity 
                                    style={[styles.iconButton, isIconSelected('home') && styles.selectedIconButton]}
                                    onPress={() => handleIconPress('home')}
                                >
                                    <FontAwesome name="home" size={20} color={isIconSelected('home') ? 'blue' : 'black'} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.iconButton, isIconSelected('work') && styles.selectedIconButton]}
                                    onPress={() => handleIconPress('work')}
                                >
                                    <MaterialIcons name="work" size={20} color={isIconSelected('work') ? 'blue' : 'black'} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.iconButton, isIconSelected('users') && styles.selectedIconButton]}
                                    onPress={() => handleIconPress('users')}
                                >
                                    <FontAwesome name="users" size={20} color={isIconSelected('users') ? 'blue' : 'black'} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.iconButton, isIconSelected('marker') && styles.selectedIconButton]}
                                    onPress={() => handleIconPress('marker')}
                                >
                                    <FontAwesome name="map-marker" size={20} color={isIconSelected('marker') ? 'blue' : 'black'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                        style={{ backgroundColor: 'green', marginTop:30, borderRadius: 10, height: 40, width: 150, justifyContent: 'center', alignSelf:'center' }}     
                        onPress={handleSaveAndContinue}
                        >
                            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>SAVE AND CONTINUE</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '18%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    extendedBottomView: {
        height: '65%',
    },
    addressText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    mainLocationText: {
        fontSize: 16,
        fontWeight: '600',
    },
    subLocationText: {
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        color: '#777',
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 8,
        fontSize: 14,
    },
    saveAsContainer: {
        marginTop: 15,
    },
    saveAsLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 10,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    iconButton: {
        padding: 10,
    },
    selectedIconButton: {
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default MapScreen;
