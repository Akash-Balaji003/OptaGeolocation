import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/Login';
import Register from './pages/Register';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './components/AuthContext';

enableScreens(); 

export type RootStackParamList = {
    login: undefined;
    register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {

	return (
		<AuthProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName='login'>
					<Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
					<Stack.Screen name='register' component={Register} options={{ headerShown: false }} />
				</Stack.Navigator>
			</NavigationContainer>
		</AuthProvider>
	);
}

const styles = StyleSheet.create({
  
});

export default App;
