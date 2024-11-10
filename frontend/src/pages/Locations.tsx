import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../components/AuthContext';
import BottomNav from '../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Address = {
    address: string;
    tag: string;
};

type LocationProps = NativeStackScreenProps<RootStackParamList, 'locations'>;


const AddressScreen = ({ navigation }: LocationProps) => {

    const { user_id } = useAuth();

    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        // Fetch addresses from backend
        const fetchAddresses = async (id: number | null) => {
            try {
                const response = await fetch(`https://hchjn6x7-8000.inc1.devtunnels.ms/get-address?data=${id}`);
                const data = await response.json();
                setAddresses(data.addresses);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };

        fetchAddresses(user_id);
    }, []);

    // Function to render the icon based on the tag
    const getIcon = (tag: string) => {
        switch (tag) {
            case 'home':
                return <FontAwesome name="home" size={24} color="black" />;
            case 'work':
                return <FontAwesome name="briefcase" size={24} color="black" />;
            case 'friends':
                return <FontAwesome name="users" size={24} color="black" />;
            default:
                return <FontAwesome name="map-marker" size={24} color="black" />;
        }
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Saved Location</Text>
                {addresses.map((item, index) => (
                    <View key={index} style={styles.addressContainer}>
                        <View style={styles.iconContainer}>{getIcon(item.tag)}</View>
                        <View style={styles.textContainer}>
                            <Text style={styles.tagText}>{item.tag.charAt(0).toUpperCase() + item.tag.slice(1)}</Text>
                            <Text style={styles.addressText}>{item.address}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <BottomNav navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, // Ensures the entire screen height is used
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        padding: 16,
        flexGrow: 1, // Makes the ScrollView take all available space except the space for BottomNav
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#444242',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    iconContainer: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    tagText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

export default AddressScreen;
