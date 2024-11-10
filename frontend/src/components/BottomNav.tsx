import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

type BottomNavProps = {
    navigation: NativeStackNavigationProp<any>;
};

const BottomNav = ({navigation}:BottomNavProps) => {

    return (
        <View style={styles.BottomNav}>
            <TouchableOpacity style={styles.NavButton} onPress={() => navigation.navigate("Home")}>
                <Feather name="home" size={28} color="#444242" />
                <Text style={styles.ButtonText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.NavButton}>
                <Feather name="users" size={28} color="#444242" />
                <Text style={styles.ButtonText}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.NavButton}>
                <AntDesign name="qrcode" size={28} color="#444242" />
                <Text style={styles.ButtonText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.NavButton}>
                <Ionicons name="chatbox-ellipses-outline" size={28} color="#444242" />
                <Text style={styles.ButtonText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.NavButton}>
                <Feather name="user" size={28} color="#444242" />
                <Text style={styles.ButtonText}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    BottomNav: {
        position: 'absolute', // Makes the bottom navigation stick to the bottom
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: 60,
    },

    NavButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    ButtonText: {
        color: '#444242',
        fontSize: 12,
    },

});

export default BottomNav;