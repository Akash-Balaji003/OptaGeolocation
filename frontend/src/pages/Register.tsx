import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { RootStackParamList } from '../App';
import AntDesign from 'react-native-vector-icons/AntDesign';

type AccProps = NativeStackScreenProps<RootStackParamList, 'register'>;

const Register = ({ navigation }: AccProps) => {
    const { width, height } = useWindowDimensions();

    const [user_name, setCommonName] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [phone_number, setPhoneNumber] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const handleNext = async () => {
        if (!user_name || !phone_number || !password || !confirm_password) {
            setErrorMessage("All fields are required.");
            return;
        }
    
        if (password !== confirm_password) {
            setErrorMessage("Passwords don't match.");
            return;
        }
    
        // Clear error message if validations pass
        setErrorMessage("");
        const addressData = {
            user_name: user_name,
            phone_number: phone_number,
            password: password,
        };
        try {
            const response = await fetch('https://hchjn6x7-8000.inc1.devtunnels.ms/register', {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(addressData),
            });
            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                Alert.alert("Account has been created successfully")
                navigation.navigate("login")
            } else {
                console.error(result.detail);
            }
        } catch (error) {
            console.error('Error sending address:', error);
        }

    };
    

    return (
        <SafeAreaView style={[styles.container, { width, height }]}>
            {/* Step Indicator */}
            <View style={[styles.stepContainer, { width: Platform.OS === 'ios' ? '90%' : 'auto', marginLeft: Platform.OS === 'ios' ? '5%' : '0%'}]}>
                <View style={styles.stepItem}>
                    <View style={styles.activeStepCircle}>
                        <Text style={styles.stepText}>1</Text>
                    </View>
                    <Text style={styles.stepLabel}>Creating account</Text>
                </View>
                <View style={styles.stepItem}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepText}>2</Text>
                    </View>
                    <Text style={styles.stepLabel}>About you</Text>
                </View>
                <View style={styles.stepItem}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepText}>3</Text>
                    </View>
                    <Text style={styles.stepLabel}>About your company</Text>
                </View>
            </View>

            {/* Form Title */}
            <Text style={styles.title}>CREATING ACCOUNT</Text>

            {/* Input Fields */}
            <View style={[styles.inputContainer, { width: Platform.OS === 'ios' ? '80%' : 'auto'}]}>
                <TextInput placeholder="Name" value={user_name} onChangeText={setCommonName} style={styles.input} placeholderTextColor="#888" />
                <TextInput placeholder="Mobile number" value={phone_number} onChangeText={setPhoneNumber} style={styles.input} placeholderTextColor="#888" keyboardType="phone-pad" />
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} placeholderTextColor="#888" secureTextEntry />
                <TextInput placeholder="Confirm password" value={confirm_password} onChangeText={setConfirmPassword} style={styles.input} placeholderTextColor="#888" secureTextEntry />
                <Text style={[styles.stepLabel, {alignSelf:'center', color:'red'}]}>{errorMessage}</Text>
            </View>

            {/* Next Button */}
            <View style={[{flexDirection:'row', justifyContent:'space-between'}]}>
                <TouchableOpacity style={[styles.buttonBack]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonBack]} onPress={handleNext}>
                    <Text style={styles.buttonText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-around',
        paddingHorizontal: '10%',
    },
    stepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5%',
    },
    stepItem: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeStepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E6F4F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepText: {
        fontSize: 14,
        color: 'black',
    },
    stepLabel: {
        fontSize: 12,
        color: 'black',
        marginTop: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#001f3f',
        textAlign: 'center',
        marginBottom: '5%',
    },
    inputContainer: {
        width: '100%',
        marginLeft: Platform.OS ==='ios' ? 'auto': '0%',
        marginRight: Platform.OS ==='ios' ? 'auto': '0%',
    },
    input: {
        backgroundColor: '#f2f2f2',
        color:"black",
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 16,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#001f3f',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        marginLeft: Platform.OS ==='ios' ? 'auto': '0%',
        marginRight: Platform.OS ==='ios' ? 'auto': '0%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonBack: {
        backgroundColor: '#001f3f',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        width:'45%'
    },
    buttonArrow: {
        backgroundColor: '#001f3f',
        borderRadius: 50,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        width: 50
    },
});

export default Register;
