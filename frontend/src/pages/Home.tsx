import React, { useCallback, useState } from 'react';
import {
    Image,
    Modal,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../components/AuthContext';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'home'>;

const Home = ({navigation}:HomeProps) => {
    const { access_token, user_name } = useAuth();
    const { height } = useWindowDimensions();
    const [locationModalVisible, setLocationModalVisible] = useState(false);

    if (!access_token) return <Text>Loading...</Text>;

    const handleLocationPress = () => {
        setLocationModalVisible(true); // Show the modal
    };

    const handleEnableLocation = useCallback(async () => {
        setLocationModalVisible(false); // Hide the modal
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                navigation.navigate('maps');
            } else {
                const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    navigation.navigate('maps');
                }
            }
        } else {
            navigation.navigate('maps');
        }
    }, [navigation]);

    const handleEnterManually = () => {
        setLocationModalVisible(false); // Hide the modal
        navigation.navigate('maps'); // Go to maps without requesting permissions
    };

    return (
        <SafeAreaView style={[styles.container, { height }]}>
            {/* Top Bar */}
            <View style={styles.TopBarNav}>
                <View>
                    <Text style={styles.WelcomeText}>Welcome</Text>
                    <Text style={[styles.WelcomeText, { fontWeight: 'bold', fontSize: 22, color: '#0077B6' }]}>{user_name}</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="bell-o" size={26} color="black" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.SearchBar}>
                <TextInput 
                    style={styles.searchInput}
                    placeholderTextColor='black'
                    textAlign='left'
                    placeholder="Search..." 
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.AdPlaceholder}>
                    <Text>Advertisements</Text>
                </View>

                <View style={styles.CardsHolder}>

                    <TouchableOpacity style={styles.Card} onPress={handleLocationPress}>
                        <View style={styles.CardTextHolder}>
                            <Text style={[styles.CardText, {fontSize: 14, fontWeight: 'bold'}]}>
                                <Text style={{color: "#0077B6"}}>SELECT</Text> YOUR LOCATION
                            </Text>
                            <Text style={[styles.CardText, {paddingTop:3}]}>CHOOSE YOUR LOCATION FOR TAILORED EXPERIENCES</Text>
                        </View>
                        <View style={styles.CardImage}>
                            <Image 
                                source={require('../images/handshake.jpg')}  // Add your image source here
                                style={styles.ImageStyle}
                                resizeMode="contain" 
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Card} onPress={() => navigation.navigate("locations")}>
                        <View style={styles.CardTextHolder}>
                            <Text style={[styles.CardText, {fontSize: 14, fontWeight: 'bold'}]}>
                                <Text style={{color: "#0077B6"}}>VIEW</Text> YOUR DELIVERY LOCATIONS
                            </Text>
                            <Text style={[styles.CardText, {paddingTop:3}]}>ACCESS YOUR SAVED LOCATIONS ANYTIME, ANYWHERE</Text>
                        </View>
                        <View style={styles.CardImage}>
                            <Image 
                                source={require('../images/handshake.jpg')}  // Add your image source here
                                style={styles.ImageStyle}
                                resizeMode="contain" 
                            />
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={styles.CardsHolder}>

                    <TouchableOpacity style={styles.Card}>
                        <View style={styles.CardTextHolder}>
                            <Text style={[styles.CardText, {fontSize: 14, fontWeight: 'bold'}]}>
                                <Text style={{color: "#0077B6"}}>YET</Text> TO COME
                            </Text>
                            <Text style={[styles.CardText, {paddingTop:3}]}>STAY TUNED FOR FURTHER UPDATES</Text>
                        </View>
                        <View style={styles.CardImage}>
                            <Image 
                                source={require('../images/handshake.jpg')}  // Add your image source here
                                style={styles.ImageStyle}
                                resizeMode="contain" 
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Card}>
                        <View style={styles.CardTextHolder}>
                            <Text style={[styles.CardText, {fontSize: 14, fontWeight: 'bold'}]}>
                                <Text style={{color: "#0077B6"}}>YET</Text> TO COME
                            </Text>
                            <Text style={[styles.CardText, {paddingTop:3}]}>STAY TUNED FOR FURTHER UPDATES</Text>
                        </View>
                        <View style={styles.CardImage}>
                            <Image 
                                source={require('../images/handshake.jpg')}  // Add your image source here
                                style={styles.ImageStyle}
                                resizeMode="contain" 
                            />
                        </View>
                    </TouchableOpacity>

                </View>
            </View>

            {/* Bottom Navigation */}
            <BottomNav navigation={navigation} />

            {/* Location Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={locationModalVisible}
                onRequestClose={() => setLocationModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Location Option</Text>
                        <Text style={styles.modalText}>Would you like to enter your location manually or enable location services?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleEnterManually}>
                                <Text style={styles.modalButtonText}>Enter Manually</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={handleEnableLocation}>
                                <Text style={styles.modalButtonText}>Enable Location</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3FBFF",
    },

    TopBarNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginVertical: '3%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    WelcomeText: {
        color: "#444242",
        fontSize: 20,
    },

    SearchBar: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: '2%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        elevation: 4, // For Android shadow

        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },

    searchInput: {
        height: 50,
        color: 'black',
        fontSize: 18,
    },

    content: {
        flex: 0.9,
        paddingHorizontal: '5%',
        paddingTop: 5,
        paddingBottom: 20, // Add some bottom padding
        justifyContent: 'space-around',
        marginTop: 10, // Add space above the content
        marginBottom: 10, // Add space below the content
    },

    AdPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
        borderRadius: 15,
        marginTop: '1%',
        paddingVertical: '8%',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },

    CardsHolder: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        paddingTop: 5,
        marginVertical: 5, // Add some vertical margin between the card holders
    },
    
    Card: {
        flex: 0.48,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        marginBottom: 5, // Add space between the individual cards
    },

    CardTextHolder: {
        marginBottom: 10,
    },

    CardText: {
        color: '#444242',
        fontSize: 11,
    },

    CardImage: {
        height: 80,
        alignItems: 'center',
        marginTop: 10,
    },

    ImageStyle: {
        width: 140,
        height: 80,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0077B6',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 14,
        color: '#444242',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#0077B6',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
        width:'49%'
    },
    modalButtonText: {
        color: 'white',
        fontSize:13,
        fontWeight: 'bold',
    },
});

export default Home;
