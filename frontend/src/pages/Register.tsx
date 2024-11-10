import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../components/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type RegisterProps = NativeStackScreenProps<RootStackParamList, 'register'>;

const Register = ({ navigation }: RegisterProps) => {
  const { access_token } = useAuth();

  return (
    <SafeAreaView>
      <Text>Token: {access_token}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("login")}>
        <Text>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Register;
