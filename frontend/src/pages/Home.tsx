import React, { useCallback, useState } from 'react';
import {
    Image,
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

type HomeProps = NativeStackScreenProps<RootStackParamList, 'home'> 

const Home = ({navigation}:HomeProps) => {

    const { access_token } = useAuth();
    const { height } = useWindowDimensions();

    if (!access_token) return <Text>Loading...</Text>;

    const handleLocationPress = useCallback(async () => {
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

    return (
        <SafeAreaView style={[styles.container, { height }]}>
            {/* Top Bar */}
            <View style={styles.TopBarNav}>
                <View>
                    <Text style={styles.WelcomeText}>Welcome</Text>
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
                            <Text style={[styles.CardText, {paddingTop:3}]}>CHANGE AND CUSTOMISE THE CARD TO YOUR PREFERENCE</Text>
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
                            <Text style={[styles.CardText, {paddingTop:3}]}>DISTRIBUTE YOUR CARD WITH OTHERS AND EXPAND YOUR NETWORK</Text>
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
                            <Text style={[styles.CardText, {paddingTop:3}]}>CHECK AND REVIEW YOUR CARD DETAILS AT A GLANCE</Text>
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
                            <Text style={[styles.CardText, {paddingTop:3}]}>BUILD NEW CONNECTIONS AND EXPLORE OPPORTUNITIES</Text>
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
});


export default Home;
