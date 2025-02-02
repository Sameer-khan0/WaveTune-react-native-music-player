import React from 'react';
import { StatusBar, useColorScheme, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/Screens/SplashScreen';
import AudioFoldersScreen from './src/Screens/AudioFoldersScreen';
import FolderListScreen from './src/Screens/FolderListScreen';
import Developer from './src/Screens/Developer';
// import Player from './src/Screens/Player';

const Stack = createStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#FFF' }]}>
      <StatusBar
        backgroundColor={isDarkMode ? '#000' : '#FFF'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="AudioFolders" component={AudioFoldersScreen} />
          <Stack.Screen name="FolderList" component={FolderListScreen} />
          <Stack.Screen name="Developer" component={Developer} />
          {/* <Stack.Screen name="Player" component={Player} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
